import type { NextPage } from "next";
import type { EventsActiveProps } from "./CalendarClicked.model";

const CalendarNewEven: NextPage<{
  editEventDateWithProp: EventsActiveProps | null;
  handleSaveEditedEvent: (item: EventsActiveProps) => void;
}> = ({ handleSaveEditedEvent, editEventDateWithProp }) => {
  const handleEditEvent = () => {
    if (!!editEventDateWithProp) {
      handleSaveEditedEvent(editEventDateWithProp);
    }
  };

  return (
    <div>
      <button onClick={handleEditEvent}>save this edited event</button>
    </div>
  );
};
export default CalendarNewEven;
