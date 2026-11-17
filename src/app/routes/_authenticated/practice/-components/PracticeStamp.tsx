import { useId } from 'react';
import * as styles from './PracticeStamp.css';

/** 자가점검을 끝까지 마친 것을 축하하는 서비스 도장 장식이다. */
export function PracticeStamp() {
  const pathId = useId();

  return (
    <svg
      aria-hidden='true'
      width='76'
      height='76'
      viewBox='0 0 120 120'
      className={styles.root}>
      <defs>
        <path
          id={pathId}
          d='M60 60m-43 0a43 43 0 1 1 86 0a43 43 0 1 1-86 0'
        />
      </defs>
      <circle
        cx='60'
        cy='60'
        r='56'
        strokeWidth='4'
        className={styles.outer}
      />
      <circle
        cx='60'
        cy='60'
        r='33'
        className={styles.inner}
      />
      <text
        fontWeight='700'
        fontSize='11.5'
        letterSpacing='2.4'
        className={styles.ring}>
        <textPath href={`#${pathId}`}>
          PLEASE · GRADUATE · ME · PLEASE · GRADUATE · ME ·
        </textPath>
      </text>
      <text
        x='60'
        y='67'
        textAnchor='middle'
        fontWeight='700'
        fontSize='20'
        letterSpacing='-0.5'
        className={styles.mark}>
        PGM
      </text>
    </svg>
  );
}
