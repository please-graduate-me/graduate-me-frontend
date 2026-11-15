'use client';
import {
  Children,
  isValidElement,
  useId,
  useState,
  type ComponentProps,
  type ReactNode,
} from 'react';
import * as fieldStyles from '@/lib/styles/field.css';
import { contentLabel } from './contentLabel';
import { FieldLabel } from './FieldLabel';
import { Icon } from './Icon';
import * as styles from './Select.css';

/** 선언한 option 중 첫 값을 찾아 초기값이 없을 때 제출할 값으로 쓴다. */
function firstOption(children: ReactNode): string | undefined {
  for (const child of Children.toArray(children)) {
    if (
      !isValidElement<{
        children?: ReactNode;
        value?: string | number;
      }>(child)
    )
      continue;

    if (child.type === 'option')
      return String(child.props.value ?? contentLabel(child.props.children));
    const nested = firstOption(child.props.children);

    if (nested !== undefined) return nested;
  }

  return undefined;
}

/** 네이티브 select에 라벨과 화살표 외형을 붙이고 초기값만 받은 선택도 제어 상태로 유지한다. */
export function Select({
  id,
  children,
  value,
  defaultValue,
  onChange,
  className,
  style,
  label,
  labelSize,
  hasRequiredTag,
  ...props
}: Pick<
  ComponentProps<'select'>,
  | 'id'
  | 'children'
  | 'value'
  | 'defaultValue'
  | 'disabled'
  | 'required'
  | 'name'
  | 'className'
  | 'style'
  | 'aria-label'
> & {
  label?: string;
  labelSize?: 'medium' | 'large';
  hasRequiredTag?: boolean;
  onChange?: (event: {
    target: { value: string };
    currentTarget: { value: string };
  }) => void;
}) {
  const generatedId = useId();
  const selectId = id ?? generatedId;

  const [draft, setDraft] = useState(
    String(defaultValue ?? firstOption(children) ?? '')
  );

  return (
    <div
      className={[fieldStyles.field, className].filter(Boolean).join(' ')}
      style={style}>
      {label && (
        <FieldLabel
          htmlFor={selectId}
          size={labelSize}
          hasRequiredTag={hasRequiredTag}>
          {label}
        </FieldLabel>
      )}
      <div className={styles.box}>
        <select
          {...props}
          id={selectId}
          aria-label={
            label ? undefined : (props['aria-label'] ?? props.name ?? '선택')
          }
          className={`${fieldStyles.control} ${styles.select}`}
          value={String(value ?? draft)}
          onChange={(event) => {
            setDraft(event.target.value);
            onChange?.(event);
          }}>
          {children}
        </select>
        <Icon
          name='chevron-down'
          size={18}
          className={styles.chevron}
        />
      </div>
    </div>
  );
}
