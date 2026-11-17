import type { AlertDialogProps } from '@/components/ui/composites/AlertDialog';
import { useCallback, useEffect, useRef, useState } from 'react';

/** 확인 요청마다 바꿀 수 있는 대상 상세, 아이콘, 실행 버튼 문구와 색이다. */
export type ConfirmationOptions = Pick<
  AlertDialogProps,
  'detail' | 'icon' | 'actionLabel' | 'actionVariant'
>;

/** 확인 결과를 비동기로 기다려 삭제와 화면 이동을 확인 대화상자에 연결한다. */
export function useConfirmation() {
  const [request, setRequest] = useState<
    | ({
        title: string;
        description: string;
      } & Partial<ConfirmationOptions>)
    | null
  >(null);

  const pending = useRef<((accepted: boolean) => void) | null>(null);

  const finish = useCallback((accepted: boolean) => {
    pending.current?.(accepted);
    pending.current = null;
    setRequest(null);
  }, []);

  const confirm = useCallback(
    (
      description: string,
      title = '계속 진행할까요?',
      options: Partial<ConfirmationOptions> = {}
    ) =>
      new Promise<boolean>((resolve) => {
        // 중복 요청과 화면 이탈 시 대기 중인 작업을 실행하지 않는다.
        pending.current?.(false);
        pending.current = resolve;
        setRequest({ ...options, title, description });
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
      detail: request?.detail,
      icon: request?.icon,
      cancelLabel: '취소',
      actionLabel: request?.actionLabel ?? '계속 진행',
      actionVariant: request?.actionVariant,
      onOpenChange: (open) => {
        if (!open) finish(false);
      },
      onAction: () => finish(true),
    } satisfies AlertDialogProps,
  };
}
