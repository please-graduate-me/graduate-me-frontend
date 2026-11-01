import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/domains/auth/api/auth';
import { getLearningSettings } from '@/domains/users/api/settings';
import { videoPaths } from '@/domains/videos/config/paths';
import { createServerTransport } from '@/lib/api/server';
import { Panel } from '@/components/ui/layouts/Panel';
import { SettingsEditor } from './_components/SettingsEditor';

/** 로그인한 사용자의 계정 설정만 서버에서 불러온다. */
export default async function SettingsPage() {
  const transport = await createServerTransport();
  if (!(await getSession(transport))?.user) redirect(videoPaths.home);
  const initial = await getLearningSettings(transport);
  return (
    <>
      <Link href={videoPaths.home}>← 내 영상으로</Link>
      <Panel>
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
