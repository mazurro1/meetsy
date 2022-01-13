export interface FiltersCompanysLocalizationProps {
  handleChangeCity: (value: number) => void;
  handleUpdateCity: (value: string, value2: string) => void;
  handleChangeInputCity: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleChangeInputDistrict: (e: React.ChangeEvent<HTMLInputElement>) => void;
  inputCity: string;
  inputDistrict: string;
  handleCancelChangeLocation: () => void;
  handleResetChangeLocation: () => void;
}
