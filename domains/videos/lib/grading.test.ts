import { describe, expect, it } from 'vitest';
import { blankIndices, grade, gradeAnswer } from './grading';

describe('받아쓰기 채점', () => {
  it('앞뒤 공백만 정리하고 문장 전체를 엄격히 비교한다', () => {
    expect(grade('Hello, WORLD!', '  Hello, WORLD! ').correct).toBe(true);
    expect(grade('Hello, WORLD!', 'hello world').correct).toBe(false);
    expect(grade('Hello world', 'Hello  world').correct).toBe(false);
    expect(grade('ฉันชอบเรียน', 'ฉันชอบเรียน').correct).toBe(true);
    expect(grade('ฉันชอบเรียน', 'ฉันชอบเรยน').correct).toBe(false);
  });

  it('축약형, 단어 순서, 빈 답안은 엄격히 비교한다', () => {
    expect(grade('I am here', "I'm here").correct).toBe(false);
    expect(grade('I can do it', 'I do can it').correct).toBe(false);
    expect(grade('', '').correct).toBe(false);
  });

  it('누락, 추가, 철자 오류를 구분한다', () => {
    expect(grade('go to school', 'go school').differences).toContainEqual({
      kind: 'missing',
      expected: 'to',
    });

    expect(grade('go home', 'go back home').differences).toContainEqual({
      kind: 'extra',
      actual: 'back',
    });

    expect(grade('hello world', 'hello word').differences).toContainEqual({
      kind: 'replace',
      expected: 'world',
      actual: 'word',
    });
  });

  it('빈칸은 고정되고 각 위치를 개별 채점한다', () => {
    const text = 'We went to the park and stayed for a while.';
    const indices = blankIndices(text);

    expect(indices).toEqual([0, 2]);
    expect(indices.length).toBeGreaterThan(0);
    expect(indices.length).toBeLessThanOrEqual(3);
    const answers = ['We', 'to'];

    expect(gradeAnswer(text, 'blank', answers).correct).toBe(true);

    expect(
      gradeAnswer(
        text,
        'blank',
        answers.map(() => 'wrong')
      ).correct
    ).toBe(false);

    expect(blankIndices('Beautiful flowers bloom.')).toEqual([0]);
  });
});
