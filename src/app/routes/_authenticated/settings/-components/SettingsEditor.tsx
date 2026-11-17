import { useId } from 'react';
import { Text } from '@/components/ui/primitives/Text';
import { StatusDot } from '@/components/ui/primitives/StatusDot';
import type { LearningSettings } from '@/domains/users/model/settings';
import { useLearningSettings } from '../../../-components/useLearningSettings';
import * as styles from './SettingsEditor.css';
import { Switch } from '@/components/ui/primitives/Switch';
import { Select } from '@/components/ui/primitives/Select';
import { ReplayPreview } from './ReplayPreview';

/** 학습 화면과 같은 저장 규칙으로 계정 옵션을 편집한다. */
export function SettingsEditor({ initial }: { initial: LearningSettings }) {
  const { settings, saving, error, change } = useLearningSettings(initial);
  const id = useId();
  const replayOff = !settings.autoReplay;

  return (
    <fieldset
      className={styles.options}
      aria-label='내 학습 옵션'
      disabled={saving}>
      <div className={styles.row}>
        <label
          htmlFor={id + 'auto'}
          className={styles.name}>
          자동 미리듣기
        </label>
        <Switch
          id={id + 'auto'}
          size='large'
          disabled={saving}
          aria-label='자동 미리듣기'
          checked={settings.autoReplay}
          onChange={(event) =>
            void change({ ...settings, autoReplay: event.target.checked })
          }
        />
      </div>
      <div className={styles.row}>
        <label
          htmlFor={id + 'delay'}
          className={replayOff ? `${styles.name} ${styles.off}` : styles.name}>
          반복 간격
        </label>
        <Select
          id={id + 'delay'}
          aria-label='반복 간격'
          className={styles.control}
          disabled={saving || replayOff}
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
        </Select>
      </div>
      <div className={styles.row}>
        <label
          htmlFor={id + 'count'}
          className={replayOff ? `${styles.name} ${styles.off}` : styles.name}>
          추가 반복
        </label>
        <Select
          id={id + 'count'}
          aria-label='추가 반복'
          className={styles.control}
          disabled={saving || replayOff}
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
        </Select>
      </div>
      <div className={styles.row}>
        <label
          htmlFor={id + 'rate'}
          className={styles.name}>
          재생 속도
        </label>
        <Select
          id={id + 'rate'}
          aria-label='재생 속도'
          className={styles.control}
          disabled={saving}
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
        </Select>
      </div>
      <ReplayPreview settings={settings} />
      <Text
        as='p'
        display='block'
        className={styles.note}>
        처음 한 번 들은 뒤 선택한 횟수만큼 더 반복합니다.
        <br />
        일시정지를 누르면 반복도 멈춥니다.
      </Text>
      <div
        className={styles.status}
        role='status'
        aria-atomic='true'>
        <StatusDot
          variant={saving ? 'neutral' : error ? 'error' : 'success'}
          label={saving ? '저장 중' : error ? '저장 오류' : '저장 완료'}
          isPulsing={saving}
          aria-hidden='true'
        />
        <Text
          type='supporting'
          color='secondary'
          weight='semibold'>
          {saving ? '옵션 저장 중…' : error || '계정에 저장됨'}
        </Text>
      </div>
    </fieldset>
  );
}
