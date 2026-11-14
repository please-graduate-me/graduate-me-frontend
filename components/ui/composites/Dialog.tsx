'use client';
import {
  Dialog as AstryxDialog,
  DialogHeader,
} from '@astryxdesign/core/Dialog';
import { Layout, LayoutContent, LayoutFooter } from '@astryxdesign/core/Layout';
import type { ReactNode } from 'react';

/** 입력 중 배경 클릭을 막고 기존 열림 계약을 Astryx 모달에 연결한다. */
export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  const changeOpen = (isOpen: boolean) => {
    if (!isOpen) onClose();
  };

  return (
    <AstryxDialog
      isOpen={open}
      onOpenChange={changeOpen}
      purpose='form'
      width={640}>
      <Layout
        header={
          <DialogHeader
            title={title}
            subtitle={description}
            onOpenChange={changeOpen}
          />
        }
        content={<LayoutContent>{children}</LayoutContent>}
        footer={
          footer ? <LayoutFooter hasDivider>{footer}</LayoutFooter> : undefined
        }
      />
    </AstryxDialog>
  );
}
