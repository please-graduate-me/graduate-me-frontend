import NextLink from 'next/link';
import type { ReactNode } from 'react';
import * as styles from './TopNavHeading.css';

/** 상단 막대 왼쪽의 로고와 서비스 이름이며 주소가 있으면 홈 링크가 된다. */
export function TopNavHeading({
  heading,
  headingHref,
  logo,
}: {
  heading?: string;
  headingHref?: string;
  logo?: ReactNode;
}) {
  const content = (
    <>
      {logo}
      {heading && <span className={styles.text}>{heading}</span>}
    </>
  );

  if (headingHref)
    return (
      <NextLink
        href={headingHref}
        className={styles.root}>
        {content}
      </NextLink>
    );

  return <span className={styles.root}>{content}</span>;
}
