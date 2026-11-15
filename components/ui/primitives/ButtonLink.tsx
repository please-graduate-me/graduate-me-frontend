import NextLink from 'next/link';
import type { ComponentProps } from 'react';
import * as styles from '@/lib/styles/button.css';
import {
  buttonClassName,
  buttonIconSize,
  type ButtonAppearance,
} from './buttonClassName';
import { Icon, type IconName } from './Icon';

/** 외부 주소나 새 창이 아닌 앱 내부 경로인지 판단한다. */
function isInternal(href: string, target?: string) {
  return (
    (target === undefined || target === '_self') &&
    (href.startsWith('/') || href.startsWith('#') || href.startsWith('?')) &&
    !href.startsWith('//')
  );
}

/** 버튼 모양의 이동 링크이며 앱 내부 경로는 Next.js 링크로 이동하고 aria-current면 선택 표시를 한다. */
export function ButtonLink({
  variant = 'primary',
  size = 'medium',
  shape,
  pressedTone,
  className,
  href,
  startIcon,
  endIcon,
  children,
  ...props
}: Pick<
  ComponentProps<'a'>,
  | 'href'
  | 'target'
  | 'rel'
  | 'className'
  | 'style'
  | 'children'
  | 'aria-label'
  | 'aria-current'
> &
  Omit<ButtonAppearance, 'hasPressedPop'> & {
    onClick?: () => void;
    startIcon?: IconName;
    endIcon?: IconName;
  }) {
  const classes = buttonClassName({
    variant,
    size,
    shape,
    pressedTone,
    className,
  });

  const content = (
    <>
      {startIcon && (
        <Icon
          name={startIcon}
          size={buttonIconSize[size]}
          className={styles.icon}
        />
      )}
      {children}
      {endIcon && (
        <Icon
          name={endIcon}
          size={buttonIconSize[size]}
          className={styles.icon}
        />
      )}
    </>
  );

  if (href !== undefined && isInternal(href, props.target))
    return (
      <NextLink
        {...props}
        href={href}
        className={classes}>
        {content}
      </NextLink>
    );

  return (
    <a
      {...props}
      href={href}
      className={classes}>
      {content}
    </a>
  );
}
