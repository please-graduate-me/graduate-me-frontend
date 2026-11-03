import { z } from 'zod';

/** 변경 요청의 성공 응답을 명시적인 계약으로 확인한다. */
export const okSchema = z.object({ ok: z.boolean() });
