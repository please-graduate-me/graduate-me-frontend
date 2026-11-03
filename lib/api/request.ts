/** 도메인 요청이 브라우저와 서버의 전송 차이를 알지 않게 한다. */
export type Transport = (path: string, init?: RequestInit) => Promise<Response>;

/** HTTP 도구가 특정 업무 스키마 라이브러리에 묶이지 않게 한다. */
export type Parser<T> = { parse: (value: unknown) => T };

/** 호출자가 HTTP 실패와 데이터 형식 오류를 구분할 수 있게 한다. */
export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string
  ) {
    super(message);
  }
}

/** 브라우저 요청에서 오래된 학습 상태를 재사용하지 않게 한다. */
export const browserTransport: Transport = (path, init) =>
  fetch(path, { cache: 'no-store', ...init });

/** 성공 여부와 응답 형식 검증을 모든 요청에 동일하게 적용한다. */
export async function request<T>(
  path: string,
  schema: Parser<T>,
  init?: RequestInit,
  transport: Transport = browserTransport
): Promise<T> {
  const response = await transport(path, init);
  const payload: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      payload &&
      typeof payload === 'object' &&
      'error' in payload &&
      typeof payload.error === 'string'
        ? payload.error
        : '서버에 연결하지 못했습니다.';

    throw new ApiError(response.status, message);
  }

  return schema.parse(payload);
}

/** JSON 요청 헤더와 본문의 조합을 호출부마다 반복하지 않는다. */
export function jsonBody(body: unknown): RequestInit {
  return {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  };
}
