import { requireSession } from '../requireSession';
import { getLearningProfile } from '@/domains/users/api/profile';
import { getRecommendations } from '@/domains/recommendations/api/recommendations';
import { RecommendedVideos } from './_components/RecommendedVideos';

/** 새 외부 분석 없이 접근 가능한 준비 영상의 추천을 표시한다. */
export default async function RecommendationsPage() {
  const { transport } = await requireSession();
  const profile = await getLearningProfile(transport);
  const initial = await getRecommendations(profile.targetLanguage, transport);

  return <RecommendedVideos initial={initial} />;
}
