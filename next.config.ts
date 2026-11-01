import { createVanillaExtractPlugin } from '@vanilla-extract/next-plugin';
import type { NextConfig } from 'next';
const backend = process.env.API_INTERNAL_URL || 'http://127.0.0.1:4000';
const config: NextConfig = {
  poweredByHeader: false,
  agentRules: false,
  transpilePackages: ['@graduate-me/shared'],
  async rewrites() {
    return [{ source: '/api/:path*', destination: `${backend}/api/:path*` }];
  },
};
/** 도구 설정을 한 진입점에서 적용해 실행 환경의 차이를 줄인다. */
export default createVanillaExtractPlugin()(config);
