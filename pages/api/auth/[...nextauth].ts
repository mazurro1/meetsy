import NextAuth from "next-auth";
import dbConnect from "@/utils/dbConnect";
import User from "@/models/user";
import { verifyPassword, hashPassword } from "@lib";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";

dbConnect();
export default NextAuth({
  callbacks: {
    async session({ session, token, user }) {
      session.accessToken = token.accessToken;
      return session;
    },
    async signIn({ user }) {
      const isAllowedToSignIn = !!user;
      if (isAllowedToSignIn) {
        return true;
      } else {
        return "/unauthorized";
      }
    },
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
  },
  session: {
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
    strategy: "jwt",
  },
  jwt: {
    maxAge: 60 * 60 * 24 * 30,
    secret: process.env.PROVIDER_TOKEN_SECREET,
  },
  pages: {
    signIn: "/auth/signin",
    error: "/404",
  },
  theme: {
    colorScheme: "dark", // "auto" | "dark" | "light"
    brandColor: "", // Hex color value
    logo: "", // Absolute URL to logo image
  },
  providers: [
    GoogleProvider({
      clientId: !!process.env.PROVIDER_GOOGLE_CLIENT
        ? process.env.PROVIDER_GOOGLE_CLIENT
        : "",
      clientSecret: !!process.env.PROVIDER_GOOGLE_SECRET
        ? process.env.PROVIDER_GOOGLE_SECRET
        : "",
      profile(profile) {
        return User.findOne({
          email: profile.email,
        })
          .select("_id email userDetails")
          .then((selectedUser) => {
            if (!!!selectedUser) {
              const newUser = new User({
                email: profile.email,
                password: null,
                userDetails: {
                  name: profile!.given_name,
                  surname: profile!.family_name,
                  language: !!profile.locale
                    ? profile!.locale === "pl"
                      ? "pl"
                      : "en"
                    : "en",
                  avatarUrl: profile!.picture,
                  isNewFromSocial: true,
                  emailIsConfirmed: !!profile.email_verified,
                },
                phoneDetails: {
                  number: null,
                  regionalCode: null,
                  has: false,
                  isConfirmed: false,
                },
              });
              return newUser.save();
            } else {
              const valuesToReturn: any = {
                _id: selectedUser._id,
                email: selectedUser.email,
                userDetails: {
                  name: selectedUser.userDetails.name,
                  surname: selectedUser.userDetails.surname,
                  avatarUrl: !!selectedUser.userDetails.avatarUrl ? "" : "",
                },
              };
              return valuesToReturn;
            }
          })
          .then((userToReturn) => {
            return {
              id: userToReturn!._id.toString(),
              name: `${userToReturn!.userDetails.name} ${
                userToReturn!.userDetails.surname
              }`,
              email: userToReturn!.email,
            };
          });
      },
    }),
    FacebookProvider({
      clientId: !!process.env.PROVIDER_FACEBOOK_CLIENT
        ? process.env.PROVIDER_FACEBOOK_CLIENT
        : "",
      clientSecret: !!process.env.PROVIDER_FACEBOOK_SECRET
        ? process.env.PROVIDER_FACEBOOK_SECRET
        : "",

      // profile(profile) {
      //   return {
      //     id: profile.id,
      //     name: profile.name,
      //     email: profile.email,
      //     image: profile.picture.data.url,
      //   };
      // },
      profile(profile) {
        return User.findOne({
          email: profile!.email,
        })
          .select("_id email userDetails")
          .then((selectedUser) => {
            if (!!!selectedUser) {
              const userName: string[] = profile.name.split(" ");
              const newUser = new User({
                email: profile.email,
                password: null,
                userDetails: {
                  name: !!userName[0] ? userName[0] : "",
                  surname: !!userName[1] ? userName[1] : "",
                  language: "pl",
                  avatarUrl: !!profile!.picture!.data!.url
                    ? profile!.picture!.data!.url
                    : "",
                  isNewFromSocial: true,
                  emailIsConfirmed: true,
                },
                phoneDetails: {
                  number: null,
                  regionalCode: null,
                  has: false,
                  isConfirmed: false,
                },
              });
              return newUser.save();
            } else {
              const valuesToReturn: any = {
                _id: selectedUser._id,
                email: selectedUser.email,
                userDetails: {
                  name: selectedUser.userDetails.name,
                  surname: selectedUser.userDetails.surname,
                  avatarUrl: !!selectedUser.userDetails.avatarUrl ? "" : "",
                },
              };
              return valuesToReturn;
            }
          })
          .then((userToReturn) => {
            return {
              id: userToReturn!._id.toString(),
              name: `${userToReturn!.userDetails.name} ${
                userToReturn!.userDetails.surname
              }`,
              email: userToReturn!.email,
              image: !!userToReturn!.userDetails.avatarUrl
                ? userToReturn!.userDetails.avatarUrl
                : null,
            };
          });
      },
    }),
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        type: { label: "Type", type: "text" },
        name: { label: "Name", type: "text" },
        surname: { label: "Surname", type: "text" },
        phone: { label: "Phone", type: "text" },
        phoneRegionalCode: { label: "PhoneRegionalCode", type: "text" },
      },
      async authorize(credentials) {
        if (!!credentials) {
          if (credentials.type === "login") {
            const selectedUser = await User.findOne({
              email: credentials.email,
            }).select("_id email userDetails");
            if (!selectedUser) {
              throw new Error("No user found!");
            } else if (!!selectedUser.password) {
              const isValidPassword = await verifyPassword(
                credentials.password,
                selectedUser.password
              );
              if (!isValidPassword) {
                throw new Error("Could not log you in!");
              }
              return {
                id: selectedUser._id,
                email: selectedUser.email,
                name: `${selectedUser.userDetails.name} ${selectedUser.userDetails.surname}`,
              };
            } else {
              return null;
            }
          } else if (credentials.type === "registration") {
            const selectedUser = await User.findOne({
              email: credentials.email,
            }).select("_id email userDetails");
            if (!!selectedUser) {
              throw new Error("Email busy!");
            } else if (
              !!credentials.email &&
              !!credentials.name &&
              !!credentials.surname &&
              !!credentials.password
            ) {
              const hashedPassword = await hashPassword(credentials.password);
              const newUser = new User({
                email: credentials.email,
                password: hashedPassword,
                userDetails: {
                  name: credentials.name,
                  surname: credentials.surname,
                  language: "pl",
                  avatarUrl: "",
                  isNewFromSocial: false,
                  emailIsConfirmed: false,
                },
                phoneDetails: {
                  number: credentials.phone,
                  regionalCode: credentials.phoneRegionalCode,
                  has: !!credentials.phone,
                  isConfirmed: false,
                },
              });
              const savedUser = await newUser.save();
              return {
                id: savedUser._id,
                email: savedUser.email,
                name: `${savedUser.userDetails.name} ${savedUser.userDetails.surname}`,
              };
            } else {
              return null;
            }
          }
        }
        return null;
      },
    }),
    // EmailProvider({
    //   server: process.env.MAIL_SERVER,
    //   from: "NextAuth.js <no-reply@example.com>",
    // }),
  ],
});
