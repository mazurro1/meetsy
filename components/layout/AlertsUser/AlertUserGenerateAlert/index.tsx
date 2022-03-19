import {NextPage} from "next";
import type {ITranslatesProps} from "@hooks";
import {AlertUserStyle, PositionDateAlert} from "./AlertUserContentItem.style";
import type {AlertUserContentItemProps} from "../AlertUserContentItem/AlertUserContentItem.model";
import {Colors} from "@constants";
import type {ColorsInterface} from "@constants";
import {Paragraph} from "@ui";
import {getFullDateWithTime} from "@functions";

interface AlertUserGenerateAlertProps {
  sitePropsColors: ColorsInterface;
}

const AlertUserGenerateAlert: NextPage<
  AlertUserContentItemProps & AlertUserGenerateAlertProps & ITranslatesProps
> = ({item, sitePropsColors, texts, isLast}) => {
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

  const simpleTemplate = (textAlert: string = "") => {
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

    default:
      return simpleTemplate("");
  }
};

export default AlertUserGenerateAlert;
