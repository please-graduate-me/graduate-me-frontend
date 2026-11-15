'use client';
import { contentLabel } from '@/components/ui/primitives/contentLabel';
import { Blockquote } from '@/components/ui/primitives/Blockquote';
import { Button } from '@/components/ui/primitives/Button';
import { ButtonLink } from '@/components/ui/primitives/ButtonLink';
import { Icon } from '@/components/ui/primitives/Icon';
import { InlineBlank } from '@/components/ui/primitives/InlineBlank';
import { TextArea } from '@/components/ui/primitives/TextArea';
import type { Assignment } from '@/domains/courses/model/contracts';
import * as styles from './AssignmentTask.css';

/** 구간 시각을 분:초로 표시한다. */
const clock = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;

/** 과제 구절 하나를 원본 듣기, 힌트와 풀이 방식에 맞는 답안 입력으로 표시한다. */
export function AssignmentTask({
  value,
  task,
  index,
  answer,
  onAnswer,
  disabled,
  listening,
  onListen,
  hint,
  onHint,
  canHint,
  busy,
}: {
  value: Assignment;
  task: Assignment['source']['tasks'][number];
  index: number;
  answer: string | string[] | undefined;
  onAnswer: (answer: string | string[]) => void;
  disabled: boolean;
  listening: boolean;
  onListen: () => void;
  hint?: string;
  onHint: () => void;
  canHint: boolean;
  busy: boolean;
}) {
  const headingId = `assignment-task-${task.id}`;
  const isVideo = value.source.kind === 'video';
  const start = task.start ?? 0;
  const end = task.end ?? start;

  // 영상 전체 길이는 응답에 없어 과제 구간 전체를 막대 기준으로 삼아 이 구절의 위치를 보인다.
  const rangeStart = Math.min(
    ...value.source.tasks.map((item) => item.start ?? 0)
  );

  const rangeEnd = Math.max(
    ...value.source.tasks.map((item) => item.end ?? item.start ?? 0)
  );

  const span = Math.max(rangeEnd - rangeStart, 0.001);

  return (
    <section
      aria-labelledby={headingId}
      className={styles.task}>
      <h2
        id={headingId}
        className={styles.heading}>
        {index + 1}.{' '}
        {value.mode === 'reading'
          ? `${task.page}페이지 읽기`
          : `${task.start?.toFixed(1)}초 ~ ${task.end?.toFixed(1)}초`}
      </h2>
      {isVideo && value.source.youtubeId && listening && (
        <div className={styles.playerBox}>
          <iframe
            className={styles.player}
            src={`https://www.youtube.com/embed/${encodeURIComponent(value.source.youtubeId)}?start=${Math.floor(start)}&end=${Math.ceil(end)}`}
            title={`${index + 1}번 과제 원본 영상`}
            allow='encrypted-media; picture-in-picture'
            allowFullScreen
          />
          <p
            className={styles.range}
            aria-label={`재생 구간 ${clock(start)}부터 ${clock(end)}까지`}>
            <span aria-hidden='true'>{clock(start)}</span>
            <span
              aria-hidden='true'
              className={styles.track}>
              <span
                className={styles.segment}
                // 구절 위치와 길이는 과제마다 달라 실행 중 계산한 비율을 인라인으로 넘긴다.
                style={{
                  left: `${((start - rangeStart) / span) * 100}%`,
                  width: `${Math.max(((end - start) / span) * 100, 2)}%`,
                }}
              />
            </span>
            <span aria-hidden='true'>{clock(end)}</span>
          </p>
        </div>
      )}
      {(isVideo || canHint) && (
        <div className={styles.actions}>
          {isVideo && (
            <Button
              type='button'
              variant='soft'
              aria-pressed={listening}
              startIcon='volume-2'
              onClick={onListen}>
              이 구절 음성 듣기
            </Button>
          )}
          {canHint && (
            <Button
              type='button'
              variant='dashed'
              disabled={busy}
              onClick={onHint}>
              <Icon
                name='lightbulb'
                size={18}
                className={styles.hintIcon}
              />
              힌트 확인 · 사용 기록됨
            </Button>
          )}
        </div>
      )}
      {hint && (
        <div
          role='status'
          className={styles.hint}>
          <span className={styles.hintLabel}>힌트</span>
          <span className={styles.hintText}>{hint}</span>
        </div>
      )}
      {value.mode === 'reading' && (
        <>
          <Blockquote className={styles.quote}>{task.text}</Blockquote>
          <ButtonLink
            href={`/materials/${encodeURIComponent(value.source.id)}?page=${task.page}&version=${task.version}`}
            variant='ghost'
            className={styles.source}>
            원본 PDF 페이지 열기
            <Icon
              name='arrow-up-right'
              size={16}
            />
          </ButtonLink>
        </>
      )}
      {value.mode === 'blank' ? (
        <p className={styles.sentence}>
          {task.units.map((unit, position) =>
            unit === null ? (
              <InlineBlank
                key={position}
                className={styles.blank}
                label={`${index + 1}번 구절 ${task.blanks.indexOf(position) + 1}번 빈칸`}
                disabled={disabled}
                value={
                  Array.isArray(answer)
                    ? (answer[task.blanks.indexOf(position)] ?? '')
                    : ''
                }
                onChange={(event) => {
                  const next = Array.isArray(answer)
                    ? [...answer]
                    : task.blanks.map(() => '');

                  next[task.blanks.indexOf(position)] = event.target.value;
                  onAnswer(next);
                }}
              />
            ) : (
              <span
                key={position}
                className={styles.word}>
                {unit}
              </span>
            )
          )}
        </p>
      ) : (
        <TextArea
          label={contentLabel(
            <>
              {value.mode === 'reading' ? '읽고 이해한 내용' : '들은 전체 문장'}
            </>
          )}
          disabled={disabled}
          maxLength={10000}
          value={typeof answer === 'string' ? answer : ''}
          onChange={(event) => onAnswer(event.target.value)}
        />
      )}
    </section>
  );
}
