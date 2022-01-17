const { PHASE_DEVELOPMENT_SERVER } = require("next/constants");

module.exports = (phase) => {
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    return {
      env: {
        NEXT_PUBLIC_MONGO_USER_NAME: "meetsy-user",
        NEXT_PUBLIC_MONGO_USER_PASSWORD: "i8VKBY6xr3G7dt9",
        NEXT_PUBLIC_MONGO_CLUSTER_NAME: "clustermeetsy",
        NEXT_PUBLIC_MONGO_DATABASE_NAME: "Meetsy-prod",
        NEXT_PUBLIC_TOKEN_SECREET:
          "Qgs2w1GyMXClRt6NTppZEouawsa2wN5kFf0Sis2xeH4=",
        NEXT_PUBLIC_GOOGLE_CLIENT:
          "241873345529-krev89do1rkuc6mu6gr0fec99jscgfgf.apps.googleusercontent.com",
        NEXT_PUBLIC_GOOGLE_SECRET: "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",
        NEXT_PUBLIC_FACEBOOK_CLIENT: "661499325296053",
        NEXT_PUBLIC_FACEBOOK_SECRET: "c4776bc67105572002fd0aefd62d1602",
        NEXTAUTH_URL: "http://localhost:3000/api/auth",
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
      NEXT_PUBLIC_TOKEN_SECREET: "Qgs2w1GyMXClRt6NTppZEouawsa2wN5kFf0Sis2xeH4=",
      NEXTAUTH_URL: "localhost:3000",
      NEXT_PUBLIC_GOOGLE_CLIENT:
        "241873345529-krev89do1rkuc6mu6gr0fec99jscgfgf.apps.googleusercontent.com",
      NEXT_PUBLIC_GOOGLE_SECRET: "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",
      NEXT_PUBLIC_FACEBOOK_CLIENT: "661499325296053",
      NEXT_PUBLIC_FACEBOOK_SECRET: "c4776bc67105572002fd0aefd62d1602",
    },
    experimental: {
      styledComponents: true,
    },
  };
};
