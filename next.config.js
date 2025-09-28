/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  basePath: "",
  images: {
    domains: [
      'e7c19ee7e46d4c14459e37cf23e998dd.ipfscdn.io',
      'ipfs.thirdwebcdn.com',
      'ipfs.io',
      'gateway.ipfscdn.io'
    ],
  },
};

module.exports = nextConfig;
