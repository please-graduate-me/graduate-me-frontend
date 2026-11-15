import * as styles from './BlankIllustration.css';

const tiles = ['excuses', 'changes', 'menus'] as const;

/** 밑줄 빈칸 문장과 보기 단어 타일로 빈칸 채우기 풀이 장면을 그린다. */
export function BlankIllustration() {
  return (
    <div
      aria-hidden='true'
      className={styles.root}>
      <p className={styles.sentence}>
        lead to big <span className={styles.blank}>changes</span>
      </p>
      <div className={styles.tiles}>
        {tiles.map((tile) => (
          <span
            key={tile}
            className={
              tile === 'changes'
                ? `${styles.tile} ${styles.tileCorrect}`
                : styles.tile
            }>
            {tile}
          </span>
        ))}
      </div>
    </div>
  );
}
