'use client';
import { ApiError } from '@/lib/api/request';
import { SessionRecovery } from '../../../../_components/SessionRecovery';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { PDFDocumentLoadingTask, PDFDocumentProxy } from 'pdfjs-dist';
import Link from 'next/link';
import { listExpressions } from '@/domains/expressions/api/expressions';
import type { Expression } from '@/domains/expressions/model/contracts';
import type { SourceInput } from '@/domains/materials/model/source';
import type { LearningPolicy } from '@/domains/learning/model/policy';
import type { Material } from '@/domains/materials/model/contracts';
import { loadPdfEngine } from '@/domains/materials/lib/pdf';
import { updateMaterial } from '@/domains/materials/api/materials';
import { Button } from '@/components/ui/primitives/Button';
import { Icon } from '@/components/ui/primitives/Icon';
import { TextArea } from '@/components/ui/primitives/TextArea';
import { EmptyState } from '@/components/ui/composites/EmptyState';
import { listAnnotations } from '@/domains/materials/api/records';
import type { Annotation } from '@/domains/materials/model/records';
import { MaterialAnalysisPanel } from './MaterialAnalysisPanel';
import { MaterialPreparation } from './MaterialPreparation';
import { AnnotationList } from '../../../../_components/AnnotationList';
import { LearningAiPanel } from '../../../../_components/LearningAiPanel';
import { ExpressionComposer } from '../../../../_components/ExpressionComposer';
import { QuestionComposer } from '../../../../_components/QuestionComposer';
import { AnnotationComposer } from '../../../../_components/AnnotationComposer';
import { ExcerptShareComposer } from '../../../../_components/ExcerptShareComposer';
import { IconButton } from '@/components/ui/primitives/IconButton';
import { PdfSavedExpressions } from './PdfSavedExpressions';
import type { OcrPage } from '@/domains/materials/model/ocr';
import { PdfOcrPanel } from './PdfOcrPanel';
import { PdfPage } from './PdfPage';
import { PdfToolbar } from './PdfToolbar';
import { PdfThumbnail } from './PdfThumbnail';
import * as styles from './PdfStudy.css';

/** 실제 PDF 선택과 개인 메모를 원문 질문·표현 저장에 연결한다. */
export function PdfStudy({
  initial,
  selection,
  policy,
}: {
  initial: Material;
  selection?: SourceInput;
  policy: LearningPolicy | null;
}) {
  const historical =
    (initial.version ?? 1) < (initial.latestVersion ?? initial.version ?? 1);

  const [document, setDocument] = useState<PDFDocumentProxy | null>(null);
  const [page, setPage] = useState(initial.currentPage);
  const [zoom, setZoom] = useState<number | 'width' | 'page'>('width');
  const [thumbnailsOpen, setThumbnailsOpen] = useState(true);
  const [selectionMode, setSelectionMode] = useState(true);

  const [tab, setTab] = useState<
    'overview' | 'explanation' | 'records' | 'questions'
  >(selection ? 'explanation' : 'overview');

  const [panelOpen, setPanelOpen] = useState(true);

  const [initialMode, setInitialMode] = useState<'meaning' | 'translation'>(
    'meaning'
  );

  const [savingExpression, setSavingExpression] = useState(false);
  const [savedReload, setSavedReload] = useState(0);
  const [expressions, setExpressions] = useState<Expression[]>([]);
  const [expressionsLoading, setExpressionsLoading] = useState(true);
  const [expressionsError, setExpressionsError] = useState('');

  useEffect(() => {
    let active = true;

    void listExpressions()
      .then((value) => {
        if (active) {
          setExpressions(value.items);
          setExpressionsError('');
          setExpressionsLoading(false);
        }
      })
      .catch((error: Error) => {
        if (active) {
          setExpressionsError(error.message);
          setExpressionsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [initial.id, savedReload]);

  const [dialog, setDialog] = useState<
    'share' | 'annotation' | 'report' | 'question' | null
  >(null);

  const memoOpen = panelOpen && tab === 'records';
  const [memo, setMemo] = useState(initial.memo);
  const [savedMemo, setSavedMemo] = useState(initial.memo);
  const [quote, setQuote] = useState(selection?.quote ?? '');

  const [usingOcr, setUsingOcr] = useState(
    selection?.kind === 'pdf' && Boolean(selection.ocrId)
  );

  const [ocrSelectionId, setOcrSelectionId] = useState(
    selection?.kind === 'pdf' ? selection.ocrId : undefined
  );

  const [ocr, setOcr] = useState<OcrPage | null>(null);

  const [pageEligibility, setPageEligibility] = useState(() =>
    initial.pages.map((_, index) => initial.pageEligibility?.[index])
  );

  const currentOcr =
    ocr?.page === page && ocr.version === (initial.version ?? 1) ? ocr : null;

  const eligibility =
    currentOcr?.eligibility ?? pageEligibility[page - 1] ?? initial.eligibility;

  const eligibilityPendingAfterOcr =
    currentOcr?.status === 'ready' &&
    !currentOcr.eligibility &&
    eligibility?.status === 'needs_ocr';

  const [rects, setRects] = useState<
    { x: number; y: number; width: number; height: number }[]
  >(selection?.rects ?? []);

  const [annotations, setAnnotations] = useState<Annotation[]>([]);

  const [pageImage, setPageImage] = useState<{
    base64: string;
    mimeType: 'image/jpeg';
  }>();

  const [saveStatus, setSaveStatus] = useState('저장됨');
  const [savingMemo, setSavingMemo] = useState(false);
  const [error, setError] = useState('');
  const [sessionExpired, setSessionExpired] = useState(false);
  const [bounds, setBounds] = useState({ width: 800, height: 850 });
  const [pageSize, setPageSize] = useState({ width: 612, height: 792 });
  const scroll = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;

    void listAnnotations({ materialId: initial.id })
      .then((result) => {
        if (active) setAnnotations(result.items);
      })
      .catch((error) => {
        if (active) setError(error.message);
      });

    return () => {
      active = false;
    };
  }, [initial.id]);

  const saveQueue = useRef<Promise<unknown>>(Promise.resolve());
  const pageVersion = useRef(0);
  const openedReading = useRef(false);

  const saveMaterial = useCallback(
    (patch: { currentPage?: number; memo?: string }) => {
      // 페이지와 메모 저장이 사용자가 조작한 순서대로 서버에 도착하게 한다.
      const task = saveQueue.current
        .catch(() => undefined)
        .then(() => updateMaterial(initial.id, patch));

      saveQueue.current = task;

      return task;
    },
    [initial.id]
  );

  useEffect(() => {
    if (historical || openedReading.current || pageVersion.current !== 0)
      return;
    openedReading.current = true;

    // 첫 페이지 열기도 기록하되 이후 페이지 이동보다 앞서 큐에 넣는다.
    void saveMaterial({ currentPage: initial.currentPage }).catch((error) => {
      if (pageVersion.current !== 0) return;
      if (error instanceof ApiError && error.status === 401)
        setSessionExpired(true);
      setSaveStatus('학습 위치 저장 실패');
      setError((error as Error).message);
    });
  }, [historical, initial.currentPage, saveMaterial]);

  useEffect(() => {
    let active = true;
    let task: PDFDocumentLoadingTask | undefined;

    void loadPdfEngine()
      .then((engine) => {
        if (!active) return;

        task = engine.getDocument({
          url: initial.fileUrl,
          withCredentials: true,
          useSystemFonts: true,
        });

        return task.promise.then((pdf) => {
          if (active) setDocument(pdf);
        });
      })
      .catch((error) => {
        if (active)
          setError(`원본 PDF를 불러오지 못했습니다. ${error.message}`);
      });

    return () => {
      active = false;
      void task?.destroy();
    };
  }, [initial.fileUrl]);

  useEffect(() => {
    let active = true;

    void document
      ?.getPage(page)
      .then((value) => {
        if (!active) return;

        const viewport = value.getViewport({ scale: 1 });

        setPageSize({ width: viewport.width, height: viewport.height });
      })
      .catch((error) => {
        if (active) setError(error.message);
      });

    return () => {
      active = false;
    };
  }, [document, page]);

  useEffect(() => {
    const element = scroll.current;

    if (!element) return;

    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;

      setBounds({ width, height });
    });

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    scroll.current?.scrollTo({ top: 0 });
  }, [page]);

  const changePage = useCallback(
    async (next: number) => {
      if (next < 1 || next > initial.pageCount || next === page) return;

      const version = ++pageVersion.current;

      setPage(next);
      setQuote('');
      setSavingExpression(false);
      setDialog(null);
      setOcr(null);
      setUsingOcr(false);
      setOcrSelectionId(undefined);
      setRects([]);
      setPageImage(undefined);
      setSaveStatus('학습 위치 저장 중…');
      setError('');
      setSessionExpired(false);

      if (historical) {
        setSaveStatus('보관 원본의 읽기 위치 · 현재 버전 진도는 유지됨');

        return;
      }

      try {
        await saveMaterial({ currentPage: next });
        if (pageVersion.current === version) setSaveStatus('저장됨');
      } catch (error) {
        if (error instanceof ApiError && error.status === 401)
          setSessionExpired(true);
        if (pageVersion.current !== version) return;
        setSaveStatus('학습 위치 저장 실패');
        setError((error as Error).message);
      }
    },
    [initial.pageCount, page, saveMaterial, historical]
  );

  useEffect(() => {
    if (memo === savedMemo) return;

    function beforeUnload(event: BeforeUnloadEvent) {
      event.preventDefault();
      event.returnValue = '';
    }

    window.addEventListener('beforeunload', beforeUnload);

    return () => window.removeEventListener('beforeunload', beforeUnload);
  }, [memo, savedMemo]);

  async function saveMemo() {
    setSavingMemo(true);
    setError('');
    setSessionExpired(false);

    try {
      await saveMaterial({ memo });
      setSavedMemo(memo);
      setSaveStatus('메모 저장됨');
    } catch (error) {
      if (error instanceof ApiError && error.status === 401)
        setSessionExpired(true);
      setError((error as Error).message);
    } finally {
      setSavingMemo(false);
    }
  }

  function confirmNavigation() {
    return (
      memo === savedMemo ||
      window.confirm('저장하지 않은 메모가 있습니다. 저장하지 않고 이동할까요?')
    );
  }

  const scale =
    typeof zoom === 'number'
      ? zoom
      : Math.max(
          0.2,
          Math.min(
            2,
            zoom === 'width'
              ? (bounds.width - 100) / pageSize.width
              : Math.min(
                  (bounds.width - 100) / pageSize.width,
                  (bounds.height - 100) / pageSize.height
                )
          )
        );

  const thumbStart = Math.max(1, Math.min(page - 2, initial.pageCount - 4));

  const thumbnailPages = Array.from(
    { length: Math.min(5, initial.pageCount) },
    (_, i) => thumbStart + i
  );

  const source = {
    kind: 'pdf' as const,
    materialId: initial.id,
    ocrId: ocrSelectionId,
    page,
    quote,
    rects,
    version: initial.version ?? 1,
  };

  return (
    <div
      className={styles.root}
      onClickCapture={(event) => {
        if (!(event.target instanceof Element)) return;
        const link = event.target.closest<HTMLAnchorElement>('a[href]');

        if (
          link &&
          link.target !== '_blank' &&
          link.href !== window.location.href &&
          !confirmNavigation()
        ) {
          event.preventDefault();
          event.stopPropagation();
        }
      }}>
      {sessionExpired && <SessionRecovery />}
      <header className={styles.header}>
        <Link
          href='/materials'
          className={styles.back}
          aria-label='자료 보관함으로 돌아가기'>
          <Icon name='arrow-left' />
        </Link>
        <Icon name='file-text' />
        <div className={styles.title}>
          <h1>{initial.title}</h1>
          <p>
            {initial.owned ? '내 자료' : '공유 자료'} /{' '}
            {initial.language === 'en' ? '영어' : '태국어'} ·{' '}
            {initial.visibility === 'public'
              ? '공개 자료'
              : initial.visibility === 'accounts'
                ? '지정 계정 공유'
                : '나만 보기'}{' '}
            · 원본 v{initial.version ?? 1}
          </p>
        </div>
        <span
          className={styles.meta}
          role='status'>
          {saveStatus}
        </span>
        <IconButton
          name='bookmark'
          label='선택한 구절을 표현집에 저장'
          disabled={!quote}
          onClick={() => {
            setPanelOpen(true);
            setTab('explanation');
            setSavingExpression(true);
          }}
        />
        <Button
          variant='secondary'
          disabled={!quote}
          onClick={() => setDialog('share')}>
          공유
        </Button>
        <details className={styles.more}>
          <summary aria-label='자료 더보기'>
            <Icon name='ellipsis' />
          </summary>
          <div className={styles.moreMenu}>
            <a
              className={styles.download}
              href={initial.fileUrl}
              target='_blank'
              rel='noreferrer'>
              원본 열기
              <Icon
                name='external-link'
                size={16}
              />
            </a>
            <Button
              variant='ghost'
              disabled={!quote}
              onClick={() => setDialog('report')}>
              선택 원문 오류 신고
            </Button>
            <Button
              variant='ghost'
              onClick={() => setPanelOpen((value) => !value)}>
              {panelOpen ? '학습 패널 닫기' : '학습 패널 열기'}
            </Button>
          </div>
        </details>
      </header>
      {historical && (
        <p className={styles.meta}>
          보관된 원본 v{initial.version}입니다. 현재 버전의 진도와 기본 준비는
          바꾸지 않습니다.{' '}
          <Link href={`/materials/${encodeURIComponent(initial.id)}`}>
            현재 원본 v{initial.latestVersion} 열기
          </Link>
        </p>
      )}
      <PdfToolbar
        page={page}
        total={initial.pageCount}
        zoom={zoom}
        selectionMode={selectionMode}
        memoOpen={memoOpen}
        thumbnailsOpen={thumbnailsOpen}
        onPage={(next) => void changePage(next)}
        onZoom={setZoom}
        onSelectionMode={setSelectionMode}
        onMemo={() => {
          setTab('records');
          setPanelOpen(!memoOpen);
        }}
        onThumbnails={() => setThumbnailsOpen((value) => !value)}
        onHighlight={() => setDialog('annotation')}
        hasSelection={Boolean(quote)}
      />
      {error && (
        <p
          className={styles.error}
          role='alert'>
          {error}
        </p>
      )}
      <div
        className={styles.workspace}
        data-thumbnails={thumbnailsOpen || undefined}
        data-panel-closed={!panelOpen || undefined}>
        {thumbnailsOpen && (
          <nav
            className={styles.thumbnails}
            aria-label='PDF 페이지 목록'>
            {document &&
              thumbnailPages.map((number) => (
                <PdfThumbnail
                  key={number}
                  document={document}
                  number={number}
                  selected={page === number}
                  onSelect={changePage}
                />
              ))}
            <p className={styles.meta}>
              페이지 입력으로 전체 자료를 이동할 수 있어요.
            </p>
          </nav>
        )}
        <div
          className={styles.canvas}
          ref={scroll}>
          {document ? (
            <PdfPage
              key={page}
              document={document}
              number={page}
              scale={scale}
              interactive={
                selectionMode && (!usingOcr || currentOcr?.status === 'ready')
              }
              ocr={
                usingOcr && currentOcr?.status === 'ready'
                  ? currentOcr
                  : undefined
              }
              savedExpressions={expressions}
              source={source}
              onSelectionAction={(action) => {
                setPanelOpen(true);
                setTab('explanation');
                setSavingExpression(action === 'save');
                if (action !== 'save') setInitialMode(action);
              }}
              onRendered={() => {
                const target = rects[0];

                if (target && scroll.current)
                  scroll.current.scrollTo({
                    top: Math.max(0, target.y * pageSize.height * scale - 120),
                    behavior: 'smooth',
                  });
              }}
              highlights={[
                ...(quote && rects.length
                  ? [{ id: 'selection', rects, color: 'yellow' as const }]
                  : []),
                ...annotations
                  .filter(
                    (item) =>
                      item.source.kind === 'pdf' &&
                      item.source.page === page &&
                      (item.source.version ?? 1) === (initial.version ?? 1)
                  )
                  .map((item) => ({
                    id: item.id,
                    rects: item.source.rects ?? [],
                    color: item.color,
                  })),
              ]}
              onSelection={(selected, selectedRects) => {
                setQuote(selected);
                setOcrSelectionId(usingOcr ? currentOcr?.id : undefined);
                setRects(selectedRects);
                const canvas = scroll.current?.querySelector('canvas');

                if (canvas) {
                  try {
                    setPageImage({
                      base64: canvas.toDataURL('image/jpeg', 0.8).split(',')[1],
                      mimeType: 'image/jpeg',
                    });
                  } catch {
                    setPageImage(undefined);
                  }
                }

                setTab('explanation');
                setPanelOpen(true);
                setSavingExpression(false);
                setDialog(null);
              }}
            />
          ) : (
            <p
              className={styles.meta}
              role='status'>
              {error
                ? '원본을 표시할 수 없습니다.'
                : '원본 PDF를 불러오고 있어요.'}
            </p>
          )}
        </div>
        <aside
          className={styles.sidebar}
          hidden={!panelOpen}
          aria-label='PDF 학습 패널'>
          <div className={styles.panelHeading}>
            <Icon
              name='sparkles'
              size={18}
            />
            <h2>
              {tab === 'overview'
                ? '자료 전체 정리'
                : savingExpression
                  ? '표현 저장'
                  : tab === 'records'
                    ? '내 학습 기록'
                    : '구절 살펴보기'}
            </h2>
            <IconButton
              name='x'
              label='PDF 학습 패널 닫기'
              onClick={() => setPanelOpen(false)}
            />
          </div>
          <div
            className={styles.tabs}
            role='tablist'
            aria-label='구절 학습 보기'>
            {(
              [
                ['overview', '전체 정리'],
                ['explanation', '설명'],
                ['records', '내 기록'],
                ['questions', '질문'],
              ] as const
            ).map(([value, label], index) => (
              <button
                key={value}
                type='button'
                role='tab'
                id={`pdf-tab-${value}`}
                aria-controls={`pdf-panel-${value}`}
                aria-selected={tab === value}
                tabIndex={tab === value ? 0 : -1}
                onClick={() => {
                  setTab(value);
                  setSavingExpression(false);
                }}
                onKeyDown={(event) => {
                  const keys = [
                    'overview',
                    'explanation',
                    'records',
                    'questions',
                  ] as const;

                  const next =
                    event.key === 'ArrowRight'
                      ? (index + 1) % 4
                      : event.key === 'ArrowLeft'
                        ? (index + 3) % 4
                        : event.key === 'Home'
                          ? 0
                          : event.key === 'End'
                            ? 3
                            : -1;

                  if (next < 0) return;
                  event.preventDefault();
                  setTab(keys[next]);
                  setSavingExpression(false);

                  event.currentTarget.parentElement
                    ?.querySelectorAll<HTMLButtonElement>('[role="tab"]')
                    [next]?.focus();
                }}>
                {label}
              </button>
            ))}
          </div>
          {quote && tab !== 'overview' && (
            <blockquote className={styles.quote}>
              <small>
                PDF · {page}페이지 · 원본 v{source.version}
                {ocrSelectionId ? ' · OCR' : ''}
              </small>
              <p>{quote}</p>
            </blockquote>
          )}
          <div
            role='tabpanel'
            id='pdf-panel-overview'
            aria-labelledby='pdf-tab-overview'
            hidden={tab !== 'overview'}>
            <MaterialAnalysisPanel
              materialId={initial.id}
              version={initial.version ?? 1}
              owned={initial.owned ?? false}
              pageCount={initial.pageCount}
              onPage={(target) => void changePage(target)}
            />
          </div>
          <div
            role='tabpanel'
            id='pdf-panel-explanation'
            aria-labelledby='pdf-tab-explanation'
            hidden={tab !== 'explanation'}>
            {quote ? (
              savingExpression ? (
                <ExpressionComposer
                  key={JSON.stringify(source)}
                  embedded
                  source={source}
                  onSaved={() => {
                    setExpressionsLoading(true);
                    setSavedReload((value) => value + 1);
                    setTab('records');
                  }}
                  onClose={() => setSavingExpression(false)}
                />
              ) : (
                <LearningAiPanel
                  key={JSON.stringify([source, initialMode])}
                  source={source}
                  language={initial.language}
                  image={pageImage}
                  compact
                  allowGeneration={
                    !historical &&
                    policy !== null &&
                    (eligibilityPendingAfterOcr ||
                      eligibility?.aiAllowed !== false)
                  }
                  initialMode={initialMode}
                  beforeNavigate={confirmNavigation}
                  onSaved={() => {
                    setExpressionsLoading(true);
                    setSavedReload((value) => value + 1);
                    setTab('records');
                  }}
                  onQuestion={() => setDialog('question')}
                />
              )
            ) : (
              <EmptyState
                icon='mouse-pointer-2'
                title='궁금한 문장을 선택해 보세요.'
                description={
                  initial.pages[page - 1]?.trim()
                    ? '문맥 속 뜻을 확인하고 기억할 표현을 저장할 수 있어요.'
                    : currentOcr?.status === 'ready'
                      ? '인식한 글자 선택을 누른 뒤 원본 위에서 선택해 보세요.'
                      : '선택 가능한 글자가 없습니다. 아래 글자 인식에서 저장 결과를 조회하거나 명시적으로 OCR을 요청해 주세요.'
                }
              />
            )}
            <details
              className={styles.preparation}
              open={!initial.pages[page - 1]?.trim()}>
              <summary>페이지 글자 인식과 기본 준비</summary>
              {eligibility &&
                !eligibility.aiAllowed &&
                !eligibilityPendingAfterOcr && (
                  <p className={styles.notice}>
                    새 AI 요청 안내: {eligibility.reason}
                    {eligibility.status === 'needs_ocr'
                      ? ' 페이지 글자 인식에서 저장 결과를 확인하거나 인식을 요청해 주세요.'
                      : ''}{' '}
                    원본 읽기와 개인 기록 조회는 계속 이용할 수 있습니다.
                  </p>
                )}
              {eligibilityPendingAfterOcr && (
                <p className={styles.meta}>
                  글자 인식을 저장했습니다. 새 AI 요청 시 인식 결과의 문자
                  단서를 다시 확인합니다.
                </p>
              )}
              <p className={styles.meta}>
                자료 적합성은 문자의 언어 단서와 등록 시 확인한 학습 목적을
                기준으로 안내합니다.
              </p>
              <PdfOcrPanel
                key={`${initial.id}:${initial.version ?? 1}:${page}`}
                id={initial.id}
                version={initial.version ?? 1}
                page={page}
                owned={initial.owned ?? false}
                historical={historical}
                usingOcr={usingOcr}
                hasNativeText={Boolean(initial.pages[page - 1]?.trim())}
                onResult={(item) => {
                  setOcr(item);
                  if (
                    item?.eligibility &&
                    item.version === (initial.version ?? 1)
                  )
                    setPageEligibility((previous) =>
                      previous.map((value, index) =>
                        index + 1 === item.page ? item.eligibility : value
                      )
                    );
                }}
                onMode={(value) => {
                  if (value === usingOcr) return;
                  setUsingOcr(value);
                  setQuote('');
                  setRects([]);
                  setPageImage(undefined);
                  setOcrSelectionId(undefined);
                }}
              />
              <MaterialPreparation
                key={`${initial.id}:${initial.version ?? 1}:${page}:${currentOcr?.id ?? 'native'}:${policy?.pdf.preparationPages ?? 'unavailable'}`}
                id={initial.id}
                page={page}
                total={initial.pageCount}
                ocrId={currentOcr?.id}
                preparationPages={policy?.pdf.preparationPages}
                pageEligibility={pageEligibility.map((value, index) =>
                  eligibilityPendingAfterOcr && index === page - 1
                    ? undefined
                    : value
                )}
                version={initial.version ?? 1}
                historical={historical}
              />
            </details>
          </div>
          <div
            role='tabpanel'
            id='pdf-panel-records'
            aria-labelledby='pdf-tab-records'
            hidden={tab !== 'records'}>
            <PdfSavedExpressions
              key={JSON.stringify(source)}
              source={source}
              expressions={expressions}
              loading={expressionsLoading}
              error={expressionsError}
            />
            {quote && (
              <Button
                variant='secondary'
                onClick={() => setDialog('annotation')}>
                이 구절 하이라이트·메모
              </Button>
            )}
            <details className={styles.preparation}>
              <summary>문서 공통 개인 메모 · 나만 보기</summary>
              <p className={styles.description}>
                이 자료를 읽으며 떠오른 생각을 기록해 보세요.
              </p>
              <TextArea
                aria-label='자료 개인 메모'
                className={styles.memo}
                value={memo}
                disabled={savingMemo}
                maxLength={20000}
                onChange={(event) => {
                  setMemo(event.target.value);
                  setSaveStatus('저장하지 않은 메모');
                }}
                placeholder='다시 읽고 싶은 부분과 생각을 남겨 주세요.'
              />
              <Button
                disabled={savingMemo}
                loading={savingMemo}
                onClick={() => void saveMemo()}>
                메모 저장
              </Button>
            </details>
            <AnnotationList
              items={annotations.filter(
                (item) =>
                  item.source.kind === 'pdf' &&
                  item.source.page === page &&
                  (item.source.version ?? 1) === (initial.version ?? 1)
              )}
              onChange={(value) =>
                setAnnotations((previous) =>
                  previous.map((item) => (item.id === value.id ? value : item))
                )
              }
              onDelete={(id) =>
                setAnnotations((previous) =>
                  previous.filter((item) => item.id !== id)
                )
              }
            />
          </div>
          <div
            role='tabpanel'
            id='pdf-panel-questions'
            aria-labelledby='pdf-tab-questions'
            hidden={tab !== 'questions'}>
            {quote ? (
              <LearningAiPanel
                key={JSON.stringify(source)}
                source={source}
                language={initial.language}
                compact
                conversationView
                beforeNavigate={confirmNavigation}
                allowGeneration={
                  !historical &&
                  policy !== null &&
                  (eligibilityPendingAfterOcr ||
                    eligibility?.aiAllowed !== false)
                }
                onSaved={() => {
                  setExpressionsLoading(true);
                  setSavedReload((value) => value + 1);
                  setTab('records');
                }}
                onQuestion={() => setDialog('question')}
              />
            ) : (
              <EmptyState
                icon='message-circle'
                title='질문할 원문을 선택해 주세요'
                description='선택한 발췌와 확인한 대상만 공유합니다. 전체 비공개 자료와 개인 메모는 전달하지 않습니다.'
              />
            )}
          </div>
        </aside>
      </div>
      {dialog === 'share' && quote && (
        <ExcerptShareComposer
          source={source}
          onClose={() => setDialog(null)}
        />
      )}
      {dialog === 'question' && quote && (
        <QuestionComposer
          beforeNavigate={confirmNavigation}
          source={source}
          language={initial.language}
          onClose={() => setDialog(null)}
        />
      )}
      {dialog === 'report' && quote && (
        <QuestionComposer
          source={source}
          language={initial.language}
          report
          beforeNavigate={confirmNavigation}
          onClose={() => setDialog(null)}
        />
      )}
      {dialog === 'annotation' && quote && (
        <AnnotationComposer
          source={source}
          onClose={() => setDialog(null)}
          onSaved={(value) =>
            setAnnotations((previous) => [
              value,
              ...previous.filter((item) => item.id !== value.id),
            ])
          }
        />
      )}
    </div>
  );
}
