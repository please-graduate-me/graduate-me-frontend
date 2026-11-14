import { SelectableCard } from '@/components/ui/composites/SelectableCard';
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
    <SelectableCard
      label={`${number}페이지`}
      isSelected={selected}
      onChange={() => onSelect(number)}
      className={styles.root}
      aria-current={selected ? 'page' : undefined}>
      <div
        className={styles.frame}
        data-selected={selected}>
        <PdfPage
          document={document}
          number={number}
          scale={0.105}
        />
      </div>
      <span
        className={styles.number}
        data-selected={selected}>
        {number}
      </span>
    </SelectableCard>
  );
}
