"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { jobLabels, jsonRequest, type Lesson, type SegmentState, type ActionResult } from "@/lib/contracts";
import { type Grade, type Mode } from "@tubedict/shared";
import { isTextInput } from "@/lib/playback";
import type { LearningAction } from "@tubedict/shared";
import { useYouTubePlayer } from "./use-youtube-player";

export function LessonLoader({ videoId }: { videoId: string }) {
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [error, setError] = useState("");
  const [reload, setReload] = useState(0);
  const [retrying, setRetrying] = useState(false);
  useEffect(() => {
    let disposed = false;
    let timer: ReturnType<typeof setTimeout>;
    async function refresh() {
      try {
        const result = await jsonRequest<Lesson>(`/api/videos/${videoId}`);
        if (disposed) return;
        setLesson(result); setError("");
        if (!["ready", "failed"].includes(result.job?.status ?? "")) timer = setTimeout(refresh, 2000);
      } catch (error) { if (!disposed) setError((error as Error).message); }
    }
    void refresh();
    return () => { disposed = true; clearTimeout(timer); };
  }, [videoId, reload]);
  async function retry() {
    setRetrying(true); setError("");
    try { await jsonRequest(`/api/videos/${videoId}/retry`, {}); setReload(value => value + 1); }
    catch (error) { setError((error as Error).message); }
    finally { setRetrying(false); }
  }
  if (lesson?.job?.status === "ready") return <Study key={videoId} initial={lesson} />;
  return <><Link href="/">← 영상 목록</Link><section className="panel processing"><h1>{lesson?.video.title ?? "학습 영상 불러오기"}</h1>
    <p role="status">{lesson?.job ? jobLabels[lesson.job.status] : "잠시 기다려 주세요."}</p>
    {lesson?.job?.status !== "failed" && <p className="muted">오디오를 구절별 학습 자료로 만들고 있어요. 페이지를 닫아도 처리는 계속됩니다.</p>}
    {lesson?.job?.errorMessage && <p className="notice">{lesson.job.errorMessage}</p>}
    {lesson?.job?.status === "failed" && <button onClick={() => void retry()} disabled={retrying}>{retrying ? "다시 등록하는 중…" : "처리 다시 시도"}</button>}
    {error && <div role="alert" className="error">{error} <button className="secondary" onClick={() => setReload(value => value + 1)}>상태 다시 확인</button></div>}
  </section></>;
}

function Study({ initial }: { initial: Lesson }) {
  const { video, segments } = initial;
  const [index, setIndex] = useState(initial.progress.currentIndex);
  const [mode, setMode] = useState<Mode>(initial.progress.mode);
  const [states, setStates] = useState(initial.states);
  const [feedback, setFeedback] = useState<Grade | null>(null);
  const [busy, setBusy] = useState(false);
  const busyRef = useRef(false);
  const [error, setError] = useState("");
  const [saveStatus, setSaveStatus] = useState("저장됨");
  const unsaved = useRef<LearningAction | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const queue = useRef<Promise<unknown>>(Promise.resolve());
  const input = useRef<HTMLTextAreaElement>(null);
  const blanksContainer = useRef<HTMLDivElement>(null);
  const segment = segments[index];
  const complete = !segment;
  const player = useYouTubePlayer(video.youtubeId, segment);
  const state = states.find(item => item.segmentId === segment?.id && item.mode === mode);
  const draft = mode === "full"
    ? (typeof state?.draft === "string" ? state.draft : "")
    : (segment?.blanks.map((_, position) => Array.isArray(state?.draft) ? state.draft[position] ?? "" : "") ?? []);
  const actionURL = `/api/videos/${video.id}/actions`;
  const enqueue = useCallback((body: LearningAction): Promise<ActionResult> => {
    const task = queue.current.catch(() => undefined).then(() => jsonRequest<ActionResult>(actionURL, body));
    queue.current = task;
    return task;
  }, [actionURL]);
  const flushDraft = useCallback(async () => {
    clearTimeout(timer.current);
    const body = unsaved.current;
    if (!body) { await queue.current.catch(() => undefined); return; }
    try {
      await enqueue(body);
      if (unsaved.current === body) { unsaved.current = null; setSaveStatus("저장됨"); }
    } catch (error) { setSaveStatus("저장 실패"); throw error; }
  }, [enqueue]);
  useEffect(() => {
    function beforeUnload(event: BeforeUnloadEvent) {
      if (unsaved.current || busyRef.current) { event.preventDefault(); event.returnValue = ""; }
    }
    function followLink(event: MouseEvent) {
      const link = event.target instanceof Element ? event.target.closest("a") : null;
      if (!link || event.ctrlKey || event.metaKey || link.target === "_blank" || (!unsaved.current && !busyRef.current)) return;
      event.preventDefault(); event.stopPropagation();
      if (busyRef.current) return;
      void flushDraft().then(() => { window.location.href = link.href; }).catch(error => setError(error.message));
    }
    window.addEventListener("beforeunload", beforeUnload);
    document.addEventListener("click", followLink, true);
    return () => { window.removeEventListener("beforeunload", beforeUnload); document.removeEventListener("click", followLink, true); clearTimeout(timer.current); };
  }, [flushDraft]);
  function updateState(patch: Partial<SegmentState>, segmentId = segment.id, selectedMode = mode) {
    setStates(previous => {
      const existing = previous.find(item => item.segmentId === segmentId && item.mode === selectedMode);
      const next: SegmentState = { segmentId, mode: selectedMode, draft: selectedMode === "full" ? "" : [], status: "pending", revealed: false, ...existing, ...patch };
      return [...previous.filter(item => !(item.segmentId === segmentId && item.mode === selectedMode)), next];
    });
  }
  function changeDraft(answer: string | string[]) {
    updateState({ draft: answer }); setFeedback(null); setSaveStatus("저장 중…");
    unsaved.current = { action: "draft", segmentId: segment.id, mode, answer };
    clearTimeout(timer.current);
    timer.current = setTimeout(() => { void flushDraft().catch(error => setError(error.message)); }, 500);
  }
  async function perform(operation: () => Promise<void>) {
    if (busyRef.current) return;
    busyRef.current = true; setBusy(true); setError("");
    try { await flushDraft(); await operation(); }
    catch (error) { setError((error as Error).message); }
    finally { busyRef.current = false; setBusy(false); }
  }
  async function navigate(next: number, nextMode = mode) {
    await perform(async () => {
      await enqueue({ action: "navigate", index: next, mode: nextMode });
      player.pause(); setIndex(next); setMode(nextMode); setFeedback(null);
    });
  }
  async function submit() {
    if (!segment) return;
    await perform(async () => {
      const result = await enqueue({ action: "submit", segmentId: segment.id, mode, answer: draft, requestId: crypto.randomUUID() });
      setFeedback(result.grade!);
      if (result.grade?.correct) {
        updateState({ status: "correct" }); player.prepareNext(); setIndex(result.nextIndex!);
      }
    });
  }
  async function skip() {
    await perform(async () => {
      const result = await enqueue({ action: "skip", segmentId: segment.id, mode });
      updateState({ status: state?.status === "correct" ? "correct" : "skipped" });
      player.pause(); setIndex(result.nextIndex!); setFeedback(null);
    });
  }
  async function reveal() {
    await perform(async () => { await enqueue({ action: "reveal", segmentId: segment.id, mode }); updateState({ revealed: true }); });
  }
  useEffect(() => {
    if (!busy && segment) {
      if (mode === "full" && input.current) { input.current.focus(); input.current.setSelectionRange(input.current.value.length, input.current.value.length); }
      else blanksContainer.current?.querySelector("input")?.focus();
    }
  }, [index, mode, busy, segment]);
  useEffect(() => {
    function keydown(event: KeyboardEvent) {
      if (event.isComposing || !segment || busyRef.current) return;
      const target = event.target;
      const answerFocused = target instanceof HTMLElement && Boolean(target.closest("[data-answer]"));
      if (event.ctrlKey && event.key.toLowerCase() === "r" && answerFocused) { event.preventDefault(); player.replay(); }
      else if (event.shiftKey && event.key === "ArrowLeft") { event.preventDefault(); player.rewind(); }
      else if (event.code === "Space" && !isTextInput(target) && !(target instanceof HTMLElement && target.closest("button, a, summary"))) { event.preventDefault(); player.toggle(); }
    }
    window.addEventListener("keydown", keydown);
    return () => window.removeEventListener("keydown", keydown);
  }, [segment, player.replay, player.rewind, player.toggle]);
  const correct = states.filter(item => item.mode === mode && item.status === "correct").length;
  const skipped = states.filter(item => item.mode === mode && item.status === "skipped").length;
  const revealed = states.filter(item => item.mode === mode && item.revealed).length;
  return <>
    <Link href="/" onClick={event => { if (unsaved.current || busyRef.current) { event.preventDefault(); void perform(async () => { window.location.href = "/"; }); } }}>← 영상 목록</Link>
    <div className="section-heading"><h1 className="lesson-title">{video.title}</h1><span className="muted small" role="status">{saveStatus}</span></div>
    {error && <p className="error" role="alert">{error}{saveStatus === "저장 실패" && <button className="secondary" onClick={() => void perform(async () => {})}>저장 다시 시도</button>}</p>}
    <div className="study-grid">
      <section className="panel" hidden={complete} aria-label="영상 플레이어">
        <div className="video-frame" ref={player.container} />
        {player.error && <p role="alert" className="error">{player.error}</p>}
        {player.blocked && <p className="notice">재생 버튼을 눌러 구절을 들어 주세요.</p>}
        <div className="row controls"><button onClick={player.toggle} disabled={!player.ready || complete}>{player.playing ? "일시정지" : "재생"}</button><button className="secondary" onClick={player.replay} disabled={!player.ready || complete}>다시 듣기</button><button className="secondary" onClick={player.rewind} disabled={!player.ready || complete}>2초 뒤로</button></div>
        <p className="muted small">구절 끝에서 자동으로 멈춰요. 영상 안의 자막은 플레이어에서 끌 수 있어요.</p>
        <details><summary>키보드 단축키</summary><ul className="shortcut-list"><li>답안 입력 중 Ctrl+R: 다시 듣기</li><li>입력창 밖 Space: 재생 / 일시정지</li><li>Shift+←: 현재 구절 안에서 2초 뒤로</li><li>Enter: 답안 제출 · Tab: 다음 항목으로 이동</li></ul><p className="muted small">YouTube 영상 내부에 포커스가 있으면 서비스 단축키가 적용되지 않아요.</p></details>
      </section>
      {complete ? <section className="panel completion"><p className="eyebrow">학습 결과</p><h2>마지막 구절까지 도착했어요.</h2><p>{mode === "full" ? "풀 타이핑" : "빈칸 채우기"} · 전체 {segments.length}구절</p><div className="stats"><span>정답 <strong>{correct}</strong></span><span>건너뛰기 <strong>{skipped}</strong></span><span>미완료 <strong>{segments.length - correct - skipped}</strong></span></div><p className="muted">정답을 확인한 구절: {revealed}개</p><div className="row"><button disabled={busy} onClick={() => void navigate(0)}>처음부터 복습</button><button className="secondary" disabled={busy} onClick={() => void navigate(0, mode === "full" ? "blank" : "full")}>다른 모드로 학습</button></div></section> : <section className="panel answer-panel">
        <div className="section-heading"><h2>구절 {index + 1} / {segments.length}</h2><label className="mode-label">모드<select value={mode} disabled={busy} onChange={event => void navigate(index, event.target.value as Mode)}><option value="full">풀 타이핑</option><option value="blank">빈칸 채우기</option></select></label></div>
        <progress max={segments.length} value={index} aria-label="학습 진행" />
        <p className="muted small">{segment.start.toFixed(1)}초 ~ {segment.end.toFixed(1)}초 · 듣고 빈칸에 입력해 주세요.</p>
        <form onSubmit={event => { event.preventDefault(); void submit(); }}>
          {mode === "full" ? <><label htmlFor="answer">들리는 문장</label><textarea id="answer" ref={input} data-answer value={typeof draft === "string" ? draft : ""} maxLength={2000} disabled={busy} autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false} placeholder="들은 내용을 영어로 적어 주세요." onChange={event => changeDraft(event.target.value)} onKeyDown={event => { if (event.key === "Enter" && !event.nativeEvent.isComposing) { event.preventDefault(); void submit(); } }} /></> : <div className="blank-sentence" ref={blanksContainer} data-answer>{segment.text.split(/\s+/).map((word, wordIndex) => {
            const position = segment.blanks.indexOf(wordIndex);
            return position < 0 ? <span key={wordIndex}>{word} </span> : <input key={wordIndex} aria-label={`빈칸 ${position + 1}`} maxLength={100} disabled={busy} autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false} value={Array.isArray(draft) ? draft[position] ?? "" : ""} onChange={event => { const next = Array.isArray(draft) ? [...draft] : segment.blanks.map(() => ""); next[position] = event.target.value; changeDraft(next); }} onKeyDown={event => { if (event.key === "Enter" && !event.nativeEvent.isComposing) { event.preventDefault(); void submit(); } }} />;
          })}</div>}
          <div className="row"><button disabled={busy}>{busy ? "저장 중…" : "확인 (Enter)"}</button><button type="button" className="secondary" disabled={busy} onClick={() => void reveal()}>정답 보기</button><button type="button" className="secondary" disabled={busy} onClick={() => void skip()}>건너뛰기</button></div>
        </form>
        {feedback && <div className={feedback.correct ? "notice success" : "notice"} role="status">{feedback.correct ? "정답이에요. 다음 구절로 이동했어요." : <><p>다른 부분을 확인하고 다시 들어보세요.</p><div className="differences">{feedback.differences.map((diff, i) => <span key={i} className={`diff ${diff.kind}`}>{diff.kind === "match" ? diff.expected : diff.kind === "missing" ? `누락: ${diff.expected}` : diff.kind === "extra" ? `추가: ${diff.actual}` : `${diff.actual} → ${diff.expected}`}</span>)}</div></>}</div>}
        {state?.revealed && <div className="notice"><strong>정답</strong><p lang="en">{segment.text}</p><p className="muted small">음성 인식 결과에 오류가 있으면 이 구절을 건너뛸 수 있어요.</p></div>}
        <div className="row navigation"><button className="secondary" disabled={busy || index === 0} onClick={() => void navigate(index - 1)}>이전 구절</button><button className="secondary" disabled={busy} onClick={() => void navigate(index + 1)}>다음 구절</button></div>
      </section>}
    </div>
  </>;
}
