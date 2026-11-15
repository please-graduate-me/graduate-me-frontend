'use client';
import { Banner } from '@/components/ui/composites/Banner';
import { Dialog } from '@/components/ui/composites/Dialog';
import { Button } from '@/components/ui/primitives/Button';
import { contentLabel } from '@/components/ui/primitives/contentLabel';
import { TextArea } from '@/components/ui/primitives/TextArea';
import { ApiError } from '@/lib/api/request';
import * as workspace from '@/lib/styles/workspace.css';
import { useState } from 'react';
import { reportCommunityPost } from '@/domains/community/api/community';
import { SessionRecovery } from '../../../../_components/SessionRecovery';

/** 깃발 버튼으로 연 대화상자에서 신고 사유를 받아 운영자에게 접수한다. */
export function CommunityReportDialog({
  postId,
  open,
  onClose,
  onReported,
}: {
  postId: string;
  open: boolean;
  onClose: () => void;
  onReported: () => void;
}) {
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [sessionExpired, setSessionExpired] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError('');

    try {
      await reportCommunityPost(postId, reason.trim());
      setReason('');
      onReported();
    } catch (error) {
      setSessionExpired(error instanceof ApiError && error.status === 401);
      setError((error as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog
      open={open}
      onClose={() => {
        if (!busy) onClose();
      }}
      title='일반 게시글 신고'
      description='학습 자료의 정답·설명 오류 신고와 별도로 운영자가 검토합니다.'>
      <form
        className={workspace.stack}
        onSubmit={(event) => void submit(event)}>
        <div className={workspace.field}>
          <TextArea
            label={contentLabel(<>신고 사유</>)}
            value={reason}
            maxLength={5000}
            required
            disabled={busy}
            onChange={(event) => setReason(event.target.value)}
          />
        </div>
        {sessionExpired && <SessionRecovery />}
        {error && (
          <Banner
            status='error'
            title='확인이 필요해요'
            role='alert'>
            {error}
          </Banner>
        )}
        <Button
          variant='secondary'
          loading={busy}
          disabled={busy || !reason.trim()}>
          운영자에게 신고
        </Button>
      </form>
    </Dialog>
  );
}
