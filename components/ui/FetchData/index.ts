import type { DataProps } from "@/utils/type";
import { addAlertItem } from "@/redux/site/actions";
import type { Dispatch } from "redux";
import { updateDisabledFetchActions } from "@/redux/site/actions";
import type { LanguagesProps } from "@Texts";

interface FetchDataProps {
  url: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  data?: Array<any> | object | null;
  callback: (data: DataProps) => void;
  dispatch?: Dispatch<any>;
  language?: LanguagesProps;
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
}: FetchDataProps) => {
  try {
    const resultFetch = await fetch(url, {
      method: method,
      body: !!data && method !== "GET" ? JSON.stringify(data) : null,
      headers: {
        "Content-Type": "application/json",
        "Content-Language": !!language ? language : "pl",
      },
    });
    const resultToJson: DataProps = await resultFetch.json();
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
    callback(resultToJson);
  } catch (error) {
    console.error(error);
  }
};

export default FetchData;
