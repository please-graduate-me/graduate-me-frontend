import { RouterAnchor } from '@/components/ui/primitives/RouterAnchor';
import type { AriaAttributes } from 'react';
import * as styles from './Avatar.css';

const namedSizes = { sm: 28, md: 36, lg: 44 } as const;
const palettes = Object.values(styles.palette);

/** 이름 문자열로 바탕색을 골라 같은 사람은 늘 같은 색을 갖게 한다. */
function paletteFor(name: string) {
  let hash = 0;

  for (const char of name) hash = (hash * 31 + (char.codePointAt(0) ?? 0)) | 0;

  return palettes[Math.abs(hash) % palettes.length];
}

/** 이름 첫 글자를 원 안에 표시하고, 주소가 있으면 그 화면으로 이동하는 링크로 만들며 조교·본인·중립 색을 고를 수 있다. */
export function Avatar({
  name,
  size = 'md',
  tone = 'auto',
  href,
  tooltip = true,
  className,
  ...props
}: AriaAttributes & {
  name: string;
  size?: keyof typeof namedSizes | number;
  tone?: 'auto' | keyof typeof styles.role;
  href?: string;
  tooltip?: boolean;
  className?: string;
  id?: string;
}) {
  const diameter = typeof size === 'number' ? size : namedSizes[size];
  const initial = Array.from(name.trim())[0]?.toUpperCase() ?? '?';
  // 이름 표시는 가리킬 때만 필요하므로 별도 레이어 없이 브라우저 기본 툴팁을 쓴다.
  const title = tooltip ? name : undefined;
  const circleClass = `${styles.root} ${tone === 'auto' ? paletteFor(name) : styles.role[tone]}`;

  // 지름에 비례한 글자 크기라 호출부마다 달라지는 값을 인라인으로 넘긴다.
  const circleStyle = {
    width: diameter,
    height: diameter,
    fontSize: diameter * 0.4,
  };

  if (href) {
    return (
      <RouterAnchor
        aria-label={name}
        title={title}
        {...props}
        href={href}
        className={className ? `${styles.link} ${className}` : styles.link}>
        <span
          aria-hidden='true'
          className={circleClass}
          style={circleStyle}>
          {initial}
        </span>
      </RouterAnchor>
    );
  }

  return (
    <span
      role='img'
      aria-label={name}
      title={title}
      {...props}
      className={className ? `${circleClass} ${className}` : circleClass}
      style={circleStyle}>
      {initial}
    </span>
  );
}
