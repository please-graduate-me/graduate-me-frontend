import { requireSession } from '../requireSession';
import { getWorkspaceAccess } from '@/domains/admin/api/admin';
import { Panel } from '@/components/ui/layouts/Panel';
import { ButtonLink } from '@/components/ui/primitives/ButtonLink';
import { Icon } from '@/components/ui/primitives/Icon';
import * as styles from './page.css';

/** 답변과 운영 업무는 별도 관리자 앱에서 수행하도록 진입을 안내한다. */
export default async function AdminPage() {
  const { transport } = await requireSession();
  const access = await getWorkspaceAccess(transport);

  if (!access.role)
    return (
      <Panel className={styles.panel}>
        <Icon
          name='shield-check'
          size={32}
        />
        <h1>작업 공간 접근 권한이 필요해요</h1>
        <p>
          학과 답변 도우미와 운영 관리자로 등록된 계정으로 이용할 수 있습니다.
        </p>
        <ButtonLink
          href='/library'
          variant='secondary'>
          내 학습으로 돌아가기
        </ButtonLink>
      </Panel>
    );

  const configured = process.env.ADMIN_APP_URL;

  const valid =
    configured &&
    URL.canParse(configured) &&
    ['http:', 'https:'].includes(new URL(configured).protocol);

  return (
    <Panel className={styles.panel}>
      <Icon
        name='shield-check'
        size={32}
      />
      <h1>답변 도우미·운영 관리</h1>
      <p>
        {access.role === 'helper'
          ? '배정받은 질문 확인과 답변 작성은 별도의 작업 공간에서 진행합니다.'
          : '질문 배정과 자료, 권한 관리는 별도의 작업 공간에서 진행합니다.'}
      </p>
      {valid ? (
        <ButtonLink href={configured}>
          관리자 앱으로 이동
          <Icon
            name='arrow-up-right'
            size={16}
          />
        </ButtonLink>
      ) : (
        <p role='status'>
          관리자 앱 연결이 준비되지 않았습니다. 운영 담당자에게 문의해 주세요.
        </p>
      )}
      <ButtonLink
        href='/library'
        variant='ghost'>
        내 학습으로 돌아가기
      </ButtonLink>
    </Panel>
  );
}
