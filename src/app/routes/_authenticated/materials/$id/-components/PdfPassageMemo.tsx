import { useState } from 'react';
import { Button } from '@/components/ui/primitives/Button';
import { Text } from '@/components/ui/primitives/Text';
import { TextArea } from '@/components/ui/primitives/TextArea';
import { createAnnotation } from '@/domains/materials/api/records';
import type { Annotation } from '@/domains/materials/model/records';
import type { SourceInput } from '@/domains/materials/model/source';
import { ApiError } from '@/lib/api/request';
import { SessionRecovery } from '../../../../-components/SessionRecovery';
import * as styles from './PdfPassageMemo.css';

/** 선택한 구절에 바로 쓰는 개인 메모이며 저장하면 기본 하이라이트와 함께 내 기록에 남는다. */
export function PdfPassageMemo({
  source,
  onSaved,
}: {
  source: SourceInput;
  onSaved: (value: Annotation) => void;
}) {
  const [memo, setMemo] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [sessionExpired, setSessionExpired] = useState(false);
  const [saved, setSaved] = useState(false);

  async function save(event: React.FormEvent) {
    event.preventDefault();
    if (busy || !memo.trim()) return;
    setBusy(true);
    setError('');
    setSessionExpired(false);

    try {
      const value = await createAnnotation({ source, color: 'yellow', memo });

      onSaved(value);
      setMemo('');
      setSaved(true);
    } catch (failure) {
      setSessionExpired(failure instanceof ApiError && failure.status === 401);
      setError((failure as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form
      className={styles.root}
      onSubmit={(event) => void save(event)}>
      {sessionExpired && <SessionRecovery />}
      <TextArea
        label='구절 개인 메모'
        rows={6}
        value={memo}
        disabled={busy}
        maxLength={5000}
        placeholder='다시 읽고 싶은 부분과 생각을 남겨 주세요.'
        onChange={(event) => {
          setMemo(event.target.value);
          setSaved(false);
        }}
      />
      <Text
        as='p'
        display='block'
        type='supporting'
        className={styles.note}>
        선택한 원문 위치와 메모는 나에게만 보입니다.
      </Text>
      {error && (
        <Text
          as='p'
          display='block'
          type='supporting'
          role='alert'
          className={styles.error}>
          {error}
        </Text>
      )}
      <div className={styles.actions}>
        <Button
          size='small'
          loading={busy}
          disabled={busy || !memo.trim()}>
          구절 메모 저장
        </Button>
        {saved && (
          <Text
            type='supporting'
            role='status'>
            내 기록에 저장했어요.
          </Text>
        )}
      </div>
    </form>
  );
}
