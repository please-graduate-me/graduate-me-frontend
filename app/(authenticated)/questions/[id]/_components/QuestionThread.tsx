'use client';
import { AlertDialog } from '@/components/ui/composites/AlertDialog';
import { useConfirmation } from '@/lib/hooks/useConfirmation';
import { contentLabel } from '@/components/ui/primitives/contentLabel';
import { Banner } from '@/components/ui/composites/Banner';
import { Heading } from '@/components/ui/primitives/Heading';
import { Text } from '@/components/ui/primitives/Text';
import { Card } from '@/components/ui/primitives/Card';
import { ApiError } from '@/lib/api/request';
import { SessionRecovery } from '../../../../_components/SessionRecovery';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Link } from '@/components/ui/primitives/Link';
import type { Question } from '@/domains/questions/model/contracts';
import {
  addQuestionMessage,
  getQuestion,
  updateQuestion,
} from '@/domains/questions/api/questions';
import { materialPaths } from '@/domains/materials/config/paths';
import { sourceLabel } from '@/domains/learning/lib/format';
import { RelativeTime } from '@/components/ui/primitives/RelativeTime';
import { Button } from '@/components/ui/primitives/Button';
import { TextArea } from '@/components/ui/primitives/TextArea';
import { Badge } from '@/components/ui/primitives/Badge';
import { Icon } from '@/components/ui/primitives/Icon';
import { ButtonLink } from '@/components/ui/primitives/ButtonLink';
import { Avatar } from '@/components/ui/primitives/Avatar';
import * as styles from './QuestionThread.css';

/** 영상 근거 미리보기 모서리에 붙일 재생 시각을 분:초로 표시한다. */
const formatClock = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;

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

  const authorName = question.author.name ?? '질문자';
  const answered = question.status === 'answered';

  return (
    <div className={styles.root}>
      <AlertDialog {...confirmation.dialog} />
      <article className={styles.article}>
        <ButtonLink
          href='/questions'
          variant='ghost'
          className={styles.back}>
          <Icon
            name='chevron-left'
            size={18}
          />
          나의 질문
        </ButtonLink>
        <div className={styles.badges}>
          <Badge tone={answered ? 'success' : 'review'}>
            {answered && (
              <Icon
                name='check'
                size={12}
              />
            )}
            {answered ? '답변 완료' : '답변 대기'}
          </Badge>
          <Badge tone='neutral'>
            {question.source.language === 'en' ? '영어' : '태국어'}
          </Badge>
        </div>
        <div className={styles.titleBlock}>
          <Heading
            level={1}
            className={styles.title}>
            {question.title}
          </Heading>
          <p className={styles.meta}>
            {question.source.title} · {sourceLabel(question.source)}
          </p>
        </div>
        <div
          role='group'
          aria-label='질문 상태'
          className={styles.states}>
          <Badge tone={question.resolvedAt ? 'success' : 'neutral'}>
            {question.resolvedAt ? '내가 해결한 질문' : '추가 확인 중'}
          </Badge>
          <Badge tone={question.revokedAt ? 'warning' : 'review'}>
            {question.revokedAt ? '공유 철회됨' : '담당자와 공유 중'}
          </Badge>
          <span className={styles.spacer} />
          <Button
            type='button'
            variant='secondary'
            size='small'
            startIcon='check'
            hasPressedPop
            disabled={busy}
            aria-pressed={Boolean(question.resolvedAt)}
            onClick={() =>
              void changeState({ resolved: !question.resolvedAt })
            }>
            {question.resolvedAt ? '다시 질문 중으로 표시' : '해결했어요'}
          </Button>
          <Button
            type='button'
            size='small'
            variant='ghost'
            disabled={busy}
            onClick={async () => {
              // 다시 공유는 바로 반영하고 철회만 도우미 접근이 끊기므로 확인을 거친다.
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
        <Card className={styles.card}>
          <div className={styles.author}>
            <span
              aria-hidden='true'
              className={styles.avatar}>
              <Avatar
                name={authorName}
                tooltip={false}
              />
            </span>
            <strong className={styles.name}>{authorName}</strong>
            <RelativeTime
              value={question.createdAt}
              className={styles.time}
            />
          </div>
          <p className={styles.body}>{question.body}</p>
        </Card>
        {question.attachment && (
          <section
            aria-labelledby='question-attachment'
            className={styles.attachment}>
            <h2
              id='question-attachment'
              className={styles.attachmentTitle}>
              <Icon
                name='sparkles'
                size={16}
              />
              내가 공유한 선택 AI 결과 ·{' '}
              {question.attachment.version
                ? `v${question.attachment.version}`
                : '선택 답변'}
            </h2>
            <p className={styles.attachmentBody}>{question.attachment.text}</p>
          </section>
        )}
        <section
          aria-labelledby='question-thread'
          className={styles.thread}>
          <Heading
            level={2}
            id='question-thread'
            className={styles.threadTitle}>
            답변과 추가 질문
          </Heading>
          {question.messages.map((message) => {
            const name =
              message.author.name ??
              (message.kind === 'answer' ? '학과 도우미' : '질문자');

            return message.kind === 'answer' ? (
              <Card
                key={message.id}
                variant='teal'
                className={styles.answer}>
                <div className={styles.author}>
                  <span
                    aria-hidden='true'
                    className={styles.avatar}>
                    <Avatar
                      name={name}
                      tooltip={false}
                    />
                  </span>
                  <strong className={styles.name}>{name}</strong>
                  <Badge
                    tone='solid'
                    size='small'
                    shape='square'>
                    <Icon
                      name='message-circle'
                      size={12}
                    />
                    학과 답변 도우미
                  </Badge>
                  <RelativeTime
                    value={message.createdAt}
                    className={styles.time}
                  />
                </div>
                <p className={styles.body}>{message.body}</p>
              </Card>
            ) : (
              <div
                key={message.id}
                className={styles.followUp}>
                <span
                  aria-hidden='true'
                  className={styles.avatar}>
                  <Avatar
                    name={name}
                    tooltip={false}
                  />
                </span>
                <div className={styles.followUpBody}>
                  <p className={styles.followUpMeta}>
                    {name}{' '}
                    <span className={styles.followUpTime}>
                      · <RelativeTime value={message.createdAt} />
                    </span>
                  </p>
                  <p className={styles.followUpText}>{message.body}</p>
                </div>
              </div>
            );
          })}
          {question.status === 'waiting' && (
            <Banner
              status='review'
              icon='clock'
              role='status'>
              {question.assignee
                ? `${question.assignee.name ?? '담당 도우미'}님의 답변을 기다리고 있어요.`
                : '질문이 접수되었어요. 운영자가 담당 도우미를 배정합니다.'}
            </Banner>
          )}
          <Button
            type='button'
            variant='secondary'
            className={styles.refresh}
            disabled={busy}
            onClick={() => void refresh()}>
            <Icon
              name='rotate-ccw'
              size={16}
            />
            답변 새로 확인
          </Button>
          {sessionExpired && <SessionRecovery />}
          {error && (
            <Banner
              status='error'
              title='확인이 필요해요'
              role='alert'>
              {error}
            </Banner>
          )}
          {question.kind === 'report' ? (
            <Card>
              <form
                className={styles.composer}
                onSubmit={(event) => void send(event)}>
                <TextArea
                  label={contentLabel(<>추가 질문</>)}
                  required
                  rows={3}
                  value={body}
                  maxLength={10000}
                  onChange={(event) => setBody(event.target.value)}
                  placeholder='더 궁금한 점을 적어 주세요.'
                />
                <Button
                  variant='ink'
                  className={styles.send}
                  loading={busy}
                  disabled={busy || !body.trim()}>
                  추가 질문 보내기
                </Button>
              </form>
            </Card>
          ) : (
            <Card variant='muted'>
              <Text
                as='p'
                display='block'
                size='sm'>
                기존 개인 질문은 이력으로 보존됩니다. 새 질문은 학습
                커뮤니티에서 조교를 태그해 주세요.
              </Text>
            </Card>
          )}
        </section>
      </article>
      <aside
        aria-label='질문의 근거'
        className={styles.aside}>
        <section className={styles.source}>
          <p className={styles.sourceLabel}>질문의 근거</p>
          <div
            aria-hidden='true'
            className={`${styles.preview} ${question.source.kind === 'pdf' ? styles.previewPdf : styles.previewVideo}`}>
            {question.source.kind === 'pdf' ? (
              <Icon
                name='file-text'
                size={36}
              />
            ) : (
              <>
                <svg
                  width='44'
                  height='44'
                  viewBox='0 0 44 44'>
                  <circle
                    cx='22'
                    cy='22'
                    r='21'
                    fill='#2B2F38'
                  />
                  <path
                    d='M18 14v16l12-8-12-8z'
                    fill='currentColor'
                  />
                </svg>
                {question.source.start !== undefined && (
                  <span className={styles.previewTime}>
                    {formatClock(question.source.start)}
                  </span>
                )}
              </>
            )}
          </div>
          <Heading
            level={2}
            className={styles.sourceTitle}>
            {question.source.title}
          </Heading>
          <blockquote className={styles.quote}>
            {question.source.quote}
          </blockquote>
          <p className={styles.sourceMeta}>{sourceLabel(question.source)}</p>
          <Link
            href={materialPaths.source(question.source)}
            className={styles.sourceLink}>
            원문에서 보기
            <Icon
              name='arrow-up-right'
              size={14}
            />
          </Link>
        </section>
        <p className={styles.privacy}>
          <span className={styles.privacyIcon}>
            <Icon
              name='lock'
              size={18}
            />
          </span>
          이 질문은 선택한 발췌와 질문 내용만 공유합니다. 답변자의 내부 검토
          메모와 운영 이력은 표시하지 않습니다.
        </p>
      </aside>
    </div>
  );
}
