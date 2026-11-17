/** 학사모를 쓴 P 모양의 PGM 로고로 헤더와 아이콘 자리에서 서비스를 알아보게 한다. */
export function BrandLogo({ size = 30 }: { size?: number }) {
  return (
    <svg
      aria-hidden='true'
      width={size}
      height={size}
      viewBox='0 0 120 120'>
      <rect
        width='120'
        height='120'
        rx='30'
        fill='#16181D'
      />
      <text
        x='58'
        y='100'
        textAnchor='middle'
        fontFamily='"Space Grotesk", sans-serif'
        fontWeight='700'
        fontSize='64'
        fill='#FFFFFF'>
        P
      </text>
      <path
        d='M60 18 98 33 60 48 22 33z'
        fill='#12A47F'
      />
      <path
        d='M38 40v9c0 4 10 8 22 8s22-4 22-8v-9l-22 8z'
        fill='#0B7A62'
      />
    </svg>
  );
}
