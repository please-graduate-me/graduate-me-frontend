'use client';
import { AlertDialog } from '@astryxdesign/core/AlertDialog';
import { useConfirmation } from '@/lib/hooks/useConfirmation';
import { contentLabel } from '@/components/ui/primitives/contentLabel';
import { Blockquote } from '@astryxdesign/core/Blockquote';
import { Banner } from '@astryxdesign/core/Banner';
import { Heading } from '@astryxdesign/core/Heading';
import { Text } from '@astryxdesign/core/Text';
import { Section } from '@astryxdesign/core/Section';
import { Card } from '@astryxdesign/core/Card';
import { ApiError } from '@/lib/api/request';
import { SessionRecovery } from '../../../../_components/SessionRecovery';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Link } from '@astryxdesign/core/Link';
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
  const confirmation = useConfirmation();
  const router = useRouter();
  const [question, setQuestion] = useState(initial);
  const [body, setBody] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [sessionExpired, setSessionExpired] = useState(false);

  async function send(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError('');

    try {
      setQuestion(await addQuestionMessage(question.id, body.trim()));
      setBody('');
      router.refresh();
    } catch (error) {
      setSessionExpired(error instanceof ApiError && error.status === 401);
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
      setSessionExpired(error instanceof ApiError && error.status === 401);
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
      setSessionExpired(error instanceof ApiError && error.status === 401);
      setError((error as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={styles.page}>
      <AlertDialog {...confirmation.dialog} />
      <div className={styles.heading}>
        <div>
          <Link
            href='/questions'
            className={styles.link}>
            ← 나의 질문
          </Link>
          <Heading level={1}>{question.title}</Heading>
          <Text
            as='p'
            display='block'
            className={styles.description}>
            {question.source.title} · {sourceLabel(question.source)}
          </Text>
        </div>
        <Badge tone={question.status === 'answered' ? 'success' : 'brand'}>
          {question.status === 'answered' ? '답변 완료' : '답변 대기'}
        </Badge>
      </div>
      <div className={styles.questionColumns}>
        <Section aria-label='질문과 공개 답변'>
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
              onClick={async () => {
                if (
                  question.revokedAt ||
                  (await confirmation.confirm(
                    '공유를 철회하면 답변 도우미가 이 질문과 발췌를 열 수 없습니다. 내 기록은 유지됩니다.'
                  ))
                )
                  void changeState({ shared: Boolean(question.revokedAt) });
              }}>
              {question.revokedAt ? '담당자와 다시 공유' : '질문 공유 철회'}
            </Button>
          </div>
          <Card className={styles.message}>
            <div className={styles.author}>
              <strong>{question.author.name ?? '질문자'}</strong>
              <time className={styles.meta}>
                {formatDate(question.createdAt)}
              </time>
            </div>
            <Text
              as='p'
              display='block'
              className={styles.prose}>
              {question.body}
            </Text>
          </Card>
          {question.attachment && (
            <Card className={styles.message}>
              <Heading level={3}>
                내가 공유한 선택 AI 결과 ·{' '}
                {question.attachment.version
                  ? `v${question.attachment.version}`
                  : '선택 답변'}
              </Heading>
              <Text
                as='p'
                display='block'
                className={styles.prose}>
                {question.attachment.text}
              </Text>
            </Card>
          )}
          {question.messages.map((message) => (
            <Card
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
              <Text
                as='p'
                display='block'
                className={styles.prose}>
                {message.body}
              </Text>
            </Card>
          ))}
          {question.status === 'waiting' && (
            <Banner
              status='info'
              title='안내'

              role='status'>
              {question.assignee
                ? `${question.assignee.name ?? '담당 도우미'}님의 답변을 기다리고 있어요.`
                : '질문이 접수되었어요. 운영자가 담당 도우미를 배정합니다.'}
            </Banner>
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
          {question.kind === 'report' ? (
            <form
              className={styles.stack}
              onSubmit={(event) => void send(event)}>
              <div className={styles.field}>
                <TextArea
                  label={contentLabel(<>추가 질문</>)}
                  required
                  value={body}
                  maxLength={10000}
                  onChange={(event) => setBody(event.target.value)}
                  placeholder='더 궁금한 점을 적어 주세요.'
                />
              </div>
              {sessionExpired && <SessionRecovery />}
              {error && (
                <Banner
                  status='error'
                  title='확인이 필요해요'

                  role='alert'>
                  {error}
                </Banner>
              )}
              <div>
                <Button
                  loading={busy}
                  disabled={busy || !body.trim()}>
                  추가 질문 보내기
                </Button>
              </div>
            </form>
          ) : (
            <Banner
              status='info'
              title='안내'>
              기존 개인 질문은 이력으로 보존됩니다. 새 질문은 학습 커뮤니티에서
              조교를 태그해 주세요.
            </Banner>
          )}
        </Section>
        <Card
          variant='muted'
          className={styles.sourcePanel}>
          <Text
            as='p'
            display='block'
            className={styles.meta}>
            질문의 근거
          </Text>
          <span className={styles.cover}>
            <Icon
              name={question.source.kind === 'pdf' ? 'file-text' : 'play'}
            />
          </span>
          <Heading level={2}>{question.source.title}</Heading>
          <Blockquote className={styles.quote}>
            {question.source.quote}
          </Blockquote>
          <Text
            as='p'
            display='block'
            className={styles.meta}>
            {sourceLabel(question.source)}
          </Text>
          <Link
            href={materialPaths.source(question.source)}
            className={styles.link}>
            원문에서 보기 ↗
          </Link>
          <Banner
            status='info'
            title='안내'>
            이 질문은 선택한 발췌와 질문 내용만 공유합니다. 답변자의 내부 검토
            메모와 운영 이력은 표시하지 않습니다.
          </Banner>
        </Card>
      </div>
    </div>
  );
}
