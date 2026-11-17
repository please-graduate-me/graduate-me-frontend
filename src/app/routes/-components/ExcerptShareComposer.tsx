import { Banner } from '@/components/ui/composites/Banner';
import { Heading } from '@/components/ui/primitives/Heading';
import { Badge } from '@/components/ui/primitives/Badge';
import { Icon } from '@/components/ui/primitives/Icon';
import { ApiError } from '@/lib/api/request';
import { SessionRecovery } from './SessionRecovery';
import { useEffect, useState } from 'react';
import type { SourceInput } from '@/domains/materials/model/source';
import type { ExcerptShare } from '@/domains/materials/model/records';
import {
  createExcerptShare,
  listExcerptShares,
  revokeExcerptShare,
} from '@/domains/materials/api/records';
import { Checkbox } from '@/components/ui/primitives/Checkbox';
import { Button } from '@/components/ui/primitives/Button';
import { Input } from '@/components/ui/primitives/Input';
import { RadioList } from '@/components/ui/primitives/RadioList';
import { RadioListItem } from '@/components/ui/primitives/RadioListItem';
import { Dialog } from '@/components/ui/composites/Dialog';
import * as styles from './ExcerptShareComposer.css';

/** 영상 위치 초를 캡션용 m:ss 표기로 바꾼다. */
const clock = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;

/** 수신 범위와 발췌를 확인한 공유와 링크 철회를 제공한다. */
export function ExcerptShareComposer({
  source,
  sourceTitle,
  start,
  onClose,
}: {
  source: SourceInput;
  sourceTitle?: string;
  start?: number;
  onClose: () => void;
}) {
  const [items, setItems] = useState<ExcerptShare[]>([]);
  const [visibility, setVisibility] = useState<'link' | 'accounts'>('accounts');
  const [recipients, setRecipients] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  // 만들기와 철회 중 누른 버튼에만 진행 표시를 두려고 진행 대상을 구분한다.
  const [pending, setPending] = useState<string | null>(null);
  const busy = pending !== null;
  const [error, setError] = useState('');
  const [sessionExpired, setSessionExpired] = useState(false);

  const [created, setCreated] = useState<{ id: string; url: string } | null>(
    null
  );

  const serial = JSON.stringify(source);
  // 호출부가 제목을 넘기지 않으면 서버가 확인한 기존 공유의 제목으로 대신한다.
  const title = sourceTitle ?? items[0]?.source.title;

  const location =
    source.kind === 'pdf'
      ? `PDF · ${source.page}페이지`
      : start === undefined
        ? '영상'
        : `영상 · ${clock(start)}`;

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
    setPending('create');
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

      setCreated({
        id: value.id,
        url: new URL(value.path, window.location.origin).href,
      });
    } catch (error) {
      setSessionExpired(error instanceof ApiError && error.status === 401);
      setError((error as Error).message);
    } finally {
      setPending(null);
    }
  }

  async function revoke(id: string) {
    setPending(id);
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

      // 방금 만든 링크를 철회할 때만 주소 띠를 숨기고 다른 링크 철회에는 유지한다.
      setCreated((previous) => (previous?.id === id ? null : previous));
    } catch (error) {
      setSessionExpired(error instanceof ApiError && error.status === 401);
      setError((error as Error).message);
    } finally {
      setPending(null);
    }
  }

  return (
    <Dialog
      open
      onClose={() => {
        if (!busy) onClose();
      }}
      title='선택한 발췌 공유'
      width={600}
      description='개인 원본 PDF, 메모, 답안과 전체 AI 대화는 포함하지 않습니다.'>
      <div className={styles.body}>
        <figure className={styles.excerpt}>
          <figcaption className={styles.caption}>
            {title}
            <span className={styles.captionMeta}>
              {title ? ' · ' : ''}
              {location}
            </span>
          </figcaption>
          <blockquote className={styles.quote}>“{source.quote}”</blockquote>
        </figure>
        <form
          className={styles.form}
          onSubmit={(event) => void create(event)}>
          <RadioList
            label='공개 대상'
            variant='tile'
            value={visibility}
            isDisabled={busy}
            onChange={(value) => setVisibility(value as typeof visibility)}>
            <RadioListItem
              value='accounts'
              icon={
                <Icon
                  name='users'
                  size={22}
                />
              }
              label='지정한 계정만'
            />
            <RadioListItem
              value='link'
              icon={
                <Icon
                  name='link'
                  size={22}
                />
              }
              label='링크를 가진 로그인 사용자'
            />
          </RadioList>
          {visibility === 'accounts' && (
            <Input
              className={styles.appear}
              label='받는 사람의 계정 ID'
              hasRequiredTag
              value={recipients}
              maxLength={10000}
              required
              onChange={(event) => setRecipients(event.target.value)}
              placeholder='계정 ID를 쉼표로 구분해 입력'
            />
          )}
          <div
            role='note'
            aria-label='공개 범위'
            className={styles.scope}>
            <p className={styles.scopeRow}>
              <Icon
                name='eye'
                className={styles.scopeShown}
              />
              <span>
                <strong className={styles.scopeTitle}>공개 내용:</strong> 선택한
                발췌·자료 제목·페이지 또는 영상 위치
              </span>
            </p>
            <p className={styles.scopeRow}>
              <Icon
                name='eye-off'
                className={styles.scopeHidden}
              />
              <span>
                <strong className={styles.scopeHidden}>
                  공개하지 않는 내용:
                </strong>{' '}
                원본 파일·개인 메모·질문·답안·전체 대화
              </span>
            </p>
          </div>
          <Checkbox
            variant='large'
            label='발췌와 공개 대상을 확인했습니다.'
            checked={confirmed}
            onChange={(event) => setConfirmed(event.target.checked)}
          />
          <div>
            <Button
              size='comfortable'
              loading={pending === 'create'}
              disabled={busy || !confirmed}>
              공유 링크 만들기
            </Button>
          </div>
          {created && (
            <div className={styles.created}>
              <Input
                className={styles.createdField}
                aria-label='생성한 발췌 공유 주소'
                tone='accent'
                isNumeric
                value={created.url}
                readOnly
              />
              <Button
                type='button'
                variant='surface'
                startIcon='copy'
                onClick={() =>
                  void navigator.clipboard
                    .writeText(created.url)
                    .catch(() => setError('주소를 직접 선택해 복사해 주세요.'))
                }>
                주소 복사
              </Button>
            </div>
          )}
          {sessionExpired && <SessionRecovery />}
          {error && (
            <Banner
              status='error'
              role='alert'
              title={<>{error}</>}
            />
          )}
        </form>
        {/* 링크가 하나도 없으면 빈 제목만 남지 않도록 첫 링크를 만든 뒤에 보인다. */}
        {items.length > 0 && (
          <section
            className={styles.links}
            aria-labelledby='excerpt-share-links'>
            <Heading
              level={3}
              id='excerpt-share-links'
              className={styles.linksTitle}>
              이 발췌의 공유 링크
            </Heading>
            <ul className={styles.list}>
              {items.map((item) => (
                <li
                  className={styles.item}
                  key={item.id}>
                  <span className={styles.itemLabel}>
                    {item.visibility === 'link'
                      ? '로그인한 링크 수신자'
                      : '지정 계정'}
                    <Badge tone={item.revokedAt ? 'neutral' : 'success'}>
                      {item.revokedAt ? '철회됨' : '공유 중'}
                    </Badge>
                  </span>
                  {!item.revokedAt && (
                    <Button
                      type='button'
                      size='small'
                      variant='danger-outline'
                      loading={pending === item.id}
                      disabled={busy && pending !== item.id}
                      onClick={() => void revoke(item.id)}>
                      공유 철회
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </Dialog>
  );
}
