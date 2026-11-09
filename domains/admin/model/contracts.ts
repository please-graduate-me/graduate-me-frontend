import { z } from 'zod';

/** 학생 앱에서 별도 작업 공간으로 이동할 수 있는 역할만 확인한다. */
export const workspaceAccessSchema = z.object({
  role: z.enum(['helper', 'admin']).nullable(),
});
