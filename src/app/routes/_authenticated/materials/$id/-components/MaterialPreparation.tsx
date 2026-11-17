import { contentLabel } from '@/components/ui/primitives/contentLabel';
import { Blockquote } from '@/components/ui/primitives/Blockquote';
import { Banner } from '@/components/ui/composites/Banner';
import { Collapsible } from '@/components/ui/composites/Collapsible';
import { Text } from '@/components/ui/primitives/Text';
import { useEffect, useState } from 'react';
import type { Explanation } from '@/domains/ai/model/contracts';
import { AiExplanation } from '../../../../-components/AiExplanation';
import { listExplanations, prepareMaterial } from '@/domains/ai/api/learning';
import { Button } from '@/components/ui/primitives/Button';
import { Input } from '@/components/ui/primitives/Input';
import * as styles from '@/lib/styles/workspace.css';

/** 기본 번역·설명 준비를 사용자가 확인한 페이지 범위에 한해 명시적으로 요청한다. */
export function MaterialPreparation({
  id,
  page,
  total,
  version,
  ocrId,
  preparationPages,
  pageEligibility,
  historical = false,
}: {
  id: string;
  page: number;
  total: number;
  version: number;
  ocrId?: string;
  preparationPages?: number;
  pageEligibility: ({ aiAllowed: boolean; reason?: string } | undefined)[];
  historical?: boolean;
}) {
  const [from, setFrom] = useState(String(page));

  const [to, setTo] = useState(
    String(Math.min(total, page + (preparationPages ?? 1) - 1))
  );

  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [items, setItems] = useState<Explanation[]>([]);

  const fromPage = Number(from);
  const toPage = Number(to);

  const validRange =
    Number.isInteger(fromPage) &&
    Number.isInteger(toPage) &&
    fromPage >= 1 &&
    toPage >= fromPage &&
    toPage <= total &&
    preparationPages !== undefined &&
    toPage - fromPage + 1 <= preparationPages;

  const selectedEligibility = pageEligibility.slice(fromPage - 1, toPage);

  // 적합성 정보가 없는 과거 계약은 서버에 맡기고 확인된 부적합 범위만 막는다.
  const rangeAllowed =
    validRange &&
    selectedEligibility.some((value) => value?.aiAllowed !== false);

  useEffect(() => {
    let active = true;

    void listExplanations({
      kind: 'pdf',
      materialId: id,
      page,
      quote: '저장된 페이지 설명 조회',
      version,
      ocrId,
    })
      .then((value) => {
        if (active)
          setItems(
            value.items.filter(
              (item) =>
                (item.source.version ?? 1) === version &&
                item.source.kind === 'pdf' &&
                (item.source.ocrId ?? null) === (ocrId ?? null)
            )
          );
      })
      .catch((error) => {
        if (active) setError(error.message);
      });

    return () => {
      active = false;
    };
  }, [id, page, version, ocrId]);

  async function prepare(event: React.FormEvent) {
    event.preventDefault();
    if (historical || !rangeAllowed) return;
    setBusy(true);
    setError('');
    setMessage('');

    try {
      const value = await prepareMaterial(id, {
        requestId: crypto.randomUUID(),
        fromPage: Number(from),
        toPage: Number(to),
      });

      setItems((previous) => [
        ...value.items.filter(
          (item) =>
            item.source.kind === 'pdf' &&
            item.source.page === page &&
            (item.source.version ?? 1) === version &&
            (item.source.ocrId ?? null) === (ocrId ?? null)
        ),
        ...previous.filter(
          (item) => !value.items.some((value) => value.id === item.id)
        ),
      ]);

      setMessage(
        `${value.range.fromPage}~${value.range.toPage}페이지: 저장된 설명 ${value.items.length}개${value.failed.length ? `. 준비 실패 ${value.failed.map((item) => item.page + '페이지: ' + item.error).join(', ')}` : ''}. 페이지 조회는 새 생성을 요청하지 않습니다.`
      );
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Collapsible trigger={<> 자료 기본 번역·설명 준비 </>}>
      <form
        className={styles.stack}
        onSubmit={(event) => void prepare(event)}>
        <Text
          as='p'
          display='block'
          className={styles.meta}>
          {preparationPages
            ? `한 번에 최대 ${preparationPages}페이지를 준비합니다. `
            : '준비 정책을 확인하지 못했습니다. 새 요청은 잠시 후 자료를 다시 열어 확인해 주세요. '}
          원본 읽기와 별도의 요청입니다. 준비할 범위를 정해 주세요. 저장된
          결과는 재사용하고 최초 준비에 실패한 페이지는 자동·수동 재분석하지
          않습니다.
        </Text>
        {historical && (
          <Banner
            status='info'
            title='안내'>
            보관된 원본은 저장 결과를 조회합니다. 새 기본 준비는 현재 원본에서
            요청해 주세요.
          </Banner>
        )}
        <div className={styles.row}>
          <div>
            <Input
              label={contentLabel(<>시작</>)}
              type='number'
              min={1}
              max={total}
              value={from}
              required
              onChange={(event) => setFrom(event.target.value)}
            />
          </div>
          <div>
            <Input
              label={contentLabel(<>끝</>)}
              type='number'
              min={Number(from) || 1}
              max={Math.min(
                total,
                (Number(from) || 1) + (preparationPages ?? 1) - 1
              )}
              value={to}
              required
              onChange={(event) => setTo(event.target.value)}
            />
          </div>
        </div>
        <Button
          size='small'
          loading={busy}
          disabled={historical || busy || !rangeAllowed}>
          선택 범위 준비 요청
        </Button>
        {validRange && !rangeAllowed && (
          <Banner
            status='info'
            title='안내'>
            선택한 범위에 새 AI 준비가 가능한 페이지가 없습니다.{' '}
            {selectedEligibility.find((value) => value?.reason)?.reason} 원본
            읽기와 OCR은 계속 이용할 수 있습니다.
          </Banner>
        )}
        {message && (
          <Banner
            status='info'
            title='안내'
            role='status'>
            {message}
          </Banner>
        )}
        {error && (
          <Banner
            status='error'
            title='확인이 필요해요'
            role='alert'>
            {error}
          </Banner>
        )}
      </form>
      <Collapsible trigger={<> 이 페이지의 저장된 설명 {items.length}개 </>}>
        {items.map((item) => (
          <div key={item.id}>
            <Blockquote className={styles.quote}>
              {item.source.quote}
            </Blockquote>
            <AiExplanation value={item} />
          </div>
        ))}
        {!items.length && (
          <Text
            as='p'
            display='block'
            className={styles.meta}>
            이 페이지에 저장된 설명이 없습니다. 원본 읽기와 구절 선택은 계속
            이용할 수 있습니다.
          </Text>
        )}
      </Collapsible>
    </Collapsible>
  );
}
