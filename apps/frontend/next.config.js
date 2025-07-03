// next.config.js
const createJiti = require('jiti');
const jiti = createJiti(__filename);

// sync import only — no `await`
jiti('./src/lib/env/client');
jiti('./src/lib/env/server');

const nextConfig = {
  allowedDevOrigins: [
    'https://relaxed-solely-parrot.ngrok-free.app/',
    'localhost:3000',
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname:'img.clerk.com'
        
      }
    ],
  },
};

module.exports = nextConfig;
