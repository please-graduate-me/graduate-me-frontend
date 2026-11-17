import { createFileRoute } from '@tanstack/react-router';
import { Heading } from '@/components/ui/primitives/Heading';
import { Text } from '@/components/ui/primitives/Text';
import { Card } from '@/components/ui/primitives/Card';
import { Link } from '@/components/ui/primitives/Link';
import { getLearningSettingsQuery } from '@/domains/users/api/queries';
import * as styles from './index.css';
import { SettingsEditor } from './-components/SettingsEditor';
import { getWorkspaceAccessQuery } from '@/domains/admin/api/queries';
import { adminPaths } from '@/domains/admin/config/paths';
import { AuthButton } from '../../-components/AuthButton';
import { Icon } from '@/components/ui/primitives/Icon';
import { Badge } from '@/components/ui/primitives/Badge';
import { Avatar } from '@/components/ui/primitives/Avatar';
import { ButtonLink } from '@/components/ui/primitives/ButtonLink';
import { getLearningProfileQuery } from '@/domains/users/api/queries';
import { ProfileEditor } from './-components/ProfileEditor';

/** URL 조건과 인증된 조회 결과를 화면에 연결한다. */
export const Route = createFileRoute('/_authenticated/settings/')({
  loader: async ({ context }) => {
    const { session } = context;

    const [initial, access, profile] = await Promise.all([
      context.queryClient.fetchQuery(getLearningSettingsQuery()),
      context.queryClient.fetchQuery(getWorkspaceAccessQuery()),
      context.queryClient.fetchQuery(getLearningProfileQuery()),
    ]);

    const name = session.user.name ?? '학습자';
    const isHelper = profile.isHelper || access.role === 'helper';

    // 조교·운영 권한이 있으면 학생 공간과 함께 쓰는 공간을 표지에 함께 밝힌다.
    const spaceLabel =
      access.role === 'admin'
        ? isHelper
          ? '학생 + 조교·운영 공간'
          : '학생 + 운영 공간'
        : isHelper
          ? '학생 + 조교 공간'
          : '학생 학습 공간';

    return { session, initial, access, profile, name, spaceLabel };
  },
  component: SettingsPage,
});

function SettingsPage() {
  const { session, initial, access, profile, name, spaceLabel } =
    Route.useLoaderData();

  return (
    <div className={styles.page}>
      <div className={styles.intro}>
        <Heading level={1}>학습 설정</Heading>
        <Text
          as='p'
          display='block'
          color='secondary'
          className={styles.lead}>
          나의 속도에 맞게 듣기와 반복을 조정해 보세요.
        </Text>
      </div>
      <div className={styles.columns}>
        <aside
          aria-label='계정과 작업 공간'
          className={styles.aside}>
          <Card
            as='section'
            className={styles.sideCard}
            aria-labelledby='account-title'>
            <Heading
              level={2}
              id='account-title'
              className={styles.eyebrow}>
              내 계정
            </Heading>
            <div className={styles.identity}>
              <Avatar
                name={name}
                size={52}
                tone='self'
                tooltip={false}
                aria-hidden='true'
              />
              <div className={styles.identityText}>
                <strong className={styles.name}>{name}</strong>
                <Text
                  as='p'
                  display='block'
                  type='supporting'
                  className={styles.email}>
                  {session.user.email}
                </Text>
              </div>
            </div>
            <div className={styles.accountActions}>
              <Badge tone='brand'>{spaceLabel}</Badge>
              <AuthButton />
            </div>
          </Card>
          {access.role && (
            <section
              className={styles.workspace}
              aria-labelledby='workspace-title'>
              <span className={styles.workspaceIcon}>
                <Icon name='shield-check' />
              </span>
              <Heading
                level={2}
                id='workspace-title'
                color='inherit'
                className={styles.sideTitle}>
                답변 도우미·운영 관리
              </Heading>
              <Text
                as='p'
                display='block'
                color='inherit'
                className={styles.workspaceText}>
                질문 답변과 자료 관리는 별도의 작업 공간에서 진행합니다.
              </Text>
              <ButtonLink
                href={adminPaths.home}
                shape='rounded'
                endIcon='arrow-up-right'
                className={styles.workspaceLink}>
                작업 공간으로 이동
              </ButtonLink>
            </section>
          )}
          <Card
            as='section'
            className={styles.sideCard}
            aria-labelledby='privacy-title'>
            <Heading
              level={2}
              id='privacy-title'
              className={styles.sideTitle}>
              계정과 개인정보
            </Heading>
            <Text
              as='p'
              display='block'
              type='supporting'>
              탈퇴 시 개인 기록의 삭제와 공개 기록의 보존 범위를 확인할 수
              있습니다.
            </Text>
            <Link
              href='/settings/account'
              className={styles.chevronLink}>
              계정 탈퇴 안내
              <Icon
                name='chevron-right'
                size={16}
              />
            </Link>
          </Card>
        </aside>
        <div className={styles.main}>
          <Card
            as='section'
            className={styles.panel}
            aria-labelledby='learning-profile-title'>
            <div className={styles.panelHeading}>
              <span className={`${styles.iconTile} ${styles.tileTone.review}`}>
                <Icon name='globe' />
              </span>
              <Heading
                level={2}
                id='learning-profile-title'
                className={styles.panelTitle}>
                언어와 학습 목표
              </Heading>
            </div>
            <ProfileEditor initial={profile} />
          </Card>
          <Card
            as='section'
            className={styles.panel}
            aria-labelledby='learning-options-title'>
            <div className={styles.panelHeading}>
              <span className={`${styles.iconTile} ${styles.tileTone.streak}`}>
                <Icon name='headphones' />
              </span>
              <Heading
                level={2}
                id='learning-options-title'
                className={styles.panelTitle}>
                영상 학습 옵션
              </Heading>
            </div>
            <Text
              as='p'
              display='block'
              type='supporting'>
              변경한 설정은 계정에 자동 저장되며 모든 영상에 적용됩니다.
            </Text>
            <SettingsEditor initial={initial} />
          </Card>
        </div>
      </div>
    </div>
  );
}
