import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import dbConnect from "@/utils/dbConnect";
import User from "@/models/user";
import { verifyPassword, hashPassword } from "@lib";
import CredentialsProvider from "next-auth/providers/credentials";

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
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "text" },
        name: { label: "Username", type: "text" },
        surname: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
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
