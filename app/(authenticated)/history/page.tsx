import { requireSession } from '../requireSession';
import { getLearningHistory } from '@/domains/learning/api/history';
import { LearningHistoryList } from './_components/LearningHistoryList';

/** 실제 저장된 자료·질문·자가점검 이력만 가져온다. */
export default async function HistoryPage() {
  const { transport } = await requireSession();
  const initial = await getLearningHistory(transport);

  return <LearningHistoryList items={initial.items} />;
}
