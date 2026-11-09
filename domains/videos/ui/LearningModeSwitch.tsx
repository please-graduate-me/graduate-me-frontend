import type { Mode } from '../model/mode';
import * as styles from './LearningModeSwitch.css';

/** 동일한 학습 방식을 체험과 개인 학습에서 같은 위치와 조작으로 제공한다. */
export function LearningModeSwitch({
  mode,
  disabled = false,
  onChange,
  blankAvailable = true,
}: {
  mode: Mode;
  disabled?: boolean;
  onChange: (mode: Mode) => void;
  blankAvailable?: boolean;
}) {
  return (
    <div
      className={styles.root}
      role='group'
      aria-label='학습 방식'>
      <button
        type='button'
        className={styles.option}
        aria-pressed={mode === 'full'}
        disabled={disabled}
        onClick={() => onChange('full')}>
        문장 전체
      </button>
      <button
        type='button'
        className={styles.option}
        aria-pressed={mode === 'blank'}
        disabled={disabled || !blankAvailable}
        onClick={() => onChange('blank')}>
        빈칸 채우기
      </button>
    </div>
  );
}
