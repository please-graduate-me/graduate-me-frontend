import { AlertDialog } from '@/components/ui/composites/AlertDialog';
import { useRouter } from '@tanstack/react-router';
import { useConfirmation } from '@/lib/hooks/useConfirmation';
import { DropdownMenu } from '@/components/ui/composites/DropdownMenu';
import { Badge } from '@/components/ui/primitives/Badge';
import { Banner } from '@/components/ui/composites/Banner';
import { TabList } from '@/components/ui/primitives/TabList';
import { Tab } from '@/components/ui/primitives/Tab';
import { Heading } from '@/components/ui/primitives/Heading';
import { Text } from '@/components/ui/primitives/Text';
import { Collapsible } from '@/components/ui/composites/Collapsible';
import * as motion from '@/lib/styles/motion.css';
import { ProgressBar } from '@/components/ui/primitives/ProgressBar';
import { ApiError } from '@/lib/api/request';
import { SessionRecovery } from '../../../../-components/SessionRecovery';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { PDFDocumentLoadingTask, PDFDocumentProxy } from 'pdfjs-dist';
import { Link } from '@/components/ui/primitives/Link';
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
import { useMaterialAnalysis } from './useMaterialAnalysis';
import { PdfPassageCard } from './PdfPassageCard';
import { PdfKeyExpressions } from './PdfKeyExpressions';
import { PdfPageSummary } from './PdfPageSummary';
import { PdfPassageMemo } from './PdfPassageMemo';
import { PdfZoomControl, type PdfZoom } from './PdfZoomControl';
import { passageVocabulary } from './pdfVocabulary';
import { MaterialPreparation } from './MaterialPreparation';
import { AnnotationList } from '../../../../-components/AnnotationList';
import { LearningAiPanel } from '../../../../-components/LearningAiPanel';
import { ExpressionComposer } from '../../../../-components/ExpressionComposer';
import { QuestionComposer } from '../../../../-components/QuestionComposer';
import { AnnotationComposer } from '../../../../-components/AnnotationComposer';
import { ExcerptShareComposer } from '../../../../-components/ExcerptShareComposer';
import { useGrowthSummary } from '../../../-components/useGrowthSummary';
import { expectedXp } from '@/domains/growth/lib/expectedXp';
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

  const confirmation = useConfirmation();
  const router = useRouter();
  const [document, setDocument] = useState<PDFDocumentProxy | null>(null);
  const [page, setPage] = useState(initial.currentPage);
  const [zoom, setZoom] = useState<PdfZoom>('width');
  const [thumbnailsOpen, setThumbnailsOpen] = useState(true);
  const [selectionMode, setSelectionMode] = useState(true);

  // 선택 구절 없이 열면 예전 기본 화면이던 전체 정리를 담은 요약·번역 탭부터 보여 준다.
  const [tab, setTab] = useState<'passage' | 'summary' | 'memo'>(
    selection ? 'passage' : 'summary'
  );

  const [panelOpen, setPanelOpen] = useState(true);

  // 서버가 기록한 완료 시각이 있으면 앞쪽을 다시 열어도 다 읽은 자료로 둔다.
  const completed = Boolean(initial.completedAt);
  const growth = useGrowthSummary();
  const [explanationReload, setExplanationReload] = useState(0);
  const analysis = useMaterialAnalysis(initial.id, initial.version ?? 1);

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

  const memoOpen = panelOpen && tab === 'memo';
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

  async function confirmNavigation() {
    return (
      memo === savedMemo ||
      (await confirmation.confirm(
        '저장하지 않은 메모가 있습니다. 저장하지 않고 이동할까요?',
        '메모를 저장하지 않고 이동할까요?'
      ))
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

  const allowGeneration =
    !historical &&
    policy !== null &&
    (eligibilityPendingAfterOcr || eligibility?.aiAllowed !== false);

  const keyWords = passageVocabulary(
    analysis.value?.overview?.vocabulary ?? [],
    page,
    quote
  );

  const reloadExpressions = () => {
    setExpressionsLoading(true);
    setSavedReload((value) => value + 1);
  };

  const languageLabel = initial.language === 'en' ? '영어' : '태국어';

  return (
    <div
      className={styles.root}
      onClickCapture={(event) => {
        if (!(event.target instanceof Element) || memo === savedMemo) return;
        const link = event.target.closest<HTMLAnchorElement>('a[href]');

        if (
          !link ||
          link.target === '_blank' ||
          link.href === window.location.href ||
          link.hasAttribute('download') ||
          event.ctrlKey ||
          event.metaKey ||
          event.shiftKey ||
          event.altKey
        )
          return;
        event.preventDefault();
        event.stopPropagation();
        const destination = link.href;

        void confirmNavigation().then((accepted) => {
          if (!accepted) return;
          if (new URL(destination).origin === window.location.origin)
            void router.navigate({ href: destination });
          else window.location.assign(destination);
        });
      }}>
      <AlertDialog {...confirmation.dialog} />
      {sessionExpired && <SessionRecovery />}
      <header className={styles.header}>
        <Link
          href='/materials'
          className={styles.back}
          aria-label='자료 보관함으로 돌아가기'>
          <Icon name='chevron-left' />
        </Link>
        <div className={styles.title}>
          <Text
            as='p'
            display='block'
            type='supporting'
            weight='semibold'
            maxLines={1}
            // 시안처럼 종류와 언어만 보이고 소유·공개 범위·원본 버전은 가리킬 때 확인한다.
            title={`${initial.owned ? '내 자료' : '공유 자료'} · ${languageLabel} · ${
              initial.visibility === 'public'
                ? '공개 자료'
                : initial.visibility === 'accounts'
                  ? '지정 계정 공유'
                  : '나만 보기'
            } · 원본 v${initial.version ?? 1}`}>
            PDF · {languageLabel}
          </Text>
          <Heading
            level={1}
            maxLines={1}
            className={styles.heading}>
            {initial.title}
          </Heading>
        </div>
        <div className={styles.progress}>
          <ProgressBar
            label='읽기 진행률'
            isLabelHidden
            className={styles.progressBar}
            value={page}
            max={initial.pageCount}
          />
          <span
            className={styles.progressText}
            aria-hidden='true'>
            {page} / {initial.pageCount}쪽
          </span>
          {!historical && (completed || page === initial.pageCount) && (
            <Badge
              tone='success'
              size='small'>
              다 읽었어요
            </Badge>
          )}
        </div>
        <PdfZoomControl
          zoom={zoom}
          scale={scale}
          onZoom={setZoom}
        />
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
            setTab('passage');
            setSavingExpression(true);
          }}
        />
        <Button
          variant='secondary'
          disabled={!quote}
          onClick={() => setDialog('share')}>
          공유
        </Button>
        <DropdownMenu
          button={{ label: '자료 더보기', variant: 'ghost' }}
          items={[
            {
              label: '원본 열기',
              href: initial.fileUrl,
              target: '_blank',
              rel: 'noreferrer',
            },
            {
              label: '선택 원문 오류 신고',
              isDisabled: !quote,
              onClick: () => setDialog('report'),
            },
            {
              label: panelOpen ? '학습 패널 닫기' : '학습 패널 열기',
              onClick: () => setPanelOpen((value) => !value),
            },
          ]}
        />
      </header>
      {historical && (
        <Text
          as='p'
          display='block'
          className={styles.meta}>
          보관된 원본 v{initial.version}입니다. 현재 버전의 진도와 기본 준비는
          바꾸지 않습니다.{' '}
          <Link href={`/materials/${encodeURIComponent(initial.id)}`}>
            현재 원본 v{initial.latestVersion} 열기
          </Link>
        </Text>
      )}
      <PdfToolbar
        page={page}
        total={initial.pageCount}
        selectionMode={selectionMode}
        memoOpen={memoOpen}
        thumbnailsOpen={thumbnailsOpen}
        onPage={(next) => void changePage(next)}
        onSelectionMode={setSelectionMode}
        onMemo={() => {
          setTab('memo');
          setPanelOpen(!memoOpen);
        }}
        onThumbnails={() => setThumbnailsOpen((value) => !value)}
        onHighlight={() => setDialog('annotation')}
        hasSelection={Boolean(quote)}
      />
      {error && (
        <Banner
          status='error'
          title='확인이 필요해요'

          role='alert'>
          {error}
        </Banner>
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
            <Text
              as='p'
              display='block'
              className={styles.meta}>
              페이지 입력으로 전체 자료를 이동할 수 있어요.
            </Text>
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
                setTab('passage');
                setSavingExpression(action === 'save');
                if (action === 'question') setDialog('question');
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
                  ? [{ id: 'selection', rects, color: 'selection' as const }]
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

                setTab('passage');
                setPanelOpen(true);
                setSavingExpression(false);
                setDialog(null);
              }}
            />
          ) : (
            <Text
              as='p'
              display='block'
              className={styles.meta}
              role='status'>
              {error
                ? '원본을 표시할 수 없습니다.'
                : '원본 PDF를 불러오고 있어요.'}
            </Text>
          )}
        </div>
        <aside
          className={styles.sidebar}
          hidden={!panelOpen}
          aria-label='PDF 학습 패널'>
          <TabList
            value={tab}
            role='tablist'
            aria-label='패널 보기'
            hasDivider
            className={styles.tabs}
            onChange={(value) => {
              if (
                value !== 'passage' &&
                value !== 'summary' &&
                value !== 'memo'
              )
                return;
              setTab(value);
              setSavingExpression(false);
            }}>
            {(
              [
                ['passage', '구절'],
                ['summary', '요약·번역'],
                ['memo', '메모'],
              ] as const
            ).map(([value, label]) => (
              <Tab
                key={value}
                value={value}
                label={label}
                id={`pdf-tab-${value}`}
                panelId={`pdf-panel-${value}`}
              />
            ))}
          </TabList>
          <div
            role='tabpanel'
            id='pdf-panel-passage'
            aria-labelledby='pdf-tab-passage'
            hidden={tab !== 'passage'}
            className={`${styles.pane} ${motion.slideIn}`}>
            {quote && (
              <PdfPassageCard
                key={JSON.stringify(source)}
                source={source}
                language={initial.language}
                allowGeneration={allowGeneration}
                onTranslated={() => setExplanationReload((value) => value + 1)}
              />
            )}
            {quote && savingExpression ? (
              <ExpressionComposer
                key={JSON.stringify(source)}
                embedded
                source={source}
                onSaved={() => {
                  reloadExpressions();
                  setSavingExpression(false);
                }}
                onClose={() => setSavingExpression(false)}
              />
            ) : (
              <>
                <PdfKeyExpressions
                  words={keyWords}
                  expressions={expressions}
                  source={source}
                  onChanged={reloadExpressions}
                  confirmRemove={(term) =>
                    confirmation.confirm(
                      `'${term}'을(를) 표현집에서 삭제합니다. 저장한 뜻과 메모도 함께 사라집니다.`,
                      '표현집에서 삭제할까요?',
                      { actionLabel: '삭제', icon: 'trash-2' }
                    )
                  }
                />
                {quote ? (
                  <LearningAiPanel
                    key={JSON.stringify([source, explanationReload])}
                    source={source}
                    language={initial.language}
                    image={pageImage}
                    compact
                    allowGeneration={allowGeneration}
                    beforeNavigate={confirmNavigation}
                    onSaved={reloadExpressions}
                    onQuestion={() => setDialog('question')}
                    practiceXp={
                      growth ? expectedXp(growth, growth.rewards.exercise) : 0
                    }
                  />
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
              </>
            )}
            <PdfSavedExpressions
              key={JSON.stringify(source)}
              source={source}
              expressions={expressions}
              loading={expressionsLoading}
              error={expressionsError}
            />
            <Collapsible
              className={styles.preparation}
              defaultIsOpen={!initial.pages[page - 1]?.trim()}
              trigger={<> 페이지 글자 인식과 기본 준비 </>}>
              {eligibility &&
                !eligibility.aiAllowed &&
                !eligibilityPendingAfterOcr && (
                  <Banner
                    status='info'
                    title='안내'>
                    새 AI 요청 안내: {eligibility.reason}
                    {eligibility.status === 'needs_ocr'
                      ? ' 페이지 글자 인식에서 저장 결과를 확인하거나 인식을 요청해 주세요.'
                      : ''}{' '}
                    원본 읽기와 개인 기록 조회는 계속 이용할 수 있습니다.
                  </Banner>
                )}
              {eligibilityPendingAfterOcr && (
                <Text
                  as='p'
                  display='block'
                  className={styles.meta}>
                  글자 인식을 저장했습니다. 새 AI 요청 시 인식 결과의 문자
                  단서를 다시 확인합니다.
                </Text>
              )}
              <Text
                as='p'
                display='block'
                className={styles.meta}>
                자료 적합성은 문자의 언어 단서와 등록 시 확인한 학습 목적을
                기준으로 안내합니다.
              </Text>
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
            </Collapsible>
          </div>
          <div
            role='tabpanel'
            id='pdf-panel-summary'
            aria-labelledby='pdf-tab-summary'
            hidden={tab !== 'summary'}
            className={`${styles.pane} ${motion.slideIn}`}>
            {analysis.value && (
              <PdfPageSummary
                analysis={analysis.value}
                page={page}
              />
            )}
            <Collapsible
              className={styles.preparation}
              defaultIsOpen={!analysis.value?.overview}
              trigger={<>자료 전체 정리와 페이지별 번역</>}>
              <MaterialAnalysisPanel
                state={analysis}
                owned={initial.owned ?? false}
                pageCount={initial.pageCount}
                onPage={(target) => void changePage(target)}
              />
            </Collapsible>
          </div>
          <div
            role='tabpanel'
            id='pdf-panel-memo'
            aria-labelledby='pdf-tab-memo'
            hidden={tab !== 'memo'}
            className={`${styles.pane} ${motion.slideIn}`}>
            {quote ? (
              <PdfPassageMemo
                key={JSON.stringify(source)}
                source={source}
                onSaved={(value) =>
                  setAnnotations((previous) => [
                    value,
                    ...previous.filter((item) => item.id !== value.id),
                  ])
                }
              />
            ) : (
              <Text
                as='p'
                display='block'
                className={styles.description}>
                원문에서 구절을 선택하면 그 위치에 개인 메모를 남길 수 있어요.
              </Text>
            )}
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
            <div className={styles.documentMemo}>
              <TextArea
                label='자료 개인 메모'
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
              <Text
                as='p'
                display='block'
                className={styles.meta}>
                문서 공통 메모 · 나만 보기. 이 자료를 읽으며 떠오른 생각을
                기록해 보세요.
              </Text>
              <div>
                <Button
                  size='small'
                  disabled={savingMemo}
                  loading={savingMemo}
                  onClick={() => void saveMemo()}>
                  메모 저장
                </Button>
              </div>
            </div>
          </div>
        </aside>
      </div>
      {dialog === 'share' && quote && (
        <ExcerptShareComposer
          source={source}
          sourceTitle={initial.title}
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
