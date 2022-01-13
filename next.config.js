/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_MONGO_USER_NAME: "meetsy-user",
    NEXT_PUBLIC_MONGO_USER_PASSWORD: "i8VKBY6xr3G7dt9",
    NEXT_PUBLIC_MONGO_CLUSTER_NAME: "clustermeetsy",
    NEXT_PUBLIC_MONGO_DATABASE_NAME: "Meetsy-prod",
    NEXTAUTH_URL_TOKEN_SECREET: "Qgs2w1GyMXClRt6NTppZEouawsa2wN5kFf0Sis2xeH4=",
  },
  experimental: {
    styledComponents: true,
  },
};
