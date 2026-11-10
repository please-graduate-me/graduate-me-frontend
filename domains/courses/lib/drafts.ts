import type { Assignment } from '../model/contracts';

/** 현재 과제 입력과 분리해 남겨 둘 이전 버전의 미제출 초안이다. */
export type AssignmentDraft = {
  version: number;
  answers: { label: string; answer: string | string[] }[];
};

/** 새 과제 버전을 열어도 이전 입력은 당시 버전으로 읽고 복사할 수 있게 보관한다. */
export function archiveAssignmentDraft(
  assignment: Assignment,
  answers: Record<string, string | string[]>
): AssignmentDraft | null {
  const items = assignment.source.tasks.flatMap((task, index) => {
    const answer = answers[task.id];

    if (answer === undefined) return [];

    // 배열도 복사해 현재 빈칸 편집이 이전 버전의 초안을 바꾸지 않게 한다.
    return [
      {
        label:
          assignment.mode === 'reading'
            ? `${task.page}페이지`
            : `구절 ${index + 1}`,
        answer: Array.isArray(answer) ? [...answer] : answer,
      },
    ];
  });

  return items.length ? { version: assignment.version, answers: items } : null;
}
