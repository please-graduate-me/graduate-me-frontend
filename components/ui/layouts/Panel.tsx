import type { ComponentProps } from 'react';
import { root } from './Panel.css';
type PanelProps = ComponentProps<'section'> & { as?: 'section' | 'article' };
/** 화면 영역의 기본 모양을 업무 컴포넌트와 분리한다. */
export function Panel({
  as: Tag = 'section',
  className,
  ...props
}: PanelProps) {
  return (
    <Tag
      {...props}
      className={[root, className].filter(Boolean).join(' ')}
    />
  );
}
