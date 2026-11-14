import NextLink from 'next/link';
import type { AnchorHTMLAttributes, Ref } from 'react';
import * as styles from './Link.css';

/** 이동 주소와 링크 요소 속성이다. */
export type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  ref?: Ref<HTMLAnchorElement>;
};

// 프로토콜이나 프로토콜 상대 주소는 앱 라우터가 처리할 수 없는 외부 주소다.
const externalHref = /^([a-z][a-z\d+.-]*:|\/\/)/i;

/** 내부 주소는 Next.js 클라이언트 이동으로, 외부 주소는 일반 링크로 연다. */
export function Link({ href, className, ...props }: LinkProps) {
  const classes = className ? `${styles.root} ${className}` : styles.root;

  if (externalHref.test(href)) {
    return (
      <a
        {...props}
        href={href}
        className={classes}
      />
    );
  }

  return (
    <NextLink
      {...props}
      href={href}
      className={classes}
    />
  );
}
