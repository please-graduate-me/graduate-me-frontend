/** 화면 주소 변경이 링크 사용처 전체로 퍼지지 않게 한다. */
export const videoPaths = {
  home: '/',
  lesson: (id: string) => `/learn/${encodeURIComponent(id)}`,
};
