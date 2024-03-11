/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "useful-ant-86.convex.cloud",
      },
    ],
  },
};

export default nextConfig;


// /** @type {import('next').NextConfig} */
// const nextConfig = {
//     // reactStrictMode: true,
//     // images: {
//     //     domains : ['https://useful-ant-86.convex.cloud', 'localhost']
//     //     // remotePatterns: [
//     //     //   {
//     //     //     hostname: 'https://useful-ant-86.convex.cloud'
//     //     //   }
//     //     // ]
//     // }
//     images : {
//       remotePatterns: [
//         {
//           protocol: 'https',
//           hostname: 'https://useful-ant-86.convex.cloud',
//           port: '',
//           pathname: '*',
//         },
//       ],
//     }
// };

// export default nextConfig;
