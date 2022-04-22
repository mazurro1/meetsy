import NextAuth from "next-auth";
import dbConnect from "@/utils/dbConnect";
import User from "@/models/User/user";
import {verifyPassword, hashPassword, randomString, SendEmail} from "@lib";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import {AllTexts} from "@Texts";
import type {LanguagesProps} from "@Texts";
import type {UserProps} from "@/models/User/user.model";
import {EnumUserConsents} from "@/models/User/user.model";

dbConnect();
export default NextAuth({
  callbacks: {
    async session({session}) {
      return session;
    },
    async signIn({user}) {
      const isAllowedToSignIn = !!user;
      if (isAllowedToSignIn) {
        return true;
      } else {
        return "/unauthorized";
      }
    },
    async jwt({token, account}) {
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
    secret: process.env.NEXT_PUBLIC_PROVIDER_TOKEN_SECREET,
  },
  secret: process.env.NEXT_PUBLIC_PROVIDER_TOKEN_SECREET,
  pages: {
    signIn: "/auth/signin",
    error: "/404",
  },
  theme: {
    colorScheme: "dark",
    brandColor: "",
    logo: "",
  },
  providers: [
    GoogleProvider({
      clientId: !!process.env.NEXT_PUBLIC_PROVIDER_GOOGLE_CLIENT
        ? process.env.NEXT_PUBLIC_PROVIDER_GOOGLE_CLIENT
        : "",
      clientSecret: !!process.env.NEXT_PUBLIC_PROVIDER_GOOGLE_SECRET
        ? process.env.NEXT_PUBLIC_PROVIDER_GOOGLE_SECRET
        : "",
      profile(profile) {
        return User.findOne({
          email: profile.email,
        })
          .select("_id email userDetails")
          .then((selectedUser) => {
            if (!!!selectedUser) {
              const selectedLanguage: LanguagesProps = !!profile.locale
                ? profile!.locale === "pl"
                  ? "pl"
                  : "en"
                : "en";
              const newUser = new User({
                email: profile.email,
                emailCode: null,
                recoverCode: null,
                password: null,
                defaultCompanyId: null,
                consents: [
                  EnumUserConsents.sendSmsAllServices,
                  EnumUserConsents.sendEmailsAllServices,
                  EnumUserConsents.sendEmailsMarketing,
                ],
                userDetails: {
                  name: profile!.given_name,
                  surname: profile!.family_name,
                  language: selectedLanguage,
                  avatarUrl: profile!.picture,
                  hasPassword: false,
                  emailIsConfirmed: true,
                  toConfirmEmail: null,
                },
                phoneDetails: {
                  number: null,
                  regionalCode: null,
                  toConfirmNumber: null,
                  toConfirmRegionalCode: null,
                  has: false,
                  isConfirmed: false,
                  code: null,
                  dateSendAgainSMS: new Date(),
                },
                pushEndpoint: {
                  endpoint: null,
                  expirationTime: null,
                  keys: {
                    p256dh: null,
                    auth: null,
                  },
                },
              });
              return newUser.save().then(async (savedUser) => {
                if (!!!savedUser.userDetails.emailIsConfirmed) {
                  const userLanguage: LanguagesProps =
                    savedUser.userDetails.language;
                  await SendEmail({
                    userEmail: savedUser.email,
                    emailTitle:
                      AllTexts?.ConfirmEmail?.[userLanguage]
                        ?.confirmEmailAdress,
                    emailContent: `${AllTexts?.ConfirmEmail[userLanguage]?.codeToConfirm} ${savedUser.emailCode}`,
                  });
                }

                return savedUser;
              });
            } else {
              const valuesToReturn: UserProps = {
                _id: selectedUser._id,
                email: selectedUser.email,
                userDetails: selectedUser.userDetails,
                phoneDetails: selectedUser.phoneDetails,
                pushEndpoint: selectedUser.pushEndpoint,
                consents: selectedUser.consents,
                defaultCompanyId: selectedUser.defaultCompanyId,
              };
              return valuesToReturn;
            }
          })
          .then(async (userToReturn) => {
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
      clientId: !!process.env.NEXT_PUBLIC_PROVIDER_FACEBOOK_CLIENT
        ? process.env.NEXT_PUBLIC_PROVIDER_FACEBOOK_CLIENT
        : "",
      clientSecret: !!process.env.NEXT_PUBLIC_PROVIDER_FACEBOOK_SECRET
        ? process.env.NEXT_PUBLIC_PROVIDER_FACEBOOK_SECRET
        : "",

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
                emailCode: null,
                recoverCode: null,
                password: null,
                defaultCompanyId: null,
                consents: [
                  EnumUserConsents.sendSmsAllServices,
                  EnumUserConsents.sendEmailsAllServices,
                  EnumUserConsents.sendEmailsMarketing,
                ],
                userDetails: {
                  name: !!userName[0] ? userName[0] : "",
                  surname: !!userName[1] ? userName[1] : "",
                  language: "pl",
                  avatarUrl: !!profile!.picture!.data!.url
                    ? profile!.picture!.data!.url
                    : "",
                  hasPassword: false,
                  emailIsConfirmed: true,
                  toConfirmEmail: null,
                },
                phoneDetails: {
                  number: null,
                  regionalCode: null,
                  toConfirmNumber: null,
                  toConfirmRegionalCode: null,
                  has: false,
                  isConfirmed: false,
                  code: null,
                  dateSendAgainSMS: new Date(),
                },
                pushEndpoint: {
                  endpoint: null,
                  expirationTime: null,
                  keys: {
                    p256dh: null,
                    auth: null,
                  },
                },
              });
              return newUser.save().then(async (savedUser) => {
                if (!!!savedUser.userDetails.emailIsConfirmed) {
                  const userLanguage: LanguagesProps =
                    savedUser.userDetails.language;

                  await SendEmail({
                    userEmail: savedUser.email,
                    emailTitle:
                      AllTexts?.ConfirmEmail[userLanguage]?.confirmEmailAdress,
                    emailContent: `${AllTexts?.ConfirmEmail[userLanguage]?.codeToConfirm} ${savedUser.emailCode}`,
                  });
                }

                return savedUser;
              });
            } else {
              const valuesToReturn: UserProps = {
                _id: selectedUser._id,
                email: selectedUser.email,
                userDetails: selectedUser.userDetails,
                phoneDetails: selectedUser.phoneDetails,
                pushEndpoint: selectedUser.pushEndpoint,
                consents: selectedUser.consents,
                defaultCompanyId: selectedUser.defaultCompanyId,
              };
              return valuesToReturn;
            }
          })
          .then(async (userToReturn) => {
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
        email: {label: "Email", type: "text"},
        password: {label: "Password", type: "password"},
        type: {label: "Type", type: "text"},
        name: {label: "Name", type: "text"},
        surname: {label: "Surname", type: "text"},
        phone: {label: "Phone", type: "text"},
        phoneRegionalCode: {label: "PhoneRegionalCode", type: "text"},
      },
      async authorize(credentials) {
        if (!!credentials) {
          if (credentials.type === "login") {
            const selectedUser = await User.findOne({
              email: credentials.email,
            }).select("_id email userDetails password");
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
              selectedUser.recoverCode = null;
              selectedUser.save();
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
              const randomCodeEmail = randomString(6);

              const newUser = new User({
                email: credentials.email,
                emailCode: randomCodeEmail,
                recoverCode: null,
                password: hashedPassword,
                defaultCompanyId: null,
                consents: [
                  EnumUserConsents.sendSmsAllServices,
                  EnumUserConsents.sendEmailsAllServices,
                  EnumUserConsents.sendEmailsMarketing,
                ],
                userDetails: {
                  name: credentials.name,
                  surname: credentials.surname,
                  language: "pl",
                  avatarUrl: "",
                  hasPassword: true,
                  emailIsConfirmed: false,
                  toConfirmEmail: null,
                },
                phoneDetails: {
                  number: credentials.phone,
                  regionalCode: credentials.phoneRegionalCode,
                  toConfirmNumber: null,
                  toConfirmRegionalCode: null,
                  has: !!credentials.phone,
                  isConfirmed: false,
                  code: null,
                  dateSendAgainSMS: new Date(),
                },
                pushEndpoint: {
                  endpoint: null,
                  expirationTime: null,
                  keys: {
                    p256dh: null,
                    auth: null,
                  },
                },
              });

              const savedUser = await newUser.save();

              if (!!savedUser) {
                const userLanguage: LanguagesProps =
                  savedUser.userDetails.language;
                if (!!!savedUser.userDetails.emailIsConfirmed) {
                  await SendEmail({
                    userEmail: savedUser.email,
                    emailTitle:
                      AllTexts?.ConfirmEmail[userLanguage]?.confirmEmailAdress,
                    emailContent: `${AllTexts?.ConfirmEmail[userLanguage]?.codeToConfirm} ${savedUser.emailCode}`,
                  });
                }
              }

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
  ],
});
