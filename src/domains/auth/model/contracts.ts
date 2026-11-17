import { z } from 'zod';

/** 미로그인 상태와 식별자가 없는 잘못된 세션을 구분한다. */
export const sessionSchema = z
  .object({
    user: z.object({
      id: z.string(),
      name: z.string().nullish(),
      email: z.string().nullish(),
      image: z.string().nullish(),
    }),
    expires: z.string(),
  })
  .nullable();

/** 인증 준비 여부를 임의의 응답 값으로 판단하지 않게 한다. */
export const authStatusSchema = z.object({ configured: z.boolean() });

/** 인증 요청에 필요한 토큰이 누락된 상태로 진행하지 않게 한다. */
export const csrfSchema = z.object({ csrfToken: z.string() });

/** 인증 후 이동할 주소가 유효한 URL인지 확인한다. */
export const authRedirectSchema = z.object({ url: z.url() });
