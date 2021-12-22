export const validURL = (url: string) => {
  var pattern = new RegExp(
    "^(https?:\\/\\/)?" +
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" +
      "((\\d{1,3}\\.){3}\\d{1,3}))" +
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" +
      "(\\?[;&a-z\\d%_.~+=-]*)?" +
      "(\\#[-a-z\\d_]*)?$",
    "i"
  );
  return !!pattern.test(url);
};

export const validEmail = (email: string) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

export const getFullDate = (date: Date): string => {
  const dayDate: number = date.getDate();
  const monthDate: number = date.getMonth() + 1;
  const yearDate: number = date.getFullYear();
  return `${dayDate < 10 ? `0${dayDate}` : dayDate}-${
    monthDate < 10 ? `0${monthDate}` : monthDate
  }-${yearDate}`;
};

export const getDateMonthYear = (date: Date): string => {
  const monthDate: number = date.getMonth() + 1;
  const yearDate: number = date.getFullYear();
  return `${monthDate < 10 ? `0${monthDate}` : monthDate}-${yearDate}`;
};

export const sortItemsInArray = (arrayToSort: Array<any>, itemName: string) => {
  arrayToSort.sort((a, b) => {
    const firstItemToSort = a[itemName].toLowerCase();
    const secondItemToSort = b[itemName].toLowerCase();
    if (firstItemToSort < secondItemToSort) return -1;
    if (firstItemToSort > secondItemToSort) return 1;
    return 0;
  });
};

export const getAllDaysInMonth = (month: number, year: number) =>
  Array.from(
    { length: new Date(year, month, 0).getDate() - 1 },
    (_, i) => new Date(year, month, i + 1)
  );

export const getDateFromString = (
  current: string,
  hour?: number,
  minute?: number,
  second?: number,
  msecond?: number
): null | Date => {
  let currentDate = null;
  if (!!current) {
    // current => day->month->year: 22-10-2022
    const splitCurrentDate = current.split("-");
    if (splitCurrentDate.length === 3) {
      currentDate = new Date(
        Number(splitCurrentDate[2]),
        Number(splitCurrentDate[1]) - 1,
        Number(splitCurrentDate[0]),
        !!hour ? hour : 10,
        !!minute ? minute : 0,
        !!second ? second : 0,
        !!msecond ? msecond : 0
      );
    }
  }
  return currentDate;
};

// export const getAllDaysInWeek = (current: Date) => {
//   const week = [];
//   const first = current.getDate() - current.getDay();
//   current.setDate(first);
//   for (let i = 0; i < 7; i++) {
//     week.push(new Date(+current));
//     current.setDate(current.getDate() + 1);
//   }
//   return week;
// };

export const getAllDaysInWeek = (current: string) => {
  if (!!current) {
    const currentDate = getDateFromString(current);
    if (!!currentDate) {
      const splitCurrentDate = current.split("-");
      const indexDate = currentDate.getDay() === 0 ? 8 : currentDate.getDay();
      const prevDays = indexDate === 8 ? indexDate - 2 : indexDate - 1;
      const nextDays = indexDate === 8 ? 8 - indexDate : 7 - indexDate;
      let allPrevDays: Date[] = [];
      for (let i = 1; i <= prevDays; i++) {
        const prevDate = new Date(
          Number(splitCurrentDate[2]),
          Number(splitCurrentDate[1]) - 1,
          Number(splitCurrentDate[0]) - i,
          10,
          0,
          0,
          0
        );
        allPrevDays = [prevDate, ...allPrevDays];
      }

      let allNextDays: Date[] = [];
      for (let i = 1; i <= nextDays; i++) {
        const nextDate = new Date(
          Number(splitCurrentDate[2]),
          Number(splitCurrentDate[1]) - 1,
          Number(splitCurrentDate[0]) + i,
          10,
          0,
          0,
          0
        );
        allNextDays = [...allNextDays, nextDate];
      }

      const allDaysInWeek: Date[] = [
        ...allPrevDays,
        currentDate,
        ...allNextDays,
      ];
      return allDaysInWeek;
    }
  }
  return [];
};
