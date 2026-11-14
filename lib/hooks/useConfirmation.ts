'use client';
import type { AlertDialogProps } from '@astryxdesign/core/AlertDialog';
import { useCallback, useEffect, useRef, useState } from 'react';

/** 확인 결과를 비동기로 기다려 삭제와 화면 이동을 공식 대화상자에 연결한다. */
export function useConfirmation() {
  const [request, setRequest] = useState<{
    title: string;
    description: string;
  } | null>(null);

  const pending = useRef<((accepted: boolean) => void) | null>(null);

  const finish = useCallback((accepted: boolean) => {
    pending.current?.(accepted);
    pending.current = null;
    setRequest(null);
  }, []);

  const confirm = useCallback(
    (description: string, title = '계속 진행할까요?') =>
      new Promise<boolean>((resolve) => {
        // 중복 요청과 화면 이탈 시 대기 중인 작업을 실행하지 않는다.
        pending.current?.(false);
        pending.current = resolve;
        setRequest({ title, description });
      }),
    []
  );

  useEffect(
    () => () => {
      pending.current?.(false);
      pending.current = null;
    },
    []
  );

  return {
    confirm,
    dialog: {
      isOpen: request !== null,
      title: request?.title ?? '',
      description: request?.description ?? '',
      cancelLabel: '취소',
      actionLabel: '계속 진행',
      onOpenChange: (open) => {
        if (!open) finish(false);
      },
      onAction: () => finish(true),
    } satisfies AlertDialogProps,
  };
}
