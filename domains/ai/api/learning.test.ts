import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  answerExercise,
  listConversations,
  listExplanations,
} from './learning';
import { exerciseSchema } from '../model/contracts';

const source = {
  kind: 'pdf' as const,
  materialId: '00000000-0000-4000-8000-000000000001',
  page: 2,
  version: 3,
  quote: 'Learning through context.',
  title: '수업 자료',
  language: 'en' as const,
};

afterEach(() => vi.unstubAllGlobals());

describe('저장된 AI 학습의 요청 경계', () => {
  it('설명과 대화를 여는 동작은 저장 조회만 수행한다', async () => {
    const fetch = vi.fn(async () => Response.json({ items: [] }));

    vi.stubGlobal('fetch', fetch);
    await listExplanations(source);
    await listConversations(source);
    expect(fetch).toHaveBeenCalledTimes(2);

    for (const call of fetch.mock.calls as unknown as [string, RequestInit][]) {
      expect(call[0]).toContain('materialId=' + source.materialId);
      expect(call[0]).toContain('page=2');
      expect(call[1].method ?? 'GET').toBe('GET');
      expect(call[1].body).toBeUndefined();
    }
  });

  it('제출 재전송에 같은 요청 식별자와 문제 버전을 전달한다', async () => {
    const result = {
      id: 'attempt',
      artifactId: 'exercise',
      version: 4,
      answer: 'context',
      correct: true,
      expectedAnswer: 'context',
      explanation: '문맥에 맞는 표현입니다.',
      feedback: null,
      hintUsed: true,
      revealed: false,
      source,
      createdAt: '2026-11-09T00:00:00.000Z',
    };

    const fetch = vi.fn(async () => Response.json(result));

    vi.stubGlobal('fetch', fetch);

    const input = {
      requestId: '00000000-0000-4000-8000-000000000002',
      version: 4,
      answer: 'context',
    };

    expect(await answerExercise('exercise', input)).toEqual(result);

    const [, options] = (
      fetch.mock.calls as unknown as [string, RequestInit][]
    )[0];

    expect(JSON.parse(String(options.body))).toEqual(input);
  });

  it('공개 문제 계약은 정답과 해설을 표시 데이터에 포함하지 않는다', () => {
    const item = exerciseSchema.parse({
      id: 'exercise',
      kind: 'practice',
      version: 4,
      status: 'ready',
      reviewStatus: 'unreviewed',
      needsReview: false,
      source,
      model: 'HCX-007',
      provider: 'naver',
      createdAt: '2026-11-09T00:00:00.000Z',
      updatedAt: '2026-11-09T00:00:00.000Z',
      payload: {
        type: 'short_answer',
        question: '빈칸을 채우세요.',
        choices: [],
        sourceQuote: source.quote,
        answer: 'secret',
        explanation: 'secret',
        hint: 'secret',
      },
      state: { draft: '', hintUsed: false, revealed: false, excluded: false },
      latestResult: null,
      expressionIds: [],
    });

    expect(item.payload).not.toHaveProperty('answer');
    expect(item.payload).not.toHaveProperty('explanation');
    expect(item.payload).not.toHaveProperty('hint');
  });
});
