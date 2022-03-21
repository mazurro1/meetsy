import type {NextPage} from "next";
import {Colors, ColorsInterface} from "@constants";
import {withSiteProps} from "@hooks";
import type {ISiteProps} from "@hooks";
import styled from "styled-components";
import {Heading} from "@ui";

const TitlePageStyle = styled.div<{
  colorBackground: string;
  marginTop: number;
  marginBottom: number;
}>`
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  display: inline-block;
  padding: 5px 10px;
  padding-left: 25px;
  margin-top: ${(props) => props.marginTop + "rem"};
  margin-bottom: ${(props) => props.marginBottom + "rem"};
  text-align: center;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  background-color: ${(props) => props.colorBackground};

  h1 {
    font-size: 2rem;
  }
`;

interface TitlePageProps {
  color?:
    | "PRIMARY"
    | "PRIMARY_DARK"
    | "SECOND"
    | "SECOND_DARK"
    | "RED"
    | "RED_DARK"
    | "GREEN"
    | "GREEN_DARK"
    | "GREY"
    | "GREY_DARK"
    | "GREY_LIGHT";
  marginTop?: number;
  marginBottom?: number;
}

const TitlePage: NextPage<ISiteProps & TitlePageProps> = ({
  siteProps = {
    blind: false,
    dark: false,
    language: "pl",
  },
  children,
  color = "PRIMARY",
  marginTop = 0,
  marginBottom = 1,
}) => {
  const sitePropsColors: ColorsInterface = {
    blind: siteProps.blind,
    dark: siteProps.dark,
  };

  let colorBackground: string = "";

  switch (color) {
    case "PRIMARY": {
      colorBackground = Colors(sitePropsColors).primaryColor;
      break;
    }
    case "PRIMARY_DARK": {
      colorBackground = Colors(sitePropsColors).primaryColorDark;
      break;
    }
    case "SECOND": {
      colorBackground = Colors(sitePropsColors).secondColor;
      break;
    }
    case "SECOND_DARK": {
      colorBackground = Colors(sitePropsColors).secondColorDark;
      break;
    }
    case "RED": {
      colorBackground = Colors(sitePropsColors).dangerColor;
      break;
    }
    case "RED_DARK": {
      colorBackground = Colors(sitePropsColors).dangerColorDark;
      break;
    }
    case "GREEN": {
      colorBackground = Colors(sitePropsColors).successColor;
      break;
    }
    case "GREEN_DARK": {
      colorBackground = Colors(sitePropsColors).successColorDark;
      break;
    }
    case "GREY": {
      colorBackground = Colors(sitePropsColors).greyColor;
      break;
    }
    case "GREY_DARK": {
      colorBackground = Colors(sitePropsColors).greyColorDark;
      break;
    }
    case "GREY_LIGHT": {
      colorBackground = Colors(sitePropsColors).greyColorLight;
      break;
    }

    default: {
      colorBackground = Colors(sitePropsColors).primaryColor;
      break;
    }
  }

  return (
    <TitlePageStyle
      colorBackground={colorBackground}
      marginBottom={marginBottom}
      marginTop={marginTop}
    >
      <Heading
        tag={1}
        color="WHITE"
        letterSpacing={0.1}
        uppercase
        marginBottom={0}
        marginTop={0}
      >
        {children}
      </Heading>
    </TitlePageStyle>
  );
};

export default withSiteProps(TitlePage);
