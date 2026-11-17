import { useId, type ReactNode } from 'react';
import { Button } from '../primitives/Button';
import { Icon, type IconName } from '../primitives/Icon';
import * as styles from './AlertDialog.css';
import { Modal } from './Modal';

/** 확인 대화상자의 열림, 문구, 대상 상세, 실행 계약이다. */
export type AlertDialogProps = {
  isOpen: boolean;
  title: string;
  description?: string;
  detail?: ReactNode;
  icon?: IconName;
  cancelLabel?: string;
  actionLabel: string;
  actionVariant?: 'primary' | 'ink' | 'danger';
  isActionLoading?: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onAction: () => void;
};

/** 되돌릴 수 없는 작업 전에 취소를 기본 초점으로 두고 확인을 받는 모달이며 상태 아이콘과 대상 상세 상자를 붙일 수 있다. */
export function AlertDialog({
  isOpen,
  title,
  description,
  detail,
  icon,
  cancelLabel = '취소',
  actionLabel,
  actionVariant = 'danger',
  isActionLoading = false,
  onOpenChange,
  onAction,
}: AlertDialogProps) {
  const titleId = useId();
  const descriptionId = useId();
  const detailId = useId();
  const hasDetail = detail != null && detail !== false;

  const describedBy = [description && descriptionId, hasDetail && detailId]
    .filter(Boolean)
    .join(' ');

  return (
    <Modal
      open={isOpen}
      role='alertdialog'
      width={400}
      onCancel={() => onOpenChange(false)}
      labelledBy={titleId}
      describedBy={describedBy || undefined}>
      <div className={styles.body}>
        {icon && (
          <span
            className={`${styles.icon} ${styles.iconTone[actionVariant === 'danger' ? 'danger' : 'neutral']}`}>
            <Icon
              name={icon}
              size={20}
            />
          </span>
        )}
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
        {hasDetail && (
          <div
            id={detailId}
            className={styles.detail}>
            {detail}
          </div>
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
