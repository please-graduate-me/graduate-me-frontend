import { Icon } from '@/components/ui/primitives/Icon';
import { pdfSelectionToolbarPosition } from '@/domains/materials/lib/pdfSelection';
import * as styles from './PdfSelectionToolbar.css';

/** 선택 도구는 원문 위치에 머물며 명시한 동작만 패널로 전달한다. */
export function PdfSelectionToolbar({
  rect,
  width,
  height,
  onAction,
}: {
  rect: { x: number; y: number; width: number; height: number };
  width: number;
  height: number;
  onAction: (action: 'meaning' | 'translation' | 'save') => void;
}) {
  return (
    <div
      role='toolbar'
      aria-label='선택한 구절 도구'
      className={styles.root}
      style={pdfSelectionToolbarPosition(rect, width, height)}
      onPointerDown={(event) => event.preventDefault()}>
      <button
        type='button'
        onClick={() => onAction('meaning')}>
        <Icon
          name='sparkles'
          size={16}
        />
        설명
      </button>
      <button
        type='button'
        onClick={() => onAction('translation')}>
        <Icon
          name='book-open'
          size={16}
        />
        번역
      </button>
      <button
        type='button'
        onClick={() => onAction('save')}>
        <Icon
          name='bookmark'
          size={16}
        />
        저장
      </button>
    </div>
  );
}
