/* eslint-disable @typescript-eslint/no-var-requires */
/** @type {import('next').NextConfig} */
const removeImports = require('next-remove-imports')();

// PWA 설정
const withPWAConfig = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
});

// 기존 Next.js 설정
const nextConfig = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'glog-image-bucket.s3.ap-northeast-2.amazonaws.com',
      },
    ],
  },
};

// removeImports와 PWA 설정을 함께 적용
module.exports = removeImports({
  ...withPWAConfig,
  ...nextConfig,
});
