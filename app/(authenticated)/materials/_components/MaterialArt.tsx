const pdfPalettes = [
  { back: '#C9C2FB', front: '#8B7CF6' },
  { back: '#FED7AA', front: '#F97316' },
  { back: '#BFDBFE', front: '#3B82F6' },
  { back: '#A7DCCB', front: '#12A47F' },
] as const;

/** 같은 자료는 늘 같은 색이 되도록 식별자 문자열로 PDF 그림 색을 고른다. */
function paletteFor(seed: string) {
  let hash = 0;

  for (const char of seed) hash = (hash * 31 + (char.codePointAt(0) ?? 0)) | 0;

  return pdfPalettes[Math.abs(hash) % pdfPalettes.length];
}

/** 자료 타일의 장식 그림으로, PDF는 자료마다 다른 색의 겹친 문서, 영상은 재생 화면이며 완료되면 체크 원을 붙인다. */
export function MaterialArt({
  kind,
  seed,
  complete,
  className,
}: {
  kind: 'pdf' | 'video';
  seed: string;
  complete?: 'ink' | 'accent';
  className?: string;
}) {
  const check = complete && (
    <>
      <circle
        cx='60'
        cy='52'
        r='11'
        fill={complete === 'ink' ? '#16181D' : '#12A47F'}
        stroke='#FFFFFF'
        strokeWidth='2'
      />
      <path
        d='m55.5 52 3 3 5.5-6'
        stroke='#FFFFFF'
        strokeWidth='2.4'
        fill='none'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </>
  );

  if (kind === 'video')
    return (
      <svg
        aria-hidden='true'
        className={className}
        width='72'
        height='64'
        viewBox='0 0 72 64'>
        <rect
          x='6'
          y='8'
          width='60'
          height='42'
          rx='10'
          fill='#16181D'
        />
        <path
          d='M30 20v18l15-9-15-9z'
          fill='#12A47F'
        />
        {check || (
          <>
            <rect
              x='0'
              y='40'
              width='30'
              height='16'
              rx='6'
              fill='#FFFFFF'
              stroke='#DADCE1'
              strokeWidth='2'
            />
            <rect
              x='6'
              y='46'
              width='14'
              height='4'
              rx='2'
              fill='#F97316'
            />
          </>
        )}
      </svg>
    );

  const palette = paletteFor(seed);

  return (
    <svg
      aria-hidden='true'
      className={className}
      width='72'
      height='64'
      viewBox='0 0 72 64'>
      <rect
        x='22'
        y='2'
        width='40'
        height='52'
        rx='8'
        fill={palette.back}
      />
      <rect
        x='12'
        y='10'
        width='40'
        height='52'
        rx='8'
        fill={palette.front}
      />
      <rect
        x='20'
        y='24'
        width='22'
        height='5'
        rx='2.5'
        fill='#FFFFFF'
      />
      <rect
        x='20'
        y='34'
        width='16'
        height='5'
        rx='2.5'
        fill='#FFFFFF'
      />
      <rect
        x='20'
        y='44'
        width='20'
        height='5'
        rx='2.5'
        fill='#FFFFFF'
      />
      {check}
    </svg>
  );
}
