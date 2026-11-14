import type { ComponentProps } from 'react';
import * as styles from './Section.css';

/** 화면의 한 영역을 section 요소로 묶고, 이름이 있으면 보조 기술의 영역 목록에 드러낸다. */
export function Section({
  variant = 'default',
  dividers,
  className,
  ...props
}: ComponentProps<'section'> & {
  variant?: 'default' | 'transparent';
  dividers?: 'top'[];
}) {
  const classes = [
    styles.root,
    variant === 'transparent' && styles.transparent,
    dividers?.includes('top') && styles.dividerTop,
    className,
  ];

  return (
    <section
      {...props}
      className={classes.filter(Boolean).join(' ')}
    />
  );
}
