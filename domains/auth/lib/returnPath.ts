/** 로그인 복귀는 이 서비스 안의 상대 경로만 허용한다. */
export function safeReturnPath(
  value: string | null | undefined,
  fallback = '/library'
) {
  if (
    !value ||
    !value.startsWith('/') ||
    value.startsWith('//') ||
    value.includes('\\') ||
    Array.from(value).some((character) => {
      const code = character.charCodeAt(0);

      return code < 32 || code === 127;
    })
  )
    return fallback;

  return value;
}
