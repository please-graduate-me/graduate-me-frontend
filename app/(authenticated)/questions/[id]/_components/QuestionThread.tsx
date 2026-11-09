'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Question } from '@/domains/questions/model/contracts';
import {
  addQuestionMessage,
  getQuestion,
  updateQuestion,
} from '@/domains/questions/api/questions';
import { materialPaths } from '@/domains/materials/config/paths';
import { formatDate, sourceLabel } from '@/domains/learning/lib/format';
import { Button } from '@/components/ui/primitives/Button';
import { TextArea } from '@/components/ui/primitives/TextArea';
import { Badge } from '@/components/ui/primitives/Badge';
import { Icon } from '@/components/ui/primitives/Icon';
import * as styles from '@/lib/styles/workspace.css';

/** 공개 답변을 원문과 나란히 읽고 같은 질문에 추가 질문을 남긴다. */
export function QuestionThread({ initial }: { initial: Question }) {
  const router = useRouter();
  const [question, setQuestion] = useState(initial);
  const [body, setBody] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function send(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError('');

    try {
      setQuestion(await addQuestionMessage(question.id, body.trim()));
      setBody('');
      router.refresh();
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function refresh() {
    setBusy(true);
    setError('');

    try {
      setQuestion(await getQuestion(question.id));
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function changeState(input: { resolved?: boolean; shared?: boolean }) {
    setBusy(true);
    setError('');

    try {
      setQuestion(await updateQuestion(question.id, input));
      router.refresh();
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.heading}>
        <div>
          <Link
            href='/questions'
            className={styles.link}>
            ← 나의 질문
          </Link>
          <h1>{question.title}</h1>
          <p className={styles.description}>
            {question.source.title} · {sourceLabel(question.source)}
          </p>
        </div>
        <Badge tone={question.status === 'answered' ? 'success' : 'brand'}>
          {question.status === 'answered' ? '답변 완료' : '답변 대기'}
        </Badge>
      </div>
      <div className={styles.questionColumns}>
        <section aria-label='질문과 공개 답변'>
          <div className={styles.row}>
            <Badge tone={question.resolvedAt ? 'success' : 'neutral'}>
              {question.resolvedAt ? '내가 해결한 질문' : '추가 확인 중'}
            </Badge>
            <Badge tone={question.revokedAt ? 'warning' : 'brand'}>
              {question.revokedAt ? '공유 철회됨' : '담당자와 공유 중'}
            </Badge>
            <Button
              size='small'
              variant='secondary'
              disabled={busy}
              onClick={() =>
                void changeState({ resolved: !question.resolvedAt })
              }>
              {question.resolvedAt ? '다시 질문 중으로 표시' : '해결했어요'}
            </Button>
            <Button
              size='small'
              variant='ghost'
              disabled={busy}
              onClick={() => {
                if (
                  question.revokedAt ||
                  window.confirm(
                    '공유를 철회하면 답변 도우미가 이 질문과 발췌를 열 수 없습니다. 내 기록은 유지됩니다.'
                  )
                )
                  void changeState({ shared: Boolean(question.revokedAt) });
              }}>
              {question.revokedAt ? '담당자와 다시 공유' : '질문 공유 철회'}
            </Button>
          </div>
          <article className={styles.message}>
            <div className={styles.author}>
              <strong>{question.author.name ?? '질문자'}</strong>
              <time className={styles.meta}>
                {formatDate(question.createdAt)}
              </time>
            </div>
            <p className={styles.prose}>{question.body}</p>
          </article>
          {question.attachment && (
            <article className={styles.message}>
              <h3>
                내가 공유한 선택 AI 결과 ·{' '}
                {question.attachment.version
                  ? `v${question.attachment.version}`
                  : '선택 답변'}
              </h3>
              <p className={styles.prose}>{question.attachment.text}</p>
            </article>
          )}
          {question.messages.map((message) => (
            <article
              className={styles.message}
              key={message.id}>
              <div className={styles.author}>
                <strong>
                  {message.author.name ??
                    (message.kind === 'answer' ? '학과 도우미' : '질문자')}
                </strong>
                {message.kind === 'answer' && (
                  <Badge tone='brand'>
                    <Icon
                      name='message-circle'
                      size={16}
                    />
                    학과 답변 도우미
                  </Badge>
                )}
                <time className={styles.meta}>
                  {formatDate(message.createdAt)}
                </time>
              </div>
              <p className={styles.prose}>{message.body}</p>
            </article>
          ))}
          {question.status === 'waiting' && (
            <p
              className={styles.notice}
              role='status'>
              {question.assignee
                ? `${question.assignee.name ?? '담당 도우미'}님의 답변을 기다리고 있어요.`
                : '질문이 접수되었어요. 운영자가 담당 도우미를 배정합니다.'}
            </p>
          )}
          <div className={styles.row}>
            <Button
              variant='ghost'
              disabled={busy}
              onClick={() => void refresh()}>
              <Icon
                name='rotate-ccw'
                size={16}
              />
              답변 새로 확인
            </Button>
          </div>
          <form
            className={styles.stack}
            onSubmit={(event) => void send(event)}>
            <label className={styles.field}>
              추가 질문
              <TextArea
                required
                value={body}
                maxLength={10000}
                onChange={(event) => setBody(event.target.value)}
                placeholder='더 궁금한 점을 적어 주세요.'
              />
            </label>
            {error && (
              <p
                className={styles.error}
                role='alert'>
                {error}
              </p>
            )}
            <div>
              <Button
                loading={busy}
                disabled={busy || !body.trim()}>
                추가 질문 보내기
              </Button>
            </div>
          </form>
        </section>
        <aside className={styles.sourcePanel}>
          <p className={styles.meta}>질문의 근거</p>
          <span className={styles.cover}>
            <Icon
              name={question.source.kind === 'pdf' ? 'file-text' : 'play'}
            />
          </span>
          <h2>{question.source.title}</h2>
          <blockquote className={styles.quote}>
            {question.source.quote}
          </blockquote>
          <p className={styles.meta}>{sourceLabel(question.source)}</p>
          <Link
            href={materialPaths.source(question.source)}
            className={styles.link}>
            원문에서 보기 ↗
          </Link>
          <p className={styles.notice}>
            이 질문은 선택한 발췌와 질문 내용만 공유합니다. 답변자의 내부 검토
            메모와 운영 이력은 표시하지 않습니다.
          </p>
        </aside>
      </div>
    </div>
  );
}
