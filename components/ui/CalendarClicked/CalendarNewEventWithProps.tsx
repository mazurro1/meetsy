import type { NextPage } from "next";
import type { EventsActiveProps } from "./CalendarClicked.model";

const CalendarNewEventWithProps: NextPage<{
  addEventDateWithProp: EventsActiveProps | null;
  handleAddNewEvent: (item: EventsActiveProps) => void;
}> = ({ addEventDateWithProp, handleAddNewEvent }) => {
  const handleAddEvent = () => {
    if (!!addEventDateWithProp) {
      handleAddNewEvent(addEventDateWithProp);
    }
  };

  return (
    <div>
      <button onClick={handleAddEvent}>add this event</button>
    </div>
  );
};
export default CalendarNewEventWithProps;
