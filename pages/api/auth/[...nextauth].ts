import NextAuth from "next-auth";
import dbConnect from "@/utils/dbConnect";
import User from "@/models/user";
import { verifyPassword } from "@lib";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";

dbConnect();
export default NextAuth({
  callbacks: {
    async session({ session, token, user }) {
      session.accessToken = token.accessToken;
      session.userId = session.sub;
      return session;
    },
  },

  session: {
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
  jwt: {
    maxAge: 60 * 60 * 24 * 30,
    secret: process.env.NEXTAUTH_URL_TOKEN_SECREET,
  },
  providers: [
    GoogleProvider({
      clientId: !!process.env.NEXTAUTH_GOOGLE_CLIENT
        ? process.env.NEXTAUTH_GOOGLE_CLIENT
        : "",
      clientSecret: !!process.env.NEXTAUTH_GOOGLE_SECRET
        ? process.env.NEXTAUTH_GOOGLE_SECRET
        : "",
      async profile(profile) {
        return User.findOne({
          email: profile.email,
        })
          .then((selectedUser) => {
            if (!!!selectedUser) {
              const newUser = new User({
                email: profile.email,
                name: profile.given_name,
                surname: profile.family_name,
                password: null,
                // language: profile.locale
                // picture: profile.picture,
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
              id: userToReturn._id,
              name: `${userToReturn.name} ${userToReturn.surname}`,
              email: userToReturn.email,
            };
          });
      },
    }),
    FacebookProvider({
      clientId: !!process.env.NEXTAUTH_FACEBOOK_CLIENT
        ? process.env.NEXTAUTH_FACEBOOK_CLIENT
        : "",
      clientSecret: !!process.env.NEXTAUTH_FACEBOOK_SECRET
        ? process.env.NEXTAUTH_FACEBOOK_SECRET
        : "",
      async profile(profile) {
        return User.findOne({
          email: profile.email,
        })
          .then((selectedUser) => {
            if (!!!selectedUser) {
              const userName = profile.name.split(" ");
              const newUser = new User({
                email: profile.email,
                name: userName[0],
                surname: !!userName[1] ? userName[1] : "",
                password: null,
                // picture: profile.picture.data.url,
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
              id: userToReturn._id,
              name: `${userToReturn.name} ${userToReturn.surname}`,
              email: userToReturn.email,
            };
          });
      },
    }),
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "text" },
        name: { label: "Username", type: "text" },
        surname: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!!credentials) {
          const selectedUser = await User.findOne({
            email: credentials.email,
          });
          if (!selectedUser) {
            throw new Error("No user found!");
          }
          const isValidPassword = await verifyPassword(
            credentials.password,
            selectedUser.password
          );
          if (!isValidPassword) {
            throw new Error("Could not log you in!");
          }
          return {
            email: selectedUser.email,
            name: `${selectedUser.name} ${selectedUser.surname}`,
          };
        }
        return null;
      },
    }),
  ],
});
