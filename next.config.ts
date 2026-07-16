const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

module.exports = {
  allowedDevOrigins: ['192.168.1.122'],
}

export default nextConfig;