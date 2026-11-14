import type { ComponentProps, Ref } from 'react';
import * as styles from './Card.css';

/** 관련 내용을 흰 카드 면으로 묶고 강조나 보조 바탕과 시맨틱 태그를 고를 수 있게 한다. */
export function Card({
  as = 'div',
  variant = 'default',
  className,
  ref,
  ...props
}: Omit<ComponentProps<'div'>, 'ref'> & {
  ref?: Ref<HTMLElement>;
  as?: 'div' | 'section' | 'article';
  variant?: 'default' | keyof typeof styles.variant;
}) {
  // 세 태그 모두 같은 HTMLElement 속성을 쓰므로 타입 검사만 div 기준으로 맞춘다.
  const Tag = as as 'div';

  const classes = [
    styles.root,
    variant !== 'default' && styles.variant[variant],
    className,
  ];

  return (
    <Tag
      {...props}
      ref={ref as Ref<HTMLDivElement>}
      className={classes.filter(Boolean).join(' ')}
    />
  );
}
