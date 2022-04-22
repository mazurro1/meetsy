import User from "@/models/User/user";
import Company from "@/models/Company/company";
import CompanyWorker from "@/models/CompanyWorker/companyWorker";
import {EnumWorkerPermissions} from "@/models/CompanyWorker/companyWorker.model";
import type {NextApiResponse} from "next";
import type {DataProps} from "@/utils/type";
import {AllTexts} from "@Texts";
import type {LanguagesProps} from "@Texts";
import {convertToValidString, stringToUrl} from "@functions";
import {
  randomString,
  SendEmail,
  UserAlertsGenerator,
  findValidUser,
} from "@lib";
import mongoose from "mongoose";

export const getUserCompanys = async (
  userEmail: string,
  validContentLanguage: LanguagesProps,
  res: NextApiResponse<DataProps>
) => {
  try {
    const isValidUserCheck = await findValidUser({userEmail: userEmail});
    if (!isValidUserCheck) {
      return res.status(401).json({
        message: AllTexts?.ApiErrors?.[validContentLanguage]?.notAuthentication,
        success: false,
        data: {
          status: 401,
        },
      });
    }

    const allUserCompanys = await CompanyWorker.find({
      userId: isValidUserCheck._id.toString(),
      active: true,
    }).populate(
      "companyId",
      "_id email companyDetails.name companyDetails.toConfirmEmail companyDetails.nip companyDetails.avatarUrl companyDetails.images companyDetails.emailIsConfirmed companyContact phoneDetails.number phoneDetails.regionalCode phoneDetails.isConfirmed phoneDetails.has phoneDetails.dateSendAgainSMS updatedAt createdAt"
    );

    return res.status(200).json({
      success: true,
      data: {
        userCompanys: allUserCompanys,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
      success: false,
    });
  }
};

export const createCompany = async (
  userEmail: string,
  email: string,
  name: string,
  nip: number | null,
  postalCode: number,
  city: string,
  district: string,
  street: string,
  phone: number,
  regionalCode: number,
  validContentLanguage: LanguagesProps,
  res: NextApiResponse<DataProps>
) => {
  try {
    const findUser = await findValidUser({userEmail: userEmail});
    if (!!findUser) {
      const findCompany = await Company.countDocuments({
        email: email.toLowerCase(),
      });
      const findCompanyName = await Company.countDocuments({
        "companyDetails.name": name.toLowerCase(),
      });
      if (!!findCompany || !!findCompanyName) {
        if (findCompanyName) {
          return res.status(422).json({
            message:
              AllTexts?.ApiErrors?.[validContentLanguage]?.notFoundCompanyName,
            success: false,
          });
        } else {
          return res.status(422).json({
            message: AllTexts?.ApiErrors?.[validContentLanguage]?.notFoundEmail,
            success: false,
          });
        }
      } else {
        const randomCodeEmail = randomString(6);
        const newCompany = new Company({
          email: email.toLowerCase(),
          emailCode: randomCodeEmail.toUpperCase(),
          companyDetails: {
            name: name.toLowerCase(),
            nip: nip,
            avatarUrl: null,
            Images: [],
            emailIsConfirmed: false,
            toConfirmEmail: null,
          },
          companyContact: {
            postalCode: postalCode,
            city: {
              placeholder: city,
              value: convertToValidString(city),
            },
            district: {
              placeholder: district,
              value: convertToValidString(district),
            },
            street: {
              placeholder: street,
              value: convertToValidString(street),
            },
            url: stringToUrl(new mongoose.Types.ObjectId().toString()),
          },
          phoneDetails: {
            number: phone,
            regionalCode: regionalCode,
            toConfirmPhone: null,
            toConfirmRegionalCode: null,
            has: true,
            isConfirmed: false,
            code: null,
            dateSendAgainSMS: new Date(),
          },
        });

        const savedCompany = await newCompany.save();
        if (!!savedCompany) {
          const newCompanyWorker = new CompanyWorker({
            companyId: savedCompany._id.toString(),
            userId: findUser._id.toString(),
            permissions: [EnumWorkerPermissions.admin],
            active: true,
            specialization: null,
          });

          const savedOwner = await newCompanyWorker.save();
          if (!!savedOwner) {
            if (
              !!!savedCompany.companyDetails.emailIsConfirmed &&
              !!savedCompany.email
            ) {
              await SendEmail({
                userEmail: savedCompany.email,
                emailTitle:
                  AllTexts?.ConfirmEmail?.[validContentLanguage]
                    ?.confirmEmailAdressCompany,
                emailContent: `${AllTexts?.ConfirmEmail?.[validContentLanguage]?.codeToConfirmCompany} ${savedCompany.emailCode}`,
              });

              await UserAlertsGenerator({
                data: {
                  color: "SECOND",
                  type: "CREATED_COMPANY",
                  userId: findUser._id,
                  companyId: savedCompany._id,
                  active: true,
                },
                email: null,
                webpush: null,
                forceEmail: false,
                forceSocket: false,
                res: res,
              });
            }

            return res.status(200).json({
              success: true,
              message:
                AllTexts?.Company?.[validContentLanguage]?.createdCompany,
              data: {
                companyId: savedCompany._id,
              },
            });
          } else {
            return res.status(422).json({
              message:
                AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
              success: false,
            });
          }
        } else {
          return res.status(422).json({
            message:
              AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
            success: false,
          });
        }
      }
    } else {
      return res.status(422).json({
        message: AllTexts?.ApiErrors?.[validContentLanguage]?.notAuthentication,
        success: false,
      });
    }
  } catch (error) {
    return res.status(501).json({
      success: false,
      message: AllTexts?.ApiErrors?.[validContentLanguage]?.somethingWentWrong,
    });
  }
};
