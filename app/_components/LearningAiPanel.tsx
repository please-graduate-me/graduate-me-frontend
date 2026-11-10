'use client';
import { ApiError } from '@/lib/api/request';
import { SessionRecovery } from './SessionRecovery';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { SourceInput } from '@/domains/materials/model/source';
import type { Conversation, Explanation } from '@/domains/ai/model/contracts';
import {
  getAiCapabilities,
  generateExplanation,
  generateExercises,
  listConversations,
  listExplanations,
  openConversation,
  sendAiMessage,
} from '@/domains/ai/api/learning';
import { Button } from '@/components/ui/primitives/Button';
import { Input } from '@/components/ui/primitives/Input';
import { Select } from '@/components/ui/primitives/Select';
import { Badge } from '@/components/ui/primitives/Badge';
import { AiExplanation } from './AiExplanation';
import { AiConversation } from './AiConversation';
import { ExpressionComposer } from './ExpressionComposer';
import { QuestionComposer } from './QuestionComposer';
import { getLearningProfile } from '@/domains/users/api/profile';
import { aiProviderLabel } from '@/domains/ai/lib/providerLabel';
import * as styles from '@/lib/styles/workspace.css';

/** PDF와 영상의 저장 설명·개인 대화·적용 연습을 같은 원문에 연결한다. */
export function LearningAiPanel({
  source,
  language,
  image,
  compact = false,
  allowGeneration = true,
  conversationView = false,
  initialMode = 'meaning',
  onQuestion,
  onSaved,
  beforeNavigate,
}: {
  source: SourceInput;
  language: 'en' | 'th';
  compact?: boolean;
  allowGeneration?: boolean;
  conversationView?: boolean;
  initialMode?: 'meaning' | 'translation';
  onQuestion?: () => void;
  onSaved?: () => void;
  beforeNavigate?: () => boolean;
  image?: { base64: string; mimeType: 'image/png' | 'image/jpeg' };
}) {
  const router = useRouter();
  const serial = JSON.stringify(source);
  const [items, setItems] = useState<Explanation[]>([]);
  const [related, setRelated] = useState<Explanation[]>([]);
  const [reload, setReload] = useState(0);
  const [conversations, setConversations] = useState<Conversation[]>([]);

  const [mode, setMode] = useState<
    'meaning' | 'translation' | 'structure' | 'concept'
  >(initialMode);

  const [explanationLanguage, setExplanationLanguage] = useState<
    'ko' | 'en' | 'th'
  >('ko');

  const [exerciseType, setExerciseType] = useState<
    'choice' | 'short_answer' | 'free_response'
  >('choice');

  const [selectedConversation, setSelectedConversation] = useState('');
  const [quickQuestion, setQuickQuestion] = useState('');

  const quickRequest = useRef<{
    conversation: Conversation;
    text: string;
    id: string;
  } | null>(null);

  const [loading, setLoading] = useState(true);

  const [capabilities, setCapabilities] = useState<Awaited<
    ReturnType<typeof getAiCapabilities>
  > | null>(null);

  const [busy, setBusy] = useState(false);
  const explanationRequest = useRef<{ key: string; id: string } | null>(null);
  const exerciseRequest = useRef<{ key: string; id: string } | null>(null);
  const [error, setError] = useState('');
  const [sessionExpired, setSessionExpired] = useState(false);
  const [dialog, setDialog] = useState<'expression' | 'question' | null>(null);
  const latest = items[0];

  const conversation = conversations.find(
    (value) => value.id === selectedConversation
  );

  useEffect(() => {
    let active = true;
    const selected: SourceInput = JSON.parse(serial);

    const same = (value: { source: SourceInput }) =>
      value.source.quote.normalize('NFKC').replace(/\s+/g, '') ===
        selected.quote.normalize('NFKC').replace(/\s+/g, '') &&
      (value.source.version ?? 1) === (selected.version ?? 1) &&
      (value.source.kind !== 'pdf' ||
        selected.kind !== 'pdf' ||
        (value.source.ocrId ?? null) === (selected.ocrId ?? null));

    void Promise.all([listExplanations(selected), listConversations(selected)])
      .then(([explanations, chats]) => {
        if (active) {
          setItems(explanations.items.filter(same));
          setRelated(explanations.items.filter((item) => !same(item)));
          setConversations(chats.items.filter(same));
          setLoading(false);
        }
      })
      .catch((error) => {
        if (active) {
          setError(error.message);
          setLoading(false);
        }
      });

    void getAiCapabilities()
      .then((value) => {
        if (active) setCapabilities(value);
      })
      .catch(() => undefined);

    void getLearningProfile()
      .then((value) => {
        if (active) setExplanationLanguage(value.explanationLanguage);
      })
      .catch(() => undefined);

    return () => {
      active = false;
    };
  }, [serial, reload]);

  async function explain(useImage = false) {
    if (busy) return;
    setBusy(true);
    setError('');
    setSessionExpired(false);

    try {
      const key = JSON.stringify([source, mode, explanationLanguage, useImage]);

      if (explanationRequest.current?.key !== key)
        explanationRequest.current = { key, id: crypto.randomUUID() };

      const value = await generateExplanation({
        requestId: explanationRequest.current.id,
        source,
        mode,
        explanationLanguage,
        ...(useImage && image ? { image } : {}),
      });

      explanationRequest.current = null;

      setItems((previous) => [
        value,
        ...previous.filter((item) => item.id !== value.id),
      ]);
    } catch (error) {
      if (error instanceof ApiError && error.status === 401)
        setSessionExpired(true);
      setError((error as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function startConversation() {
    if (busy) return;
    setBusy(true);
    setError('');
    setSessionExpired(false);

    try {
      const value = await openConversation(source);

      setConversations((previous) => [
        value,
        ...previous.filter((item) => item.id !== value.id),
      ]);

      setSelectedConversation(value.id);
    } catch (error) {
      if (error instanceof ApiError && error.status === 401)
        setSessionExpired(true);
      setError((error as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function practice() {
    if (busy || (beforeNavigate && !beforeNavigate())) return;
    setBusy(true);
    setError('');
    setSessionExpired(false);

    try {
      const key = JSON.stringify([source, language, exerciseType, latest?.id]);

      if (exerciseRequest.current?.key !== key)
        exerciseRequest.current = { key, id: crypto.randomUUID() };

      const value = await generateExercises({
        requestId: exerciseRequest.current.id,
        source,
        language,
        type: exerciseType,
        count: 1,
        ...(latest ? { explanationId: latest.id } : {}),
      });

      exerciseRequest.current = null;
      if (value.items[0])
        router.push(
          `/practice?exerciseId=${encodeURIComponent(value.items[0].id)}`
        );
    } catch (error) {
      if (error instanceof ApiError && error.status === 401)
        setSessionExpired(true);
      setError((error as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function askFromSource(event: React.FormEvent) {
    event.preventDefault();
    if (busy || !allowGeneration || !quickQuestion.trim()) return;
    setBusy(true);
    setError('');
    setSessionExpired(false);

    try {
      // 응답을 받지 못한 재전송에도 같은 실행 ID와 대화를 사용한다.
      const chat =
        quickRequest.current?.conversation ?? (await openConversation(source));

      if (quickRequest.current?.text !== quickQuestion.trim())
        quickRequest.current = {
          conversation: chat,
          text: quickQuestion.trim(),
          id: crypto.randomUUID(),
        };

      const value = await sendAiMessage(chat.id, {
        requestId: quickRequest.current.id,
        text: quickRequest.current.text,
      });

      setConversations((previous) => [
        value,
        ...previous.filter((item) => item.id !== value.id),
      ]);

      setSelectedConversation(value.id);
      setQuickQuestion('');
      quickRequest.current = null;
    } catch (error) {
      if (error instanceof ApiError && error.status === 401)
        setSessionExpired(true);
      setError((error as Error).message);
    } finally {
      setBusy(false);
    }
  }

  if (compact)
    return (
      <section
        className={styles.stack}
        aria-label='원문 AI 학습'>
        {sessionExpired && <SessionRecovery />}
        {dialog === 'expression' ? (
          <ExpressionComposer
            source={source}
            explanation={latest}
            embedded
            onSaved={onSaved}
            onClose={() => setDialog(null)}
          />
        ) : (
          <>
            {!allowGeneration && (
              <p className={styles.notice}>
                지금은 새 AI 생성을 요청할 수 없습니다. 저장 설명·대화·표현과
                개인 기록은 유지합니다.
              </p>
            )}
            {loading && <p role='status'>저장된 설명을 불러오고 있어요.</p>}
            {latest && (
              <AiExplanation
                value={latest}
                compact
              />
            )}
            {!loading && !latest && (
              <p className={styles.meta}>
                저장된 설명이 없습니다. 필요한 설명을 요청하면 이곳에
                보관합니다.
              </p>
            )}
            <div hidden={conversationView}>
              <div className={styles.row}>
                <Button
                  disabled={busy}
                  onClick={() => setDialog('expression')}>
                  표현 저장
                </Button>
                <Button
                  variant='secondary'
                  disabled={busy || !allowGeneration}
                  onClick={() => void practice()}>
                  이해 확인
                </Button>
              </div>
              <details open={!latest}>
                <summary>
                  {latest ? '다른 설명과 연습 요청' : '설명 요청'}
                </summary>
                <div className={styles.stack}>
                  <label className={styles.field}>
                    살펴볼 내용
                    <Select
                      value={mode}
                      disabled={busy || !allowGeneration}
                      onChange={(e) => setMode(e.target.value as typeof mode)}>
                      <option value='meaning'>문맥의 뜻</option>
                      <option value='translation'>번역</option>
                      <option value='structure'>문장 구조</option>
                      <option value='concept'>개념과 적용</option>
                    </Select>
                  </label>
                  <label className={styles.field}>
                    설명 언어
                    <Select
                      value={explanationLanguage}
                      disabled={busy || !allowGeneration}
                      onChange={(e) =>
                        setExplanationLanguage(
                          e.target.value as typeof explanationLanguage
                        )
                      }>
                      <option value='ko'>한국어</option>
                      <option value='en'>영어</option>
                      <option value='th'>태국어</option>
                    </Select>
                  </label>
                  <Button
                    loading={busy}
                    disabled={busy || !allowGeneration}
                    onClick={() => void explain()}>
                    선택 원문 설명 요청
                  </Button>
                  {image && (
                    <Button
                      variant='secondary'
                      disabled={busy || !allowGeneration}
                      onClick={() => void explain(true)}>
                      이 페이지 이미지로 해석
                    </Button>
                  )}
                  <label className={styles.field}>
                    이해 확인 방식
                    <Select
                      value={exerciseType}
                      disabled={busy || !allowGeneration}
                      onChange={(e) =>
                        setExerciseType(e.target.value as typeof exerciseType)
                      }>
                      <option value='choice'>객관식</option>
                      <option value='short_answer'>짧은 정답형</option>
                      <option value='free_response'>
                        자유 답변과 AI 피드백
                      </option>
                    </Select>
                  </label>
                </div>
              </details>
              <details>
                <summary>저장한 다른 설명과 사용 한도</summary>
                {items.slice(1).map((item) => (
                  <AiExplanation
                    key={item.id}
                    value={item}
                    compact
                  />
                ))}
                {related.map((item) => (
                  <AiExplanation
                    key={item.id}
                    value={item}
                    compact
                  />
                ))}
                {capabilities && (
                  <p className={styles.meta}>
                    {aiProviderLabel(capabilities.provider)} ·{' '}
                    {capabilities.models.text}
                    <br />
                    하루 {capabilities.limits.dailyRequests}회 ·{' '}
                    {capabilities.limits.dailyTokens.toLocaleString()}토큰 ·
                    동시 {capabilities.limits.concurrentRequests}개
                  </p>
                )}
                <Button
                  variant='ghost'
                  onClick={() => {
                    setLoading(true);
                    setReload((v) => v + 1);
                  }}>
                  저장 결과 새로 조회
                </Button>
              </details>
            </div>
            <hr />
            {!conversation && (
              <form
                className={styles.stack}
                onSubmit={(event) => void askFromSource(event)}>
                <label className={styles.field}>
                  선택한 구절에 질문하기
                  <Input
                    aria-label='선택한 구절에 질문하기'
                    value={quickQuestion}
                    onChange={(event) => setQuickQuestion(event.target.value)}
                    maxLength={3000}
                    disabled={busy || !allowGeneration}
                    required
                    placeholder='이 구절에 대해 더 물어보세요'
                  />
                </label>
                <div>
                  <Button
                    loading={busy}
                    disabled={
                      busy || !allowGeneration || !quickQuestion.trim()
                    }>
                    질문 보내기
                  </Button>
                </div>
              </form>
            )}
            {conversations.length > 0 && (
              <Select
                aria-label='저장된 원문 대화'
                value={selectedConversation}
                onChange={(e) => setSelectedConversation(e.target.value)}>
                <option value=''>저장된 대화 선택</option>
                {conversations.map((chat, index) => (
                  <option
                    key={chat.id}
                    value={chat.id}>
                    {chat.messages
                      .find((m) => m.role === 'user')
                      ?.text.slice(0, 35) || `원문 대화 ${index + 1}`}
                  </option>
                ))}
              </Select>
            )}
            {conversation && (
              <AiConversation
                key={conversation.id}
                initial={conversation}
                language={language}
                readOnly={!allowGeneration}
              />
            )}
            <Button
              variant='ghost'
              onClick={() =>
                onQuestion ? onQuestion() : setDialog('question')
              }>
              도우미에게 질문하기 →
            </Button>
            <p className={styles.meta}>
              설명 조회와 저장에는 새 AI 호출이 없습니다. 새 설명·문제·대화
              답변만 사용량에 포함됩니다.
            </p>
          </>
        )}
        {error && (
          <p
            role='alert'
            className={styles.error}>
            {error}
          </p>
        )}
        {dialog === 'question' && (
          <QuestionComposer
            source={source}
            language={language}
            onClose={() => setDialog(null)}
          />
        )}
      </section>
    );

  return (
    <section
      className={styles.stack}
      aria-label='원문 AI 학습'>
      {sessionExpired && <SessionRecovery />}
      <div className={styles.row}>
        <Badge tone='brand'>원문 기반 AI 학습</Badge>
        <span className={styles.meta}>자료 v{source.version ?? 1}</span>
      </div>
      {capabilities && (
        <p className={styles.meta}>
          현재 요청 공급자: {aiProviderLabel(capabilities.provider)} · 텍스트{' '}
          {capabilities.models.text} · 이미지 {capabilities.models.image}
          {capabilities.configured ? '' : ' · 연결 설정 필요'}
          <br />
          하루 최대 {capabilities.limits.dailyRequests}회 ·{' '}
          {capabilities.limits.dailyTokens.toLocaleString()}토큰 · 동시{' '}
          {capabilities.limits.concurrentRequests}개 요청
        </p>
      )}
      <div className={styles.row}>
        <label className={styles.field}>
          살펴볼 내용
          <Select
            value={mode}
            disabled={busy}
            onChange={(event) => setMode(event.target.value as typeof mode)}>
            <option value='meaning'>문맥의 뜻</option>
            <option value='translation'>번역</option>
            <option value='structure'>문장 구조</option>
            <option value='concept'>개념과 적용</option>
          </Select>
        </label>
        <label className={styles.field}>
          설명 언어
          <Select
            value={explanationLanguage}
            disabled={busy}
            onChange={(event) =>
              setExplanationLanguage(
                event.target.value as typeof explanationLanguage
              )
            }>
            <option value='ko'>한국어</option>
            <option value='en'>영어</option>
            <option value='th'>태국어</option>
          </Select>
        </label>
      </div>
      <div className={styles.row}>
        <Button
          size='small'
          loading={busy}
          disabled={busy}
          onClick={() => void explain()}>
          선택 원문 설명 요청
        </Button>
        {image && (
          <Button
            size='small'
            variant='secondary'
            disabled={busy}
            onClick={() => void explain(true)}>
            이 페이지 이미지로 해석
          </Button>
        )}
      </div>
      <p className={styles.meta}>
        저장 결과를 여는 것만으로 AI를 호출하지 않습니다. 새 설명·질문·연습을
        요청할 때 서버 한도를 확인합니다.
      </p>
      {loading && <p role='status'>저장된 설명과 대화를 불러오고 있어요.</p>}
      <div>
        <Button
          size='small'
          variant='ghost'
          disabled={loading || busy}
          onClick={() => {
            setLoading(true);
            setError('');
            setSessionExpired(false);
            setReload((value) => value + 1);
          }}>
          저장 결과 새로 조회
        </Button>
      </div>
      {error && (
        <p
          role='alert'
          className={styles.error}>
          {error}
          <span className={styles.row}>
            <Button
              size='small'
              variant='ghost'
              disabled={busy}
              onClick={() => {
                explanationRequest.current = null;
                void explain();
              }}>
              선택 원문 설명 새로 요청
            </Button>
            <Button
              size='small'
              variant='ghost'
              disabled={busy}
              onClick={() => {
                exerciseRequest.current = null;
                void practice();
              }}>
              적용 문제 새로 요청
            </Button>
          </span>
        </p>
      )}
      {latest && (
        <>
          <AiExplanation value={latest} />
          <div className={styles.row}>
            <Button
              variant='secondary'
              size='small'
              onClick={() => setDialog('expression')}>
              이 뜻과 버전으로 표현 저장
            </Button>
            <Button
              variant='ghost'
              size='small'
              onClick={() => setDialog('question')}>
              이 설명을 도우미에게 질문
            </Button>
          </div>
        </>
      )}
      {!loading && !latest && (
        <p className={styles.notice}>
          아직 저장된 설명이 없습니다. 필요한 내용과 설명 언어를 선택해 요청해
          보세요.
        </p>
      )}
      {items.length > 1 && (
        <details>
          <summary>이 발췌의 다른 저장 설명 {items.length - 1}개</summary>
          {items.slice(1).map((value) => (
            <AiExplanation
              key={value.id + ':' + value.version}
              value={value}
            />
          ))}
        </details>
      )}
      {related.length > 0 && (
        <details>
          <summary>
            이 페이지·구절의 다른 범위 준비 결과 {related.length}개
          </summary>
          {related.map((value) => (
            <div key={value.id + ':' + value.version}>
              <p className={styles.meta}>이 설명에 사용한 원문 범위</p>
              <blockquote className={styles.quote}>
                {value.source.quote}
              </blockquote>
              <AiExplanation value={value} />
            </div>
          ))}
        </details>
      )}
      <label className={styles.field}>
        짧은 적용 연습
        <Select
          value={exerciseType}
          onChange={(event) =>
            setExerciseType(event.target.value as typeof exerciseType)
          }>
          <option value='choice'>객관식 이해 확인</option>
          <option value='short_answer'>짧은 정답형</option>
          <option value='free_response'>자유 답변과 AI 피드백</option>
        </Select>
      </label>
      <div>
        <Button
          variant='secondary'
          size='small'
          disabled={busy}
          onClick={() => void practice()}>
          이 원문으로 새 문제 생성
        </Button>
      </div>
      <hr />
      <div className={styles.row}>
        <h3>나만의 원문 대화</h3>
        <Button
          variant='ghost'
          size='small'
          disabled={busy}
          onClick={() => void startConversation()}>
          새 대화 열기
        </Button>
      </div>
      {conversations.length > 0 && (
        <Select
          aria-label='저장된 원문 대화'
          value={selectedConversation}
          onChange={(event) => setSelectedConversation(event.target.value)}>
          <option value=''>저장된 대화 선택</option>
          {conversations.map((chat, index) => (
            <option
              key={chat.id}
              value={chat.id}>
              {chat.messages
                .find((message) => message.role === 'user')
                ?.text.slice(0, 35) || `원문 대화 ${index + 1}`}
            </option>
          ))}
        </Select>
      )}
      {conversation && (
        <AiConversation
          key={conversation.id}
          initial={conversation}
          language={language}
        />
      )}
      {dialog === 'expression' && latest && (
        <ExpressionComposer
          source={source}
          explanation={latest}
          onClose={() => setDialog(null)}
        />
      )}
      {dialog === 'question' && latest && (
        <QuestionComposer
          source={source}
          language={language}
          attachment={{ artifactId: latest.id, version: latest.version }}
          attachmentText={[
            latest.payload.translation,
            latest.payload.meaning,
            latest.payload.structure,
            latest.payload.concept,
          ]
            .filter(Boolean)
            .join('\n')}
          onClose={() => setDialog(null)}
        />
      )}
    </section>
  );
}
