/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",
    env: {
        //apiurl: 'http://192.168.13.174:4500',
        apiurl: 'http://192.168.250.10:4500',
      },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'cdn.icon-icons.com'
            },
            {
                protocol: 'https',
                hostname: 'raw.githubusercontent.com'
            }
        ]
    }

};

export default nextConfig;
