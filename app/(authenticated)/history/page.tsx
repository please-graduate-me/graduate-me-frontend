import { requireSession } from '../requireSession';
import { getLearningHistory } from '@/domains/learning/api/history';
import { LearningHistoryList } from './_components/LearningHistoryList';

/** 서버가 집계한 개인 학습 활동만 가져온다. */
export default async function HistoryPage() {
  const { transport } = await requireSession();
  const initial = await getLearningHistory(transport);

  return <LearningHistoryList items={initial.items} />;
}
