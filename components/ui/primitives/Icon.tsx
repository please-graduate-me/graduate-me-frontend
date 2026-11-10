import { assignInlineVars } from '@vanilla-extract/dynamic';
import * as styles from './Icon.css';

/** 서비스 디자인 시스템의 원본 아이콘 이름을 제한한다. */
export type IconName =
  | 'house'
  | 'book-open'
  | 'layers'
  | 'repeat-2'
  | 'message-circle'
  | 'chart-no-axes-column'
  | 'settings'
  | 'plus'
  | 'search'
  | 'chevron-down'
  | 'arrow-up-right'
  | 'arrow-left'
  | 'bookmark'
  | 'ellipsis'
  | 'file-text'
  | 'play'
  | 'upload'
  | 'check'
  | 'chevron-left'
  | 'chevron-right'
  | 'highlighter'
  | 'zoom-in'
  | 'menu'
  | 'bell'
  | 'send'
  | 'x'
  | 'clock'
  | 'check-check'
  | 'headphones'
  | 'volume-2'
  | 'arrow-right'
  | 'sparkles'
  | 'shield-check'
  | 'flag'
  | 'users'
  | 'layout-grid'
  | 'list'
  | 'link'
  | 'loader-circle'
  | 'panel-left'
  | 'chevrons-up-down'
  | 'mouse-pointer-2'
  | 'external-link'
  | 'circle-help'
  | 'minus'
  | 'pause'
  | 'rotate-ccw'
  | 'hand'
  | 'pencil';

/** Figma의 SVG 자산을 색상과 크기를 상속하는 장식 아이콘으로 표시한다. */
export function Icon({
  name,
  size = 20,
  className,
}: {
  name: IconName;
  size?: number;
  className?: string;
}) {
  return (
    <span
      aria-hidden='true'
      className={[styles.root, className].filter(Boolean).join(' ')}
      style={{
        // createVar의 var(...) 참조를 실제 사용자 정의 속성 이름으로 변환해야 마스크가 적용된다.
        ...assignInlineVars({ [styles.source]: `url(/icons/${name}.svg)` }),
        width: size,
        height: size,
      }}
    />
  );
}
