const configured = import.meta.env.VITE_ADMIN_APP_URL?.trim();
const url = configured ? new URL(configured) : null;

if (
  url &&
  (!['http:', 'https:'].includes(url.protocol) || url.username || url.password)
)
  throw new Error(
    '운영 앱 주소는 인증 정보가 없는 HTTP 또는 HTTPS 주소여야 합니다.'
  );

/** 운영 앱의 공개 주소를 사용하며 미설정 환경에서는 기존 진입 경로를 유지한다. */
export const adminPaths = { home: url?.href ?? '/admin' };
