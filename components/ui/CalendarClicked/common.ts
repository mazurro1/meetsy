import type { ArrayHoursProps } from "./CalendarClicked.model";

export const selectWeekDayName = (weekNumber: number): string => {
  let weekName = "";
  switch (weekNumber) {
    case 1: {
      weekName = "Poniedziałek";
      break;
    }
    case 2: {
      weekName = "Wtorek";
      break;
    }
    case 3: {
      weekName = "Środa";
      break;
    }
    case 4: {
      weekName = "Czwartek";
      break;
    }
    case 5: {
      weekName = "Piątek";
      break;
    }
    case 6: {
      weekName = "Sobota";
      break;
    }
    case 0: {
      weekName = "Niedziela";
      break;
    }

    default: {
      weekName = "";
      break;
    }
  }
  return weekName;
};

export const arrayHours: ArrayHoursProps[] = [
  {
    index: 0,
    hour: "0:00",
  },
  {
    index: 1,
    hour: "1:00",
  },
  {
    index: 2,
    hour: "2:00",
  },
  {
    index: 3,
    hour: "3:00",
  },
  {
    index: 4,
    hour: "4:00",
  },
  {
    index: 5,
    hour: "5:00",
  },
  {
    index: 6,
    hour: "6:00",
  },
  {
    index: 7,
    hour: "7:00",
  },
  {
    index: 8,
    hour: "8:00",
  },
  {
    index: 9,
    hour: "9:00",
  },
  {
    index: 10,
    hour: "10:00",
  },
  {
    index: 11,
    hour: "11:00",
  },
  {
    index: 12,
    hour: "12:00",
  },
  {
    index: 13,
    hour: "13:00",
  },
  {
    index: 14,
    hour: "14:00",
  },
  {
    index: 15,
    hour: "15:00",
  },
  {
    index: 16,
    hour: "16:00",
  },
  {
    index: 17,
    hour: "17:00",
  },
  {
    index: 18,
    hour: "18:00",
  },
  {
    index: 19,
    hour: "19:00",
  },
  {
    index: 20,
    hour: "20:00",
  },
  {
    index: 21,
    hour: "21:00",
  },
  {
    index: 22,
    hour: "22:00",
  },
  {
    index: 23,
    hour: "23:00",
  },
];
