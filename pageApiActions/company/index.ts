import User from "@/models/User/user";
import Company from "@/models/Company/company";
import CompanyWorker from "@/models/CompanyWorker/companyWorker";
import {EnumWorkerPermissions} from "@/models/CompanyWorker/companyWorker.model";
import type {NextApiResponse} from "next";
import type {DataProps} from "@/utils/type";
import {AllTexts} from "@Texts";
import type {LanguagesProps} from "@Texts";
import {convertToValidString, stringToUrl} from "@functions";
import {randomString, SendEmail, UserAlertsGenerator} from "@lib";
import mongoose from "mongoose";

export const getUserCompanys = async (
  userEmail: string,
  validContentLanguage: LanguagesProps,
  res: NextApiResponse<DataProps>
) => {
  try {
    const user = await User.findOne({
      email: userEmail,
      password: {$ne: null},
      "userDetails.emailIsConfirmed": true,
      "phoneDetails.isConfirmed": true,
    }).select("email _id");
    if (!user) {
      res.status(401).json({
        message: AllTexts[validContentLanguage]?.ApiErrors?.notAuthentication,
        success: false,
      });
      return;
    }

    const allUserCompanys = await CompanyWorker.find({
      userId: user._id.toString(),
      active: true,
    }).populate(
      "companyId",
      "_id companyDetails.name companyDetails.nip companyDetails.avatarUrl companyDetails.images companyDetails.emailIsConfirmed companyContact phoneDetails.number phoneDetails.regionalCode phoneDetails.isConfirmed phoneDetails.has phoneDetails.dateSendAgainSMS updatedAt createdAt"
    );

    res.status(200).json({
      success: true,
      data: {
        userCompanys: allUserCompanys,
      },
    });
    return;
  } catch (error) {
    res.status(500).json({
      message: AllTexts[validContentLanguage]?.ApiErrors?.somethingWentWrong,
      success: false,
    });
    return;
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
    const findUser = await User.findOne({
      email: userEmail,
      password: {$ne: null},
      "userDetails.emailIsConfirmed": true,
      "phoneDetails.isConfirmed": true,
    }).select("_id");
    if (!!findUser) {
      const findCompany = await Company.findOne({email: email}).select("_id");
      if (!!findCompany) {
        return res.status(422).json({
          message: AllTexts[validContentLanguage]?.ApiErrors?.notFoundEmail,
          success: false,
        });
      } else {
        const randomCodeEmail = randomString(6);
        const newCompany = new Company({
          email: email,
          emailCode: randomCodeEmail.toUpperCase(),
          companyDetails: {
            name: name,
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
                  AllTexts[validContentLanguage].ConfirmEmail
                    .confirmEmailAdressCompany,
                emailContent: `${AllTexts[validContentLanguage].ConfirmEmail.codeToConfirmCompany} ${savedCompany.emailCode}`,
              });

              await UserAlertsGenerator({
                data: {
                  color: "SECOND",
                  type: "CREATED_COMPANY",
                  userId: findUser._id,
                  active: true,
                },
                email: null,
                webpush: null,
                forceEmail: false,
                forceSocket: false,
                res: res,
              });
            }

            res.status(200).json({
              success: true,
              message: AllTexts[validContentLanguage]?.Company?.createdCompany,
              data: {
                companyId: savedCompany._id,
              },
            });
          } else {
            return res.status(422).json({
              message:
                AllTexts[validContentLanguage]?.ApiErrors?.somethingWentWrong,
              success: false,
            });
          }
        } else {
          return res.status(422).json({
            message:
              AllTexts[validContentLanguage]?.ApiErrors?.somethingWentWrong,
            success: false,
          });
        }
      }
    } else {
      return res.status(422).json({
        message: AllTexts[validContentLanguage]?.ApiErrors?.notAuthentication,
        success: false,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(501).json({
      success: false,
      message: AllTexts[validContentLanguage]?.ApiErrors?.somethingWentWrong,
    });
  }
};
