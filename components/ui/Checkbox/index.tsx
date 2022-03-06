import React, {useState} from "react";
import type {NextPage} from "next";
import {Checkbox, Switch} from "pretty-checkbox-react";
import "@djthoms/pretty-checkbox";
import {CheckIcon} from "@heroicons/react/solid";
import {Paragraph} from "@ui";
import styled from "styled-components";

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

const MarginStyle = styled.div<{
  marginTop: number;
  marginBottom: number;
}>`
  margin-top: ${(props) => props.marginTop + "rem"};
  margin-bottom: ${(props) => props.marginBottom + "rem"};
`;

const CheckboxComponent: NextPage<CheckboxComponentProps> = ({
  colorText = "BLACK",
  color = "info",
  marginTop = 1,
  marginBottom = 1,
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
      <MarginStyle marginTop={marginTop} marginBottom={marginBottom}>
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
          style={{marginRight: "0.5rem"}}
        >
          <Paragraph color={colorText} marginBottom={0} marginTop={0}>
            {placeholder}
          </Paragraph>
        </Checkbox>
      </MarginStyle>
    ) : (
      <MarginStyle marginTop={marginTop} marginBottom={marginBottom}>
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
          style={{marginRight: "0.5rem"}}
        >
          <Paragraph color={colorText} marginBottom={0} marginTop={0}>
            {placeholder}
          </Paragraph>
        </Switch>
      </MarginStyle>
    );

  return <>{selectedCheckbox}</>;
};
export default CheckboxComponent;
