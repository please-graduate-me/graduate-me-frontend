import { GrowthFeedback } from '../_components/GrowthFeedback';
import { getLearningProfile } from '@/domains/users/api/profile';
import { requireSession } from './requireSession';
import { StudentShell } from './_components/StudentShell';

/** 로그인 전용 그룹의 모든 화면에 동일한 진입 조건을 적용한다. */
export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session, transport } = await requireSession();
  const profile = await getLearningProfile(transport);

  return (
    <>
      <GrowthFeedback />
      <StudentShell
        name={session.user.name ?? '학습자'}
        isHelper={profile.isHelper}>
        {children}
      </StudentShell>
    </>
  );
}
