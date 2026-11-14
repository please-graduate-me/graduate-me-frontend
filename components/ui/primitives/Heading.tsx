import type { HTMLAttributes } from 'react';
import * as styles from './Heading.css';

/** 문서 단계와 표시 크기를 고르는 제목 속성이다. */
export type HeadingProps = Omit<HTMLAttributes<HTMLHeadingElement>, 'color'> & {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  type?: keyof typeof styles.type;
  weight?: 'bold';
  color?: 'inherit';
  justify?: 'start' | 'center';
  maxLines?: 1;
};

/** 단계에 맞는 실제 h1에서 h6 요소로 시안의 제목 위계를 표시한다. */
export function Heading({
  level,
  type,
  weight,
  color,
  justify = 'start',
  maxLines,
  className,
  ...props
}: HeadingProps) {
  const Tag = `h${level}` as const;

  const classes = [
    styles.root,
    styles.level[level],
    type && styles.type[type],
    weight === 'bold' && styles.bold,
    color === 'inherit' && styles.inherit,
    justify === 'center' && styles.center,
    maxLines === 1 && styles.singleLine,
    className,
  ];

  return (
    <Tag
      {...props}
      className={classes.filter(Boolean).join(' ')}
    />
  );
}
