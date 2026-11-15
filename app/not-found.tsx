import { TopNav } from '@/components/ui/layouts/TopNav';
import { TopNavHeading } from '@/components/ui/layouts/TopNavHeading';
import { videoPaths } from '@/domains/videos/config/paths';
import { BrandLogo } from './_components/BrandLogo';
import { NotFoundView } from './_components/NotFoundView';

/** 로그인 틀 밖의 없는 주소에서 학습 목록으로 복귀할 경로를 제공한다. */
export default function NotFound() {
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
        <NotFoundView />
      </main>
    </>
  );
}
