import { requireSession } from './requireSession';

/** 로그인 전용 그룹의 모든 화면에 동일한 진입 조건을 적용한다. */
export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireSession();
  return children;
}
