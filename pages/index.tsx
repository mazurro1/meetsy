import { NextPage } from "next";
import {
  PageSegment,
  ButtonIcon,
  Heading,
  Paragraph,
  SelectCreated,
  Popup,
  InputIcon,
} from "@ui";
import { useDispatch } from "react-redux";
import {
  updateDarkMode,
  updateBlindMode,
  updateLanguageSite,
} from "@/redux/site/actions";
import { withSiteProps, withTranslates } from "@hooks";
import type { ISiteProps, ITranslatesProps } from "@hooks";
import { useState } from "react";

const Home: NextPage<ISiteProps & ITranslatesProps> = ({
  siteProps,
  disableFetchActions,
  texts,
}) => {
  const [inputName, setInputName] = useState("");
  const [valueSelect, setValueSelect] = useState([]);
  const [popupEnable, setPopupEnable] = useState(false);
  const dispatch = useDispatch();
  const handleClick = () => {
    dispatch(updateDarkMode(!siteProps.dark));
  };
  const handleClickBlind = () => {
    dispatch(updateBlindMode(!siteProps.blind));
  };

  const handleUpdateLanguage = () => {
    dispatch(updateLanguageSite());
  };

  const handlechangeSelect = (value: any) => {
    if (!!value) {
      setValueSelect(value);
    }
  };

  const handleChangePopup = () => {
    setPopupEnable((prevState) => !prevState);
  };

  const handleChangeInputName = (e: any) => {
    setInputName(e.target.value);
  };

  return (
    <div>
      <PageSegment id="home_page">
        <ButtonIcon onClick={handleChangePopup} id="xd" color="RED">
          Enable popup
        </ButtonIcon>
        <InputIcon
          iconName="XIcon"
          placeholder="Imię"
          value={inputName}
          onChange={handleChangeInputName}
          required
          validText="Minimum 3 znaki"
          type="password"
          showPassword
        />
        <InputIcon
          iconName="XIcon"
          placeholder="Imię2"
          value={inputName}
          onChange={handleChangeInputName}
          required
          validText="Minimum 3 znaki"
          type="password"
          showPassword
        />
        <Popup
          popupEnable={popupEnable}
          handleClose={handleChangePopup}
          title="Filtruj"
          maxWidth={900}
        >
          <div>
            <Heading color="RED">hellow!</Heading>
          </div>
        </Popup>

        <div style={{ margin: "50px" }}>
          <SelectCreated
            handleChange={handlechangeSelect}
            value={valueSelect}
            defaultMenuIsOpen={false}
            isClearable={false}
            deleteItem={true}
            deleteLastItem={false}
            closeMenuOnSelect
            isMulti
            options={[
              {
                label: "xd1",
                value: "xd1",
              },
              {
                label: "xd2",
                value: "xd2",
              },
              {
                label: "xd3",
                value: "xd3",
              },
            ]}
          />
        </div>
        <div>
          <ButtonIcon
            onClick={handleClickBlind}
            id="xd"
            color="RED"
            isFetchToBlock
          >
            {texts!.buttonBlindMode}
          </ButtonIcon>
        </div>
        <div>
          <ButtonIcon
            onClick={handleUpdateLanguage}
            id="xd"
            color="SECOND"
            iconName="BanIcon"
          >
            {texts!.buttonChangeLanguage}
          </ButtonIcon>
        </div>
        <Paragraph spanColor="GREEN">
          xsada sdas dasd <span>span1</span>
        </Paragraph>
        <div style={{ marginTop: "100px" }}>
          <ButtonIcon id="xd" iconName="UserGroupIcon" onClick={handleClick}>
            {texts!.buttonDarkMode}
          </ButtonIcon>
        </div>
      </PageSegment>
    </div>
  );
};

export default withTranslates(withSiteProps(Home), "HomePage");
