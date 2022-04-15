import type {DataProps} from "@/utils/type";
import {addAlertItem} from "@/redux/site/actions";
import type {Dispatch} from "redux";
import {updateDisabledFetchActions} from "@/redux/site/actions";
import type {LanguagesProps} from "@Texts";
import {changeLoadingVisible} from "@/redux/site/actions";

interface FetchDataProps {
  url: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  data?: Array<any> | object | null;
  callback?: (data: DataProps) => void;
  dispatch?: Dispatch<any>;
  language?: LanguagesProps;
  disabledLoader?: boolean;
  companyId?: string;
  userEmail?: string | null;
  ssr?: boolean;
  async?: boolean;
}

// GET - wysyłanie zmiennych
// POST - pobieranie zmiennych
// PUT - pobieranie zmiennych
// PATCH - aktualizacja zmienne
// DELETE - usuwanie zmiennych

const FetchData = async ({
  url = "/error",
  method = "GET",
  data = null,
  callback,
  dispatch,
  language,
  disabledLoader = false,
  companyId = "",
  userEmail = "",
  ssr = false,
  async = false,
}: FetchDataProps) => {
  try {
    if (!disabledLoader && !ssr) {
      dispatch?.(changeLoadingVisible(true));
    }

    const userEmailContent = !!userEmail
      ? {"Content-userEmail": userEmail}
      : null;

    const companyIdContent = !!companyId
      ? {"Content-CompanyId": companyId}
      : null;

    const resultFetch = await fetch(url, {
      method: method,
      body: !!data && method !== "GET" ? JSON.stringify(data) : null,
      headers: {
        "Content-Type": "application/json",
        "Content-Language": !!language ? language : "pl",
        ...companyIdContent,
        ...userEmailContent,
      },
    });
    const resultToJson: DataProps = await resultFetch.json();
    if (!ssr) {
      dispatch!(updateDisabledFetchActions(true));
      setTimeout(() => {
        dispatch!(updateDisabledFetchActions(false));
      }, 2000);
      if (!!language && !!resultToJson.message && !!dispatch) {
        dispatch!(
          addAlertItem(
            resultToJson.message,
            resultToJson.success ? "PRIMARY" : "RED"
          )
        );
      } else if (!!resultToJson.message) {
        console.error(`Error fetch: ${url}`);
      }
      if (!disabledLoader) {
        dispatch?.(changeLoadingVisible(false));
      }
    }
    if (async) {
      return resultToJson;
    } else if (!!callback) {
      callback(resultToJson);
    }
    return null;
  } catch (error) {
    if (!disabledLoader) {
      dispatch?.(changeLoadingVisible(false));
    }
    console.error(error);
  }
};

export default FetchData;
