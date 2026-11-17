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

/** 학교 주소만 인증 요청과 코드 확인에 사용한다. */
export const schoolEmailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .max(254)
  .email()
  .refine(
    (value) => value.split('@')[1] === 'hufs.ac.kr',
    '한국외국어대학교 이메일(@hufs.ac.kr)을 입력해 주세요.'
  );

/** 인증 요청 식별자와 만료 시간만 화면에 전달하고 코드는 응답하지 않는다. */
export const emailChallengeSchema = z.object({
  requestId: z.uuid(),
  expiresAt: z.iso.datetime(),
  resendAfterSeconds: z.number().int().positive(),
});

/** 코드 인증과 로그아웃은 세션 쿠키만 발급하고 비밀 토큰은 응답하지 않는다. */
export const authSuccessSchema = z.object({ ok: z.literal(true) });
