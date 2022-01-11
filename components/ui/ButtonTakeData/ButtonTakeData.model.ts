export interface ButtonTakeDataProps {
  text: string;
  resetTextEnable: boolean;
  handleChangeText: (value: string) => void;
  placeholder: string;
  handlePopupStatus?: (value: boolean) => void;
}
