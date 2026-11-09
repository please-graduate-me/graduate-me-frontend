import { requireSession } from '../../requireSession';
import { AccountDeletion } from './_components/AccountDeletion';

/** 탈퇴 시 삭제하는 개인 기록과 보존되는 공개 기록을 확인하게 한다. */
export default async function AccountPage() {
  await requireSession();

  return <AccountDeletion />;
}
