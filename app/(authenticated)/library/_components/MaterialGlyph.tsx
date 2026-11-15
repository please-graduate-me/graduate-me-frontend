/** 최근 자료 타일 안에 영상은 재생 화면, PDF는 겹친 문서 모양으로 자료 종류를 그린다. */
export function MaterialGlyph({ kind }: { kind: 'pdf' | 'video' }) {
  if (kind === 'video')
    return (
      <svg
        aria-hidden='true'
        width='30'
        height='24'
        viewBox='0 0 30 24'>
        <rect
          width='30'
          height='24'
          rx='6'
          fill='#16181D'
        />
        <path
          d='M12 7v10l8-5-8-5z'
          fill='#12A47F'
        />
      </svg>
    );

  return (
    <svg
      aria-hidden='true'
      width='28'
      height='30'
      viewBox='0 0 28 30'>
      <rect
        x='8'
        y='0'
        width='20'
        height='26'
        rx='5'
        fill='#C9C2FB'
      />
      <rect
        x='2'
        y='4'
        width='20'
        height='26'
        rx='5'
        fill='#8B7CF6'
      />
      <rect
        x='7'
        y='12'
        width='11'
        height='3'
        rx='1.5'
        fill='#FFFFFF'
      />
      <rect
        x='7'
        y='19'
        width='8'
        height='3'
        rx='1.5'
        fill='#FFFFFF'
      />
    </svg>
  );
}
