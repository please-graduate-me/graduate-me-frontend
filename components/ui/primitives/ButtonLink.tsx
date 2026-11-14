import NextLink from 'next/link';
import type { ComponentProps } from 'react';
import * as styles from '@/lib/styles/button.css';

/** 외부 주소나 새 창이 아닌 앱 내부 경로인지 판단한다. */
function isInternal(href: string, target?: string) {
  return (
    (target === undefined || target === '_self') &&
    (href.startsWith('/') || href.startsWith('#') || href.startsWith('?')) &&
    !href.startsWith('//')
  );
}

/** 버튼 모양의 이동 링크이며 앱 내부 경로는 Next.js 링크로 이동한다. */
export function ButtonLink({
  variant = 'primary',
  size = 'medium',
  className,
  href,
  children,
  ...props
}: Pick<
  ComponentProps<'a'>,
  'href' | 'target' | 'rel' | 'className' | 'style' | 'children' | 'aria-label'
> & {
  onClick?: () => void;
  variant?: 'primary' | 'ink' | 'secondary' | 'ghost' | 'danger';
  size?: 'small' | 'medium' | 'large';
}) {
  const classes = [
    styles.base,
    styles.variant[variant],
    styles.size[size],
    className,
  ].join(' ');

  if (href !== undefined && isInternal(href, props.target))
    return (
      <NextLink
        {...props}
        href={href}
        className={classes}>
        {children}
      </NextLink>
    );

  return (
    <a
      {...props}
      href={href}
      className={classes}>
      {children}
    </a>
  );
}
