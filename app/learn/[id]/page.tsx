import { getSession } from '@/domains/auth/api/auth';
import { getLesson } from '@/domains/videos/api/videos';
import { videoPaths } from '@/domains/videos/config/paths';
import { createServerTransport } from '@/lib/api/server';
import { ApiError } from '@/lib/api/request';
import { redirect, notFound } from 'next/navigation';
import { LessonLoader } from './_components/LessonLoader';
/** 인증과 자원 존재 여부를 확인한 후 학습 화면에 진입시킨다. */
export default async function Learn({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const transport = await createServerTransport();
  if (!(await getSession(transport))?.user) redirect(videoPaths.home);
  const { id } = await params;
  const initial = await getLesson(id, transport).catch((error) => {
    if (error instanceof ApiError && error.status === 404) notFound();
    throw error;
  });
  return (
    <LessonLoader
      key={id}
      initial={initial}
    />
  );
}
