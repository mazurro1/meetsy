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
> = ({item, sitePropsColors, texts}) => {
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

  switch (item?.type) {
    case "CHANGE_PASSWORD": {
      return <div></div>;
    }
    case "CHANGE_EMAIL": {
      return (
        <AlertUserStyle backgroundColor={backgroundColor}>
          <Paragraph
            marginBottom={0}
            marginTop={0}
            fontSize="SMALL"
            color="BLACK"
            spanBold
            spanColor={`${item?.color}_DARK`}
            dangerouslySetInnerHTML={texts!.changeEmail}
          />

          <PositionDateAlert>
            <Paragraph
              marginBottom={0}
              marginTop={0}
              fontSize="SMALL"
              color="GREY"
              spanBold
              spanColor={item.active ? item?.color : "BLACK"}
            >
              {getFullDateWithTime(new Date(item.createdAt))}
            </Paragraph>
          </PositionDateAlert>
        </AlertUserStyle>
      );
    }

    default:
      return (
        <AlertUserStyle backgroundColor={backgroundColor}>null</AlertUserStyle>
      );
  }
};

export default AlertUserGenerateAlert;
