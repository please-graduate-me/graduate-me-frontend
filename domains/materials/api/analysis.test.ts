import { afterEach, describe, expect, it, vi } from 'vitest';
import { getMaterialAnalysis, retryMaterialAnalysis } from './analysis';

afterEach(() => vi.unstubAllGlobals());

describe('PDF 전체 정리 조회와 재요청 계약', () => {
  it('진행 중·부분 완료 상태를 보존하고 조회로 생성하지 않는다', async () => {
    const analysis = {
      id: 'analysis',
      version: 2,
      status: 'partial',
      explanationLanguage: 'th',
      totalPages: 30,
      completedPages: 1,
      error: '일일 한도',
      canRetry: true,
      createdAt: '2026-11-11T00:00:00Z',
      updatedAt: '2026-11-11T00:00:00Z',
      overview: {
        documentType: '강의안',
        introduction: '자료 소개',
        summary: ['핵심 요약'],
        keyPoints: [{ text: '주요 개념', pages: [1] }],
        vocabulary: [
          {
            id: '1:0',
            page: 1,
            term: 'Learning',
            lemma: 'learn',
            partOfSpeech: '명사',
            meaning: '배움',
            example: 'Learning opens doors.',
          },
        ],
      },
      pages: [
        {
          page: 1,
          status: 'ready',
          error: null,
          translation: '전체 번역',
          sourceText: 'Learning opens doors.',
          summary: '배움',
          warnings: [],
          provider: 'anthropic',
          model: 'mock',
        },
      ],
    };

    const fetch = vi.fn(async () => Response.json({ analysis }));

    vi.stubGlobal('fetch', fetch);

    expect((await getMaterialAnalysis('material', 2)).analysis).toEqual(
      analysis
    );

    expect(fetch).toHaveBeenCalledTimes(1);

    expect(fetch).toHaveBeenCalledWith(
      '/api/materials/material/analysis?version=2',
      expect.objectContaining({ cache: 'no-store' })
    );

    expect(fetch.mock.calls[0]).toHaveLength(2);
  });

  it('원본 버전과 재전송 식별자를 명시적 재요청에만 전달한다', async () => {
    const fetch = vi.fn(async () => Response.json({ analysis: null }));

    vi.stubGlobal('fetch', fetch);
    await retryMaterialAnalysis('material', 2, 'request');

    expect(fetch).toHaveBeenCalledWith(
      '/api/materials/material/analysis/retry',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ version: 2, requestId: 'request' }),
      })
    );
  });
});
