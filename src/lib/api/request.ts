/** 도메인 요청이 브라우저와 서버의 전송 차이를 알지 않게 한다. */
export type Transport = (path: string, init?: RequestInit) => Promise<Response>;

/** HTTP 도구가 특정 업무 스키마 라이브러리에 묶이지 않게 한다. */
export type Parser<T> = { parse: (value: unknown) => T };

/** 호출자가 HTTP 실패와 데이터 형식 오류를 구분할 수 있게 한다. */
export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly requestId?: string,
    public readonly code?: string
  ) {
    super(requestId ? `${message} (요청 ID: ${requestId})` : message);
  }
}

/** 브라우저 요청에서 오래된 학습 상태를 재사용하지 않게 한다. */
export const browserTransport: Transport = (path, init) => {
  const headers = new Headers(init?.headers);

  // 프록시도 HTML 오류 화면 대신 API용 형식으로 응답하도록 요청한다.
  if (!headers.has('Accept')) headers.set('Accept', 'application/json');

  return fetch(path, { cache: 'no-store', ...init, headers });
};

/** 성공 여부와 응답 형식 검증을 모든 요청에 동일하게 적용한다. */
export async function request<T>(
  path: string,
  schema: Parser<T>,
  init?: RequestInit,
  transport: Transport = browserTransport
): Promise<T> {
  let response: Response;

  try {
    response = await transport(path, init);
  } catch {
    // 전송 실패는 서버의 HTTP 오류 응답과 구분하며 AI 요청을 자동 재실행하지 않는다.
    throw new ApiError(
      0,
      '응답을 받지 못했습니다. 네트워크 연결을 확인해 주세요.'
    );
  }

  const payload: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const details =
      payload && typeof payload === 'object'
        ? (payload as Record<string, unknown>)
        : {};

    const candidate = details.requestId ?? response.headers.get('X-Request-Id');

    // 응답 본문이나 프록시 헤더의 임의 문자열을 추적 식별자로 화면에 복사하지 않는다.
    const requestId =
      typeof candidate === 'string' &&
      /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(
        candidate
      )
        ? candidate
        : undefined;

    const code =
      typeof details.code === 'string' && /^[A-Z_]{1,80}$/.test(details.code)
        ? details.code
        : undefined;

    const message =
      payload &&
      typeof payload === 'object' &&
      'error' in payload &&
      typeof payload.error === 'string'
        ? payload.error
        : `요청을 처리하지 못했습니다. (HTTP ${response.status})`;

    throw new ApiError(response.status, message, requestId, code);
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
