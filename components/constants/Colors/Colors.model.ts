interface ColorsInterface {
  blind?: boolean;
  dark?: boolean;
}

interface ColorsReturns {
  backgroundColorPage: string;
  menuColor: string;
  navBackground: string;
  navDownBackground: string;
  primaryColor: string;
  primaryColorDark: string;
  primaryColorLight: string;
  secondColor: string;
  secondColorLight: string;
  secondColorDark: string;
  greyColor: string;
  greyColorLight: string;
  greyColorDark: string;
  dangerColor: string;
  dangerColorLight: string;
  dangerColorDark: string;
  successColorLight: string;
  successColor: string;
  successColorDark: string;
  textBlack: string;
  textOnlyBlack: string;
  textWhite: string;
  textOnlyWhite: string;
  greyExtraItem: string;
  disabled: string;
}

export type { ColorsInterface, ColorsReturns };
