'use client';
import { DropdownMenu } from '@astryxdesign/core/DropdownMenu';
import type { MaterialSummary } from '@/domains/materials/model/contracts';
import { formatDate } from '@/domains/learning/lib/format';
import { Badge } from '@/components/ui/primitives/Badge';
import { Icon } from '@/components/ui/primitives/Icon';
import { MaterialTile } from './MaterialTile';

/** PDF 원문의 읽기 위치와 공유 범위를 타일로 보여 주고 내 자료면 관리 메뉴를 연다. */
export function PdfTile({
  material,
  removing,
  onReplace,
  onRemove,
}: {
  material: MaterialSummary;
  removing: boolean;
  onReplace: () => void;
  onRemove: () => void;
}) {
  const progress =
    material.pageCount > 0
      ? Math.min(
          100,
          Math.floor((material.currentPage / material.pageCount) * 100)
        )
      : 0;

  return (
    <MaterialTile
      kind='pdf'
      href={`/materials/${encodeURIComponent(material.id)}`}
      title={material.title}
      progress={progress}
      progressLabel={material.title + ' 읽기 위치'}
      details={
        <>
          <span>
            {material.language === 'en' ? '영어' : '태국어'} · 읽기 자료 ·{' '}
            {material.pageCount}페이지 · 원본 v{material.version ?? 1}
          </span>
          <span>
            {material.visibility === 'public'
              ? '공개 자료'
              : material.visibility === 'accounts'
                ? '지정 계정 공유'
                : '나만 보기'}{' '}
            · {material.currentPage}페이지에서 이어 읽기
          </span>
        </>
      }
      status={
        <>
          <Badge tone='success'>원본 준비 완료</Badge>
          <time>{formatDate(material.updatedAt)}</time>
        </>
      }
      action={
        material.owned && (
          <DropdownMenu
            button={{
              label: material.title + ' 관리',
              variant: 'ghost',
              size: 'sm',
              isIconOnly: true,
              icon: (
                <Icon
                  name='ellipsis'
                  size={16}
                />
              ),
            }}
            items={[
              { label: '새 원본 버전 등록', onClick: onReplace },
              {
                label: '내 PDF 삭제',
                isDisabled: removing,
                onClick: onRemove,
              },
            ]}
          />
        )
      }
    />
  );
}
