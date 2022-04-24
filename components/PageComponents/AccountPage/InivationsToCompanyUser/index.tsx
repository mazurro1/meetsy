import {NextPage} from "next";
import {ButtonIcon, FetchData, According, AccordingItem, Paragraph} from "@ui";
import {withSiteProps, withTranslates, withUserProps} from "@hooks";
import type {ISiteProps, ITranslatesProps, IWithUserProps} from "@hooks";
import {CompanyWorkerPropsShowCompanyNameLive} from "@/models/CompanyWorker/companyWorker.model";
import {useEffect, useState} from "react";
import type {CompanyWorkerProps} from "@/models/CompanyWorker/companyWorker.model";
import {addAlertItem} from "@/redux/site/actions";

interface InivationsToCompanyUserProps {}

const InivationsToCompanyUser: NextPage<
  ITranslatesProps & ISiteProps & InivationsToCompanyUserProps & IWithUserProps
> = ({texts, dispatch, siteProps, router}) => {
  const [userInvitations, setUserInvitations] = useState<CompanyWorkerProps[]>(
    []
  );

  useEffect(() => {
    FetchData({
      url: "/api/user/account/invitations",
      method: "GET",
      dispatch: dispatch,
      language: siteProps?.language,
      callback: (data) => {
        if (data.success) {
          if (!!data?.data?.invitations) {
            const resultData =
              CompanyWorkerPropsShowCompanyNameLive.array().safeParse(
                data.data.invitations
              );
            if (resultData.success) {
              setUserInvitations(data.data.invitations);
            }
          }
        } else {
          dispatch!(addAlertItem("Błąd podczas pobierania zaproszeń", "RED"));
        }
      },
    });
  }, []);

  const handleDeleteCompanyFromState = (companyId: string) => {
    setUserInvitations((prevState) => {
      const filterCompany = prevState.filter((item) => {
        if (!!item.companyId) {
          if (typeof item.companyId !== "string") {
            if (item.companyId._id === companyId) {
              return false;
            }
          }
        }
        return true;
      });
      return filterCompany;
    });
  };

  const handleConfirmInvitation = (companyId: string) => {
    if (!!companyId) {
      FetchData({
        url: "/api/user/account/invitations",
        method: "PATCH",
        dispatch: dispatch,
        language: siteProps?.language,
        companyId: companyId,
        callback: (data) => {
          if (data.success) {
            handleDeleteCompanyFromState(companyId);
            dispatch!(addAlertItem("Zaakceptowano zaproszenie", "GREEN"));
          } else {
            dispatch!(
              addAlertItem("Błąd podczas akceptowania zaproszenia", "RED")
            );
          }
        },
      });
    }
  };

  const handleCancelInvitation = (companyId: string) => {
    if (!!companyId) {
      FetchData({
        url: "/api/user/account/invitations",
        method: "DELETE",
        dispatch: dispatch,
        language: siteProps?.language,
        companyId: companyId,
        callback: (data) => {
          if (data.success) {
            handleDeleteCompanyFromState(companyId);
            dispatch!(addAlertItem("Odrzucono zaproszenie", "RED"));
          } else {
            dispatch!(
              addAlertItem("Błąd podczas odrzucania zaproszenia", "RED")
            );
          }
        },
      });
    }
  };

  const mapUserInvitations = userInvitations.map((item, index) => {
    let companyName: string = "";
    let companyPostalCode: string = "";
    let companyCity: string = "";
    let companyStreet: string = "";
    let companyDistrict: string = "";
    let companyUrl: string = "";
    let companyId: string;

    if (!!item.companyId) {
      if (typeof item.companyId !== "string") {
        if (!!item.companyId._id) {
          companyId = item.companyId._id;
        }

        if (!!item.companyId.companyDetails.name) {
          companyName = item.companyId.companyDetails.name.toUpperCase();
        }

        if (!!item.companyId.companyContact.postalCode) {
          const postalCodeFromCompany: string =
            item.companyId.companyContact.postalCode.toString();
          if (!!postalCodeFromCompany) {
            companyPostalCode = `${postalCodeFromCompany.slice(
              0,
              2
            )}-${postalCodeFromCompany.slice(2, postalCodeFromCompany.length)}`;
          }
        }

        if (!!item.companyId.companyContact.city.placeholder) {
          companyCity = item.companyId.companyContact.city.placeholder;
        }

        if (!!item.companyId.companyContact.street.placeholder) {
          companyStreet = item.companyId.companyContact.street.placeholder;
        }

        if (!!item.companyId.companyContact.district.placeholder) {
          companyDistrict = item.companyId.companyContact.district.placeholder;
        }

        if (!!item.companyId.companyContact.url) {
          companyUrl = item.companyId.companyContact.url;
        }
      }
    }
    return (
      <According
        id="according_user_companys"
        title={companyName}
        marginTop={0}
        marginBottom={0}
        key={index}
        defaultIsOpen
      >
        <AccordingItem id="according_user_company" index={0}>
          <Paragraph
            spanBold
            spanColor="PRIMARY_DARK"
            dangerouslySetInnerHTML={`Miasto: <span>${companyPostalCode}, ${companyCity}</sapn>`}
            marginTop={0}
            marginBottom={0.5}
          />
          <Paragraph
            spanBold
            spanColor="PRIMARY_DARK"
            dangerouslySetInnerHTML={`Dzielnica: <span>${companyDistrict}</sapn>`}
            marginTop={0}
            marginBottom={0.5}
          />
          <Paragraph
            spanBold
            spanColor="PRIMARY_DARK"
            dangerouslySetInnerHTML={`Ulica: <span>${companyStreet}</sapn>`}
            marginTop={0}
            marginBottom={0.5}
          />
          <div className="mb-10">
            <ButtonIcon
              id="company_url"
              iconName="GlobeAltIcon"
              fullWidth
              onClick={() => {
                router?.push(
                  `${process.env.NEXT_PUBLIC_NEXTAUTH_SITE}/company/${companyUrl}`
                );
              }}
            >
              Strona firmy
            </ButtonIcon>
          </div>
          <div className="flex-between-center">
            <ButtonIcon
              id="company_url"
              iconName="TrashIcon"
              color="RED"
              onClick={() => handleCancelInvitation(companyId)}
            >
              Odrzuć zaproszenie
            </ButtonIcon>
            <ButtonIcon
              id="company_url"
              iconName="CheckIcon"
              color="GREEN"
              onClick={() => handleConfirmInvitation(companyId)}
            >
              Przyjmij zaproszenie
            </ButtonIcon>
          </div>
        </AccordingItem>
      </According>
    );
  });

  const contentUserInvitations =
    mapUserInvitations.length > 0 ? (
      mapUserInvitations
    ) : (
      <div className="mt-40 mb-40 text-center">
        <Paragraph bold fontSize="LARGE">
          Brak oczekujących zaproszeń
        </Paragraph>
      </div>
    );

  return <div>{contentUserInvitations}</div>;
};

export default withTranslates(
  withSiteProps(withUserProps(InivationsToCompanyUser)),
  "InivationsToCompanyUser"
);
