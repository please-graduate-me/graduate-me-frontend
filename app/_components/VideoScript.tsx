'use client';
import type { SourceInput } from '@/domains/materials/model/source';
import { useState } from 'react';
import type {
  Mode,
  Segment,
  SegmentState,
} from '@/domains/videos/model/contracts';
import { Icon } from '@/components/ui/primitives/Icon';
import { Input } from '@/components/ui/primitives/Input';
import { Badge } from '@/components/ui/primitives/Badge';
import { SourceActions } from './SourceActions';
import * as styles from './VideoScript.css';

/** 확인한 스크립트와 원문 출처를 영상 오른쪽에서 연결한다. */
export function VideoScript({
  selection: initialSelection,
  segments,
  states,
  index,
  mode,
  busy,
  videoId,
  demo,
  language = 'en',
  scriptViewed = false,
  onNavigate,
}: {
  segments: Segment[];
  states: SegmentState[];
  index: number;
  mode: Mode;
  busy: boolean;
  videoId: string;
  demo: boolean;
  language?: 'en' | 'th';
  scriptViewed?: boolean;
  selection?: SourceInput;
  onNavigate: (index: number) => void;
}) {
  const [query, setQuery] = useState('');

  const [selection, setSelection] = useState<{
    id: string;
    quote: string;
  } | null>(
    initialSelection?.kind === 'video'
      ? { id: initialSelection.segmentId, quote: initialSelection.quote }
      : null
  );

  const segment = segments[index];

  const selectedQuote =
    selection?.id === segment?.id ? selection.quote : segment?.text;

  function selectQuote(event: React.SyntheticEvent<HTMLParagraphElement>) {
    const selected = window.getSelection();

    if (
      !segment ||
      !selected ||
      !event.currentTarget.contains(selected.anchorNode) ||
      !event.currentTarget.contains(selected.focusNode)
    )
      return;
    const quote = selected.toString().trim();

    if (quote) setSelection({ id: segment.id, quote: quote.slice(0, 5000) });
  }

  const visible = (id: string) =>
    scriptViewed ||
    states.some(
      (state) =>
        state.segmentId === id && (state.revealed || state.status === 'correct')
    );

  return (
    <aside
      className={styles.sidebar}
      aria-label='영상 스크립트와 구절 탐색'>
      <div className={styles.heading}>
        <h2>스크립트</h2>
        <Icon
          name='search'
          size={18}
        />
      </div>
      <Input
        aria-label='확인한 스크립트 검색'
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder='확인한 구절에서 찾기'
      />
      <p className={styles.description}>
        정답을 확인하거나 맞힌 문장만 표시됩니다.
      </p>
      <ol className={styles.list}>
        {segments
          .map((item, position) => ({ item, position }))
          .filter(
            ({ item }) =>
              !query.trim() ||
              (visible(item.id) &&
                item.text.toLowerCase().includes(query.toLowerCase()))
          )
          .map(({ item, position }) => (
            <li key={item.id}>
              <button
                type='button'
                className={styles.item}
                aria-current={index === position ? 'step' : undefined}
                disabled={busy}
                onClick={() => onNavigate(position)}>
                <time className={styles.time}>
                  {Math.floor(item.start / 60)}:
                  {String(Math.floor(item.start % 60)).padStart(2, '0')}
                </time>
                <p className={styles.text}>
                  {visible(item.id)
                    ? item.text
                    : `구절 ${position + 1} · 아직 확인하지 않은 문장`}
                </p>
                {visible(item.id) && item.translation && (
                  <p className={styles.description}>{item.translation}</p>
                )}
                {states.some(
                  (state) =>
                    state.segmentId === item.id &&
                    state.mode === mode &&
                    state.status === 'correct'
                ) && <Badge tone='success'>받아쓰기 완료</Badge>}
              </button>
            </li>
          ))}
      </ol>
      {segment && visible(segment.id) && !demo && (
        <div className={styles.actions}>
          <p className={styles.description}>
            단어나 여러 단어 표현을 선택해 문맥의 뜻을 살펴보세요.
          </p>
          <p
            className={styles.selectable}
            tabIndex={0}
            onPointerUp={selectQuote}
            onKeyUp={selectQuote}>
            {segment.text}
          </p>
          {selectedQuote !== segment.text && (
            <p className={styles.description}>
              선택한 표현: {selectedQuote}{' '}
              <button
                type='button'
                onClick={() => setSelection(null)}>
                문장 전체로
              </button>
            </p>
          )}
          <SourceActions
            key={`${segment.id}:${selectedQuote}`}
            source={{
              kind: 'video',
              videoId,
              segmentId: segment.id,
              quote: selectedQuote ?? segment.text,
              version: segment.version ?? 1,
            }}
            language={language}
          />
        </div>
      )}
      {segment && !visible(segment.id) && (
        <p className={styles.description}>
          정답을 확인한 뒤 표현 저장과 구절 질문을 사용할 수 있어요.
        </p>
      )}
      {demo && (
        <p className={styles.description}>
          로그인한 뒤 개인 표현집과 도우미 질문을 사용할 수 있어요.
        </p>
      )}
    </aside>
  );
}
