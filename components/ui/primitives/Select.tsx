'use client';
import { Selector } from '@astryxdesign/core/Selector';
import {
  Children,
  isValidElement,
  useState,
  type ComponentProps,
  type ReactNode,
} from 'react';
import { contentLabel } from './contentLabel';

type Option = { value: string; label: string; isDisabled?: boolean };

function collectOptions(children: ReactNode): Option[] {
  return Children.toArray(children).flatMap((child): Option[] => {
    if (
      !isValidElement<{
        children?: ReactNode;
        value?: string | number;
        disabled?: boolean;
      }>(child)
    )
      return [];

    if (child.type === 'option') {
      const label = contentLabel(child.props.children);

      return [
        {
          value: String(child.props.value ?? label),
          label,
          isDisabled: child.props.disabled,
        },
      ];
    }

    return collectOptions(child.props.children);
  });
}

/** 네이티브 옵션 선언과 폼 이름을 Astryx 선택 목록으로 변환한다. */
export function Select({
  children,
  value,
  defaultValue,
  onChange,
  disabled,
  required,
  name,
  className,
  style,
  label,
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
  onChange?: (event: {
    target: { value: string };
    currentTarget: { value: string };
  }) => void;
}) {
  const options = collectOptions(children);

  const [draft, setDraft] = useState(
    String(defaultValue ?? options[0]?.value ?? '')
  );

  return (
    <Selector
      {...props}
      label={label ?? props['aria-label'] ?? name ?? '선택'}
      isLabelHidden={!label}
      htmlName={name}
      isDisabled={disabled}
      isRequired={required}
      containerClassName={className}
      containerStyle={style}
      options={options}
      value={String(value ?? draft)}
      onChange={(next) => {
        setDraft(next);
        const target = { value: next };

        onChange?.({ target, currentTarget: target });
      }}
    />
  );
}
