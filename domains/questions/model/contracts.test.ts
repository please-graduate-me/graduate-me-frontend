import { describe, expect, it } from 'vitest';
import { questionSchema } from './contracts';
import { sourceInputSchema } from '@/domains/materials/model/source';
import { materialInputSchema } from '@/domains/materials/model/contracts';

describe('원문 기반 학습 계약', () => {
  it('기존 영상의 문자열 식별자로도 출처를 복원한다', () => {
    expect(
      sourceInputSchema.parse({
        kind: 'video',
        videoId: 'legacy-video',
        segmentId: 'legacy-segment',
        quote: 'Learning opens doors.',
      })
    ).toEqual({
      kind: 'video',
      videoId: 'legacy-video',
      segmentId: 'legacy-segment',
      quote: 'Learning opens doors.',
    });
  });

  it('탈퇴한 답변자의 게시된 답변은 보존하고 admin 내부 필드는 사용하지 않는다', () => {
    const result = questionSchema.parse({
      id: 'question',
      title: '표현의 의미',
      body: '무슨 뜻인가요?',
      status: 'answered',
      source: {
        kind: 'video',
        videoId: 'video',
        segmentId: 'segment',
        quote: 'Learning opens doors.',
        title: '원문',
        language: 'en',
      },
      createdAt: '2026-11-09T00:00:00Z',
      updatedAt: '2026-11-09T00:00:00Z',
      assignee: null,
      author: { id: 'owner', name: '질문자' },
      messages: [
        {
          id: 'message',
          body: '가능성을 열어 준다는 뜻이에요.',
          author: { id: null, name: '탈퇴한 도우미' },
          kind: 'answer',
          createdAt: '2026-11-09T00:00:00Z',
        },
      ],
      draft: '게시 전 초안',
      internalNote: '내부 검토',
    });

    expect(result.messages[0].author.id).toBeNull();
    expect(result).not.toHaveProperty('draft');
    expect(result).not.toHaveProperty('internalNote');
  });

  it('페이지별 제한 이내라도 전체 추출 텍스트가 200만자를 넘으면 등록하지 않는다', () => {
    const input = {
      title: '큰 PDF',
      language: 'en',
      filename: 'large.pdf',
      contentBase64: 'JVBERi0xLjQK',
      pages: Array.from({ length: 41 }, () => 'a'.repeat(50000)),
    };

    expect(materialInputSchema.safeParse(input).success).toBe(false);
  });
});
