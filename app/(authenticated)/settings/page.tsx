import { requireSession } from '../requireSession';
import Link from 'next/link';
import { getLearningSettings } from '@/domains/users/api/settings';
import * as styles from './page.css';
import { SettingsEditor } from './_components/SettingsEditor';
import { getWorkspaceAccess } from '@/domains/admin/api/admin';
import { adminPaths } from '@/domains/admin/config/paths';
import { AuthButton } from '../../_components/AuthButton';
import { Icon } from '@/components/ui/primitives/Icon';
import { Badge } from '@/components/ui/primitives/Badge';
import { getLearningProfile } from '@/domains/users/api/profile';
import { ProfileEditor } from './_components/ProfileEditor';

/** 로그인한 계정의 학습 설정과 별도 작업 공간 진입 권한을 표시한다. */
export default async function SettingsPage() {
  const { session, transport } = await requireSession();

  const [initial, access, profile] = await Promise.all([
    getLearningSettings(transport),
    getWorkspaceAccess(transport),
    getLearningProfile(transport),
  ]);

  return (
    <div className={styles.page}>
      <div className={styles.intro}>
        <h1>학습 설정</h1>
        <p>나의 속도에 맞게 듣기와 반복을 조정해 보세요.</p>
      </div>
      <section
        className={styles.account}
        aria-labelledby='account-title'>
        <div>
          <h2 id='account-title'>내 계정</h2>
          <strong>{session.user.name ?? '학습자'}</strong>
          <p>{session.user.email}</p>
        </div>
        <div className={styles.accountActions}>
          <Badge tone='brand'>학생 학습 공간</Badge>
          <AuthButton action='signout' />
        </div>
      </section>
      <section
        className={styles.learning}
        aria-labelledby='learning-profile-title'>
        <h2 id='learning-profile-title'>언어와 학습 목표</h2>
        <ProfileEditor initial={profile} />
      </section>
      <section
        className={styles.learning}
        aria-labelledby='learning-options-title'>
        <h2 id='learning-options-title'>
          <Icon name='headphones' />
          영상 학습 옵션
        </h2>
        <p>변경한 설정은 계정에 자동 저장되며 모든 영상에 적용됩니다.</p>
        <SettingsEditor initial={initial} />
      </section>
      {access.role && (
        <section className={styles.workplace}>
          <div>
            <h2>답변 도우미·운영 관리</h2>
            <p>질문 답변과 자료 관리는 별도의 작업 공간에서 진행합니다.</p>
          </div>
          <Link href={adminPaths.home}>
            작업 공간으로 이동
            <Icon
              name='arrow-up-right'
              size={16}
            />
          </Link>
        </section>
      )}
      <section className={styles.workplace}>
        <div>
          <h2>계정과 개인정보</h2>
          <p>
            탈퇴 시 개인 기록의 삭제와 공개 기록의 보존 범위를 확인할 수
            있습니다.
          </p>
        </div>
        <Link href='/settings/account'>계정 탈퇴 안내</Link>
      </section>
    </div>
  );
}
