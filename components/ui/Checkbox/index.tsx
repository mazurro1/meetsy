import React, { useCallback, useState } from "react";
import type { NextPage } from "next";
import { Checkbox, Switch } from "pretty-checkbox-react";
import "@djthoms/pretty-checkbox";
import { CheckIcon } from "@heroicons/react/solid";
import { Paragraph } from "@ui";

interface CheckboxComponentProps {
  colorText?:
    | "BLACK"
    | "WHITE"
    | "BLACK_ONLY"
    | "WHITE_ONLY"
    | "PRIMARY"
    | "PRIMARY_DARK"
    | "SECOND"
    | "SECOND_DARK"
    | "RED"
    | "RED_DARK"
    | "GREEN"
    | "GREEN_DARK"
    | "GREY"
    | "GREY_DARK"
    | "GREY_LIGHT";
  color?: "primary" | "success" | "info" | "warning" | "danger";
  marginTop?: number;
  marginBottom?: number;
  type?: "SWITCH" | "CHECKBOX";
  id: string;
  onChange?: (value: boolean) => void;
  defaultValue?: boolean;
  disabled?: boolean;
  placeholder: string;
}

const CheckboxComponent: NextPage<CheckboxComponentProps> = ({
  colorText = "BLACK",
  color = "info",
  marginTop = 0,
  marginBottom = 0,
  type = "CHECKBOX",
  placeholder = "",
  id = "",
  onChange = () => {},
  defaultValue = false,
  disabled = false,
}) => {
  const [checkboxValue, setCheckboxValue] = useState<boolean>(defaultValue);

  const onChangeComponent = React.useCallback(() => {
    setCheckboxValue((prevState) => {
      if (!!onChange) {
        onChange(!prevState);
      }
      return !prevState;
    });
  }, [onChange]);

  const selectedCheckbox =
    type === "CHECKBOX" ? (
      <Checkbox
        animation="jelly"
        color={color}
        shape="curve"
        bigger
        checked={checkboxValue}
        onChange={onChangeComponent}
        icon={<CheckIcon className="h-5 w-5 text-blue-500" />}
        id={id}
        data-test-id={id}
        disabled={disabled}
        placeholder={placeholder + " "}
        style={{ marginRight: "0.5rem" }}
      >
        <Paragraph
          marginTop={marginTop}
          marginBottom={marginBottom}
          color={colorText}
        >
          {placeholder}
        </Paragraph>
      </Checkbox>
    ) : (
      <Switch
        shape="slim"
        color={color}
        bigger
        onChange={onChangeComponent}
        checked={checkboxValue}
        id={id}
        data-test-id={id}
        disabled={disabled}
        placeholder={placeholder + " "}
        style={{ marginRight: "0.5rem" }}
      >
        <Paragraph
          marginTop={marginTop}
          marginBottom={marginBottom}
          color={colorText}
        >
          {placeholder}
        </Paragraph>
      </Switch>
    );

  return <>{selectedCheckbox}</>;
};
export default CheckboxComponent;
