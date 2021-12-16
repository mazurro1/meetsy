import type { NextPage } from "next";
import type { EventsActiveProps } from "./CalendarClicked.model";
import shortid from "shortid";

const CalendarNewEven: NextPage<{
  addEventDate: string;
  handleAddNewEvent: (item: EventsActiveProps) => void;
}> = ({ addEventDate, handleAddNewEvent }) => {
  const handleAddEvent = () => {
    if (!!addEventDate) {
      const splitFullDate = addEventDate.split("-");
      if (splitFullDate.length === 3) {
        const [day, month, year] = splitFullDate;
        const newItem: EventsActiveProps = {
          minDate: new Date(
            Number(year),
            Number(month) - 1,
            Number(day),
            12,
            0,
            0,
            0
          ),
          maxDate: new Date(
            Number(year),
            Number(month) - 1,
            Number(day),
            14,
            0,
            0,
            0
          ),
          id: `${shortid.generate()}-${shortid.generate()}`,
          tooltip: "tooltip",
          color: "GREEN",
          text: "text",
        };

        if (!!newItem) {
          handleAddNewEvent(newItem);
        }
      }
    }
  };

  return (
    <div>
      {addEventDate}
      <button onClick={handleAddEvent}>add this event</button>
    </div>
  );
};
export default CalendarNewEven;
