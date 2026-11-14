import { Text } from '@/components/ui/primitives/Text';
import * as styles from './MethodStrip.css';

const methods = [
  { label: 'PDF 읽기', shape: 'pdf' },
  { label: '영상 받아쓰기', shape: 'video' },
  { label: '빈칸 채우기', shape: 'blank' },
  { label: '조교 Q&A', shape: 'question' },
  { label: '표현집 복습', shape: 'review' },
] as const;

/** 서비스에서 할 수 있는 학습 방식을 색 도형과 함께 한 줄로 보여준다. */
export function MethodStrip() {
  return (
    <ul className={styles.root}>
      {methods.map((method) => (
        <li
          key={method.shape}
          className={styles.item}>
          <span
            aria-hidden='true'
            className={styles.shapes[method.shape]}
          />
          <Text
            size='sm'
            weight='bold'>
            {method.label}
          </Text>
        </li>
      ))}
    </ul>
  );
}
