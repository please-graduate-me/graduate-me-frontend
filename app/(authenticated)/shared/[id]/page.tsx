import { Card } from '@/components/ui/primitives/Card';
import { Heading } from '@/components/ui/primitives/Heading';
import { Text } from '@/components/ui/primitives/Text';
import { Icon } from '@/components/ui/primitives/Icon';
import { ButtonLink } from '@/components/ui/primitives/ButtonLink';
import { notFound } from 'next/navigation';
import { requireSession } from '../../requireSession';
import { getExcerptShare } from '@/domains/materials/api/records';
import { materialPaths } from '@/domains/materials/config/paths';
import { sourceLabel } from '@/domains/learning/lib/format';
import { ApiError } from '@/lib/api/request';
import { Badge } from '@/components/ui/primitives/Badge';
import * as styles from './page.css';

/** 허용된 수신자에게 공유자가 고른 발췌만 표시한다. */
export default async function SharedExcerptPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { transport } = await requireSession();
  const { id } = await params;

  const item = await getExcerptShare(id, transport).catch((error) => {
    if (
      error instanceof ApiError &&
      (error.status === 403 || error.status === 404 || error.status === 410)
    )
      notFound();
    throw error;
  });

  const { source } = item;
  const isPdf = source.kind === 'pdf';

  const origin = isPdf ? `${source.page}페이지에서 발췌` : '영상 구절에서 발췌';

  const included = [
    '선택한 발췌',
    isPdf ? '자료 제목과 페이지 위치' : '자료 제목과 영상 위치',
  ];

  const excluded = [
    ...(isPdf ? ['원본 PDF'] : []),
    '공유자의 개인 메모·답안·진도',
  ];

  return (
    <div className={styles.page}>
      <article className={styles.article}>
        <div className={styles.heading}>
          <Badge tone='brand'>
            <Icon
              name='link'
              size={14}
            />
            공유된 원문 발췌
          </Badge>
          <Heading level={1}>{source.title}</Heading>
          <Text
            as='p'
            display='block'
            type='supporting'
            weight='semibold'>
            {sourceLabel(source)} · 원문 v{source.version ?? 1}
          </Text>
        </div>
        <div className={styles.stack}>
          <span
            aria-hidden='true'
            className={styles.sheetBack}
          />
          <span
            aria-hidden='true'
            className={styles.sheetMiddle}
          />
          <figure className={styles.excerpt}>
            <svg
              aria-hidden='true'
              width='36'
              height='28'
              viewBox='0 0 36 28'
              className={styles.mark}>
              <path d='M0 28V16C0 7 5 1.5 14 0l1.5 4C10 5.6 7.5 9 7.5 13H14v15H0zm20 0V16c0-9 5-14.5 14-16l1.5 4C30 5.6 27.5 9 27.5 13H34v15H20z' />
            </svg>
            <blockquote className={styles.quote}>{source.quote}</blockquote>
            <figcaption className={styles.caption}>
              {source.title}
              <span className={styles.captionMeta}> · {origin}</span>
            </figcaption>
          </figure>
        </div>
        <Card
          variant='muted'
          role='note'
          className={styles.note}>
          <Icon
            name='info'
            className={styles.noteIcon}
          />
          <Text
            as='p'
            display='block'
            size='sm'>
            <strong className={styles.noteTitle}>안내</strong> · 이 링크는
            선택한 발췌만 공유합니다.{' '}
            {isPdf
              ? '원본 PDF와 공유자의 개인 메모·답안·진도는 포함하지 않습니다.'
              : '공유자의 개인 메모·답안·진도는 포함하지 않습니다.'}{' '}
            원본 열람 권한은 별도로 관리됩니다.
          </Text>
        </Card>
        <Card className={styles.actions}>
          <Text
            as='p'
            display='block'
            type='supporting'>
            원본 접근 권한이 있으면 같은 위치에서 내 기록으로 학습할 수
            있습니다.
          </Text>
          <div className={styles.buttons}>
            <ButtonLink
              href={materialPaths.source(source)}
              variant='ink'
              size='prominent'
              endIcon='arrow-right'>
              원문 위치에서 학습하기
            </ButtonLink>
            <ButtonLink
              href='/materials'
              variant='secondary'
              size='prominent'>
              내 자료로 돌아가기
            </ButtonLink>
          </div>
        </Card>
      </article>
      <aside
        aria-labelledby='scope-title'
        className={styles.aside}>
        <Card
          as='section'
          className={styles.scope}>
          <Heading
            level={2}
            id='scope-title'
            className={styles.scopeTitle}>
            이 링크에 담긴 내용
          </Heading>
          <ul className={styles.scopeList}>
            {included.map((label) => (
              <li
                key={label}
                className={styles.scopeItem}>
                <span className={`${styles.scopeMark} ${styles.markTone.in}`}>
                  <Icon
                    name='check'
                    size={12}
                  />
                </span>
                {label}
              </li>
            ))}
          </ul>
          <hr className={styles.divider} />
          <Text
            as='p'
            display='block'
            className={styles.excludedTitle}>
            포함하지 않아요
          </Text>
          <ul className={styles.scopeList}>
            {excluded.map((label) => (
              <li
                key={label}
                className={`${styles.scopeItem} ${styles.excluded}`}>
                <span className={`${styles.scopeMark} ${styles.markTone.out}`}>
                  <Icon
                    name='x'
                    size={12}
                  />
                </span>
                {label}
              </li>
            ))}
          </ul>
        </Card>
      </aside>
    </div>
  );
}
