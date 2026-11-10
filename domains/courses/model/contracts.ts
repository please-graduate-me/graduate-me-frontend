import { z } from 'zod';

const role = z.enum(['teacher', 'assistant', 'student']);

const course = z.object({
  id: z.string(),
  title: z.string(),
  language: z.enum(['en', 'th']),
  createdAt: z.string(),
  role,
});

const answer = z.union([z.string(), z.array(z.string())]);

const submission = z.object({
  id: z.string(),
  assignmentId: z.string(),
  userId: z.string(),
  version: z.number(),
  answers: z.array(z.object({ id: z.string(), answer })),
  result: z.array(
    z.object({
      id: z.string(),
      correct: z.boolean().nullable(),
      expected: answer.nullable().optional(),
    })
  ),
  hintCount: z.number().optional(),
  late: z.boolean(),
  createdAt: z.string(),
  studentName: z.string().nullable().optional(),
});

/** 학생에게 허용된 수업 목록만 복원한다. */
export const coursesSchema = z.object({ items: z.array(course) });

/** 수업 참여와 개인 원본 열람 권한을 별도로 유지하는 과제 요약이다. */
export const courseDetailSchema = z.object({
  course: course.extend({ inviteCode: z.string().optional() }),
  members: z.array(
    z.object({ userId: z.string(), role, name: z.string().nullable() })
  ),
  assignments: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      version: z.number(),
      mode: z.enum(['full', 'blank', 'reading']),
      dueAt: z.string(),
      allowLate: z.boolean(),
      allowResubmit: z.boolean(),
      source: z.object({
        kind: z.enum(['video', 'pdf']),
        id: z.string(),
        title: z.string(),
      }),
      taskCount: z.number(),
      submission: z
        .object({
          assignmentId: z.string(),
          version: z.number(),
          createdAt: z.string(),
          hintCount: z.number().optional(),
          late: z.boolean(),
        })
        .nullable(),
    })
  ),
});

/** 제출 전 가려진 답안과 현재 과제·원문 버전을 구분한다. */
export const assignmentSchema = z.object({
  id: z.string(),
  courseId: z.string(),
  version: z.number(),
  title: z.string(),
  source: z.object({
    kind: z.enum(['video', 'pdf']),
    id: z.string(),
    title: z.string(),
    language: z.enum(['en', 'th']),
    version: z.number(),
    youtubeId: z.string().optional(),
    tasks: z.array(
      z.object({
        id: z.string(),
        text: z.string().nullable(),
        version: z.number(),
        start: z.number().optional(),
        end: z.number().optional(),
        page: z.number().optional(),
        blanks: z.array(z.number()),
        units: z.array(z.string().nullable()),
      })
    ),
  }),
  mode: z.enum(['full', 'blank', 'reading']),
  dueAt: z.string(),
  allowLate: z.boolean(),
  allowResubmit: z.boolean(),
  allowHints: z.boolean(),
  revealAfterSubmit: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
  submissions: z.array(submission),
  revisions: z.array(
    z.object({
      version: z.number(),
      reason: z.string(),
      createdAt: z.string(),
      actorId: z.string().optional(),
    })
  ),
});

/** 과제별 제출은 개인 학습 기록과 독립된 계약이다. */
export const submissionSchema = submission;

/** 조회한 수업의 검증된 목록이다. */
export type Courses = z.infer<typeof coursesSchema>;

/** 학생 수업 상세는 허용된 구성원·과제만 포함한다. */
export type CourseDetail = z.infer<typeof courseDetailSchema>;

/** 과제 화면은 공개된 당시 버전과 제출 이력을 사용한다. */
export type Assignment = z.infer<typeof assignmentSchema>;
