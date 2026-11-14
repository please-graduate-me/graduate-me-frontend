import * as styles from './QuestionIllustration.css';

/** 구절을 질문하고 조교 답변을 받는 흐름을 말풍선으로 그린다. */
export function QuestionIllustration() {
  return (
    <div
      aria-hidden='true'
      className={styles.root}>
      <span className={styles.question}>happen to 는 왜 넣나요?</span>
      <span className={styles.answer}>“혹시” 라는 뉘앙스를 더해요</span>
      <span className={styles.tag}>조교 답변</span>
    </div>
  );
}
