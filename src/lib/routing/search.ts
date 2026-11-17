/** 숫자·JSON 모양의 문자열도 기존 공유 주소의 원문으로 유지한다. */
export function parseUrlSearch(search: string): Record<string, string> {
  return Object.fromEntries(new URLSearchParams(search));
}

/** 검증된 검색 조건을 따옴표나 JSON 변환 없이 주소에 기록한다. */
export function stringifyUrlSearch(search: Record<string, unknown>) {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(search))
    if (value !== undefined && value !== null) params.set(key, String(value));
  const result = params.toString();

  return result ? '?' + result : '';
}
