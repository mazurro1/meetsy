import {stringToUrl} from "@functions";
import {FetchData} from "@ui";
import Geolocation from "@/models/Geolocation/geolocation";

interface GetGeolocationProps {
  adress: string;
}

interface GoogleGeolocation {
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
    location_type: string;
  };
  place_id: string;
  types: string[];
}

export const getGeolocation = async ({adress = ""}: GetGeolocationProps) => {
  try {
    const validAdress = !!adress
      ? stringToUrl(adress.toLowerCase().trim())
      : "polska";

    const findedGeolocation = await Geolocation.findOne({
      adress: validAdress,
    });

    if (!!findedGeolocation) {
      return findedGeolocation.location;
    }

    const fetchedGeolocation: any = await FetchData({
      url: `https://maps.googleapis.com/maps/api/geocode/json?address=${validAdress}&sensor=false&key=${process.env.GOOGLE_API_KEY}`,
      method: "POST",
      disabledLoader: true,
      ssr: true,
      async: true,
    });

    if (!!!fetchedGeolocation) {
      return null;
    }

    if (fetchedGeolocation.status !== "OK") {
      return null;
    }

    if (!!!Array.isArray(fetchedGeolocation.results)) {
      return null;
    }

    if (fetchedGeolocation.results.length <= 0) {
      return null;
    }

    const [resultGeolocation]: GoogleGeolocation[] = fetchedGeolocation.results;

    const newGeolocation = new Geolocation({
      adress: validAdress,
      location: resultGeolocation.geometry.location,
    });

    const savedGeolocation = await newGeolocation.save();

    return savedGeolocation.location;
  } catch (err) {
    console.log(err);
    return null;
  }
};
