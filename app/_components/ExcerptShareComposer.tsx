'use client';
import { useEffect, useState } from 'react';
import type { SourceInput } from '@/domains/materials/model/source';
import type { ExcerptShare } from '@/domains/materials/model/records';
import {
  createExcerptShare,
  listExcerptShares,
  revokeExcerptShare,
} from '@/domains/materials/api/records';
import { Button } from '@/components/ui/primitives/Button';
import { Input } from '@/components/ui/primitives/Input';
import { Select } from '@/components/ui/primitives/Select';
import { Dialog } from '@/components/ui/composites/Dialog';
import * as styles from '@/lib/styles/workspace.css';

/** 수신 범위와 발췌를 확인한 공유와 링크 철회를 제공한다. */
export function ExcerptShareComposer({
  source,
  onClose,
}: {
  source: SourceInput;
  onClose: () => void;
}) {
  const [items, setItems] = useState<ExcerptShare[]>([]);
  const [visibility, setVisibility] = useState<'link' | 'accounts'>('accounts');
  const [recipients, setRecipients] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [url, setUrl] = useState('');
  const serial = JSON.stringify(source);

  useEffect(() => {
    let active = true;
    const selected: SourceInput = JSON.parse(serial);

    void listExcerptShares()
      .then((result) => {
        if (active)
          setItems(
            result.items.filter(
              (item) =>
                item.source.kind === selected.kind &&
                item.source.quote === selected.quote &&
                (item.source.kind === 'pdf' && selected.kind === 'pdf'
                  ? item.source.materialId === selected.materialId
                  : item.source.kind === 'video' &&
                    selected.kind === 'video' &&
                    item.source.videoId === selected.videoId)
            )
          );
      })
      .catch((error) => {
        if (active) setError(error.message);
      });

    return () => {
      active = false;
    };
  }, [serial]);

  async function create(event: React.FormEvent) {
    event.preventDefault();
    if (!confirmed || busy) return;
    setBusy(true);
    setError('');

    try {
      const value = await createExcerptShare({
        source,
        visibility,
        ...(visibility === 'accounts'
          ? {
              allowedUserIds: recipients
                .split(',')
                .map((value) => value.trim())
                .filter(Boolean),
            }
          : {}),
      });

      setItems((previous) => [value, ...previous]);
      setUrl(new URL(value.path, window.location.origin).href);
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function revoke(id: string) {
    setBusy(true);
    setError('');

    try {
      await revokeExcerptShare(id);

      setItems((previous) =>
        previous.map((item) =>
          item.id === id
            ? { ...item, revokedAt: new Date().toISOString() }
            : item
        )
      );

      setUrl('');
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog
      open
      onClose={() => {
        if (!busy) onClose();
      }}
      title='선택한 발췌 공유'
      description='개인 원본 PDF, 메모, 답안과 전체 AI 대화는 포함하지 않습니다.'>
      <form
        className={styles.stack}
        onSubmit={(event) => void create(event)}>
        <blockquote className={styles.quote}>{source.quote}</blockquote>
        <label className={styles.field}>
          공개 대상
          <Select
            value={visibility}
            disabled={busy}
            onChange={(event) =>
              setVisibility(event.target.value as typeof visibility)
            }>
            <option value='accounts'>지정한 계정만</option>
            <option value='link'>링크를 가진 로그인 사용자</option>
          </Select>
        </label>
        {visibility === 'accounts' && (
          <label className={styles.field}>
            받는 사람의 계정 ID
            <Input
              value={recipients}
              maxLength={10000}
              required
              onChange={(event) => setRecipients(event.target.value)}
              placeholder='계정 ID를 쉼표로 구분해 입력'
            />
          </label>
        )}
        <p className={styles.notice}>
          공개 내용: 선택한 발췌·자료 제목·페이지 또는 영상 위치
          <br />
          공개하지 않는 내용: 원본 파일·개인 메모·질문·답안·전체 대화
        </p>
        <label className={styles.row}>
          <input
            type='checkbox'
            checked={confirmed}
            onChange={(event) => setConfirmed(event.target.checked)}
          />
          발췌와 공개 대상을 확인했습니다.
        </label>
        <div>
          <Button
            loading={busy}
            disabled={busy || !confirmed}>
            공유 링크 만들기
          </Button>
        </div>
        {url && (
          <div className={styles.stack}>
            <Input
              aria-label='생성한 발췌 공유 주소'
              value={url}
              readOnly
            />
            <Button
              type='button'
              variant='secondary'
              onClick={() =>
                void navigator.clipboard
                  .writeText(url)
                  .catch(() => setError('주소를 직접 선택해 복사해 주세요.'))
              }>
              주소 복사
            </Button>
          </div>
        )}
        {error && (
          <p
            className={styles.error}
            role='alert'>
            {error}
          </p>
        )}
      </form>
      <div className={styles.stack}>
        <h3>이 발췌의 공유 링크</h3>
        {items.map((item) => (
          <div
            className={styles.row}
            key={item.id}>
            <span className={styles.meta}>
              {item.visibility === 'link'
                ? '로그인한 링크 수신자'
                : '지정 계정'}{' '}
              · {item.revokedAt ? '철회됨' : '공유 중'}
            </span>
            {!item.revokedAt && (
              <Button
                size='small'
                variant='danger'
                disabled={busy}
                onClick={() => void revoke(item.id)}>
                공유 철회
              </Button>
            )}
          </div>
        ))}
      </div>
    </Dialog>
  );
}
