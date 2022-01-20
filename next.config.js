const { PHASE_DEVELOPMENT_SERVER } = require("next/constants");

module.exports = (phase) => {
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    return {
      env: {
        NEXT_PUBLIC_MONGO_USER_NAME: "meetsy-user",
        NEXT_PUBLIC_MONGO_USER_PASSWORD: "i8VKBY6xr3G7dt9",
        NEXT_PUBLIC_MONGO_CLUSTER_NAME: "clustermeetsy",
        NEXT_PUBLIC_MONGO_DATABASE_NAME: "Meetsy-prod",
        PROVIDER_TOKEN_SECREET: "Qgs2w1GyMXClRt6NTppZEouawsa2wN5kFf0Sis2xeH4=",
        NEXTAUTH_URL: "http://localhost:3000/api/auth",
        PROVIDER_GOOGLE_CLIENT:
          "241873345529-krev89do1rkuc6mu6gr0fec99jscgfgf.apps.googleusercontent.com",
        PROVIDER_GOOGLE_SECRET: "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",
        PROVIDER_FACEBOOK_CLIENT: "661499325296053",
        PROVIDER_FACEBOOK_SECRET: "c4776bc67105572002fd0aefd62d1602",
      },
      experimental: {
        styledComponents: true,
      },
    };
  }
  return {
    env: {
      NEXT_PUBLIC_MONGO_USER_NAME: "meetsy-user",
      NEXT_PUBLIC_MONGO_USER_PASSWORD: "i8VKBY6xr3G7dt9",
      NEXT_PUBLIC_MONGO_CLUSTER_NAME: "clustermeetsy",
      NEXT_PUBLIC_MONGO_DATABASE_NAME: "Meetsy-prod",
      PROVIDER_TOKEN_SECREET: "Qgs2w1GyMXClRt6NTppZEouawsa2wN5kFf0Sis2xeH4=",
      NEXTAUTH_URL: "http://localhost:3000/api/auth",
      PROVIDER_GOOGLE_CLIENT:
        "241873345529-krev89do1rkuc6mu6gr0fec99jscgfgf.apps.googleusercontent.com",
      PROVIDER_GOOGLE_SECRET: "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",
      PROVIDER_FACEBOOK_CLIENT: "661499325296053",
      PROVIDER_FACEBOOK_SECRET: "c4776bc67105572002fd0aefd62d1602",
    },
    experimental: {
      styledComponents: true,
    },
  };
};
