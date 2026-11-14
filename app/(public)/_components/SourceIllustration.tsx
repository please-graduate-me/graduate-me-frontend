import * as styles from './SourceIllustration.css';

/** 학습 자료가 PDF와 영상에서 시작된다는 것을 단순한 도형으로 그린다. */
export function SourceIllustration() {
  return (
    <div
      aria-hidden='true'
      className={styles.root}>
      <svg
        className={styles.shape}
        width='120'
        height='140'
        viewBox='0 0 120 140'>
        <rect
          x='30'
          y='0'
          width='86'
          height='112'
          rx='14'
          fill='#C9C2FB'
        />
        <rect
          x='10'
          y='20'
          width='86'
          height='112'
          rx='14'
          fill='#8B7CF6'
        />
        <rect
          x='26'
          y='48'
          width='48'
          height='8'
          rx='4'
          fill='#FFFFFF'
        />
        <rect
          x='26'
          y='66'
          width='36'
          height='8'
          rx='4'
          fill='#FFFFFF'
        />
        <rect
          x='26'
          y='84'
          width='44'
          height='8'
          rx='4'
          fill='#FFFFFF'
        />
      </svg>
      <svg
        className={styles.shape}
        width='140'
        height='100'
        viewBox='0 0 140 100'>
        <rect
          width='140'
          height='96'
          rx='18'
          fill='#16181D'
        />
        <path
          d='M58 28v40l32-20-32-20z'
          fill='#12A47F'
        />
      </svg>
    </div>
  );
}
