import React, {useState, useEffect} from "react";
import {NextPage} from "next";
import TimeKeeper from "react-timekeeper";
import moment from "moment";
import {addAlertItem} from "@/redux/site/actions";
import * as styled from "./TimePickerContentStyle";
import {ButtonIcon, Popup, Tooltip, Paragraph, GenerateIcons} from "@ui";
import {withSiteProps, withTranslates} from "@hooks";
import type {ISiteProps, ITranslatesProps} from "@hooks";
import {Colors, ColorsInterface} from "@constants";

interface TimePickerProps {
  handleResetTakeData?: () => void;
  setSelectedTime: (time: string | null) => void;
  timeTimePicker: string;
  defaultTimeTimePicker?: string;
  minTime?: string;
  maxTime?: string;
  color?: "PRIMARY" | "SECOND" | "RED" | "GREEN" | "GREY";
  id: string;
  resetDate?: boolean;
}

const TimePicker: NextPage<TimePickerProps & ISiteProps & ITranslatesProps> = ({
  siteProps = {
    blind: false,
    dark: false,
    language: "pl",
  },
  handleResetTakeData = () => {},
  setSelectedTime,
  timeTimePicker = "",
  minTime = "0:00",
  maxTime = "23:59",
  color = "PRIMARY",
  texts,
  dispatch,
  id = "",
  resetDate = false,
  defaultTimeTimePicker,
}) => {
  const [time, setTime] = useState<string>(timeTimePicker);
  const [popupEnable, setPopupEnable] = useState(false);

  useEffect(() => {
    if (!!defaultTimeTimePicker) {
      setTime(defaultTimeTimePicker);
    }
  }, [defaultTimeTimePicker]);

  useEffect(() => {
    setTime(timeTimePicker);
  }, [timeTimePicker]);

  const sitePropsColors: ColorsInterface = {
    blind: siteProps.blind,
    dark: siteProps.dark,
  };

  moment().format(moment.HTML5_FMT.TIME);
  useEffect(() => {
    if (!!!time) {
      const date: Date = new Date();
      const timeToPicker: string = moment(date).format(moment.HTML5_FMT.TIME);
      setTime(timeToPicker);
    }
  }, [time]);

  const handleTimeOnChange = (data: any) => {
    setTime(data.formatted24);
  };

  const handleReset = () => {
    handleResetTakeData();
    setSelectedTime(!!timeTimePicker ? timeTimePicker : null);
    setPopupEnable(false);
  };

  const handleResetToEmpty = () => {
    handleResetTakeData();
    setSelectedTime(null);
    setPopupEnable(false);
  };

  const handleChangePopup = () => {
    setPopupEnable((prevState) => !prevState);
    setTime(timeTimePicker);
  };

  const handleClose = () => {
    handleResetTakeData();
    let timeToUpdate: string = "";
    let isToUpdate: boolean = false;
    const splitTime: string[] = time.split(":");
    const convertTimeToNumber: number =
      Number(splitTime[0]) * 60 + Number(splitTime[1]);

    if (!!minTime) {
      const splitMinTime: string[] = minTime.split(":");
      const convertMinTime: number =
        Number(splitMinTime[0]) * 60 + Number(splitMinTime[1]);
      if (convertTimeToNumber > convertMinTime) {
        isToUpdate = true;
        timeToUpdate = time;
      } else {
        dispatch!(addAlertItem(`${texts?.hourSmall} ${minTime}`, "RED"));
        return;
      }
    }

    if (!!maxTime) {
      const splitMaxTime: string[] = maxTime.split(":");
      const convertMaxTime: number =
        Number(splitMaxTime[0]) * 60 + Number(splitMaxTime[1]);
      if (convertTimeToNumber <= convertMaxTime) {
        isToUpdate = true;
        timeToUpdate = time;
      } else {
        dispatch!(addAlertItem(`${texts?.hourBig} ${maxTime}`, "RED"));
        return;
      }
    }
    if (isToUpdate) {
      setSelectedTime(timeToUpdate);
      setPopupEnable(false);
    }
  };

  let colorDark: string = "";
  let colorLight: string = "";
  const backgroundPage: string = Colors(sitePropsColors).backgroundColorPage;
  const colorText: string = Colors(sitePropsColors).textBlack;

  switch (color) {
    case "PRIMARY": {
      colorDark = Colors(sitePropsColors).primaryColorDark;
      colorLight = Colors(sitePropsColors).primaryColorLight;
      break;
    }
    case "SECOND": {
      colorDark = Colors(sitePropsColors).secondColorDark;
      colorLight = Colors(sitePropsColors).secondColorLight;
      break;
    }
    case "RED": {
      colorDark = Colors(sitePropsColors).dangerColorDark;
      colorLight = Colors(sitePropsColors).dangerColorLight;
      break;
    }
    case "GREEN": {
      colorDark = Colors(sitePropsColors).successColorDark;
      colorLight = Colors(sitePropsColors).successColorLight;
      break;
    }
    case "GREY": {
      colorDark = Colors(sitePropsColors).greyColorDark;
      colorLight = Colors(sitePropsColors).greyColorLight;
      break;
    }

    default: {
      colorDark = Colors(sitePropsColors).primaryColorDark;
      colorLight = Colors(sitePropsColors).primaryColorLight;
      break;
    }
  }

  return (
    <>
      <Popup
        popupEnable={popupEnable}
        handleClose={handleChangePopup}
        title="TimePicker"
        noContent
        id={id}
      >
        <styled.MaxWidth
          backgroundPage={backgroundPage}
          colorLight={colorLight}
          colorText={colorText}
          colorDark={colorDark}
        >
          {!!time && (
            <TimeKeeper
              hour24Mode
              switchToMinuteOnHourSelect
              time={time}
              closeOnMinuteSelect
              onChange={handleTimeOnChange}
              doneButton={() => (
                <styled.ButtonConfirmDate>
                  <ButtonIcon
                    id={`timepicker_confirm_${id}`}
                    uppercase
                    fontSize="SMALL"
                    iconName="CheckIcon"
                    onClick={handleClose}
                    color="GREEN"
                  >
                    {texts?.confirm}
                  </ButtonIcon>
                </styled.ButtonConfirmDate>
              )}
            />
          )}
          <styled.ButtonCancelStyle>
            <ButtonIcon
              id={`timepicker_back_${id}`}
              uppercase
              fontSize="SMALL"
              iconName="XIcon"
              onClick={handleReset}
              color="RED"
            >
              {texts?.cancel}
            </ButtonIcon>
          </styled.ButtonCancelStyle>
        </styled.MaxWidth>
      </Popup>
      <div className="flex-start-center">
        <ButtonIcon
          onClick={handleChangePopup}
          id={`timepicker_change_time_${id}`}
          color={color}
          iconName="ClockIcon"
          fontSize="LARGE"
        >
          {!!timeTimePicker ? timeTimePicker : texts?.noTime}
        </ButtonIcon>
        {!!timeTimePicker && !!resetDate && (
          <div className="ml-10">
            <Tooltip text={texts!.resetTime}>
              <styled.IconSize onClick={handleResetToEmpty}>
                <Paragraph
                  color="BLACK"
                  fontSize="MEDIUM"
                  marginBottom={0}
                  marginTop={0}
                >
                  <GenerateIcons iconName="XIcon" />
                </Paragraph>
              </styled.IconSize>
            </Tooltip>
          </div>
        )}
      </div>
    </>
  );
};

export default withTranslates(withSiteProps(TimePicker), "Timepicker");
