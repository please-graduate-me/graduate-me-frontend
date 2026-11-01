"use client";
import { useState } from "react";
export function AuthButton({ action, disabled = false }: { action: "signin" | "signout"; disabled?: boolean }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function authenticate() {
    if (busy) return;
    setBusy(true); setError("");
    try {
      const csrfResponse = await fetch("/api/auth/csrf", { cache: "no-store" });
      if (!csrfResponse.ok) throw new Error("인증 요청을 준비하지 못했습니다.");
      const { csrfToken } = await csrfResponse.json();
      const response = await fetch(action === "signin" ? "/api/auth/signin/google" : "/api/auth/signout", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded", "X-Auth-Return-Redirect": "1" },
        body: new URLSearchParams({ csrfToken, callbackUrl: `${window.location.origin}/` }),
      });
      if (!response.ok) throw new Error("로그인 요청을 처리하지 못했습니다.");
      const result = await response.json();
      if (typeof result.url !== "string") throw new Error("이동할 인증 주소를 확인하지 못했습니다.");
      window.location.assign(result.url);
    } catch (error) { setError((error as Error).message); setBusy(false); }
  }
  return <><button className={action === "signout" ? "secondary" : undefined} disabled={disabled || busy} onClick={() => void authenticate()}>{busy ? "처리 중…" : action === "signin" ? "Google로 시작하기" : "로그아웃"}</button>{error && <p className="error" role="alert">{error}</p>}</>;
}
