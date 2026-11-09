import { afterEach, describe, expect, it, vi } from 'vitest';
import { getMaterialOcr, recognizeMaterialPage } from './ocr';
import { sourceInputSchema } from '../model/source';
import { materialOcrSchema } from '../model/ocr';

const id = '11111111-1111-4111-8111-111111111111';

const result = {
  provider: 'anthropic',
  model: 'claude-test-model',
  configured: true,
  supportedLanguages: ['en', 'th'],
  languageSupported: true,
  item: {
    id,
    eligibility: {
      status: 'eligible',
      aiAllowed: true,
      reason: '학습 언어의 문자 단서가 있습니다.',
    },
    materialId: id,
    provider: 'anthropic',
    model: 'claude-test-model',
    version: 2,
    page: 3,
    status: 'ready',
    text: 'sample',
    fields: [
      {
        text: 'sample',
        rect: { x: 0.1, y: 0.1, width: 0.3, height: 0.1 },
        confidence: null,
        lineBreak: true,
      },
    ],
    width: 100,
    height: 100,
    lowConfidenceCount: 0,
    error: null,
    createdAt: '',
    updatedAt: '',
  },
};

afterEach(() => vi.unstubAllGlobals());

describe('페이지 OCR 계약', () => {
  it('저장 결과는 GET으로 조회하고 명시적 실행에만 원본 버전과 한 페이지를 보낸다', async () => {
    const transport = vi.fn(async () => Response.json(result));

    vi.stubGlobal('fetch', transport);

    const saved = await getMaterialOcr(id, 2, 3);

    expect(saved.item?.fields[0].confidence).toBeNull();
    expect(saved.item?.lowConfidenceCount).toBe(0);

    expect(transport.mock.calls[0]).toEqual([
      `/api/materials/${id}/ocr?version=2&page=3`,
      { cache: 'no-store' },
    ]);

    await recognizeMaterialPage(id, { requestId: id, version: 2, page: 3 });
    const call = transport.mock.calls[1] as unknown as [string, RequestInit];

    expect(call[0]).toBe(`/api/materials/${id}/ocr`);
    expect(call[1].method).toBe('POST');

    expect(JSON.parse(String(call[1].body))).toEqual({
      requestId: id,
      version: 2,
      page: 3,
    });
  });

  it('인식 출처를 저장하며 페이지 바깥의 인식 영역은 거부한다', () => {
    expect(materialOcrSchema.parse(result).supportedLanguages).toContain('th');

    expect(
      sourceInputSchema.parse({
        kind: 'pdf',
        materialId: id,
        page: 1,
        version: 2,
        quote: 'sample',
        ocrId: id,
      })
    ).toMatchObject({ ocrId: id });

    expect(
      materialOcrSchema.safeParse({
        ...result,
        item: {
          id,
          materialId: id,
          version: 2,
          page: 1,
          status: 'ready',
          text: 'sample',
          width: 100,
          height: 100,
          lowConfidenceCount: 0,
          error: null,
          createdAt: '',
          updatedAt: '',
          fields: [
            {
              text: 'sample',
              confidence: 0.9,
              lineBreak: true,
              rect: { x: 0.9, y: 0.2, width: 0.2, height: 0.1 },
            },
          ],
        },
      }).success
    ).toBe(false);
  });
});
