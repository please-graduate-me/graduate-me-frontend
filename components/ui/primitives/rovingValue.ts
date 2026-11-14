import { Children, isValidElement, type ReactNode } from 'react';

/** 선택값이 활성 항목 중에 있으면 그 값을, 없으면 첫 활성 항목 값을 키보드 진입점으로 고른다. */
export function rovingValue(children: ReactNode, value: string) {
  const enabled = Children.toArray(children).flatMap((child) =>
    isValidElement<{ value?: string; isDisabled?: boolean }>(child) &&
    typeof child.props.value === 'string' &&
    !child.props.isDisabled
      ? [child.props.value]
      : []
  );

  return enabled.includes(value) ? value : enabled[0];
}
