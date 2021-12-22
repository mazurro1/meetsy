import React, { useState, useEffect } from "react";
import { NextPage } from "next";
import TimeKeeper from "react-timekeeper";
import { ButtonIcon } from "@ui";
import { Colors } from "@constants";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { addAlertItem } from "@/redux/site/actions";
import * as styled from "./TimePickerContentStyle";

interface TimePickerProps {
  handleResetTakeData?: () => void;
  setSelectedTime: (time: string | null) => void;
  timeTimePicker: string;
  secondColor?: boolean;
  minTime?: string;
  maxTime?: string;
}

const TimePicker: NextPage<TimePickerProps> = ({
  handleResetTakeData = () => {},
  setSelectedTime,
  timeTimePicker = "",
  secondColor = false,
  minTime,
  maxTime,
}) => {
  const [time, setTime] = useState<string>(timeTimePicker);
  const dispatch = useDispatch();
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
        dispatch(
          addAlertItem(
            `Godzina nie może być mniejsza, lub równa ${minTime}`,
            "RED"
          )
        );
        return;
      }
    }

    if (!!maxTime) {
      const splitMaxTime: string[] = maxTime.split(":");
      const convertMaxTime: number =
        Number(splitMaxTime[0]) * 60 + Number(splitMaxTime[1]);
      if (convertTimeToNumber < convertMaxTime) {
        isToUpdate = true;
        timeToUpdate = time;
      } else {
        dispatch(
          addAlertItem(
            `Godzina nie może być większa, lub równa ${maxTime}`,
            "RED"
          )
        );
        return;
      }
    }
    if (isToUpdate) {
      setSelectedTime(timeToUpdate);
    }
  };

  return (
    <styled.MaxWidth secondColor={secondColor}>
      {!!time && (
        <TimeKeeper
          hour24Mode
          switchToMinuteOnHourSelect
          time={time}
          closeOnMinuteSelect
          onChange={handleTimeOnChange}
          doneButton={() => (
            <styled.ButtonConfirmDate>
              <styled.MarginButtons>
                <ButtonIcon
                  id="timepicker_back"
                  uppercase
                  fontSize="SMALL"
                  iconName="XIcon"
                  onClick={handleReset}
                  color="RED"
                >
                  Anuluj
                </ButtonIcon>
              </styled.MarginButtons>
              <styled.MarginButtons>
                <ButtonIcon
                  id="timepicker_confirm"
                  uppercase
                  fontSize="SMALL"
                  iconName="CheckIcon"
                  onClick={handleClose}
                  color="GREEN"
                >
                  POTWIERDŹ
                </ButtonIcon>
              </styled.MarginButtons>
            </styled.ButtonConfirmDate>
          )}
        />
      )}
    </styled.MaxWidth>
  );
};

export default TimePicker;
