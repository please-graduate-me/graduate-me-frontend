import { z } from 'zod';

/** 인식 영역은 원본 페이지 안의 비율 좌표로만 표시한다. */
export const ocrFieldSchema = z.object({
  text: z.string(),
  rect: z
    .object({
      x: z.number().min(0).max(1),
      y: z.number().min(0).max(1),
      width: z.number().positive().max(1),
      height: z.number().positive().max(1),
    })
    .refine(
      (rect) =>
        rect.x + rect.width <= 1.000001 && rect.y + rect.height <= 1.000001
    ),
  confidence: z.number().min(0).max(1).nullable(),
  lineBreak: z.boolean(),
});

/** OCR은 원본 텍스트와 구분한 페이지별 저장 결과다. */
export const ocrPageSchema = z.object({
  provider: z.enum(['naver', 'anthropic']).default('naver'),
  model: z.string().default('모델 기록 없음'),
  id: z.string().uuid(),
  materialId: z.string(),
  version: z.number().int().positive(),
  page: z.number().int().positive(),
  status: z.enum(['running', 'ready', 'failed']),
  text: z.string(),
  fields: z.array(ocrFieldSchema),
  width: z.number().positive().nullable(),
  height: z.number().positive().nullable(),
  lowConfidenceCount: z.number().int().nonnegative(),
  error: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

/** 저장 결과 조회와 실제 지원·설정 상태를 함께 검증한다. */
export const materialOcrSchema = z.object({
  provider: z.enum(['naver', 'anthropic']),
  model: z.string(),
  configured: z.boolean(),
  supportedLanguages: z.array(z.enum(['en', 'th'])),
  languageSupported: z.boolean(),
  item: ocrPageSchema.nullable(),
});

/** 페이지별 인식 결과를 원본 위의 선택층으로 전달한다. */
export type OcrPage = z.infer<typeof ocrPageSchema>;

/** OCR 조회·실행 응답의 외부 계약이다. */
export type MaterialOcr = z.infer<typeof materialOcrSchema>;
