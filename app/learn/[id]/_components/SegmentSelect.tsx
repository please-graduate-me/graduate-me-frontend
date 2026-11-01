import type {
  Mode,
  Segment,
  SegmentState,
} from '@/domains/videos/model/contracts';
import * as styles from './SegmentSelect.css';

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
  mode,
  index,
  disabled,
  onNavigate,
}: {
  segments: Segment[];
  states: SegmentState[];
  mode: Mode;
  index: number;
  disabled: boolean;
  onNavigate: (index: number) => void;
}) {
  const statuses = new Map(
    states
      .filter((state) => state.mode === mode)
      .map((state) => [state.segmentId, state.status])
  );
  return (
    <div className={styles.container}>
      <label className={styles.label}>
        구절 바로 이동
        <select
          className={styles.select}
          value={index < segments.length ? index : ''}
          disabled={disabled || segments.length === 0}
          onChange={(event) => onNavigate(Number(event.target.value))}>
          <option
            value=''
            disabled>
            복습할 구절 선택
          </option>
          {segments.map((segment, position) => {
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
              </option>
            );
          })}
        </select>
      </label>
      <p className={styles.description}>
        선택한 구절의 시작으로 이동합니다. 이동만으로 정답 처리되지는 않습니다.
      </p>
    </div>
  );
}
