/** 미응답 태그 글 수를 배지 글자로 바꾸며 0이면 숨기고 99를 넘으면 99+로 줄인다. */
export function taggedCountLabel(count: number) {
  if (!Number.isFinite(count) || count <= 0) return null;

  return count > 99 ? '99+' : String(Math.floor(count));
}
