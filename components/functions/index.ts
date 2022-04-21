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

export const getFullDateWithTime = (date: Date): string => {
  const minuteDate: number = date.getMinutes();
  const hourDate: number = date.getHours();
  const dayDate: number = date.getDate();
  const monthDate: number = date.getMonth() + 1;
  const yearDate: number = date.getFullYear();
  return `${dayDate < 10 ? `0${dayDate}` : dayDate}-${
    monthDate < 10 ? `0${monthDate}` : monthDate
  }-${yearDate}, ${hourDate < 10 ? `0${hourDate}` : hourDate}:${
    minuteDate < 10 ? `0${minuteDate}` : minuteDate
  }`;
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
    {length: new Date(year, month, 0).getDate() - 1},
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

export const capitalizeFirstLetter = (value: string): string => {
  if (value.length >= 2) {
    return value.charAt(0).toUpperCase() + value.slice(1);
  } else if (value.length === 1) {
    return value.charAt(0).toUpperCase();
  } else {
    return value;
  }
};

export interface FormElementsOnSubmit {
  value: string | number | boolean;
  placeholder: string;
}

export const detectChangesForm = (
  elements: HTMLFormElement["elements"]
): boolean => {
  if (!!elements) {
    const array: Array<any> = Array.from(elements);
    const filterArray = array.filter((itemToFilter) => {
      return (
        itemToFilter.nodeName === "INPUT" && itemToFilter.type !== "checkbox"
      );
    });

    const valuesForm: FormElementsOnSubmit[] = filterArray.map(
      (itemForm: HTMLInputElement) => {
        const indexToSlice: number = itemForm.placeholder.lastIndexOf("...");
        return {
          placeholder: itemForm.placeholder.slice(0, indexToSlice),
          value:
            itemForm.type === "checkbox"
              ? itemForm.checked
              : itemForm.type === "number"
              ? Number(itemForm.value)
              : itemForm.value,
        };
      }
    );
    let hasChanges: boolean = false;
    for (const itemForm of valuesForm) {
      if (!!itemForm.value) {
        hasChanges = true;
      }
    }

    return hasChanges;
  } else {
    return false;
  }
};

export const convertToValidString = (value: string) => {
  let str = value.toLowerCase();
  var charMap = {
    ó: "o",
    ę: "e",
    ą: "a",
    ś: "s",
    ł: "l",
    ż: "z",
    ź: "z",
    ć: "c",
    ń: "n",
  };
  var rx = /(ó|ę|ą|ś|ł|ż|ź|ć|ń)/g;
  if (rx.test(str)) {
    str = str.replace(rx, function (m, key: any, index) {
      // @ts-ignore
      return charMap[key];
    });
  }
  str = str.replace(/[^a-z\d\s-]/gi, "");
  str = str.replace(/^\s+|\s+$/g, "");
  return str;
};

export const stringToUrl = (value: string) => {
  let str = value.toLowerCase();
  var charMap = {
    ó: "o",
    ę: "e",
    ą: "a",
    ś: "s",
    ł: "l",
    ż: "z",
    ź: "z",
    ć: "c",
    ń: "n",
  };
  var rx = /(ó|ę|ą|ś|ł|ż|ź|ć|ń)/g;
  if (rx.test(str)) {
    str = str.replace(rx, function (m, key: any, index) {
      // @ts-ignore
      return charMap[key];
    });
  }
  str = str.replace(/[^a-z\d\s-]/gi, "");
  str = str.replace(/^\s+|\s+$/g, "");
  str = str.replace(/\s/g, "-");
  return str;
};

export const sortStringsItemsInArray = (
  arrayToSort: Array<any>,
  itemName: string
) => {
  arrayToSort.sort((a, b) => {
    const firstItemToSort: string = a[itemName].toLowerCase();
    const secondItemToSort: string = b[itemName].toLowerCase();
    if (firstItemToSort < secondItemToSort) return -1;
    if (firstItemToSort > secondItemToSort) return 1;
    return 0;
  });
};
