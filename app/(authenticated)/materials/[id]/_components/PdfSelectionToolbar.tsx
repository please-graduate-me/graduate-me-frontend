import { Toolbar } from '@astryxdesign/core/Toolbar';
import { Theme } from '@astryxdesign/core/theme';
import { pgmTheme } from '@/lib/styles/pgm';
import { Button } from '@/components/ui/primitives/Button';
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
    // 짙은 막대 위 버튼 대비는 어두운 모드 토큰에 맡기고, 감싸는 요소는 display: contents라 위치 기준이 같다.
    <Theme
      theme={pgmTheme}
      mode='dark'>
      <Toolbar
        label='선택한 구절 도구'
        className={styles.root}
        style={pdfSelectionToolbarPosition(rect, width, height)}
        onPointerDown={(event) => event.preventDefault()}
        startContent={
          <>
            <Button
              variant='primary'
              type='button'
              onClick={() => onAction('meaning')}>
              <Icon
                name='sparkles'
                size={16}
              />
              설명
            </Button>
            <Button
              variant='ghost'
              type='button'
              onClick={() => onAction('translation')}>
              <Icon
                name='book-open'
                size={16}
              />
              번역
            </Button>
            <Button
              variant='ghost'
              type='button'
              onClick={() => onAction('save')}>
              <Icon
                name='bookmark'
                size={16}
              />
              저장
            </Button>
          </>
        }
      />
    </Theme>
  );
}
