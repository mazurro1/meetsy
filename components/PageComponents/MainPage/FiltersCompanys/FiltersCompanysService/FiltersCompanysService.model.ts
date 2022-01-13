export interface FiltersCompanysServiceProps {
  inputService: string;
  handleChangeInputService: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleUpdateService: (value: string) => void;
  handleResetChangeService: () => void;
  handleCancelChangeService: () => void;
}
