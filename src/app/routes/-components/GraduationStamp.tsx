import { useId } from 'react';
import * as styles from './GraduationStamp.css';

/** 큰 성취 순간에 PLEASE GRADUATE ME 문구를 두른 PGM 도장을 찍고, 가운데 글자나 번진 모양을 고를 수 있다. */
export function GraduationStamp({
  size = 96,
  label = 'PGM',
  faded = false,
}: {
  size?: number;
  label?: string;
  faded?: boolean;
}) {
  // 한 화면에 도장이 여럿이어도 원형 문구 경로가 서로 겹치지 않게 고유 id를 쓴다.
  const pathId = 'stamp-' + useId().replace(/[^a-zA-Z0-9-]/g, '');
  // 기본 PGM 도장의 글자 배치는 그대로 두고 다른 글자일 때만 시안의 크기로 맞춘다.
  const custom = label !== 'PGM';
  const ink = faded ? '#9EA2AD' : '#0B7A62';

  return (
    <svg
      aria-hidden='true'
      className={faded ? styles.faded : styles.stamp}
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
        stroke={ink}
        strokeWidth='4'
        strokeDasharray={faded ? '14 9' : undefined}
      />
      <circle
        cx='60'
        cy='60'
        r='33'
        fill={faded ? '#E6E7EB' : '#0B7A62'}
      />
      {faded && (
        <path
          d='M36 52c8-4 14 6 24 2s14-8 24-2v14c-10-4-16 2-24 4s-16-6-24-2z'
          fill='#B9BCC5'
        />
      )}
      <text
        fontFamily='"Space Grotesk", sans-serif'
        fontWeight='700'
        fontSize='11.5'
        letterSpacing='2.4'
        fill={ink}
        opacity={faded ? 0.75 : undefined}>
        <textPath href={'#' + pathId}>
          PLEASE · GRADUATE · ME · PLEASE · GRADUATE · ME ·
        </textPath>
      </text>
      <text
        x='60'
        y={custom ? '68' : '67'}
        textAnchor='middle'
        fontFamily='"Space Grotesk", sans-serif'
        fontWeight='700'
        fontSize={custom ? '22' : '20'}
        letterSpacing={custom ? '-0.5' : undefined}
        fill='#FFFFFF'
        opacity={faded ? 0.9 : undefined}>
        {label}
      </text>
    </svg>
  );
}
