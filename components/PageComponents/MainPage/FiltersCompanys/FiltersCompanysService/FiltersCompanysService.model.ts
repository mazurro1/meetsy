export interface FiltersCompanysServiceProps {
  inputService: string;
  handleChangeInputService: (text: string) => void;
  handleUpdateService: (value: string) => void;
  handleResetChangeService: () => void;
  handleCancelChangeService: () => void;
}
