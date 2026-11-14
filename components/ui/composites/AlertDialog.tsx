'use client';
import { useId } from 'react';
import { Button } from '../primitives/Button';
import * as styles from './AlertDialog.css';
import { Modal } from './Modal';

/** 확인 대화상자의 열림, 문구, 실행 계약이다. */
export type AlertDialogProps = {
  isOpen: boolean;
  title: string;
  description?: string;
  cancelLabel?: string;
  actionLabel: string;
  actionVariant?: 'primary' | 'ink' | 'danger';
  isActionLoading?: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onAction: () => void;
};

/** 되돌릴 수 없는 작업 전에 취소를 기본 초점으로 두고 확인을 받는 모달이다. */
export function AlertDialog({
  isOpen,
  title,
  description,
  cancelLabel = '취소',
  actionLabel,
  actionVariant = 'danger',
  isActionLoading = false,
  onOpenChange,
  onAction,
}: AlertDialogProps) {
  const titleId = useId();
  const descriptionId = useId();

  return (
    <Modal
      open={isOpen}
      role='alertdialog'
      width={400}
      onCancel={() => onOpenChange(false)}
      labelledBy={titleId}
      describedBy={description ? descriptionId : undefined}>
      <div className={styles.body}>
        <h2
          id={titleId}
          className={styles.title}>
          {title}
        </h2>
        {description && (
          <p
            id={descriptionId}
            className={styles.description}>
            {description}
          </p>
        )}
      </div>
      <div className={styles.actions}>
        <Button
          type='button'
          variant='secondary'
          data-autofocus
          onClick={() => onOpenChange(false)}>
          {cancelLabel}
        </Button>
        <Button
          type='button'
          variant={actionVariant}
          loading={isActionLoading}
          onClick={onAction}>
          {actionLabel}
        </Button>
      </div>
    </Modal>
  );
}
