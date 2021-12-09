import type { ColorsReturns, ColorsInterface } from "./Colors.model";

const Colors = (
  siteProps: ColorsInterface = {
    blind: false,
    dark: false,
  }
): ColorsReturns => {
  const colorOrangeBlind: string = "#f9a825";
  const colorYellowBlind: string = "#ffff00";
  const colorDarkGreyBackgroundSite: string = "#313131";
  const colorWhite: string = "white";
  const colorBlack: string = "#222";
  const colorDarkGrey: string = "#212121";
  const colorPrimary: string = "#5ec2d7";
  const colorPrimaryDark: string = "#0597a7";
  const colorPrimaryLight: string = "#cce3e8";
  const colorSecond: string = "#f7a52c";
  const colorSecondDark: string = "#ed6c0c";
  const colorSecondLight: string = "#fff3e0";
  const colorGrey: string = "#424242";
  const colorGreyDark: string = "#282828";
  const colorGreyLight: string = "#bdbdbd";
  const colorDarkModeGrey: string = "#9e9e9e";
  const colorDarkModeGreyDark: string = "#e0e0e0";
  const colorDarkModeGreyLight: string = "#f5f5f5";
  const colorDanger: string = "#f44336";
  const colorDangerDark: string = "#c62828";
  const colorDangerLight: string = "#ffebee";
  const colorSuccess: string = "#43a047";
  const colorSuccessLight: string = "#e8f5e9";
  const colorSuccessDark: string = "#2e7d32";
  const colorGreyDisabledDark: string = "#616161";
  const colorGreyDisabledLight: string = "#e0e0e0";
  const colorGreyCompanyItem: string = "#f5f4f5";

  if (!siteProps.blind && siteProps.dark) {
    return {
      backgroundColorPage: colorDarkGreyBackgroundSite,
      menuColor: colorDarkGrey,
      navBackground: colorDarkGrey,
      navDownBackground: colorGreyDark,
      primaryColor: colorPrimary,
      primaryColorDark: colorPrimaryDark,
      primaryColorLight: colorDarkGrey,
      secondColor: colorSecond,
      secondColorLight: colorDarkGrey,
      secondColorDark: colorSecondDark,
      greyColor: colorDarkModeGrey,
      greyColorLight: colorDarkModeGreyLight,
      greyColorDark: colorDarkModeGreyDark,
      dangerColor: colorDanger,
      dangerColorLight: colorDarkGrey,
      dangerColorDark: colorDangerDark,
      successColorLight: colorDarkGrey,
      successColor: colorSuccess,
      successColorDark: colorSuccessDark,
      textBlack: colorWhite,
      textOnlyBlack: colorBlack,
      textWhite: colorWhite,
      textOnlyWhite: colorWhite,
      greyExtraItem: colorDarkGrey,
      disabled: colorGreyDisabledDark,
    };
  } else if (siteProps.blind && !siteProps.dark) {
    return {
      backgroundColorPage: colorDarkGreyBackgroundSite,
      menuColor: colorDarkGrey,
      navBackground: colorDarkGrey,
      navDownBackground: colorGreyDark,
      primaryColor: colorOrangeBlind,
      primaryColorDark: colorYellowBlind,
      primaryColorLight: colorDarkGrey,
      secondColor: colorOrangeBlind,
      secondColorLight: colorDarkGrey,
      secondColorDark: colorYellowBlind,
      greyColor: colorYellowBlind,
      greyColorLight: colorDarkGrey,
      greyColorDark: colorOrangeBlind,
      dangerColor: colorOrangeBlind,
      dangerColorLight: colorDarkGrey,
      dangerColorDark: colorYellowBlind,
      successColorLight: colorDarkGrey,
      successColor: colorOrangeBlind,
      successColorDark: colorYellowBlind,
      textBlack: colorWhite,
      textOnlyBlack: colorBlack,
      textWhite: colorBlack,
      textOnlyWhite: colorWhite,
      greyExtraItem: colorDarkGrey,
      disabled: colorGreyDisabledDark,
    };
  } else {
    return {
      backgroundColorPage: colorWhite,
      menuColor: colorWhite,
      navBackground: colorDarkGrey,
      navDownBackground: colorGreyDark,
      primaryColor: colorPrimary,
      primaryColorDark: colorPrimaryDark,
      primaryColorLight: colorPrimaryLight,
      secondColor: colorSecond,
      secondColorLight: colorSecondLight,
      secondColorDark: colorSecondDark,
      greyColor: colorGrey,
      greyColorLight: colorGreyLight,
      greyColorDark: colorGreyDark,
      dangerColor: colorDanger,
      dangerColorLight: colorDangerLight,
      dangerColorDark: colorDangerDark,
      successColor: colorSuccess,
      successColorLight: colorSuccessLight,
      successColorDark: colorSuccessDark,
      textBlack: colorBlack,
      textOnlyBlack: colorBlack,
      textWhite: colorWhite,
      textOnlyWhite: colorWhite,
      greyExtraItem: colorGreyCompanyItem,
      disabled: colorGreyDisabledLight,
    };
  }
};

export default Colors;
