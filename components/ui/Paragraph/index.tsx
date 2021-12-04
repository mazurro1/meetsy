import type { NextPage } from "next";
import { ParagraphProps } from "./Paragraph.model";
import { ParagraphStyle } from "./Paragraph.style";
import { Colors, ColorsInterface } from "@constants";
import { withSiteProps } from "@hooks";
import type { ISiteProps } from "@hooks";

const Paragraph: NextPage<ParagraphProps & ISiteProps> = ({
  siteProps = {
    blind: false,
    dark: false,
    language: "pl",
  },
  children,
  marginTop = 1.2,
  marginBottom = 1.0,
  color = "BLACK",
  uppercase = false,
  underline = false,
  letterSpacing = 0,
  spanColor = "BLACK",
  bold = false,
  spanBold = false,
}) => {
  const sitePropsColors: ColorsInterface = {
    blind: siteProps.blind,
    dark: siteProps.dark,
  };

  let colorText: string = "";
  let colorSpanToStyle: string = "";

  switch (color) {
    case "PRIMARY": {
      colorText = Colors(sitePropsColors).primaryColor;
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
  switch (spanColor) {
    case "PRIMARY": {
      colorSpanToStyle = Colors(sitePropsColors).primaryColor;
      break;
    }
    case "SECOND": {
      colorSpanToStyle = Colors(sitePropsColors).secondColor;
      break;
    }
    case "RED": {
      colorSpanToStyle = Colors(sitePropsColors).dangerColor;
      break;
    }
    case "GREEN": {
      colorSpanToStyle = Colors(sitePropsColors).successColor;
      break;
    }
    case "GREY": {
      colorSpanToStyle = Colors(sitePropsColors).greyColor;
      break;
    }
    case "BLACK": {
      colorSpanToStyle = Colors(sitePropsColors).textBlack;
      break;
    }
    case "BLACK_ONLY": {
      colorSpanToStyle = Colors(sitePropsColors).textOnlyBlack;
      break;
    }
    case "WHITE": {
      colorSpanToStyle = Colors(sitePropsColors).textWhite;
      break;
    }
    case "WHITE_ONLY": {
      colorSpanToStyle = Colors(sitePropsColors).textOnlyWhite;
      break;
    }

    default: {
      colorSpanToStyle = Colors(sitePropsColors).textBlack;
      break;
    }
  }

  return (
    <ParagraphStyle
      color={colorText}
      marginTop={marginTop}
      marginBottom={marginBottom}
      uppercase={uppercase}
      underline={underline}
      letterSpacing={letterSpacing}
      spanColor={colorSpanToStyle}
      bold={bold}
      spanBold={spanBold}
    >
      {children}
    </ParagraphStyle>
  );
};

export default withSiteProps(Paragraph);
