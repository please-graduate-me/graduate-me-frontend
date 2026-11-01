import { headers } from "next/headers";
type Session = { user: { id: string; name?: string | null; email?: string | null; image?: string | null }; expires: string };
const backend = () => process.env.API_INTERNAL_URL || "http://127.0.0.1:4000";
export async function getSession(): Promise<Session | null> {
  const requestHeaders = await headers();
  const response = await fetch(`${backend()}/api/auth/session`, { headers: { cookie: requestHeaders.get("cookie") || "" }, cache: "no-store" });
  if (!response.ok) throw new Error("로그인 상태를 확인하지 못했습니다.");
  return response.json();
}
export async function isAuthConfigured(): Promise<boolean> {
  const response = await fetch(`${backend()}/api/auth-status`, { cache: "no-store" });
  if (!response.ok) throw new Error("로그인 설정을 확인하지 못했습니다.");
  return (await response.json()).configured === true;
}
