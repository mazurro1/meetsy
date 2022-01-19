export interface FiltersCompanysLocalizationProps {
  handleChangeCity: (value: number) => void;
  handleUpdateCity: (value: string, value2: string) => void;
  handleChangeInputCity: (text: string) => void;
  handleChangeInputDistrict: (text: string) => void;
  inputCity: string;
  inputDistrict: string;
  handleCancelChangeLocation: () => void;
  handleResetChangeLocation: () => void;
}
