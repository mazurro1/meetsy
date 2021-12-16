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

export const getFullDate = (date: Date) => {
  const dayDate = date.getDate();
  const monthDate = date.getMonth() + 1;
  const yearDate = date.getFullYear();
  return `${dayDate < 10 ? `0${dayDate}` : dayDate}-${
    monthDate < 10 ? `0${monthDate}` : monthDate
  }-${yearDate}`;
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

export const getAllDaysInWeek = (current: Date) => {
  var week = [];
  var first = current.getDate() - current.getDay() + 1;
  current.setDate(first);
  for (var i = 0; i < 7; i++) {
    week.push(new Date(+current));
    current.setDate(current.getDate() + 1);
  }
  return week;
};
