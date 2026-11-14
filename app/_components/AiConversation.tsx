'use client';
import { Blockquote } from '@/components/ui/primitives/Blockquote';

import { Banner } from '@/components/ui/composites/Banner';

import { Text } from '@/components/ui/primitives/Text';
import { Card } from '@/components/ui/primitives/Card';

import { aiProviderLabel } from '@/domains/ai/lib/providerLabel';
import { ApiError } from '@/lib/api/request';
import { SessionRecovery } from './SessionRecovery';
import { Link } from '@/components/ui/primitives/Link';
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
  readOnly = false,
}: {
  initial: Conversation;
  language: 'en' | 'th';
  readOnly?: boolean;
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
    if (!text.trim() || busy || readOnly) return;
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
      <Text
        as='p'
        className={styles.meta}>
        나만 보는 대화 · 현재 발췌와 자료 버전에 연결됩니다. 전사문 기반 답변은
        영상 화면을 본 결과와 다릅니다.
      </Text>
      <div
        role='log'
        aria-label='원문 AI 대화'>
        {conversation.messages.map((message) => (
          <Card
            role='article'
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
                <Text
                  as='p'
                  className={styles.meta}>
                  {message.provider
                    ? aiProviderLabel(message.provider)
                    : '공급자 기록 없음'}
                  {message.model ? ` · ${message.model}` : ''}
                </Text>
              )}
            <Text
              as='p'
              className={styles.prose}>
              {message.text}
            </Text>
            {message.citations?.map((cite, index) => (
              <Blockquote
                key={index}
                className={styles.quote}>
                {cite.quote}
                <Text as='p'>
                  <Link
                    href={materialPaths.source({
                      ...conversation.source,
                      quote: cite.quote,
                      rects: undefined,
                    })}
                    className={styles.link}>
                    근거 위치로 이동 ↗
                  </Link>
                </Text>
              </Blockquote>
            ))}
            {message.contextDescription && (
              <Text
                as='p'
                className={styles.meta}>
                실제로 제공한 문맥: {message.contextDescription}
              </Text>
            )}
            {message.uncertainty && (
              <Banner
                status='warning'
                title={<>해석·추정 및 한계: {message.uncertainty}</>}
              />
            )}
            {message.role === 'assistant' && message.status === 'ready' && (
              <Button
                variant='ghost'
                size='small'
                onClick={() => setSharedMessage(message.id)}>
                이 답변을 커뮤니티에 질문
              </Button>
            )}
          </Card>
        ))}
      </div>
      {readOnly && (
        <Banner
          status='warning'
          title={
            <>
              저장된 대화를 읽을 수 있습니다. 현재 원문에서는 새 AI 답변을
              요청할 수 없습니다.
            </>
          }
        />
      )}
      <form
        onSubmit={(event) => void send(event)}
        className={styles.stack}>
        <div className={styles.field}>
          <TextArea
            label='이 원문에서 궁금한 점'

            value={text}
            maxLength={3000}
            disabled={busy || readOnly}
            onChange={(event) => setText(event.target.value)}
            placeholder='이 표현은 왜 이 의미로 쓰였나요?'
            required
          />
        </div>
        <Text
          as='p'
          className={styles.meta}>
          질문을 보낼 때만 새 답변을 요청합니다. 선택한 원문과 관계없는 질문은
          문맥 질문으로 안내합니다.
        </Text>
        {error && (
          <Banner
            status='error'
            role='alert'
            title={<>{error}</>}
          />
        )}
        <div>
          <Button
            loading={busy}
            disabled={busy || readOnly || !text.trim()}>
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
