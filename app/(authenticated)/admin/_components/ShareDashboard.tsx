'use client';
import { useRef, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/primitives/Button';
import { getAdminShares, revokeShare } from '@/domains/admin/api/admin';
import type { AdminShares } from '@/domains/admin/model/contracts';
import { sharePaths } from '@/domains/shares/config/paths';
import * as styles from './ShareDashboard.css';

/** 공유자와 유입 성과를 운영자가 한 목록에서 확인하게 한다. */
export function ShareDashboard({ initial }: { initial: AdminShares }) {
  const [data, setData] = useState(initial);
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [busy, setBusy] = useState(false);
  const pending = useRef(false);
  const [error, setError] = useState('');
  async function load(page: number, q = appliedQuery) {
    if (pending.current) return;
    pending.current = true;
    setBusy(true);
    setError('');
    try {
      setData(await getAdminShares(page, q));
      setAppliedQuery(q);
    } catch (error) {
      setError((error as Error).message);
    } finally {
      pending.current = false;
      setBusy(false);
    }
  }
  async function revoke(id: string) {
    if (
      pending.current ||
      !window.confirm(
        '이 공유 링크를 중지할까요? 기존 통계는 유지되며 링크로 더 이상 접근할 수 없습니다.'
      )
    )
      return;
    pending.current = true;
    setBusy(true);
    setError('');
    try {
      await revokeShare(id);
      setData(await getAdminShares(data.page, appliedQuery));
    } catch (error) {
      setError((error as Error).message);
    } finally {
      pending.current = false;
      setBusy(false);
    }
  }
  return (
    <>
      <div className={styles.summary}>
        <p>
          전체 공유 링크 <strong>{data.summary.links}</strong>
        </p>
        <p>
          로그인 방문 세션 <strong>{data.summary.visits}</strong>
        </p>
        <p>
          링크별 학습 시작 사용자 합계 <strong>{data.summary.starts}</strong>
        </p>
      </div>
      <p>
        로그인한 방문만 집계하며 같은 탭의 새로고침은 한 방문으로 집계합니다.
        학습 시작은 링크·사용자별 한 번이며, 여러 링크의 같은 사용자는 각각
        집계됩니다. 실제 사람 수나 청취 시간은 아닙니다.
      </p>
      <form
        className={styles.controls}
        onSubmit={(event) => {
          event.preventDefault();
          void load(1, query);
        }}>
        <label>
          영상 제목 또는 공유자 이메일
          <input
            value={query}
            maxLength={100}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <Button disabled={busy}>검색</Button>
        <Button
          type='button'
          variant='secondary'
          disabled={busy}
          onClick={() => void load(data.page)}>
          새로고침
        </Button>
      </form>
      {error && <p role='alert'>{error}</p>}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>영상·공유 범위</th>
              <th>공유자</th>
              <th>생성일</th>
              <th>방문 세션</th>
              <th>학습 시작</th>
              <th>상태</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item) => (
              <tr key={item.id}>
                <td>
                  <Link
                    href={sharePaths.detail(item.id)}
                    prefetch={false}
                    target='_blank'
                    rel='noreferrer'>
                    {item.video.title}
                  </Link>
                  <div>
                    {item.segment
                      ? `${item.segment.start.toFixed(1)}초 ~ ${item.segment.end.toFixed(1)}초`
                      : '영상 전체'}
                  </div>
                </td>
                <td>
                  {item.creator?.name ?? '이름 없음'}
                  <div>{item.creator?.email ?? '탈퇴한 사용자'}</div>
                </td>
                <td>
                  {new Intl.DateTimeFormat('ko-KR', {
                    dateStyle: 'short',
                    timeStyle: 'short',
                    timeZone: 'Asia/Seoul',
                  }).format(new Date(item.createdAt))}
                </td>
                <td>{item.visitCount}</td>
                <td>{item.startCount}</td>
                <td>
                  {item.revokedAt ? (
                    '공유 중지됨'
                  ) : (
                    <Button
                      variant='secondary'
                      disabled={busy}
                      onClick={() => void revoke(item.id)}>
                      공유 중지
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {data.items.length === 0 && <p>표시할 공유 링크가 없습니다.</p>}
      <div className={styles.controls}>
        <Button
          variant='secondary'
          disabled={busy || data.page === 1}
          onClick={() => void load(data.page - 1)}>
          이전
        </Button>
        <span>{data.page}페이지</span>
        <Button
          variant='secondary'
          disabled={busy || !data.hasMore}
          onClick={() => void load(data.page + 1)}>
          다음
        </Button>
      </div>
    </>
  );
}
