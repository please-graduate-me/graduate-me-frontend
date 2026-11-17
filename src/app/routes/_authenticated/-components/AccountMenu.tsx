import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { DropdownMenu } from '@/components/ui/composites/DropdownMenu';
import { Toast } from '@/components/ui/composites/Toast';
import { Avatar } from '@/components/ui/primitives/Avatar';
import { Icon } from '@/components/ui/primitives/Icon';
import { getCsrfToken, signOut } from '@/domains/auth/api/auth';
import { videoPaths } from '@/domains/videos/config/paths';

/** 헤더 아바타에서 학습 설정, 계정 관리, 로그아웃으로 바로 갈 수 있게 하는 계정 메뉴다. */
export function AccountMenu({ name }: { name: string }) {
  const client = useQueryClient();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function leave() {
    if (busy) return;
    setBusy(true);
    setError('');

    try {
      const { csrfToken } = await getCsrfToken();

      const result = await signOut(
        csrfToken,
        new URL(videoPaths.home, window.location.origin).href
      );

      client.clear();
      window.location.assign(result.url);
    } catch (error) {
      setError((error as Error).message);
      setBusy(false);
    }
  }

  return (
    <>
      <DropdownMenu
        alignment='end'
        button={{
          label: '내 계정 메뉴',
          variant: 'ghost',
          isIconOnly: true,
          icon: (
            <Avatar
              name={name}
              size='lg'
              tone='self'
              tooltip={false}
              aria-hidden
            />
          ),
        }}
        items={[
          {
            id: 'settings',
            label: '학습 설정',
            href: '/settings',
            icon: (
              <Icon
                name='settings'
                size={18}
              />
            ),
          },
          {
            id: 'account',
            label: '계정 관리',
            href: '/settings/account',
            icon: (
              <Icon
                name='users'
                size={18}
              />
            ),
          },
          {
            id: 'signout',
            label: busy ? '로그아웃 중…' : '로그아웃',
            isDisabled: busy,
            onClick: () => void leave(),
            icon: (
              <Icon
                name='log-out'
                size={18}
              />
            ),
          },
        ]}
      />
      {error && (
        <Toast
          type='error'
          body={`로그아웃하지 못했어요. ${error}`}
          onDismiss={() => setError('')}
        />
      )}
    </>
  );
}
