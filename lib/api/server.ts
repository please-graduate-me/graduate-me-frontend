import 'server-only';
import { headers } from 'next/headers';
import type { Transport } from './request';

/** 쿠키와 내부 API 주소를 서버 전용 경계 안에 가둔다. */
export async function createServerTransport(): Promise<Transport> {
  const incoming = await headers();
  const backend = process.env.API_INTERNAL_URL || 'http://127.0.0.1:4000';

  return (path, init) => {
    const outgoing = new Headers(init?.headers);

    outgoing.set('cookie', incoming.get('cookie') || '');

    return fetch(`${backend}${path}`, {
      ...init,
      headers: outgoing,
      cache: 'no-store',
    });
  };
}
