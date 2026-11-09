'use client';
import { aiProviderLabel } from '@/domains/ai/lib/providerLabel';
import { ApiError } from '@/lib/api/request';
import { SessionRecovery } from './SessionRecovery';
import Link from 'next/link';
import { materialPaths } from '@/domains/materials/config/paths';
import { useEffect, useRef, useState } from 'react';
import type { Conversation } from '@/domains/ai/model/contracts';
import { getConversation, sendAiMessage } from '@/domains/ai/api/learning';
import { Button } from '@/components/ui/primitives/Button';
import { TextArea } from '@/components/ui/primitives/TextArea';
import { Badge } from '@/components/ui/primitives/Badge';
import { QuestionComposer } from './QuestionComposer';
import * as styles from '@/lib/styles/workspace.css';

/** 원문이 고정된 개인 대화와 명시적으로 선택한 답변 공유를 연결한다. */
export function AiConversation({
  initial,
  language,
}: {
  initial: Conversation;
  language: 'en' | 'th';
}) {
  const [conversation, setConversation] = useState(initial);
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [sessionExpired, setSessionExpired] = useState(false);
  const request = useRef<{ text: string; id: string } | null>(null);
  const [sharedMessage, setSharedMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    void getConversation(initial.id)
      .then((value) => {
        if (active) setConversation(value);
      })
      .catch((error) => {
        if (active) setError(error.message);
      });

    return () => {
      active = false;
    };
  }, [initial.id]);

  async function send(event: React.FormEvent) {
    event.preventDefault();
    if (!text.trim() || busy) return;
    setBusy(true);
    setError('');
    setSessionExpired(false);

    try {
      if (request.current?.text !== text.trim())
        request.current = { text: text.trim(), id: crypto.randomUUID() };

      setConversation(
        await sendAiMessage(conversation.id, {
          requestId: request.current.id,
          text: text.trim(),
        })
      );

      request.current = null;
      setText('');
    } catch (error) {
      if (error instanceof ApiError && error.status === 401)
        setSessionExpired(true);
      setError((error as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={styles.stack}>
      {sessionExpired && <SessionRecovery />}
      <p className={styles.meta}>
        나만 보는 대화 · 현재 발췌와 자료 버전에 연결됩니다. 전사문 기반 답변은
        영상 화면을 본 결과와 다릅니다.
      </p>
      <div
        role='log'
        aria-label='원문 AI 대화'>
        {conversation.messages.map((message) => (
          <article
            key={message.id}
            className={styles.message}>
            <div className={styles.row}>
              <strong>
                {message.role === 'user' ? '나' : 'AI 학습 도우미'}
              </strong>
              {message.role === 'assistant' && (
                <Badge tone={message.status === 'ready' ? 'brand' : 'warning'}>
                  {message.status === 'out_of_scope'
                    ? '원문 관련 질문 안내'
                    : message.status === 'failed'
                      ? '요청 실패'
                      : '원문 근거 응답'}
                </Badge>
              )}
            </div>
            {message.role === 'assistant' &&
              (message.model || message.provider) && (
                <p className={styles.meta}>
                  {message.provider
                    ? aiProviderLabel(message.provider)
                    : '공급자 기록 없음'}
                  {message.model ? ` · ${message.model}` : ''}
                </p>
              )}
            <p className={styles.prose}>{message.text}</p>
            {message.citations?.map((cite, index) => (
              <blockquote
                key={index}
                className={styles.quote}>
                {cite.quote}
                <p>
                  <Link
                    href={materialPaths.source({
                      ...conversation.source,
                      quote: cite.quote,
                      rects: undefined,
                    })}
                    className={styles.link}>
                    근거 위치로 이동 ↗
                  </Link>
                </p>
              </blockquote>
            ))}
            {message.contextDescription && (
              <p className={styles.meta}>
                실제로 제공한 문맥: {message.contextDescription}
              </p>
            )}
            {message.uncertainty && (
              <p className={styles.notice}>
                해석·추정 및 한계: {message.uncertainty}
              </p>
            )}
            {message.role === 'assistant' && message.status === 'ready' && (
              <Button
                variant='ghost'
                size='small'
                onClick={() => setSharedMessage(message.id)}>
                이 답변을 도우미에게 질문
              </Button>
            )}
          </article>
        ))}
      </div>
      <form
        onSubmit={(event) => void send(event)}
        className={styles.stack}>
        <label className={styles.field}>
          이 원문에서 궁금한 점
          <TextArea
            value={text}
            maxLength={3000}
            disabled={busy}
            onChange={(event) => setText(event.target.value)}
            placeholder='이 표현은 왜 이 의미로 쓰였나요?'
            required
          />
        </label>
        <p className={styles.meta}>
          질문을 보낼 때만 새 답변을 요청합니다. 선택한 원문과 관계없는 질문은
          문맥 질문으로 안내합니다.
        </p>
        {error && (
          <p
            role='alert'
            className={styles.error}>
            {error}
          </p>
        )}
        <div>
          <Button
            loading={busy}
            disabled={busy || !text.trim()}>
            질문 보내기
          </Button>
        </div>
      </form>
      {sharedMessage && (
        <QuestionComposer
          source={conversation.source}
          language={language}
          attachment={{
            conversationId: conversation.id,
            messageId: sharedMessage,
          }}
          attachmentText={
            conversation.messages.find(
              (message) => message.id === sharedMessage
            )?.text
          }
          onClose={() => setSharedMessage(null)}
        />
      )}
    </div>
  );
}
