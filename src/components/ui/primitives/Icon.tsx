/** public/icons에 있는 서비스 SVG 자산 이름 목록이다. */
export const iconNames = [
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
  'flame',
  'zap',
  'thumbs-up',
  'info',
  'circle-alert',
  'trash-2',
  'eye',
  'eye-off',
  'lightbulb',
  'circle-play',
  'graduation-cap',
  'lock',
  'copy',
  'globe',
  'log-out',
  'rotate-cw',
  'refresh-cw',
  'at-sign',
  'user-plus',
  'trending-up',
  'archive',
  'arrow-up',
  'shield',
  'trophy',
  'audio-lines',
  'messages-square',
] as const;

/** 서비스에서 사용하는 SVG 자산 이름을 제한한다. */
export type IconName = (typeof iconNames)[number];

/** 서비스 SVG 자산을 글자색 마스크로 그리고, 장식이므로 보조 기술에서는 숨긴다. */
export function Icon({
  name,
  size = 20,
  className,
}: {
  name: IconName;
  size?: number;
  className?: string;
}) {
  const mask = `url(/icons/${name}.svg) center / contain no-repeat`;

  // 테스트 렌더러가 vanilla-extract를 거치지 않으므로 외형을 인라인으로 고정한다.

  return (
    <span
      aria-hidden='true'
      className={className}
      style={{
        width: size,
        height: size,
        display: 'inline-block',
        flexShrink: 0,
        verticalAlign: 'middle',
        background: 'currentColor',
        mask,
        WebkitMask: mask,
      }}
    />
  );
}
