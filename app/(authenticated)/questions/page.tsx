import { requireSession } from '../requireSession';
import { listQuestions } from '@/domains/questions/api/questions';
import { QuestionList } from './_components/QuestionList';

/** 질문자가 보낸 질문과 공개 답변 상태를 가져온다. */
export default async function QuestionsPage() {
  const { transport } = await requireSession();
  const initial = await listQuestions(transport);

  return <QuestionList initial={initial.items} />;
}
