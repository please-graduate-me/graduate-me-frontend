import { getSession, isAuthConfigured } from "@/lib/session";
import { AuthButton } from "@/components/auth-button";
import { Dashboard } from "@/components/dashboard";
export const dynamic = "force-dynamic";
export default async function Home({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const configured = await isAuthConfigured();
  const session = configured ? await getSession() : null;
  const { error } = await searchParams;
  return <>
    <div className="page-heading"><div><p className="eyebrow">영어 청해 훈련</p><h1>들리는 만큼 쓰고,<br />안 들린 부분은 다시.</h1><p className="muted">유튜브 영상을 한 구절씩 듣고 받아쓰며 실제 영어 소리에 익숙해지세요.</p></div>
    {session?.user ? <div><span className="account">{session.user.name ?? "학습자"} 님</span><AuthButton action="signout" /></div> : null}</div>
    {error && <p role="alert" className="error">로그인하지 못했습니다. Google 계정과 로그인 설정을 확인한 뒤 다시 시도해 주세요.</p>}
    {session?.user ? <Dashboard /> : <section className="panel"><h2>내 학습 기록으로 이어서 시작하기</h2><p>Google 계정으로 로그인하면 입력한 답안과 진도가 저장됩니다.</p>
      <AuthButton action="signin" disabled={!configured} />
      {!configured && <p role="status" className="notice">로그인 설정이 아직 준비되지 않았습니다. README의 Google OAuth 설정을 완료해 주세요.</p>}
      <p className="muted small">공개 영어 영상, 최대 15분 · 풀 타이핑과 빈칸 채우기</p></section>}
  </>;
}
