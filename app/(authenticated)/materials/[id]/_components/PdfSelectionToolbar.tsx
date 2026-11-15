import { Toolbar } from '@/components/ui/composites/Toolbar';
import { Button } from '@/components/ui/primitives/Button';
import { pdfSelectionToolbarPosition } from '@/domains/materials/lib/pdfSelection';
import * as styles from './PdfSelectionToolbar.css';

/** 선택 도구 막대가 패널에 넘기는 동작이다. */
export type PdfSelectionAction = 'explore' | 'save' | 'question';

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
  onAction: (action: PdfSelectionAction) => void;
}) {
  return (
    <Toolbar
      label='선택한 구절 도구'
      className={styles.root}
      style={pdfSelectionToolbarPosition(rect, width, height)}
      onPointerDown={(event) => event.preventDefault()}
      startContent={
        <>
          <Button
            variant='ghost'
            size='small'
            type='button'
            startIcon='sparkles'
            onClick={() => onAction('explore')}>
            구절 살펴보기
          </Button>
          <Button
            variant='ghost'
            size='small'
            type='button'
            startIcon='bookmark'
            onClick={() => onAction('save')}>
            표현 저장
          </Button>
          <Button
            variant='primary'
            size='small'
            type='button'
            startIcon='message-circle'
            onClick={() => onAction('question')}>
            질문하기
          </Button>
        </>
      }
    />
  );
}
