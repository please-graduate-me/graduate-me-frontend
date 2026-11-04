'use client';
import type { LearningSettings } from '@/domains/users/model/settings';
import { useLearningSettings } from '../../../_components/useLearningSettings';
import * as styles from './SettingsEditor.css';

/** 학습 화면과 같은 저장 규칙으로 계정 옵션을 편집한다. */
export function SettingsEditor({ initial }: { initial: LearningSettings }) {
  const { settings, saving, error, change } = useLearningSettings(initial);

  return (
    <fieldset
      className={styles.options}
      aria-label='내 학습 옵션'
      disabled={saving}>
      <label className={styles.row}>
        <span className={styles.name}>자동 미리듣기</span>
        <input
          className={styles.toggle}
          aria-label='자동 미리듣기'
          type='checkbox'
          checked={settings.autoReplay}
          onChange={(event) =>
            void change({ ...settings, autoReplay: event.target.checked })
          }
        />
      </label>
      <label className={styles.row}>
        <span className={styles.name}>반복 간격</span>
        <select
          disabled={!settings.autoReplay}
          value={settings.replayDelay}
          onChange={(event) =>
            void change({
              ...settings,
              replayDelay: Number(event.target.value),
            })
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
      <label className={styles.row}>
        <span className={styles.name}>추가 반복</span>
        <select
          disabled={!settings.autoReplay}
          value={settings.replayCount ?? 'unlimited'}
          onChange={(event) =>
            void change({
              ...settings,
              replayCount:
                event.target.value === 'unlimited'
                  ? null
                  : Number(event.target.value),
            })
          }>
          <option value='unlimited'>계속 반복</option>
          {Array.from({ length: 10 }, (_, index) => index + 1).map((count) => (
            <option
              key={count}
              value={count}>
              {count}회
            </option>
          ))}
        </select>
      </label>
      <label className={styles.row}>
        <span className={styles.name}>재생 속도</span>
        <select
          value={settings.playbackRate}
          onChange={(event) =>
            void change({
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
      <p className={styles.note}>
        처음 한 번 들은 뒤 선택한 횟수만큼 더 반복합니다.
        <br />
        일시정지를 누르면 반복도 멈춥니다.
      </p>
      <p
        className={styles.status}
        role='status'
        data-state={saving ? 'saving' : error ? 'error' : 'saved'}>
        {saving ? '옵션 저장 중…' : error || '계정에 저장됨'}
      </p>
    </fieldset>
  );
}
