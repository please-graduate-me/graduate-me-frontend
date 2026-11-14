import { Children, isValidElement, type ReactNode } from 'react';

/** 아이콘과 텍스트가 섞인 기존 동작에서 Astryx 접근성 이름을 추출한다. */
export function contentLabel(children: ReactNode): string {
  return Children.toArray(children)
    .map((child): string => {
      if (typeof child === 'string' || typeof child === 'number')
        return String(child);
      if (isValidElement<{ children?: ReactNode }>(child))
        return contentLabel(child.props.children);

      return '';
    })
    .join(' ')
    .trim();
}
