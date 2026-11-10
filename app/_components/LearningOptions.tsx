import { Checkbox } from '@/components/ui/primitives/Checkbox';
import type { LearningSettings } from '@/domains/users/model/settings';
import * as styles from './LearningOptions.css';

/** 다른 영상에서도 유지되는 계정 옵션임을 학습 화면에서 알린다. */
export function LearningOptions({
  settings,
  temporary = false,
  saving,
  error,
  actualRate = 1,
  ready = false,
  onChange,
}: {
  settings: LearningSettings;
  temporary?: boolean;
  saving: boolean;
  error: string;
  actualRate?: number;
  ready?: boolean;
  onChange: (settings: LearningSettings) => void;
}) {
  return (
    <fieldset
      className={styles.container}
      disabled={saving}>
      <legend>내 학습 옵션</legend>
      <label className={styles.control}>
        <Checkbox
          checked={settings.autoReplay}
          onChange={(event) =>
            onChange({ ...settings, autoReplay: event.target.checked })
          }
        />
        자동 미리듣기
      </label>
      <div className={styles.controls}>
        <label className={styles.control}>
          반복 간격
          <select
            disabled={!settings.autoReplay}
            value={settings.replayDelay}
            onChange={(event) =>
              onChange({ ...settings, replayDelay: Number(event.target.value) })
            }>
            {Array.from({ length: 10 }, (_, index) => index + 1).map(
              (seconds) => (
                <option
                  key={seconds}
                  value={seconds}>
                  {seconds}초
                </option>
              )
            )}
          </select>
        </label>
        <label className={styles.control}>
          추가 반복
          <select
            disabled={!settings.autoReplay}
            value={settings.replayCount ?? 'unlimited'}
            onChange={(event) =>
              onChange({
                ...settings,
                replayCount:
                  event.target.value === 'unlimited'
                    ? null
                    : Number(event.target.value),
              })
            }>
            <option value='unlimited'>계속 반복</option>
            {Array.from({ length: 10 }, (_, index) => index + 1).map(
              (count) => (
                <option
                  key={count}
                  value={count}>
                  {count}회
                </option>
              )
            )}
          </select>
        </label>
        <label className={styles.control}>
          재생 속도
          <select
            value={settings.playbackRate}
            onChange={(event) =>
              onChange({
                ...settings,
                playbackRate: Number(
                  event.target.value
                ) as LearningSettings['playbackRate'],
              })
            }>
            {([0.5, 0.75, 1, 1.25, 1.5] as const).map((rate) => (
              <option
                key={rate}
                value={rate}>
                {rate}배{rate === 1 ? ' (기본)' : ''}
              </option>
            ))}
          </select>
        </label>
      </div>
      <p className={styles.description}>
        처음 한 번 들은 뒤 선택한 횟수만큼 더 반복합니다. 일시정지를 누르면
        반복도 멈춥니다.{' '}
        {temporary
          ? '체험을 마치면 설정이 초기화됩니다.'
          : '이 설정은 다른 영상에도 적용됩니다.'}
      </p>
      {ready && actualRate !== settings.playbackRate && (
        <p className={styles.description}>
          현재 플레이어는 {actualRate}배속입니다. 선택한 속도를 지원하지 않거나
          적용 중일 수 있습니다.
        </p>
      )}
      <p
        className={styles.description}
        role='status'>
        {saving
          ? '옵션 저장 중…'
          : error || (temporary ? '체험 중에만 적용됨' : '계정에 저장됨')}
      </p>
    </fieldset>
  );
}
