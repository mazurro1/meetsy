import type {NextPage} from "next";
import type {HeadingProps} from "./Heading.model";
import {HeadingStyle} from "./Heading.style";
import {Colors, ColorsInterface} from "@constants";
import {withSiteProps} from "@hooks";
import type {ISiteProps} from "@hooks";

const Heading: NextPage<HeadingProps & ISiteProps> = ({
  siteProps = {
    blind: false,
    dark: false,
    language: "pl",
  },
  tag = 1,
  children,
  marginTop = 1.2,
  marginBottom = 1.2,
  color = "BLACK",
  uppercase = false,
  underline = false,
  letterSpacing = 0,
}) => {
  const SelectedTag: any = `h${tag}`;
  const sitePropsColors: ColorsInterface = {
    blind: siteProps.blind,
    dark: siteProps.dark,
  };

  let colorText: string = "";

  switch (color) {
    case "PRIMARY": {
      colorText = Colors(sitePropsColors).primaryColor;
      break;
    }
    case "PRIMARY_DARK": {
      colorText = Colors(sitePropsColors).primaryColorDark;
      break;
    }
    case "SECOND": {
      colorText = Colors(sitePropsColors).secondColor;
      break;
    }
    case "RED": {
      colorText = Colors(sitePropsColors).dangerColor;
      break;
    }
    case "GREEN": {
      colorText = Colors(sitePropsColors).successColor;
      break;
    }
    case "GREY": {
      colorText = Colors(sitePropsColors).greyColor;
      break;
    }
    case "BLACK": {
      colorText = Colors(sitePropsColors).textBlack;
      break;
    }
    case "BLACK_ONLY": {
      colorText = Colors(sitePropsColors).textOnlyBlack;
      break;
    }
    case "WHITE": {
      colorText = Colors(sitePropsColors).textWhite;
      break;
    }
    case "WHITE_ONLY": {
      colorText = Colors(sitePropsColors).textOnlyWhite;
      break;
    }

    default: {
      colorText = Colors(sitePropsColors).textBlack;
      break;
    }
  }

  return (
    <HeadingStyle
      as={SelectedTag}
      color={colorText}
      marginTop={marginTop}
      marginBottom={marginBottom}
      uppercase={uppercase}
      underline={underline}
      letterSpacing={letterSpacing}
    >
      {children}
    </HeadingStyle>
  );
};

export default withSiteProps(Heading);
