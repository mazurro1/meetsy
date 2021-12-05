import { NextPage } from "next";
import {
  PageSegment,
  ButtonIcon,
  Heading,
  Paragraph,
  SelectCreated,
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
  const [valueSelect, setValueSelect] = useState([]);
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
    setValueSelect(value);
  };

  console.log(valueSelect);

  return (
    <div>
      <PageSegment id="home_page">
        <Heading color="RED">hellow!</Heading>
        <div style={{ margin: "50px" }}>
          <SelectCreated
            handleChange={handlechangeSelect}
            value={valueSelect}
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
          >
            dasd
          </SelectCreated>
        </div>
        <div>
          <ButtonIcon
            onClick={handleClickBlind}
            id="xd"
            color="RED"
            isFetchToBlock
          >
            {texts.buttonBlindMode}
          </ButtonIcon>
        </div>
        <div>
          <ButtonIcon
            onClick={handleUpdateLanguage}
            id="xd"
            color="SECOND"
            iconName="BanIcon"
          >
            {texts.buttonChangeLanguage}
          </ButtonIcon>
        </div>
        <Paragraph spanColor="GREEN">
          xsada sdas dasd <span>span1</span>
        </Paragraph>
        <div style={{ marginTop: "100px" }}>
          <ButtonIcon id="xd" iconName="UserGroupIcon" onClick={handleClick}>
            {texts.buttonDarkMode}
          </ButtonIcon>
        </div>
      </PageSegment>
    </div>
  );
};

export default withTranslates(withSiteProps(Home), "HomePage");
