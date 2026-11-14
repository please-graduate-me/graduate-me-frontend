'use client';
import { Icon as AstryxIcon, registerIcons } from '@astryxdesign/core/Icon';

/** 서비스에서 사용하는 SVG 자산 이름을 제한한다. */
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

const iconNames: IconName[] = [
  'house',
  'book-open',
  'layers',
  'repeat-2',
  'message-circle',
  'chart-no-axes-column',
  'settings',
  'plus',
  'search',
  'chevron-down',
  'arrow-up-right',
  'arrow-left',
  'bookmark',
  'ellipsis',
  'file-text',
  'play',
  'upload',
  'check',
  'chevron-left',
  'chevron-right',
  'highlighter',
  'zoom-in',
  'menu',
  'bell',
  'send',
  'x',
  'clock',
  'check-check',
  'headphones',
  'volume-2',
  'arrow-right',
  'sparkles',
  'shield-check',
  'flag',
  'users',
  'layout-grid',
  'list',
  'link',
  'loader-circle',
  'panel-left',
  'chevrons-up-down',
  'mouse-pointer-2',
  'external-link',
  'circle-help',
  'minus',
  'pause',
  'rotate-ccw',
  'hand',
  'pencil',
];

registerIcons(
  Object.fromEntries(
    iconNames.map((name) => [
      `graduate:${name}`,
      <span
        key={name}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          background: 'currentColor',
          mask: `url(/icons/${name}.svg) center / contain no-repeat`,
          WebkitMask: `url(/icons/${name}.svg) center / contain no-repeat`,
        }}
      />,
    ])
  )
);

/** 서비스 SVG 자산을 Astryx 아이콘 레지스트리와 접근성 규칙으로 표시한다. */
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
    <AstryxIcon
      icon={`graduate:${name}`}
      color='inherit'
      className={className}
      style={{ width: size, height: size, fontSize: size }}
    />
  );
}
