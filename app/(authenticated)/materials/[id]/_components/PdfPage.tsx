'use client';
import { useEffect, useRef, useState } from 'react';
import type { PDFDocumentProxy, RenderTask, TextLayer } from 'pdfjs-dist';
import type { Expression } from '@/domains/expressions/model/contracts';
import type { SourceInput } from '@/domains/materials/model/source';
import { pdfMeaningsAt } from '@/domains/materials/lib/pdfRecords';
import { loadPdfEngine } from '@/domains/materials/lib/pdf';
import type { OcrPage } from '@/domains/materials/model/ocr';
import { readPdfSelection } from '@/domains/materials/lib/pdfSelection';
import { PdfSelectionToolbar } from './PdfSelectionToolbar';
import { PdfOcrLayer } from './PdfOcrLayer';
import * as styles from './PdfPage.css';

/** 실제 PDF 캔버스와 선택 가능한 텍스트 층을 같은 좌표로 렌더링한다. */
export function PdfPage({
  document,
  number,
  scale,
  interactive = false,
  onSelection,
  highlights = [],
  onRendered,
  ocr,
  onSelectionAction,
  savedExpressions = [],
  source,
}: {
  document: PDFDocumentProxy;
  savedExpressions?: Expression[];
  source?: SourceInput;
  ocr?: OcrPage;
  onSelectionAction?: (action: 'meaning' | 'translation' | 'save') => void;
  number: number;
  scale: number;
  interactive?: boolean;
  onSelection?: (
    quote: string,
    rects: { x: number; y: number; width: number; height: number }[]
  ) => void;
  onRendered?: () => void;
  highlights?: {
    id: string;
    rects: { x: number; y: number; width: number; height: number }[];
    color: 'yellow' | 'blue' | 'green';
  }[];
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const layer = useRef<HTMLDivElement>(null);
  const onRenderedRef = useRef(onRendered);

  useEffect(() => {
    onRenderedRef.current = onRendered;
  }, [onRendered]);

  const [error, setError] = useState('');

  const [hovered, setHovered] = useState<{
    x: number;
    y: number;
    meanings: { text: string; meaning: string }[];
  } | null>(null);

  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    let disposed = false;
    let render: RenderTask | undefined;
    let text: TextLayer | undefined;

    async function draw() {
      const page = await document.getPage(number);
      const target = canvas.current;
      const container = layer.current;

      if (disposed || !target || !container) return;

      const viewport = page.getViewport({ scale });
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const context = target.getContext('2d');

      if (!context)
        throw new Error('이 브라우저에서 PDF를 표시할 수 없습니다.');
      target.width = Math.floor(viewport.width * ratio);
      target.height = Math.floor(viewport.height * ratio);
      target.style.width = `${viewport.width}px`;
      target.style.height = `${viewport.height}px`;
      setSize({ width: viewport.width, height: viewport.height });
      container.replaceChildren();

      container.style.setProperty(
        '--total-scale-factor',
        String(viewport.scale * viewport.userUnit)
      );

      render = page.render({
        canvas: target,
        canvasContext: context,
        viewport,
        transform: ratio === 1 ? undefined : [ratio, 0, 0, ratio, 0, 0],
      });

      await render.promise;
      if (disposed) return;

      if (interactive && !ocr) {
        const engine = await loadPdfEngine();
        const content = await page.getTextContent();

        if (disposed) return;

        text = new engine.TextLayer({
          textContentSource: content,
          container,
          viewport,
        });

        await text.render();
      }

      if (!disposed) {
        setError('');
        onRenderedRef.current?.();
      }
    }

    void draw().catch((error) => {
      if (!disposed && error.name !== 'RenderingCancelledException')
        setError('PDF 페이지를 표시하지 못했습니다. 원본을 다시 열어 주세요.');
    });

    return () => {
      disposed = true;
      render?.cancel();
      text?.cancel();
    };
  }, [document, number, scale, interactive, ocr]);

  function selected() {
    if (!interactive) return;

    const selection = readPdfSelection(layer.current, window.getSelection());

    if (selection) onSelection?.(selection.quote, selection.rects);
  }

  const selectedRect = highlights.find((item) => item.id === 'selection')
    ?.rects[0];

  return (
    <div
      className={styles.page}
      onPointerMove={(event) => {
        if (!source || !savedExpressions.length) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width;
        const y = (event.clientY - bounds.top) / bounds.height;
        const meanings = pdfMeaningsAt(savedExpressions, source, x, y);

        setHovered(
          meanings.length
            ? {
                x: Math.max(
                  8,
                  Math.min(bounds.width - 248, x * bounds.width + 16)
                ),
                y: Math.max(
                  8,
                  Math.min(bounds.height - 100, y * bounds.height + 20)
                ),
                meanings,
              }
            : null
        );
      }}
      onPointerLeave={() => setHovered(null)}
      style={
        size.width ? { width: size.width, height: size.height } : undefined
      }>
      <canvas
        ref={canvas}
        aria-label={`PDF ${number}페이지`}
      />
      <div
        ref={layer}
        className={styles.textLayer}
        onPointerUp={selected}
        onKeyUp={selected}
      />
      {ocr && (
        <PdfOcrLayer
          item={ocr}
          width={size.width}
          height={size.height}
          interactive={interactive}
          onSelection={onSelection}
        />
      )}
      <div
        className={styles.highlights}
        aria-hidden='true'>
        {highlights.flatMap((item) =>
          item.rects.map((rect, index) => (
            <span
              key={item.id + ':' + index}
              className={styles.highlight}
              data-color={item.color}
              style={{
                left: rect.x * 100 + '%',
                top: rect.y * 100 + '%',
                width: rect.width * 100 + '%',
                height: rect.height * 100 + '%',
              }}
            />
          ))
        )}
      </div>
      {interactive && selectedRect && onSelectionAction && size.width > 0 && (
        <PdfSelectionToolbar
          rect={selectedRect}
          width={size.width}
          height={size.height}
          onAction={onSelectionAction}
        />
      )}
      {hovered && (
        <div
          className={styles.meaningTooltip}
          role='tooltip'
          style={{ left: hovered.x, top: hovered.y }}>
          <small>이 위치에 저장한 나의 뜻</small>
          {hovered.meanings.map((item, index) => (
            <p key={index}>
              <strong>{item.text}</strong>
              <br />
              {item.meaning}
            </p>
          ))}
        </div>
      )}
      {error && (
        <p
          className={styles.error}
          role='alert'>
          {error}
        </p>
      )}
    </div>
  );
}
