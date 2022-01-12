import type { ValueSelectCreatedProps } from "@ui";
import type { SortsNamesProps, ListMapProps } from "@constants";

export interface FiltersCompanysProps {
  selectedSortsName: ValueSelectCreatedProps;
  SortsNames: SortsNamesProps[];
  setSelectedSortsName: (value: ValueSelectCreatedProps) => void;
  selectedListMapName: ValueSelectCreatedProps;
  setSelectedListMapName: (value: ValueSelectCreatedProps) => void;
  ListMapNames: ListMapProps[];
  selectedCity: string;
  selectedDistrict: string;
}
