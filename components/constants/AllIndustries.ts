export interface AllIndustriesProps {
  value: number;
  label: string;
  avaibleToSelect: boolean;
}

export const AllIndustries = {
  pl: [
    { value: -1, label: "Wszystko", avaibleToSelect: false },
    { value: 1, label: "Fryzjer", avaibleToSelect: true },
    { value: 2, label: "Salon kosmetyczny", avaibleToSelect: true },
    { value: 3, label: "Paznokcie", avaibleToSelect: true },
    { value: 4, label: "Brwi i rzęsy", avaibleToSelect: true },
    { value: 5, label: "Makijaż", avaibleToSelect: true },
    { value: 6, label: "Fizjoterapia", avaibleToSelect: true },
    { value: 7, label: "Studio Tatuażu", avaibleToSelect: true },
    { value: 8, label: "Barber", avaibleToSelect: true },
    { value: 9, label: "Masaż", avaibleToSelect: true },
    { value: 10, label: "Trener personalny", avaibleToSelect: true },
    { value: 11, label: "Medycyna Estetyczna", avaibleToSelect: true },
    { value: 12, label: "Zdrowie", avaibleToSelect: true },
    { value: 13, label: "Dietetyk", avaibleToSelect: true },
    { value: 14, label: "Depilacja", avaibleToSelect: true },
    { value: 15, label: "Piercing", avaibleToSelect: true },
    { value: 16, label: "Psychoterapia", avaibleToSelect: true },
    { value: 17, label: "Zakupy", avaibleToSelect: true },
    { value: 18, label: "Motoryzacja", avaibleToSelect: true },
    { value: 19, label: "Telekomunikacja", avaibleToSelect: true },
    { value: 20, label: "Elektronika", avaibleToSelect: true },
    { value: 21, label: "Hotele, motele", avaibleToSelect: true },
    {
      value: 22,
      label: "Warsztaty samochodowe, serwisy naprawcze",
      avaibleToSelect: true,
    },
    { value: 23, label: "Instytucje finansowe", avaibleToSelect: true },
    { value: 0, label: "Inne", avaibleToSelect: true },
  ] as AllIndustriesProps[],
  en: [
    { value: -1, label: "All", avaibleToSelect: false },
    { value: 1, label: "Hairdresser", avaibleToSelect: true },
    { value: 2, label: "Beauty studio", avaibleToSelect: true },
    { value: 3, label: "Nails", avaibleToSelect: true },
    { value: 4, label: "Eyebrows and eyelashes", avaibleToSelect: true },
    { value: 5, label: "Makeup", avaibleToSelect: true },
    { value: 6, label: "Physiotherapy", avaibleToSelect: true },
    { value: 7, label: "Tattoo studio", avaibleToSelect: true },
    { value: 8, label: "Barber", avaibleToSelect: true },
    { value: 9, label: "Massage", avaibleToSelect: true },
    { value: 10, label: "Personal trainer", avaibleToSelect: true },
    { value: 11, label: "Aesthetic medicine", avaibleToSelect: true },
    { value: 12, label: "Health", avaibleToSelect: true },
    { value: 13, label: "Dietician", avaibleToSelect: true },
    { value: 14, label: "Epilation", avaibleToSelect: true },
    { value: 15, label: "Piercing", avaibleToSelect: true },
    { value: 16, label: "Psychotherapy", avaibleToSelect: true },
    { value: 17, label: "Shopping", avaibleToSelect: true },
    { value: 18, label: "Automotive", avaibleToSelect: true },
    { value: 19, label: "Telecommunication", avaibleToSelect: true },
    { value: 20, label: "Electronics", avaibleToSelect: true },
    { value: 21, label: "Hotels, motels", avaibleToSelect: true },
    {
      value: 22,
      label: "Car workshops, repair services",
      avaibleToSelect: true,
    },
    { value: 23, label: "Financial institutions", avaibleToSelect: true },
    { value: 0, label: "Other", avaibleToSelect: true },
  ] as AllIndustriesProps[],
};
