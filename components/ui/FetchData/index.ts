import type { DataProps } from "@/utils/type";

interface FetchDataProps {
  url: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  data?: Array<any> | object | null;
  callback: (data: DataProps) => void;
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
      callback(data);
    });
};

export default FetchData;
