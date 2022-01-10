import type { NextPage } from "next";
import { ButtonIcon } from "@ui";
import type { GenerateIconsProps } from "@ui";
import { ButtonPosition, FormStyle } from "./Form.style";
import type { FormElementsOnSubmit, FormProps } from "./Form.model";
import { validEmail } from "@functions";
import { useDispatch } from "react-redux";
import { addAlertItem } from "@/redux/site/actions";
import { withTranslates } from "@hooks";
import type { ITranslatesProps } from "@hooks";

const Form: NextPage<FormProps & GenerateIconsProps & ITranslatesProps> = ({
  onSubmit = () => {},
  buttonColor = "PRIMARY",
  id = "",
  children,
  buttonText = "",
  iconName = "",
  marginTop = 2,
  marginBottom = 2,
  validation = [],
  texts,
  extraButtons = null,
}) => {
  const dispatch = useDispatch();

  const handleAddAlert = (text: string) => {
    dispatch(addAlertItem(text, "RED"));
  };

  const handleSubmit: any = (
    e: HTMLFormElement & { target: HTMLFormElement }
  ) => {
    e.preventDefault();
    if (!!e.target.elements) {
      const array: Array<any> = Array.from(e.target.elements);
      const filterArray = array.filter(
        (itemToFilter) => itemToFilter.nodeName === "INPUT"
      );

      const valuesForm: FormElementsOnSubmit[] = filterArray.map(
        (itemForm: HTMLInputElement) => {
          const indexToSlice: number = itemForm.placeholder.lastIndexOf("...");
          return {
            placeholder: itemForm.placeholder.slice(0, indexToSlice),
            value:
              itemForm.type === "number"
                ? Number(itemForm.value)
                : itemForm.value,
          };
        }
      );

      let isValuesValid: boolean = true;
      validation.forEach((itemValidation) => {
        const findItemToValid = valuesForm.find(
          (itemToValid) =>
            itemToValid.placeholder === itemValidation.placeholder
        );
        if (!!findItemToValid) {
          const valueItemToValid = findItemToValid.value;
          const valuePlaceholder = findItemToValid.placeholder;
          if (
            itemValidation!.isString !== undefined &&
            itemValidation!.isString !== null
          ) {
            if (
              (typeof valueItemToValid === "string") !==
              itemValidation.isString
            ) {
              isValuesValid = false;
              console.warn(`${valuePlaceholder} : value is not valid string`);
              handleAddAlert(texts!.somethingWentWrong);
            }
          }
          if (
            itemValidation!.isNumber !== undefined &&
            itemValidation!.isNumber !== null
          ) {
            if (
              (typeof valueItemToValid === "number") !==
              itemValidation.isNumber
            ) {
              isValuesValid = false;
              console.warn(`${valuePlaceholder} : value is not valid number`);
              handleAddAlert(texts!.somethingWentWrong);
            }
          }
          if (
            itemValidation!.isEmail !== undefined &&
            itemValidation!.isEmail !== null
          ) {
            const checkIsEmail = validEmail(valueItemToValid.toString());
            if (checkIsEmail !== itemValidation.isEmail) {
              isValuesValid = false;
              handleAddAlert(`${valuePlaceholder}: ${texts!.emailValid}`);
            }
          }

          if (
            itemValidation!.minNumber !== null &&
            itemValidation!.minNumber !== undefined
          ) {
            if (typeof valueItemToValid === "number") {
              if (valueItemToValid < itemValidation.minNumber) {
                isValuesValid = false;

                handleAddAlert(
                  `${valuePlaceholder}: ${texts!.minNumberValid} ${
                    itemValidation.minNumber
                  }`
                );
              }
            } else {
              isValuesValid = false;
              console.warn(
                `${valuePlaceholder} : value cant check minNumber, because is not number`
              );
              handleAddAlert(texts!.somethingWentWrong);
            }
          }

          if (
            itemValidation!.maxNumber !== undefined &&
            itemValidation!.maxNumber !== null
          ) {
            if (typeof valueItemToValid === "number") {
              if (valueItemToValid > itemValidation.maxNumber) {
                isValuesValid = false;
                handleAddAlert(
                  `${valuePlaceholder}: ${texts!.maxNumberValid} ${
                    itemValidation.maxNumber
                  }`
                );
              }
            } else {
              isValuesValid = false;
              console.warn(
                `${valuePlaceholder} : value cant check maxNumber, because is not number`
              );
              handleAddAlert(texts!.somethingWentWrong);
            }
          }

          const valueToStringToCheck = valueItemToValid.toString();
          if (
            itemValidation!.minLength !== undefined &&
            itemValidation!.minLength !== null
          ) {
            if (valueToStringToCheck.length < itemValidation.minLength) {
              isValuesValid = false;
              handleAddAlert(
                `${valuePlaceholder}: ${texts!.minLengthValid} ${
                  itemValidation.minLength
                }`
              );
            }
          }
          if (
            itemValidation!.maxLength !== undefined &&
            itemValidation!.maxLength !== null
          ) {
            if (valueToStringToCheck.length > itemValidation.maxLength) {
              isValuesValid = false;
              handleAddAlert(
                `${valuePlaceholder}: ${texts!.maxLengthValid} ${
                  itemValidation.maxLength
                }`
              );
            }
          }
        } else {
          isValuesValid = false;
          console.warn(`Dont find item: ${itemValidation.placeholder}`);
          handleAddAlert(texts!.somethingWentWrong);
        }
      });

      onSubmit(valuesForm, isValuesValid);
    }
  };
  return (
    <FormStyle
      onSubmit={handleSubmit}
      marginTop={marginTop}
      marginBottom={marginBottom}
    >
      {children}
      <ButtonPosition>
        {extraButtons}
        <ButtonIcon
          id={id}
          type="submit"
          color={buttonColor}
          onClick={() => {}}
          iconName={iconName}
        >
          {buttonText}
        </ButtonIcon>
      </ButtonPosition>
    </FormStyle>
  );
};

export default withTranslates(Form, "Form");
