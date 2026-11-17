import { useLinkProps } from '@tanstack/react-router';
import type { ComponentProps } from 'react';

/** 기존 href 계약을 유지하며 내부 이동을 앱 라우터에 연결한다. */
export function RouterAnchor({ href = '', ...props }: ComponentProps<'a'>) {
  const internal = href.startsWith('/') && !href.startsWith('//');

  const link = useLinkProps({ ...props, to: href, href, disabled: !internal });

  return (
    <a
      {...props}
      {...(internal ? link : {})}
      href={href}
    />
  );
}
