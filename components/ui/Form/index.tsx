import type { NextPage } from "next";
import { ButtonIcon } from "@ui";
import type { GenerateIconsProps } from "@ui";

interface ReturnFormElements {
  value: number | string;
  placeholder: string;
}

interface FormProps {
  onSubmit: (e: ReturnFormElements[]) => void;
  buttonColor?: "PRIMARY" | "SECOND" | "RED" | "GREEN" | "GREY";
  id: string;
  buttonText: string;
}

const Form: NextPage<FormProps & GenerateIconsProps> = ({
  onSubmit = () => {},
  buttonColor = "PRIMARY",
  id = "",
  children,
  buttonText = "",
  iconName = "",
}) => {
  const handleSubmit: React.FormEventHandler = (e: any) => {
    e.preventDefault();
    if (!!e.target.elements) {
      const array: Array<HTMLInputElement> = Array.from(e.target.elements);
      const valuesForm: ReturnFormElements[] = array
        .slice(0, array.length - 1)
        .map((itemForm: HTMLInputElement) => {
          const indexToSlice: number = itemForm.placeholder.lastIndexOf("...");
          return {
            placeholder: itemForm.placeholder.slice(0, indexToSlice),
            value: itemForm.value,
          };
        });
      onSubmit(valuesForm);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      {children}
      <ButtonIcon
        id={id}
        type="submit"
        color={buttonColor}
        onClick={() => {}}
        iconName={iconName}
      >
        {buttonText}
      </ButtonIcon>
    </form>
  );
};

export default Form;
