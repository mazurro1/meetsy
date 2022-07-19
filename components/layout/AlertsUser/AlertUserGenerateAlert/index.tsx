import {NextPage} from "next";
import type {ITranslatesProps, ISiteProps} from "@hooks";
import {withSiteProps} from "@hooks";
import {AlertUserStyle, PositionDateAlert} from "./AlertUserContentItem.style";
import type {AlertUserContentItemProps} from "../AlertUserContentItem/AlertUserContentItem.model";
import {Colors} from "@constants";
import type {ColorsInterface} from "@constants";
import {Paragraph, ButtonIcon} from "@ui";
import {getFullDateWithTime} from "@functions";

interface AlertUserGenerateAlertProps {
  sitePropsColors: ColorsInterface;
}

const AlertUserGenerateAlert: NextPage<
  AlertUserContentItemProps &
    AlertUserGenerateAlertProps &
    ITranslatesProps &
    ISiteProps
> = ({item, sitePropsColors, texts, isLast, router}) => {
  let backgroundColorActive: string = "";
  const backgroundColorDefault: string =
    Colors(sitePropsColors).backgroundColorPage;

  switch (item?.color) {
    case "PRIMARY": {
      backgroundColorActive = Colors(sitePropsColors).primaryColorLight;
      break;
    }
    case "SECOND": {
      backgroundColorActive = Colors(sitePropsColors).secondColorLight;
      break;
    }
    case "RED": {
      backgroundColorActive = Colors(sitePropsColors).dangerColorLight;
      break;
    }
    case "GREEN": {
      backgroundColorActive = Colors(sitePropsColors).successColorLight;
      break;
    }
    case "GREY": {
      backgroundColorActive = Colors(sitePropsColors).greyColorLight;
      break;
    }

    default: {
      backgroundColorActive = Colors(sitePropsColors).backgroundColorPage;
      break;
    }
  }

  const backgroundColor: string = item?.active
    ? backgroundColorActive
    : backgroundColorDefault;

  const simpleTemplate = (textAlert: string = "", extraContent: any = null) => {
    return (
      <AlertUserStyle backgroundColor={backgroundColor} isLast={isLast}>
        <Paragraph
          marginBottom={0}
          marginTop={0}
          fontSize="SMALL"
          color="BLACK"
          spanBold
          spanColor={`${item!.color}_DARK`}
          dangerouslySetInnerHTML={textAlert}
        />
        {extraContent}

        <PositionDateAlert>
          <Paragraph
            marginBottom={0}
            marginTop={0}
            fontSize="SMALL"
            color="GREY"
            spanBold
            spanColor={item!.active ? item?.color : "BLACK"}
          >
            {getFullDateWithTime(
              !!item!.createdAt ? new Date(item!.createdAt) : new Date()
            )}
          </Paragraph>
        </PositionDateAlert>
      </AlertUserStyle>
    );
  };

  let companyName = "";
  if (typeof item?.companyId !== "string") {
    if (item?.companyId?.companyDetails.name) {
      companyName = item?.companyId?.companyDetails.name.toUpperCase();
    }
  }

  switch (item?.type) {
    case "CHANGED_PASSWORD": {
      return simpleTemplate(texts!.changedPassword);
    }
    case "CHANGED_EMAIL": {
      return simpleTemplate(texts!.changedEmail);
    }

    case "CHANGED_CONSENTS": {
      return simpleTemplate(texts!.changedConsents);
    }

    case "CHANGED_PHONE_NUMBER": {
      return simpleTemplate(texts!.changedPhoneNumber);
    }

    case "CHANGED_ACCOUNT_PROPS": {
      return simpleTemplate(texts!.changedAccountProps);
    }

    case "CREATED_COMPANY": {
      return simpleTemplate(texts!.createdNewCompany);
    }

    case "CHANGED_COMPANY_CONTACT": {
      return simpleTemplate(
        `${texts!.updatedCompanyContact} <span>${companyName}</span>`
      );
    }

    case "CHANGED_COMPANY_EMAIL": {
      return simpleTemplate(
        `${texts!.updatedCompanyEmail} <span>${companyName}</span>`
      );
    }

    case "CHANGED_COMPANY_PHONE": {
      return simpleTemplate(
        `${texts!.updatedCompanyPhone} <span>${companyName}</span>`
      );
    }
    case "CHANGED_COMPANY_INFORMATION": {
      return simpleTemplate(
        `${texts!.updatedCompanyInformation} <span>${companyName}</span>`
      );
    }

    case "INVITATION_COMPANY_WORKER": {
      return simpleTemplate(
        `${texts!.invitationCompanyWorker} <span>${companyName}</span>`,
        <div className="mt-5 mb-5">
          <ButtonIcon
            id="button_go_to_invations"
            onClick={() => {}}
            color="SECOND"
            iconName="MailIcon"
            fontSize="SMALL"
            fullWidth
            loadingToChangeRouteLink="/account?component=invations"
          >
            {texts!.goToInvations}
          </ButtonIcon>
        </div>
      );
    }

    case "SENDED_INVITATION_COMPANY_WORKER": {
      return (
        <>
          {simpleTemplate(
            `${
              texts!.sendedInvitationCompanyWorker
            } <span>${companyName}</span>`
          )}
        </>
      );
    }

    case "INVITATION_COMPANY_WORKER_CANCELED": {
      return (
        <>
          {simpleTemplate(
            `${
              texts!.canceledInvitationCompanyWorker
            } <span>${companyName}</span>`
          )}
        </>
      );
    }

    case "INVITATION_COMPANY_WORKER_ACCEPTED": {
      return (
        <>
          {simpleTemplate(
            `${
              texts!.acceptedInvitationCompanyWorker
            } <span>${companyName}</span>`
          )}
        </>
      );
    }

    case "DELETE_COMPANY_WORKER": {
      return (
        <>
          {simpleTemplate(
            `${texts!.deleteCompanyWorker} <span>${companyName}</span>`
          )}
        </>
      );
    }

    case "DELETE_INVITATION_COMPANY_WORKER": {
      return (
        <>
          {simpleTemplate(
            `${
              texts!.deleteInvitationCompanyWorker
            } <span>${companyName}</span>`
          )}
        </>
      );
    }

    case "DELETED_COMPANY_WORKER": {
      return (
        <>
          {simpleTemplate(
            `${texts!.deletedCompanyWorker} <span>${companyName}</span>`
          )}
        </>
      );
    }

    case "DELETED_INVITATION_COMPANY_WORKER": {
      return (
        <>
          {simpleTemplate(
            `${
              texts!.deletedInvitationCompanyWorker
            } <span>${companyName}</span>`
          )}
        </>
      );
    }

    case "EDITED_COMPANY_WORKER": {
      return (
        <>
          {simpleTemplate(
            `${texts!.editedCompanyWorker} <span>${companyName}</span>`
          )}
        </>
      );
    }

    case "BANED_COMPANY": {
      return (
        <>
          {simpleTemplate(`${texts!.banedCompany} <span>${companyName}</span>`)}
        </>
      );
    }

    case "UNBANED_COMPANY": {
      return (
        <>
          {simpleTemplate(
            `${texts!.unBanedCompany} <span>${companyName}</span>`
          )}
        </>
      );
    }

    case "REMOVE_AS_ADMIN": {
      return (
        <>
          {simpleTemplate(
            `${texts!.removeAsAdmin} <span>${companyName}</span>`
          )}
        </>
      );
    }

    case "SET_AS_ADMIN": {
      return (
        <>
          {simpleTemplate(`${texts!.setAsAdmin} <span>${companyName}</span>`)}
        </>
      );
    }

    default:
      return simpleTemplate("");
  }
};

export default withSiteProps(AlertUserGenerateAlert);
