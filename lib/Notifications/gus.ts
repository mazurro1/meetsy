import Bir from "bir1";

interface GetGUSCompanyInfoProps {
  companyNip: number | null;
}

interface ResponseGetGUSCompanyInfoProps {
  regon: string;
  nip: string;
  statusNip: null | string;
  nazwa: string;
  wojewodztwo: string;
  powiat: string;
  gmina: string;
  miejscowosc: string;
  kodPocztowy: string;
  ulica: string;
  nrNieruchomosci: string;
  nrLokalu: null | string;
  typ: string;
  silosID: string;
  dataZakonczeniaDzialalnosci: null | string;
  miejscowoscPoczty: string;
}

export const GetGUSCompanyInfo = async ({
  companyNip = null,
}: GetGUSCompanyInfoProps) => {
  if (!!companyNip) {
    const bir = new Bir({ key: process.env.GUS_USER_KEY });
    await bir.login();
    const result: ResponseGetGUSCompanyInfoProps = await bir.search({
      nip: companyNip.toString(),
    });
    return result;
  } else {
    return null;
  }
};
