import type { PDFDocumentProxy } from 'pdfjs-dist';
import { PdfPage } from './PdfPage';
import * as styles from './PdfThumbnail.css';

/** 실제 PDF 미리보기에서 선택한 페이지로 즉시 이동한다. */
export function PdfThumbnail({
  document,
  number,
  selected,
  onSelect,
}: {
  document: PDFDocumentProxy;
  number: number;
  selected: boolean;
  onSelect: (page: number) => void;
}) {
  return (
    <button
      type='button'
      className={styles.root}
      aria-current={selected ? 'page' : undefined}
      onClick={() => onSelect(number)}>
      <PdfPage
        document={document}
        number={number}
        scale={0.105}
      />
      <span>{number}</span>
    </button>
  );
}
