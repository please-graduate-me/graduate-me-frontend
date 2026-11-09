'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { PDFDocumentLoadingTask, PDFDocumentProxy } from 'pdfjs-dist';
import Link from 'next/link';
import type { Material } from '@/domains/materials/model/contracts';
import { loadPdfEngine } from '@/domains/materials/lib/pdf';
import { updateMaterial } from '@/domains/materials/api/materials';
import { Button } from '@/components/ui/primitives/Button';
import { Icon } from '@/components/ui/primitives/Icon';
import { Badge } from '@/components/ui/primitives/Badge';
import { TextArea } from '@/components/ui/primitives/TextArea';
import { EmptyState } from '@/components/ui/composites/EmptyState';
import { SourceActions } from '../../../../_components/SourceActions';
import { PdfPage } from './PdfPage';
import { PdfToolbar } from './PdfToolbar';
import { PdfThumbnail } from './PdfThumbnail';
import * as styles from './PdfStudy.css';

/** 실제 PDF 선택과 개인 메모를 원문 질문·표현 저장에 연결한다. */
export function PdfStudy({ initial }: { initial: Material }) {
  const [document, setDocument] = useState<PDFDocumentProxy | null>(null);
  const [page, setPage] = useState(initial.currentPage);
  const [zoom, setZoom] = useState<number | 'width' | 'page'>('width');
  const [thumbnailsOpen, setThumbnailsOpen] = useState(true);
  const [selectionMode, setSelectionMode] = useState(true);
  const [memoOpen, setMemoOpen] = useState(false);
  const [memo, setMemo] = useState(initial.memo);
  const [savedMemo, setSavedMemo] = useState(initial.memo);
  const [quote, setQuote] = useState('');
  const [saveStatus, setSaveStatus] = useState('저장됨');
  const [savingMemo, setSavingMemo] = useState(false);
  const [error, setError] = useState('');
  const [bounds, setBounds] = useState({ width: 800, height: 850 });
  const [pageSize, setPageSize] = useState({ width: 612, height: 792 });
  const scroll = useRef<HTMLDivElement>(null);
  const saveQueue = useRef<Promise<unknown>>(Promise.resolve());
  const pageVersion = useRef(0);

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
      setSaveStatus('학습 위치 저장 중…');
      setError('');

      try {
        await saveMaterial({ currentPage: next });
        if (pageVersion.current === version) setSaveStatus('저장됨');
      } catch (error) {
        if (pageVersion.current !== version) return;
        setSaveStatus('학습 위치 저장 실패');
        setError((error as Error).message);
      }
    },
    [initial.pageCount, page, saveMaterial]
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

    try {
      await saveMaterial({ memo });
      setSavedMemo(memo);
      setSaveStatus('메모 저장됨');
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setSavingMemo(false);
    }
  }

  const scale =
    typeof zoom === 'number'
      ? zoom
      : Math.max(
          0.2,
          Math.min(
            2,
            zoom === 'width'
              ? (bounds.width - 80) / pageSize.width
              : Math.min(
                  (bounds.width - 80) / pageSize.width,
                  (bounds.height - 80) / pageSize.height
                )
          )
        );

  const thumbStart = Math.max(1, Math.min(page - 2, initial.pageCount - 4));

  const thumbnailPages = Array.from(
    { length: Math.min(5, initial.pageCount) },
    (_, i) => thumbStart + i
  );

  const source = { kind: 'pdf' as const, materialId: initial.id, page, quote };

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <Link
          href='/materials'
          className={styles.back}
          aria-label='자료 보관함으로 돌아가기'
          onClick={(event) => {
            if (
              memo !== savedMemo &&
              !window.confirm(
                '저장하지 않은 메모가 있습니다. 저장하지 않고 자료 보관함으로 돌아갈까요?'
              )
            )
              event.preventDefault();
          }}>
          <Icon name='arrow-left' />
        </Link>
        <Icon name='file-text' />
        <div className={styles.title}>
          <h1>{initial.title}</h1>
          <p>
            내 자료 / {initial.language === 'en' ? '영어' : '태국어'} · 나만
            보기
          </p>
        </div>
        <span
          className={styles.meta}
          role='status'>
          {saveStatus}
        </span>
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
      </header>
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
        onMemo={() => setMemoOpen((value) => !value)}
        onThumbnails={() => setThumbnailsOpen((value) => !value)}
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
        data-thumbnails={thumbnailsOpen || undefined}>
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
              interactive={selectionMode}
              onSelection={(selected) => {
                setQuote(selected);
                setMemoOpen(false);
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
          aria-label={memoOpen ? '개인 메모' : '선택한 구절 학습'}>
          {memoOpen ? (
            <>
              <div className={styles.panelHeading}>
                <Icon
                  name='pencil'
                  size={18}
                />
                <h2>내 메모</h2>
                <Badge tone='neutral'>나만 보기</Badge>
              </div>
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
            </>
          ) : (
            <>
              <div className={styles.panelHeading}>
                <Icon
                  name='sparkles'
                  size={18}
                />
                <h2>구절 살펴보기</h2>
              </div>
              {quote ? (
                <>
                  <Badge tone='brand'>PDF · {page}페이지</Badge>
                  <blockquote className={styles.quote}>{quote}</blockquote>
                  <div className={styles.section}>
                    <h3>이 원문으로 학습하기</h3>
                    <p className={styles.description}>
                      발견한 표현을 내 언어로 정리하거나, 궁금한 점을 학과 답변
                      도우미에게 질문해 보세요.
                    </p>
                    <SourceActions
                      key={`${page}:${quote}`}
                      source={source}
                      language={initial.language}
                    />
                  </div>
                  <div className={styles.capability}>
                    <Icon
                      name='circle-help'
                      size={18}
                    />
                    <p>
                      AI 설명과 번역은 아직 연결되지 않았어요. 원문과 나의 메모,
                      도우미 답변을 활용할 수 있습니다.
                    </p>
                  </div>
                </>
              ) : (
                <EmptyState
                  icon='mouse-pointer-2'
                  title='원문에서 구절을 선택해 보세요'
                  description={
                    initial.pages[page - 1]?.trim()
                      ? '선택한 문장을 저장하거나 담당 도우미에게 질문할 수 있어요.'
                      : '이 페이지에는 선택할 수 있는 텍스트가 없습니다. 스캔본 OCR은 제공하지 않습니다.'
                  }
                />
              )}
            </>
          )}
        </aside>
      </div>
    </div>
  );
}
