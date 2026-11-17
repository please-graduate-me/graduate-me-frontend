import { createFileRoute, redirect } from '@tanstack/react-router';

/** 기존 운영 주소를 서비스의 커뮤니티 진입으로 연결한다. */
export const Route = createFileRoute('/_authenticated/admin/')({
  beforeLoad: () => {
    throw redirect({ href: '/community' });
  },
});
