/** 공유 대상 식별자를 안전하게 화면 주소로 변환한다. */
export const sharePaths = {
  detail: (id: string) => `/share/${encodeURIComponent(id)}`,
};
