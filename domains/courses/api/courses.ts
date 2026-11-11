import { z } from 'zod';
import { request, jsonBody, type Transport } from '@/lib/api/request';
import {
  coursesSchema,
  courseDetailSchema,
  assignmentSchema,
  submissionSchema,
} from '../model/contracts';

const coursePath = (id: string) => `/api/courses/${encodeURIComponent(id)}`;

const assignmentPath = (id: string, assignmentId: string) =>
  `${coursePath(id)}/assignments/${encodeURIComponent(assignmentId)}`;

/** 내 소속 수업만 조회한다. */
export const listCourses = (transport?: Transport) =>
  request('/api/courses', coursesSchema, undefined, transport);

/** 전달받은 초대 코드는 서버가 유효성을 확인한다. */
export const joinCourse = (inviteCode: string) =>
  request(
    '/api/courses/join',
    z.object({ id: z.string() }),
    jsonBody({ inviteCode })
  );

/** 수업 역할에 허용된 과제와 구성원을 조회한다. */
export const getCourse = (id: string, transport?: Transport) =>
  request(coursePath(id), courseDetailSchema, undefined, transport);

/** 과제 정답 공개 정책을 적용한 응답만 조회한다. */
export const getAssignment = (
  id: string,
  assignmentId: string,
  transport?: Transport
) =>
  request(
    assignmentPath(id, assignmentId),
    assignmentSchema,
    undefined,
    transport
  );

/** 같은 요청 식별자를 재사용해 통신 재전송의 중복 제출을 막는다. */
export const submitAssignment = (
  id: string,
  assignmentId: string,
  input: {
    requestId: string;
    version: number;
    answers: { id: string; answer: string | string[] }[];
  }
) =>
  request(
    `${assignmentPath(id, assignmentId)}/submissions`,
    submissionSchema,
    jsonBody(input)
  );

/** 허용된 과제에서만 힌트를 공개하고 사용 횟수를 기록한다. */
export const getAssignmentHint = (
  id: string,
  assignmentId: string,
  version: number,
  taskId: string
) =>
  request(
    `${assignmentPath(id, assignmentId)}/hints`,
    z.object({ hint: z.string(), hintCount: z.number() }),
    jsonBody({ version, taskId })
  );

/** 일반 사용자 계정으로 수업을 개설하고 수업 내부 역할만 얻는다. */
export const createCourse = (input: { title: string; language: 'en' | 'th' }) =>
  request('/api/courses', z.object({ id: z.string() }), jsonBody(input));

/** 개설자의 구성원 관리는 서비스 운영자 자격과 분리한다. */
export const saveCourseMember = (
  id: string,
  input: { userId: string; role: 'assistant' | 'student' } | { remove: string }
) =>
  'remove' in input
    ? request(
        `${coursePath(id)}/members/${encodeURIComponent(input.remove)}`,
        z.object({ ok: z.literal(true) }),
        { method: 'DELETE' }
      )
    : request(
        `${coursePath(id)}/members`,
        z.object({ ok: z.literal(true) }),
        jsonBody(input)
      );

/** 과제 변경은 기대 버전과 이유를 전달해 기존 제출 기준을 보존한다. */
export const saveCourseAssignment = (
  id: string,
  input: {
    title: string;
    videoId?: string;
    materialId?: string;
    fromIndex: number;
    toIndex: number;
    mode: 'full' | 'blank' | 'reading';
    blankRatio: 20 | 40 | 60;
    dueAt: string;
    allowLate: boolean;
    allowResubmit: boolean;
    allowHints: boolean;
    revealAfterSubmit: boolean;
    expectedVersion?: number;
    reason?: string;
  },
  assignmentId?: string
) =>
  request(
    assignmentId
      ? assignmentPath(id, assignmentId)
      : `${coursePath(id)}/assignments`,
    z.object({ id: z.string(), version: z.number() }),
    { ...jsonBody(input), method: assignmentId ? 'PATCH' : 'POST' }
  );

/** 과제 선택지에는 현재 계정이 조회할 수 있는 자료만 표시한다. */
export const listAssignmentSources = (
  kind: 'pdf' | 'video',
  language: 'en' | 'th',
  q: string,
  page: number
) =>
  request(
    kind === 'pdf'
      ? '/api/materials'
      : `/api/catalog/videos?${new URLSearchParams({ language, q, page: String(page), limit: '50', sort: 'latest' })}`,
    z.object({
      items: z.array(
        z.object({
          id: z.string(),
          title: z.string(),
          language: z.enum(['en', 'th']),
        })
      ),
      hasMore: z.boolean().optional(),
    })
  );
