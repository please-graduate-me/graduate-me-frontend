import { Children, isValidElement, type ReactNode } from 'react';

/** 아이콘과 텍스트가 섞인 내용에서 접근성 이름으로 쓸 글자만 추출한다. */
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
