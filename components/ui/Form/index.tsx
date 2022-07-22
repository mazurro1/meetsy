import type {NextPage} from "next";
import {ButtonIcon, Tooltip} from "@ui";
import type {GenerateIconsProps} from "@ui";
import {ButtonPosition, FormStyle} from "./Form.style";
import type {FormElementsOnSubmit, FormProps} from "./Form.model";
import {validEmail} from "@functions";
import {useDispatch} from "react-redux";
import {addAlertItem} from "@/redux/site/actions";
import {withTranslates} from "@hooks";
import type {ITranslatesProps} from "@hooks";
import {useSelector} from "react-redux";
import type {IStoreProps} from "@/redux/store";
import {updateDisabledFetchActions} from "@/redux/site/actions";

const Form: NextPage<FormProps & GenerateIconsProps & ITranslatesProps> = ({
  onSubmit = () => {},
  onChange = () => {},
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
  isFetchToBlock = false,
  disabled = false,
  disabledTooltip = "",
  refProp = null,
  isNewIcon = false,
  buttonsInColumn = false,
  buttonsFullWidth = false,
}) => {
  const disableFetchActions = useSelector(
    (state: IStoreProps) => state.site.disableFetchActions
  );
  const dispatch = useDispatch();

  const handleAddAlert = (text: string) => {
    dispatch(addAlertItem(text, "RED"));
  };

  const handleSubmit: any = (
    e: HTMLFormElement & {target: HTMLFormElement}
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
              itemForm.type === "checkbox"
                ? itemForm.checked
                : itemForm.type === "number"
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
          const valueItemToValid =
            typeof findItemToValid.value === "string"
              ? findItemToValid.value.trim()
              : findItemToValid.value;

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
              handleAddAlert(`${valuePlaceholder} - ${texts!.invalidValue}`);
            }
          }
          if (
            itemValidation!.isNumber !== undefined &&
            itemValidation!.isNumber !== null
          ) {
            if (Number(valueItemToValid) === NaN) {
              isValuesValid = false;
              console.warn(`${valuePlaceholder} : value is not valid number`);
              handleAddAlert(`${valuePlaceholder} - ${texts!.invalidValue}`);
            }
          }
          if (
            itemValidation!.isEmail !== undefined &&
            itemValidation!.isEmail !== null
          ) {
            const checkIsEmail = validEmail(valueItemToValid.toString());
            if (checkIsEmail !== itemValidation.isEmail) {
              isValuesValid = false;
              handleAddAlert(`${valuePlaceholder} - ${texts!.emailValid}`);
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
                  `${valuePlaceholder} - ${texts!.minNumberValid} ${
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
                  `${valuePlaceholder} - ${texts!.maxNumberValid} ${
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
                `${valuePlaceholder} - ${texts!.minLengthValid} ${
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
                `${valuePlaceholder} - ${texts!.maxLengthValid} ${
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
      if (isFetchToBlock && isValuesValid) {
        dispatch!(updateDisabledFetchActions(true));
        setTimeout(() => {
          dispatch!(updateDisabledFetchActions(false));
        }, 2000);
      }
      onSubmit(valuesForm, isValuesValid);
    }
  };

  if (disabled && !!!disabledTooltip) {
    console.warn("Form button tooltip don't have value: disabledTooltip");
  }

  return (
    <FormStyle
      onSubmit={handleSubmit}
      marginTop={marginTop}
      marginBottom={marginBottom}
      ref={refProp}
      onChange={onChange}
    >
      {children}
      <ButtonPosition
        buttonsInColumn={buttonsInColumn}
        fullWidth={buttonsFullWidth}
      >
        {extraButtons}
        <Tooltip
          text={disabledTooltip}
          enable={disabled}
          fullWidth={buttonsFullWidth}
        >
          <ButtonIcon
            id={id}
            type="submit"
            color={buttonColor}
            onClick={() => {}}
            iconName={iconName}
            disabled={disableFetchActions || disabled}
            isNewIcon={isNewIcon}
            fullWidth={buttonsFullWidth}
          >
            {buttonText}
          </ButtonIcon>
        </Tooltip>
      </ButtonPosition>
    </FormStyle>
  );
};

export default withTranslates(Form, "Form");
