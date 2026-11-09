'use client';
import { Fragment, useLayoutEffect, useRef } from 'react';
import type { OcrPage } from '@/domains/materials/model/ocr';
import { readPdfSelection } from '@/domains/materials/lib/pdfSelection';
import * as styles from './PdfOcrLayer.css';

/** 저장된 인식 글자를 원본 위의 선택 가능한 투명 텍스트층으로 표시한다. */
export function PdfOcrLayer({
  item,
  width,
  height,
  interactive,
  onSelection,
}: {
  item: OcrPage;
  width: number;
  height: number;
  interactive: boolean;
  onSelection?: (
    quote: string,
    rects: { x: number; y: number; width: number; height: number }[]
  ) => void;
}) {
  const layer = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const words =
      layer.current?.querySelectorAll<HTMLSpanElement>('[data-ocr-word]');

    words?.forEach((word, index) => {
      const field = item.fields[index];

      if (!field) return;
      word.style.transform = 'none';
      const bounds = word.getBoundingClientRect();

      if (!bounds.width || !bounds.height) return;
      word.style.transform = `scale(${(field.rect.width * width) / bounds.width}, ${(field.rect.height * height) / bounds.height})`;
    });
  }, [item, width, height]);

  function selected() {
    if (!interactive) return;

    const selection = readPdfSelection(
      layer.current,
      window.getSelection(),
      true
    );

    if (selection) onSelection?.(selection.quote, selection.rects);
  }

  return (
    <div
      ref={layer}
      className={styles.layer}
      data-interactive={interactive}
      onPointerUp={selected}
      onKeyUp={selected}
      aria-label='인식한 글자 선택층'>
      {item.fields.map((field, index) => (
        <Fragment key={index}>
          <span
            className={styles.word}
            data-ocr-word
            data-low-confidence={field.confidence < 0.8 || undefined}
            title={`인식 신뢰도 ${Math.round(field.confidence * 100)}%, 원본 확인`}
            style={{
              left: field.rect.x * 100 + '%',
              top: field.rect.y * 100 + '%',
              fontSize: Math.max(1, field.rect.height * height),
            }}>
            {field.text}
          </span>
          {field.lineBreak ? '\n' : ' '}
        </Fragment>
      ))}
    </div>
  );
}
