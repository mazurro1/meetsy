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
}

const PhoneInput: NextPage<ISiteProps & PhoneInputProps> = ({
  placeholder = "",
  handleChangeCountry,
  validText = "",
  id,
}) => {
  const [selectedPhone, setSelectedPhone] =
    useState<ValueSelectCreatedProps>(null);
  const [phoneInput, setPhoneInput] = useState<string>("");

  useEffect(
    () => {
      setSelectedPhone(options[0]);
      handleChangeCountry(options[0].value);
    }, //eslint-disable-next-line
    []
  );

  const handleChangeCountryItem = (value: ValueSelectCreatedProps) => {
    const savedValue = value as SelectCreatedValuesProps;
    setSelectedPhone(savedValue);
    handleChangeCountry(savedValue.value);
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
        id={id}
      />
      <div className="mt-30 ml-10">
        <SelectCreated
          options={options}
          value={selectedPhone}
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
