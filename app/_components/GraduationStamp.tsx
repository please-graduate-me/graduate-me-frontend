import { useId } from 'react';
import * as styles from './GraduationStamp.css';

/** 큰 성취 순간에 PLEASE GRADUATE ME 문구를 두른 PGM 도장을 찍는다. */
export function GraduationStamp({ size = 96 }: { size?: number }) {
  // 한 화면에 도장이 여럿이어도 원형 문구 경로가 서로 겹치지 않게 고유 id를 쓴다.
  const pathId = 'stamp-' + useId().replace(/[^a-zA-Z0-9-]/g, '');

  return (
    <svg
      aria-hidden='true'
      className={styles.stamp}
      width={size}
      height={size}
      viewBox='0 0 120 120'>
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
        fill='#FFFFFF'
        stroke='#0B7A62'
        strokeWidth='4'
      />
      <circle
        cx='60'
        cy='60'
        r='33'
        fill='#0B7A62'
      />
      <text
        fontFamily='"Space Grotesk", sans-serif'
        fontWeight='700'
        fontSize='11.5'
        letterSpacing='2.4'
        fill='#0B7A62'>
        <textPath href={'#' + pathId}>
          PLEASE · GRADUATE · ME · PLEASE · GRADUATE · ME ·
        </textPath>
      </text>
      <text
        x='60'
        y='67'
        textAnchor='middle'
        fontFamily='"Space Grotesk", sans-serif'
        fontWeight='700'
        fontSize='20'
        fill='#FFFFFF'>
        PGM
      </text>
    </svg>
  );
}
