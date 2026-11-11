import { redirect } from 'next/navigation';

/** 조교의 서비스 이용에 별도 운영 콘솔 로그인을 요구하지 않는다. */
export default function AdminPage() {
  redirect('/community');
}
