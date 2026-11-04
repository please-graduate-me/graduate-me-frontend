import { requireSession } from '../requireSession';
import Link from 'next/link';
import { getLearningSettings } from '@/domains/users/api/settings';
import { videoPaths } from '@/domains/videos/config/paths';
import * as styles from './page.css';
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
      <Link
        className={styles.back}
        href={videoPaths.library}>
        ← 내 영상으로
      </Link>
      <div className={styles.page}>
        <div className={styles.intro}>
          <h1>학습 설정</h1>
          <p>
            변경하면 계정에 자동 저장됩니다.
            <br />
            모든 영상에 같은 설정이 적용됩니다.
          </p>
        </div>
        <SettingsEditor initial={initial} />
        {access.allowed && (
          <Link
            className={styles.admin}
            href={adminPaths.home}>
            백오피스 · 공유 분석
          </Link>
        )}
      </div>
    </>
  );
}
