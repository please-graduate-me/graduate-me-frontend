'use client';
import { TopNav } from '@/components/ui/layouts/TopNav';
import { TopNavHeading } from '@/components/ui/layouts/TopNavHeading';
import { videoPaths } from '@/domains/videos/config/paths';
import { BrandLogo } from './_components/BrandLogo';
import { ErrorView } from './_components/ErrorView';

/** 로그인 틀 밖에서 조회 실패 후 페이지 전체를 떠나지 않고 재시도하게 한다. */
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <>
      <TopNav
        heading={
          <TopNavHeading
            heading='Please graduate me'
            headingHref={videoPaths.home}
            logo={<BrandLogo />}
          />
        }
      />
      <main>
        <ErrorView reset={reset} />
      </main>
    </>
  );
}
