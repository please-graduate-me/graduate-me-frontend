import { requireSession } from '../requireSession';
import { getLearningProfile } from '@/domains/users/api/profile';
import { getLearningInsights } from '@/domains/learning/api/insights';
import { LearningInsightsPanel } from './_components/LearningInsightsPanel';

/** 계정의 기본 언어로 개인 기록 분석을 열고 기간별 조회를 이어 준다. */
export default async function InsightsPage() {
  const { transport } = await requireSession();
  const profile = await getLearningProfile(transport);

  const initial = await getLearningInsights(
    profile.targetLanguage,
    30,
    transport
  );

  return <LearningInsightsPanel initial={initial} />;
}
