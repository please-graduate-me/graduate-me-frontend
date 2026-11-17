import { assignInlineVars } from '@vanilla-extract/dynamic';
import { useEffect, useEffectEvent, useRef, type ReactNode } from 'react';
import * as styles from './Modal.css';

const firstField =
  'input:not([type="hidden"]):not(:disabled), textarea:not(:disabled), select:not(:disabled)';

/** 네이티브 모달에 포커스 가두기와 배경 비활성화를 맡기고 닫기 요청만 상위에 알린다. */
export function Modal({
  open,
  onCancel,
  role,
  labelledBy,
  describedBy,
  width = 640,
  className,
  children,
}: {
  open: boolean;
  onCancel: () => void;
  role?: 'alertdialog';
  labelledBy: string;
  describedBy?: string;
  width?: number;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const cancel = useEffectEvent(onCancel);

  useEffect(() => {
    const dialog = ref.current;

    if (!open || !dialog) return;
    let active = true;

    // 닫은 뒤 모달을 연 조작으로 포커스를 돌려보내 키보드 위치를 잃지 않게 한다.
    const previous =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    // 입력 중 닫힘을 막을 수 있도록 Escape는 상위의 닫기 판단에 맡긴다.
    const handleCancel = (event: Event) => {
      event.preventDefault();
      cancel();
    };

    // 브라우저가 Escape 반복으로 강제로 닫았는데 상위가 열림을 유지하면 다시 연다.
    const handleClose = () => {
      cancel();

      requestAnimationFrame(() => {
        if (active && !dialog.open && dialog.isConnected) dialog.showModal();
      });
    };

    dialog.addEventListener('cancel', handleCancel);
    dialog.addEventListener('close', handleClose);
    if (!dialog.open) dialog.showModal();

    // React의 autoFocus는 모달이 보이기 전에 실행되므로 연 뒤에 직접 초점을 옮긴다.
    (
      dialog.querySelector<HTMLElement>('[data-autofocus]') ??
      dialog.querySelector<HTMLElement>(firstField)
    )?.focus();

    return () => {
      active = false;
      dialog.removeEventListener('cancel', handleCancel);
      dialog.removeEventListener('close', handleClose);
      if (dialog.open) dialog.close();
      if (previous?.isConnected) previous.focus();
    };
  }, [open]);

  return (
    <dialog
      ref={ref}
      role={role}
      aria-modal={role === 'alertdialog' ? true : undefined}
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      className={[styles.dialog, className].filter(Boolean).join(' ')}
      style={assignInlineVars({ [styles.width]: `${width}px` })}>
      {open && children}
    </dialog>
  );
}
