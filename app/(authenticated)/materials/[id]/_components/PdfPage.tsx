'use client';
import { useEffect, useRef, useState } from 'react';
import type { PDFDocumentProxy, RenderTask, TextLayer } from 'pdfjs-dist';
import { loadPdfEngine } from '@/domains/materials/lib/pdf';
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
}: {
  document: PDFDocumentProxy;
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

      if (interactive) {
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
  }, [document, number, scale, interactive]);

  function selected() {
    if (!interactive) return;

    const selection = window.getSelection();

    if (
      !selection ||
      !selection.rangeCount ||
      !layer.current?.contains(selection.anchorNode) ||
      !layer.current.contains(selection.focusNode)
    )
      return;

    const quote = selection.toString().replace(/\s+/g, ' ').trim();

    const bounds = layer.current.getBoundingClientRect();

    const rects = Array.from(selection.getRangeAt(0).getClientRects())
      .filter((rect) => rect.width > 0 && rect.height > 0)
      .slice(0, 200)
      .map((rect) => ({
        x: Math.max(0, Math.min(1, (rect.left - bounds.left) / bounds.width)),
        y: Math.max(0, Math.min(1, (rect.top - bounds.top) / bounds.height)),
        width: Math.max(0, Math.min(1, rect.width / bounds.width)),
        height: Math.max(0, Math.min(1, rect.height / bounds.height)),
      }));

    if (quote) onSelection?.(quote.slice(0, 5000), rects);
  }

  return (
    <div
      className={styles.page}
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
