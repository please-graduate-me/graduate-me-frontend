import { z } from 'zod';

/** 자료 목록과 원문 이동에 필요한 메타데이터를 검증한다. */
export const materialSummarySchema = z.object({
  id: z.string(),
  title: z.string(),
  language: z.enum(['en', 'th']),
  filename: z.string(),
  pageCount: z.number().int().positive(),
  currentPage: z.number().int().positive(),
  status: z.literal('ready'),
  createdAt: z.string(),
  updatedAt: z.string(),
});

/** 미지원 AI 기능을 준비 완료로 오해하지 않도록 응답에 포함한다. */
export const materialSchema = materialSummarySchema.extend({
  pages: z.array(z.string()),
  memo: z.string(),
  fileUrl: z.string(),
  capabilities: z.object({
    explanation: z.literal(false),
    generatedPractice: z.literal(false),
  }),
});

/** 개인 자료 목록의 외부 응답을 검증한다. */
export const materialsSchema = z.object({
  items: z.array(materialSummarySchema),
});

/** PDF 등록 용량과 페이지 수를 요청 전에 확인한다. */
export const materialInputSchema = z.object({
  title: z.string().trim().min(1).max(200),
  language: z.enum(['en', 'th']),
  filename: z.string().trim().min(1).max(200),
  contentBase64: z.string().min(8).max(13981016),
  pages: z
    .array(z.string().max(50000))
    .min(1)
    .max(200)
    .refine(
      (pages) =>
        pages.reduce((total, page) => total + page.length, 0) <= 2000000
    ),
});

/** 자료 목록의 검증 결과를 화면에 전달한다. */
export type MaterialSummary = z.infer<typeof materialSummarySchema>;

/** 원문과 개인 메모를 포함하는 자료 상세 계약이다. */
export type Material = z.infer<typeof materialSchema>;
