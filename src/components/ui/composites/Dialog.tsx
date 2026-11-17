import { useId, type ReactNode } from 'react';
import * as buttonStyles from '@/lib/styles/button.css';
import { Icon } from '../primitives/Icon';
import * as styles from './Dialog.css';
import { Modal } from './Modal';

/** 배경 클릭으로는 닫히지 않는 입력용 모달이며 닫기 버튼과 Escape는 onClose에 판단을 맡긴다. */
export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  width,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: ReactNode;
  footer?: ReactNode;
  width?: number;
}) {
  const titleId = useId();
  const descriptionId = useId();

  return (
    <Modal
      open={open}
      onCancel={onClose}
      width={width}
      labelledBy={titleId}
      describedBy={description ? descriptionId : undefined}>
      <header className={styles.header}>
        <div className={styles.heading}>
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
        <button
          type='button'
          aria-label='닫기'
          className={[
            buttonStyles.base,
            buttonStyles.variant.ghost,
            buttonStyles.iconOnly.medium,
            styles.close,
          ].join(' ')}
          onClick={onClose}>
          <Icon
            name='x'
            size={20}
          />
        </button>
      </header>
      <div className={styles.content}>{children}</div>
      {footer && <footer className={styles.footer}>{footer}</footer>}
    </Modal>
  );
}
