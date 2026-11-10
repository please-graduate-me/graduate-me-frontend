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
