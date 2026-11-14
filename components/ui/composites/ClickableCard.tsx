import NextLink from 'next/link';
import type { HTMLAttributes, MouseEventHandler } from 'react';
import * as styles from './ClickableCard.css';

/** 카드 전체를 하나의 링크나 버튼으로 만들고 label을 그 접근성 이름으로 쓴다. */
export function ClickableCard({
  label,
  href,
  onClick,
  variant = 'default',
  padding,
  className,
  children,
  ...props
}: Omit<HTMLAttributes<HTMLDivElement>, 'onClick'> & {
  label: string;
  href?: string;
  onClick?: MouseEventHandler<HTMLElement>;
  variant?: 'default' | 'transparent';
  padding?: 0 | 3;
}) {
  const classes = [
    styles.root,
    variant === 'transparent' && styles.transparent,
    styles.padding[padding ?? 'default'],
    className,
  ];

  return (
    <div
      {...props}
      className={classes.filter(Boolean).join(' ')}>
      {children}
      {href ? (
        <NextLink
          href={href}
          aria-label={label}
          className={styles.action}
          onClick={onClick}
        />
      ) : (
        <button
          type='button'
          aria-label={label}
          className={styles.action}
          onClick={onClick}
        />
      )}
    </div>
  );
}
