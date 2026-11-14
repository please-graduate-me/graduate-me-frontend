import type { ComponentProps } from 'react';
import * as styles from './List.css';

/** ListItem을 담는 목록으로, 글머리 점이나 항목 구분선을 고를 수 있다. */
export function List({
  listStyle = 'none',
  hasDividers = false,
  className,
  ...props
}: ComponentProps<'ul'> & {
  listStyle?: 'none' | 'disc';
  hasDividers?: boolean;
}) {
  const classes = [
    styles.root,
    listStyle === 'disc' && styles.disc,
    hasDividers && styles.dividers,
    className,
  ];

  return (
    <ul
      // Safari가 list-style: none 목록의 목록 의미를 지우므로 역할을 명시한다.
      role='list'
      {...props}
      className={classes.filter(Boolean).join(' ')}
    />
  );
}
