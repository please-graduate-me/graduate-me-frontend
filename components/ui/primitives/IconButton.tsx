import type { ComponentProps } from 'react';
import { Icon, type IconName } from './Icon';
import { root } from './IconButton.css';

/** 아이콘만 있는 동작에도 키보드와 스크린리더용 이름을 제공한다. */
export function IconButton({
  label,
  name,
  selected,
  className,
  ...props
}: Omit<ComponentProps<'button'>, 'children'> & {
  label: string;
  name: IconName;
  selected?: boolean;
}) {
  return (
    <button
      type='button'
      {...props}
      aria-label={label}
      title={label}
      aria-pressed={selected}
      className={[root, className].filter(Boolean).join(' ')}>
      <Icon name={name} />
    </button>
  );
}
