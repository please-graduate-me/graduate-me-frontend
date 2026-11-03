import { z } from 'zod';

/** 저장과 표시에서 지원하는 학습 모드의 범위를 맞춘다. */
export const modeSchema = z.enum(['full', 'blank']);

/** 검증 스키마에서 타입을 추론해 별도 선언의 불일치를 막는다. */
export type Mode = z.infer<typeof modeSchema>;
