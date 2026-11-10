import { Checkbox } from '@/components/ui/primitives/Checkbox';
import type {
  Mode,
  Segment,
  SegmentState,
} from '@/domains/videos/model/contracts';
import * as styles from './SegmentSelect.css';
import { useState } from 'react';

function formatTime(seconds: number) {
  const wholeSeconds = Math.floor(seconds);

  return `${Math.floor(wholeSeconds / 60)
    .toString()
    .padStart(2, '0')}:${(wholeSeconds % 60).toString().padStart(2, '0')}`;
}

/** 정답을 노출하지 않고 시간과 현재 모드의 상태로 복습할 구절을 찾게 한다. */
export function SegmentSelect({
  segments,
  states,
  difficultSegmentIds,
  mode,
  index,
  disabled,
  onNavigate,
}: {
  segments: Segment[];
  states: SegmentState[];
  difficultSegmentIds: string[];
  mode: Mode;
  index: number;
  disabled: boolean;
  onNavigate: (index: number) => void;
}) {
  const [onlyDifficult, setOnlyDifficult] = useState(false);

  const options = segments
    .map((segment, position) => ({ segment, position }))
    .filter(
      ({ segment }) =>
        !onlyDifficult || difficultSegmentIds.includes(segment.id)
    );

  const statuses = new Map(
    states
      .filter((state) => state.mode === mode)
      .map((state) => [state.segmentId, state.status])
  );

  return (
    <div className={styles.container}>
      <label className={styles.label}>
        <Checkbox
          checked={onlyDifficult}
          onChange={(event) => setOnlyDifficult(event.target.checked)}
        />
        안 들리는 구절만 보기 ({difficultSegmentIds.length}개)
      </label>
      <label className={styles.label}>
        구절 바로 이동
        <select
          className={styles.select}
          value={options.some((item) => item.position === index) ? index : ''}
          disabled={disabled || options.length === 0}
          onChange={(event) => onNavigate(Number(event.target.value))}>
          <option
            value=''
            disabled>
            복습할 구절 선택
          </option>
          {options.map(({ segment, position }) => {
            const status = statuses.get(segment.id);

            const label =
              status === 'correct'
                ? '정답'
                : status === 'skipped'
                  ? '건너뛰기'
                  : '미완료';

            return (
              <option
                key={segment.id}
                value={position}>
                구절 {position + 1} · {formatTime(segment.start)} · {label}
                {difficultSegmentIds.includes(segment.id) ? ' · 안 들림' : ''}
              </option>
            );
          })}
        </select>
      </label>
      {onlyDifficult && options.length === 0 && (
        <p className={styles.description}>
          안 들리는 구절로 표시한 문장이 없습니다.
        </p>
      )}
      <p className={styles.description}>
        선택한 구절의 시작으로 이동합니다. 이동만으로 정답 처리되지는 않습니다.
      </p>
    </div>
  );
}
