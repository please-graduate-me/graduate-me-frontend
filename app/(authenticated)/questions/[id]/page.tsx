import { notFound } from 'next/navigation';
import { requireSession } from '../../requireSession';
import { getQuestion } from '@/domains/questions/api/questions';
import { ApiError } from '@/lib/api/request';
import { QuestionThread } from './_components/QuestionThread';

/** 질문의 소유권을 확인한 뒤 공개 대화만 표시한다. */
export default async function QuestionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { transport } = await requireSession();
  const { id } = await params;

  const initial = await getQuestion(id, transport).catch((error) => {
    if (error instanceof ApiError && error.status === 404) notFound();
    throw error;
  });

  return <QuestionThread initial={initial} />;
}
