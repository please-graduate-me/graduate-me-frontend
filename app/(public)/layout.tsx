import { Link } from '@astryxdesign/core/Link';
import { TopNav, TopNavHeading } from '@astryxdesign/core/TopNav';
import { HStack } from '@astryxdesign/core/HStack';
import { Text } from '@astryxdesign/core/Text';
import type { ReactNode } from 'react';
import { Icon } from '@/components/ui/primitives/Icon';
import * as styles from './layout.css';
import { ButtonLink } from '@/components/ui/primitives/ButtonLink';
import { AuthButton } from '../_components/AuthButton';
import { getPublicSession } from './_components/getPublicSession';

/** 공개 화면은 학습 앱과 같은 브랜드를 유지하면서 간결한 진입 탐색을 제공한다. */
export default async function PublicLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { configured, session } = await getPublicSession();

  return (
    <div className={styles.root}>
      <TopNav
        label='서비스 소개'
        heading={
          <TopNavHeading
            heading='graduate me'
            headingHref='/'
            logo={
              <Icon
                name='book-open'
                size={24}
              />
            }
          />
        }
        endContent={
          session?.user ? (
            <ButtonLink
              href='/library'
              variant='secondary'>
              내 학습 공간
            </ButtonLink>
          ) : (
            <AuthButton
              action='signin'
              variant='secondary'
              label='로그인'
              disabled={!configured}
            />
          )
        }
      />
      <main className={styles.main}>{children}</main>
      <footer className={styles.footer}>
        <HStack gap={4}>
          <Text weight='bold'>graduate me</Text>
          <Text color='secondary'>읽고, 듣고, 질문하며 나의 언어로.</Text>
          <Link href='/library'>학습 시작하기</Link>
        </HStack>
      </footer>
    </div>
  );
}
