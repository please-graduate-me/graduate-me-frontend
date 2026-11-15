'use client';
import { DropdownMenu } from '@/components/ui/composites/DropdownMenu';
import type { MaterialSummary } from '@/domains/materials/model/contracts';
import { formatDate } from '@/domains/learning/lib/format';
import { Icon } from '@/components/ui/primitives/Icon';
import { MaterialTile } from './MaterialTile';
import { isPdfComplete } from './materialProgress';

const visibilityLabels = {
  public: '공개 자료',
  accounts: '지정 계정 공유',
  private: '나만 보기',
} as const;

/** PDF 원문의 읽기 위치를 타일로 보여 주고 언어·버전·공유 범위는 툴팁으로, 내 자료면 관리 메뉴를 연다. */
export function PdfTile({
  material,
  isLatest = false,
  removing,
  onReplace,
  onRemove,
}: {
  material: MaterialSummary;
  isLatest?: boolean;
  removing: boolean;
  onReplace: () => void;
  onRemove: () => void;
}) {
  const complete = isPdfComplete(material);

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
      seed={material.id}
      href={`/materials/${encodeURIComponent(material.id)}`}
      title={material.title}
      progress={progress}
      progressLabel={material.title + ' 읽기 위치'}
      caption={`PDF · ${material.currentPage} / ${material.pageCount}쪽`}
      complete={complete ? 'ink' : undefined}
      pill={isLatest ? { label: '이어서', tone: 'accent' } : undefined}
      hint={[
        material.language === 'th' ? '태국어' : '영어',
        `원본 v${material.version ?? 1}`,
        visibilityLabels[material.visibility as keyof typeof visibilityLabels],
        `${formatDate(material.updatedAt)} 학습`,
      ]
        .filter(Boolean)
        .join(' · ')}
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
                variant: 'danger',
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
