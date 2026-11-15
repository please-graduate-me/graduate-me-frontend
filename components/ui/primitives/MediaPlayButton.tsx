import type { ComponentProps } from 'react';
import { Icon } from './Icon';
import * as styles from './MediaPlayButton.css';

/** 영상 포스터 가운데에서 실제 재생을 시작하는 큰 원형 버튼이며 이름은 접근성 이름으로만 제공한다. */
export function MediaPlayButton({
  label,
  className,
  ...props
}: Omit<ComponentProps<'button'>, 'children' | 'type'> & { label: string }) {
  return (
    <button
      {...props}
      type='button'
      aria-label={label}
      className={[styles.root, className].filter(Boolean).join(' ')}>
      <Icon
        name='play'
        size={30}
      />
    </button>
  );
}
