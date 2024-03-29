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
  TimePicker,
  Calendar,
  LinkEffect,
} from "@ui";
import type { FormElementsOnSubmit, SelectCreatedValuesProps } from "@ui";
import {
  updateDarkMode,
  updateBlindMode,
  updateLanguageSite,
} from "@/redux/site/actions";
import { withSiteProps, withTranslates } from "@hooks";
import type { ISiteProps, ITranslatesProps } from "@hooks";
import { useState } from "react";
import { addAlertItem } from "@/redux/site/actions";
import type { ValueSelectCreatedProps } from "@ui";

const Home: NextPage<ISiteProps & ITranslatesProps> = ({
  siteProps,
  disableFetchActions,
  texts,
  dispatch,
}) => {
  const [timeTimepicker, setTimeTimepicker] = useState("12:00");
  const [valueSelect, setValueSelect] = useState([]);
  const handleClick = () => {
    dispatch!(updateDarkMode(!siteProps?.dark));
  };
  const handleClickBlind = () => {
    dispatch!(updateBlindMode(!siteProps?.blind));
  };

  const handleUpdateLanguage = () => {
    dispatch!(updateLanguageSite());
  };

  const handlechangeSelect = (values: ValueSelectCreatedProps): void => {
    if (!!values) {
      setValueSelect(values as []);
    }
  };

  const handleOnSubmitForm = (
    values: FormElementsOnSubmit[],
    isValid: boolean
  ) => {
    if (isValid) {
      dispatch!(addAlertItem(values[0].value.toString(), "PRIMARY"));
    }
  };

  const handleChangeMonth = (month: number, year: number) => {
    console.log("new month", month, year);
  };

  const handleChangeTime = (time: string | null) => {
    setTimeTimepicker(!!time ? time : "");
  };

  const handleResetTime = () => {};

  const handleClickFetch = () => {
    const dataToSend = {};
    fetch("/api/test", {
      method: "POST",
      body: JSON.stringify(dataToSend),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      });
  };

  const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  return (
    <div>
      <PageSegment id="home_page">
        <div>
          <ButtonIcon
            onClick={handleClickFetch}
            id="xd"
            color="RED"
            // isFetchToBlock
          >
            Testuj fetch
          </ButtonIcon>
        </div>
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
        <LinkEffect path="/">Main page</LinkEffect>
        <div style={{ marginTop: 100, marginBottom: 100 }}>
          <Calendar
            id="calendar_sandbox"
            actualDate="17-01-2022"
            handleChangeDay={(day) => {
              console.log("new day: " + day);
            }}
            minDate={new Date(2022, 0, 4)}
            maxDate={new Date(2022, 0, 14)}
            disabledDays={[
              { from: new Date(2022, 0, 6), to: new Date(2022, 0, 8) },
            ]}
          />
        </div>

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
                value: 1,
              },
              {
                label: "xd2",
                value: 2,
              },
              {
                label: "xd3",
                value: 3,
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
          <TimePicker
            setSelectedTime={handleChangeTime}
            timeTimePicker={timeTimepicker}
            handleResetTakeData={handleResetTime}
            minTime="10:00"
            maxTime="18:00"
            id="timepicker_sandbox"
          />
        </div>
        <div style={{ marginTop: 100 }}>
          <CalendarClicked
            id="calendarClicked_sandbox"
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
