import * as styles from '@/lib/styles/button.css';

/** 버튼과 버튼 모양 링크가 함께 받는 외형 선택지다. */
export type ButtonAppearance = {
  variant?: keyof typeof styles.variant;
  size?: keyof typeof styles.size;
  shape?: 'pill' | 'rounded';
  pressedTone?: 'accent' | 'ink';
  hasPressedPop?: boolean;
};

/** 크기 단계마다 글자 높이에 맞춘 아이콘 크기다. */
export const buttonIconSize = {
  small: 16,
  medium: 18,
  comfortable: 18,
  prominent: 20,
  large: 20,
} satisfies Record<keyof typeof styles.size, number>;

/** 외형 선택지를 공통 버튼 스타일 클래스 목록으로 바꾼다. */
export function buttonClassName({
  variant = 'primary',
  size = 'medium',
  shape = 'pill',
  pressedTone = 'accent',
  hasPressedPop = false,
  className,
}: ButtonAppearance & { className?: string }) {
  return [
    styles.base,
    styles.variant[variant],
    styles.size[size],
    shape === 'rounded' && styles.rounded,
    pressedTone === 'ink' && styles.pressedInk,
    hasPressedPop && styles.pressedPop,
    className,
  ]
    .filter(Boolean)
    .join(' ');
}
