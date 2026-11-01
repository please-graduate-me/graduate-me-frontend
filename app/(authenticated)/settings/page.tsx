import { requireSession } from '../requireSession';
import Link from 'next/link';
import { getLearningSettings } from '@/domains/users/api/settings';
import { videoPaths } from '@/domains/videos/config/paths';
import { Panel } from '@/components/ui/layouts/Panel';
import { SettingsEditor } from './_components/SettingsEditor';
import { getAdminAccess } from '@/domains/admin/api/admin';
import { adminPaths } from '@/domains/admin/config/paths';

/** 로그인한 사용자의 계정 설정만 서버에서 불러온다. */
export default async function SettingsPage() {
  const { transport } = await requireSession();
  const initial = await getLearningSettings(transport);
  const access = await getAdminAccess(transport);
  return (
    <>
      <Link href={videoPaths.library}>← 내 영상으로</Link>
      <Panel>
        {access.allowed && (
          <Link href={adminPaths.home}>백오피스 · 공유 분석</Link>
        )}
        <h1>설정</h1>
        <p>
          학습 옵션은 계정에 저장되어 모든 영상에 적용됩니다. 변경하면 자동으로
          저장됩니다.
        </p>
        <SettingsEditor initial={initial} />
      </Panel>
    </>
  );
}
