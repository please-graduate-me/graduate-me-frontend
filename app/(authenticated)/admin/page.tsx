import { requireSession } from '../requireSession';
import Link from 'next/link';
import { getAdminAccess, getAdminShares } from '@/domains/admin/api/admin';
import { videoPaths } from '@/domains/videos/config/paths';
import { Panel } from '@/components/ui/layouts/Panel';
import { ShareDashboard } from './_components/ShareDashboard';

/** 화면 진입 단계에서도 관리 권한을 확인한다. */
export default async function AdminPage() {
  const { transport } = await requireSession();
  if (!(await getAdminAccess(transport)).allowed)
    return (
      <Panel>
        <h1>관리자 전용 화면입니다.</h1>
        <p>접근 권한이 있는 계정으로 로그인해 주세요.</p>
        <Link href={videoPaths.home}>홈으로</Link>
      </Panel>
    );
  const initial = await getAdminShares(1, '', transport);
  return (
    <>
      <Link href={videoPaths.home}>← 홈</Link>
      <h1>백오피스 · 공유 분석</h1>
      <p>모든 시각은 한국 시간 기준입니다.</p>
      <ShareDashboard initial={initial} />
    </>
  );
}
