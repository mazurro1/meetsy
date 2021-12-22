import { NextPage } from "next";
import {
  PageSegment,
  ButtonIcon,
  Heading,
  Paragraph,
  SelectCreated,
  Popup,
  InputIcon,
  Form,
  Tooltip,
  According,
  AccordingItem,
  CalendarClicked,
} from "@ui";
import type { FormElementsOnSubmit, SelectCreatedValuesProps } from "@ui";
import { useDispatch } from "react-redux";
import {
  updateDarkMode,
  updateBlindMode,
  updateLanguageSite,
} from "@/redux/site/actions";
import { withSiteProps, withTranslates } from "@hooks";
import type { ISiteProps, ITranslatesProps } from "@hooks";
import { useState } from "react";
import { addAlertItem } from "@/redux/site/actions";

const Home: NextPage<ISiteProps & ITranslatesProps> = ({
  siteProps,
  disableFetchActions,
  texts,
}) => {
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

  const handlechangeSelect = (
    values: SelectCreatedValuesProps[] | null
  ): void => {
    if (!!values) {
      setValueSelect(values as []);
    }
  };

  const handleChangePopup = () => {
    setPopupEnable((prevState) => !prevState);
  };

  const handleOnSubmitForm = (
    values: FormElementsOnSubmit[],
    isValid: boolean
  ) => {
    if (isValid) {
      dispatch(addAlertItem(values[0].value.toString(), "PRIMARY"));
    }
  };

  const handleChangeMonth = (month: number, year: number) => {
    console.log("new month", month, year);
  };

  const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  return (
    <div>
      <PageSegment id="home_page">
        <ButtonIcon onClick={handleChangePopup} id="xd" color="RED">
          Enable popup
        </ButtonIcon>
        <According
          title="acording"
          id="xdddd"
          handleDelete={(id) => {
            console.log(id);
          }}
          handleEdit={(id) => {
            console.log(id);
          }}
          handleAdd={(id) => {
            console.log(id);
          }}
        >
          {items.map((itemMap, index) => {
            return (
              <AccordingItem
                key={index}
                index={index}
                id={"xddd" + itemMap}
                handleDelete={(id) => {
                  console.log(id);
                }}
                handleEdit={(id) => {
                  console.log(id);
                }}
              >
                xd
              </AccordingItem>
            );
          })}
        </According>

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

        <div>
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
        <div>
          <ButtonIcon id="xd" iconName="UserGroupIcon" onClick={handleClick}>
            {texts!.buttonDarkMode}
          </ButtonIcon>
        </div>
        <div style={{ marginTop: 100 }}>
          <CalendarClicked
            minutesInHour={5}
            minHour={10}
            maxHour={23}
            heightMinutes={5}
            minDate={new Date(2021, 4, 1, 15, 0, 0, 0)}
            maxDate={new Date(2022, 4, 10, 15, 0, 0, 0)}
            actualDate="17-12-2021"
            daysToShow={7}
            disabledDays={[
              {
                from: new Date(2021, 11, 15, 13, 0, 0, 0),
                to: new Date(2021, 11, 15, 18, 0, 0, 0),
              },
            ]}
            constOpeningDays={[
              {
                weekId: 4,
                from: "13:00",
                to: "18:00",
              },
            ]}
            openingDays={[
              {
                fullDate: "17-12-2021",
                from: "15:00",
                to: "18:00",
              },
            ]}
            events={[
              {
                color: "RED",
                id: "83r2sCT75-pL2fY70K5M",
                minDate: new Date(2021, 11, 16, 13, 20, 0, 0),
                maxDate: new Date(2021, 11, 16, 14, 0, 0, 0),
                text: "text",
                tooltip: "tooltip",
              },
              {
                color: "GREY",
                id: "83r2sCT75-pL2fY7fK5M",
                minDate: new Date(2021, 11, 18, 13, 0, 0, 0),
                maxDate: new Date(2021, 11, 18, 18, 0, 0, 0),
                text: "text",
                tooltip: "tooltip",
              },
            ]}
            handleChangeMonth={handleChangeMonth}
          />
        </div>
      </PageSegment>
    </div>
  );
};

export default withTranslates(withSiteProps(Home), "HomePage");
