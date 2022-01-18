import type { DataProps } from "@/utils/type";
import { addAlertItem } from "@/redux/site/actions";
import type { Dispatch } from "redux";

interface FetchDataProps {
  url: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  data?: Array<any> | object | null;
  callback: (data: DataProps) => void;
  dispatch?: Dispatch<any>;
  language?: "pl" | "en";
}

// GET - wysyłanie zmiennych
// POST - pobieranie zmiennych
// PUT - pobieranie zmiennych
// PATCH - aktualizacja zmienne
// DELETE - usuwanie zmiennych

const FetchData = ({
  url = "/error",
  method = "GET",
  data = null,
  callback,
  dispatch,
  language,
}: FetchDataProps) => {
  return fetch(url, {
    method: method,
    body: !!data && method !== "GET" ? JSON.stringify(data) : null,
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data: DataProps) => {
      if (!!language && !!data.message && !!dispatch) {
        dispatch!(
          addAlertItem(data.message[language], data.success ? "PRIMARY" : "RED")
        );
      } else if (!!data.message) {
        console.error(`Error fetch: ${url}`);
      }

      callback(data);
    });
};

export default FetchData;
