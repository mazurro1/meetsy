import {NextPage} from "next";
import {InputIcon, SelectCreated} from "@ui";
import {withSiteProps} from "@hooks";
import type {ISiteProps} from "@hooks";
import type {SelectCreatedValuesProps, ValueSelectCreatedProps} from "@ui";
import {useState, useEffect} from "react";
import styled from "styled-components";

const NumberPhoneStyle = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
`;

const options: SelectCreatedValuesProps[] = [
  {
    value: 48,
    label: "Polska +48",
  },
  {
    value: 49,
    label: "Niemcy +49",
  },
  {
    value: 380,
    label: "Ukraina +380",
  },
];

interface PhoneInputProps {
  placeholder: string;
  handleChangeCountry: (value: number) => void;
  validText?: string;
  id: string;
  defaultValue?: number;
  defaultValueRegional?: number;
  validTextGenerate?:
    | "MIN_3"
    | "MIN_5"
    | "MIN_9"
    | "MIN_10"
    | "NO_REQUIRED"
    | "OPTIONAL"
    | "";
}

const PhoneInput: NextPage<ISiteProps & PhoneInputProps> = ({
  placeholder = "",
  handleChangeCountry,
  validText = "",
  id,
  defaultValue = "",
  defaultValueRegional = null,
  validTextGenerate = "",
}) => {
  const [selectedPhoneRegional, setSelectedPhoneRegional] =
    useState<ValueSelectCreatedProps>(null);
  const [phoneInput, setPhoneInput] = useState<string>("");

  useEffect(() => {
    if (!!defaultValue) {
      setPhoneInput(defaultValue.toString());
    }
  }, [defaultValue]);

  useEffect(() => {
    if (!!defaultValueRegional) {
      const findValueRegional = options.find(
        (item) => item.value === defaultValueRegional
      );
      if (!!findValueRegional) {
        setSelectedPhoneRegional(findValueRegional);
      }
    }
  }, [defaultValueRegional]);

  useEffect(
    () => {
      if (typeof options[0].value === "number") {
        setSelectedPhoneRegional(options[0]);
        handleChangeCountry(options[0].value);
      }
    }, //eslint-disable-next-line
    []
  );

  const handleChangeCountryItem = (value: ValueSelectCreatedProps) => {
    const savedValue = value as SelectCreatedValuesProps;
    if (typeof savedValue.value === "number") {
      setSelectedPhoneRegional(savedValue);
      handleChangeCountry(savedValue.value);
    }
  };

  const handleChangePhone = (text: string) => {
    setPhoneInput(text);
  };

  return (
    <NumberPhoneStyle>
      <InputIcon
        placeholder={placeholder}
        iconName="PhoneIcon"
        onChange={handleChangePhone}
        value={phoneInput}
        validText={validText}
        type="number"
        id={id}
        validTextGenerate={validTextGenerate}
      />
      <div className="mt-30 ml-10">
        <SelectCreated
          options={options}
          value={selectedPhoneRegional}
          handleChange={handleChangeCountryItem}
          isMulti={false}
          deleteItem={false}
          deleteLastItem={false}
          width={160}
          color="GREY"
        />
      </div>
    </NumberPhoneStyle>
  );
};

export default withSiteProps(PhoneInput);
