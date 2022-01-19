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
    async session({ session }) {
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
  },
  session: {
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
  jwt: {
    maxAge: 60 * 60 * 24 * 30,
  },
  secret: process.env.NEXT_PUBLIC_TOKEN_SECREET,
  providers: [
    GoogleProvider({
      clientId: !!process.env.NEXT_PUBLIC_GOOGLE_CLIENT
        ? process.env.NEXT_PUBLIC_GOOGLE_CLIENT
        : "",
      clientSecret: !!process.env.NEXT_PUBLIC_GOOGLE_SECRET
        ? process.env.NEXT_PUBLIC_GOOGLE_SECRET
        : "",
      async profile(profile) {
        return User.findOne({
          email: profile.email,
        })
          .select("_id email name surname")
          .then((selectedUser) => {
            if (!!!selectedUser) {
              const newUser = new User({
                email: profile.email,
                name: profile!.given_name,
                surname: profile!.family_name,
                password: null,
                language: !!profile.locale
                  ? profile!.locale === "pl"
                    ? "pl"
                    : "en"
                  : "en",
                avatarUrl: profile!.picture,
                isNewFromSocial: true,
              });
              return newUser.save();
            } else {
              return {
                _id: selectedUser._id,
                email: selectedUser.email,
                name: selectedUser.name,
                surname: selectedUser.surname,
              };
            }
          })
          .then((userToReturn) => {
            return {
              id: userToReturn!._id.toString(),
              name: `${userToReturn!.name} ${userToReturn!.surname}`,
              email: userToReturn!.email,
            };
          });
      },
    }),
    FacebookProvider({
      clientId: !!process.env.NEXT_PUBLIC_FACEBOOK_CLIENT
        ? process.env.NEXT_PUBLIC_FACEBOOK_CLIENT
        : "",
      clientSecret: !!process.env.NEXT_PUBLIC_FACEBOOK_SECRET
        ? process.env.NEXT_PUBLIC_FACEBOOK_SECRET
        : "",
      async profile(profile) {
        return User.findOne({
          email: profile!.email,
        })
          .select("_id name surname avatarUrl email")
          .then((selectedUser) => {
            if (!!!selectedUser) {
              const userName: string[] = profile.name.split(" ");
              const newUser = new User({
                email: profile.email,
                name: !!userName[0] ? userName[0] : "",
                surname: !!userName[1] ? userName[1] : "",
                password: null,
                language: "pl",
                avatarUrl: !!profile!.picture!.data!.url
                  ? profile!.picture!.data!.url
                  : "",
                isNewFromSocial: true,
              });
              return newUser.save();
            } else {
              const valuesToReturn: any = {
                _id: selectedUser._id,
                email: selectedUser.email,
                name: selectedUser.name,
                surname: selectedUser.surname,
                avatarUrl: !!selectedUser.avatarUrl ? "" : "",
              };
              return valuesToReturn;
            }
          })
          .then((userToReturn) => {
            return {
              id: userToReturn!._id.toString(),
              name: `${userToReturn!.name} ${userToReturn!.surname}`,
              email: userToReturn!.email,
              image: !!userToReturn!.avatarUrl ? userToReturn!.avatarUrl : null,
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
      },
      async authorize(credentials) {
        if (!!credentials) {
          if (credentials.type === "login") {
            const selectedUser = await User.findOne({
              email: credentials.email,
            });
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
                name: `${selectedUser.name} ${selectedUser.surname}`,
              };
            } else {
              return null;
            }
          } else if (credentials.type === "registration") {
            const selectedUser = await User.findOne({
              email: credentials.email,
            });
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
                name: credentials.name,
                surname: credentials.surname,
                password: hashedPassword,
                language: "pl",
                isNewFromSocial: false,
                avatarUrl: "",
              });
              const savedUser = await newUser.save();
              return {
                id: savedUser._id,
                email: savedUser.email,
                name: `${savedUser.name} ${savedUser.surname}`,
              };
            } else {
              return null;
            }
          }
        }
        return null;
      },
    }),
  ],
});
