export const UPDATE_DARK_MODE = "UPDATE_DARK_MODE";

export const updateDarkMode = (darkMode: boolean) => (dispatch: any) => {
  return dispatch({ type: UPDATE_DARK_MODE, darkMode });
};
