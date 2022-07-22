import {NextPage} from "next";
import {Calendar, Paragraph, TimePicker} from "@ui";
import {withTranslates} from "@hooks";
import type {ITranslatesProps} from "@hooks";
import {getServerSideProps} from "@/lib/VerifiedAdmins";
import {useEffect, useState} from "react";
import {getDateFromString, getFullDate, getTimeFromDate} from "@functions";

interface DateWithTimeProps {
  resetDate?: boolean;
  handleUpdateTime: (value: Date | null) => void;
  id: string;
  placeholder: string;
  defaultDate?: Date | null;
}

const DateWithTime: NextPage<ITranslatesProps & DateWithTimeProps> = ({
  resetDate,
  handleUpdateTime = () => {},
  id = "date",
  placeholder,
  defaultDate = null,
}) => {
  const [dateStart, setDateStart] = useState<Date | null>(null);
  const [timeTimepicker, setTimeTimepicker] = useState<string>("10:00");

  useEffect(() => {
    if (!!defaultDate) {
      setDateStart(defaultDate);
      setTimeTimepicker(getTimeFromDate(defaultDate));
    }
  }, [defaultDate]);

  useEffect(() => {
    handleUpdateTime(dateStart);
  }, [dateStart]);

  const handleChangeTime = (time: string | null) => {
    if (!!dateStart) {
      const fullDate = getFullDate(dateStart);
      if (!!time) {
        const [timeHours, timeMinutes] = time.split(":");
        setDateStart(
          getDateFromString(
            fullDate,
            Number(timeHours),
            Number(timeMinutes),
            0,
            0
          )
        );
      } else {
        setDateStart(getDateFromString(fullDate, 0, 0, 0, 0));
      }
    } else {
      setDateStart(null);
    }
    setTimeTimepicker(!!time ? time : "");
  };

  const setDefaultDate =
    !!defaultDate && !!dateStart
      ? {
          actualDate: getFullDate(dateStart),
        }
      : {};

  return (
    <div>
      <div className="mt-10 mb-40">
        <Paragraph bold marginBottom={0} marginTop={0}>
          {placeholder}
        </Paragraph>
        <div className="flex-start-center">
          <div>
            <Calendar
              {...setDefaultDate}
              id={`calendar_${id}`}
              resetDate={resetDate}
              handleChangeDay={(day) => {
                if (!!day) {
                  const splitValueTime = timeTimepicker?.split(":");
                  if (splitValueTime?.length === 2) {
                    setDateStart(
                      getDateFromString(
                        day,
                        Number(splitValueTime[0]),
                        Number(splitValueTime[1]),
                        0,
                        0
                      )
                    );
                  } else {
                    setDateStart(getDateFromString(day, 0, 0, 0, 0));
                  }
                } else {
                  setDateStart(null);
                }
              }}
            />
          </div>
          <div className="ml-10">
            <TimePicker
              setSelectedTime={handleChangeTime}
              timeTimePicker={timeTimepicker}
              defaultTimeTimePicker={!!dateStart ? timeTimepicker : ""}
              handleResetTakeData={() => handleChangeTime(null)}
              id={`timepicker_${id}`}
              resetDate={resetDate}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export {getServerSideProps};

export default withTranslates(DateWithTime, "DateWithTime");
