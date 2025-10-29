/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    removeConsole: {
      exclude: ["error"], // 仅保留 console.error
    },
  },
};

export default nextConfig;
