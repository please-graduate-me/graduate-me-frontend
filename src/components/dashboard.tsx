"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { recommendations } from "@tubedict/shared";
import { jobLabels, jsonRequest } from "@/lib/contracts";
type History = { videoId: string; title: string; currentIndex: number; count: number; status: string };
export function Dashboard() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState<History[] | null>(null);
  const [topic, setTopic] = useState("");
  const [level, setLevel] = useState("");
  const [historyError, setHistoryError] = useState("");
  function refreshHistory() {
    setHistoryError("");
    jsonRequest<History[]>("/api/videos").then(setHistory).catch(error => setHistoryError(error.message));
  }
  useEffect(refreshHistory, []);
  async function register(value: string) {
    setError(""); setBusy(true);
    try { const result = await jsonRequest<{ videoId: string }>("/api/videos", { url: value }); router.push(`/learn/${result.videoId}`); }
    catch (error) { setError((error as Error).message); setBusy(false); }
  }
  return <>
    <section className="panel"><h2>학습할 영상 추가</h2><form onSubmit={event => { event.preventDefault(); void register(url); }} className="url-form">
      <label htmlFor="youtube-url">유튜브 URL</label><div className="row"><input id="youtube-url" type="url" required placeholder="https://www.youtube.com/watch?v=..." value={url} onChange={event => setUrl(event.target.value)} disabled={busy} /><button disabled={busy}>{busy ? "등록 중…" : "학습 시작"}</button></div>
      <p className="muted small">공개된 15분 이하 영어 영상의 링크를 입력해 주세요.</p>
    </form>{error && <p className="error" role="alert">{error}</p>}</section>
    <section><div className="section-heading"><h2>추천 영상</h2><div className="row"><select aria-label="난이도" value={level} onChange={event => setLevel(event.target.value)}><option value="">모든 난이도</option>{["초급", "중급", "고급"].map(value => <option key={value}>{value}</option>)}</select><select aria-label="주제" value={topic} onChange={event => setTopic(event.target.value)}><option value="">모든 주제</option>{recommendations.map(item => <option key={item.topic}>{item.topic}</option>)}</select></div></div>
    <div className="cards">{recommendations.filter(item => (!level || item.level === level) && (!topic || item.topic === topic)).map(item => <article className="panel" key={item.youtubeId}><p className="eyebrow">{item.level} · {item.topic}</p><h3>{item.title}</h3><p className="muted">{item.description}</p><button className="secondary" disabled={busy} onClick={() => void register(`https://www.youtube.com/watch?v=${item.youtubeId}`)}>이 영상 선택</button></article>)}</div>
    {!recommendations.some(item => (!level || item.level === level) && (!topic || item.topic === topic)) && <p className="muted">선택한 조건에 맞는 추천 영상이 없습니다.</p>}</section>
    <section><h2>내 학습</h2>{historyError ? <p role="alert" className="error">{historyError} <button className="secondary" onClick={refreshHistory}>다시 불러오기</button></p> : history === null ? <p role="status">학습 기록을 불러오는 중…</p> : history.length === 0 ? <p className="muted">아직 학습한 영상이 없어요. 위에서 첫 영상을 선택해 보세요.</p> : <ul className="history">{history.map(item => <li key={item.videoId}><Link href={`/learn/${item.videoId}`}>{item.title}</Link><span className="muted small">{jobLabels[item.status]}{item.count > 0 && ` · ${Math.min(item.currentIndex, item.count)}/${item.count} 구절 진행`}</span></li>)}</ul>}</section>
  </>;
}
