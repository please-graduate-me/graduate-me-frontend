import { expect, it } from 'vitest';
import { relatedAnsweredQuestions } from './relatedQuestions';
import type { QuestionSummary } from '../model/contracts';

it('이전 답변은 같은 출처·버전이며 철회되지 않은 내 질문만 연결한다', () => {
  const source = {
    kind: 'pdf' as const,
    materialId: 'pdf-1',
    page: 3,
    version: 2,
    quote: 'opens doors',
  };

  const row: QuestionSummary = {
    id: 'q1',
    title: '문맥 질문',
    body: '질문',
    status: 'answered',
    source: { ...source, title: '자료', language: 'en' },
    createdAt: '2026-11-10',
    updatedAt: '2026-11-10',
    assignee: null,
    author: { id: 'me', name: null },
  };

  expect(relatedAnsweredQuestions([row], source)).toEqual([row]);

  expect(
    relatedAnsweredQuestions([{ ...row, revokedAt: '2026-11-10' }], source)
  ).toEqual([]);

  expect(relatedAnsweredQuestions([row], { ...source, version: 1 })).toEqual(
    []
  );

  expect(
    relatedAnsweredQuestions([row], { ...source, ocrId: 'ocr-1' })
  ).toEqual([]);

  expect(
    relatedAnsweredQuestions([row], { ...source, quote: 'unrelated' })
  ).toEqual([]);
});
