import type { HTMLAttributes } from 'react';
import * as styles from './Text.css';

/** 글자 유형, 크기, 색, 굵기, 숫자 서체와 줄 수 제한을 고르는 본문 글자 속성이다. */
export type TextProps = Omit<HTMLAttributes<HTMLElement>, 'color'> & {
  as?: 'span' | 'p' | 'h3';
  type?: keyof typeof styles.type;
  size?: keyof typeof styles.size;
  color?: keyof typeof styles.color;
  weight?: keyof typeof styles.weight;
  display?: 'inline' | 'block';
  justify?: 'start' | 'center';
  maxLines?: number;
  hasTabularNumbers?: boolean;
  isNumeric?: boolean;
};

/** 시안의 본문 위계로 글자를 표시하고 필요한 의미 요소로 렌더링한다. */
export function Text({
  as: Tag = 'span',
  type = 'body',
  size,
  color,
  weight,
  display = 'inline',
  justify = 'start',
  maxLines = 0,
  hasTabularNumbers = false,
  isNumeric = false,
  className,
  style,
  ...props
}: TextProps) {
  const classes = [
    styles.root,
    styles.type[type],
    size && styles.size[size],
    color && styles.color[color],
    weight && styles.weight[weight],
    display === 'block' && styles.block,
    justify === 'center' && styles.center,
    hasTabularNumbers && styles.tabular,
    isNumeric && styles.numeric,
    maxLines === 1 && styles.singleLine,
    maxLines > 1 && styles.multiLine,
    className,
  ];

  return (
    <Tag
      {...props}
      className={classes.filter(Boolean).join(' ')}
      // 여러 줄 제한은 줄 수가 호출부마다 달라 인라인 값으로 전달한다.
      style={maxLines > 1 ? { WebkitLineClamp: maxLines, ...style } : style}
    />
  );
}
