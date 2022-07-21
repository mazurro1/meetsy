import {NextPage} from "next";
import {
  PageSegment,
  Form,
  FetchData,
  InputIcon,
  TitlePage,
  According,
  AccordingItem,
  Paragraph,
  ButtonIcon,
} from "@ui";
import type {FormElementsOnSubmit} from "@ui";
import {withSiteProps, withTranslates, withUserProps} from "@hooks";
import type {ISiteProps, ITranslatesProps, IUserProps} from "@hooks";
import {
  EnumUserPermissions,
  getAllNamesOfUserPermissions,
  getAllNamesOfUserConsents,
} from "@/models/User/user.model";
import {getServerSideProps} from "@/lib/VerifiedAdmins";
import type {UserProps} from "@/models/User/user.model";
import {useState} from "react";
import {getFullDateWithTime} from "@functions";
import BanUser from "@/components/PageComponents/AdminUsers/BanCompany";
import ChangeUserConsents from "@/components/PageComponents/AdminUsers/ChangeUserConsents";

export interface ItemsPermissionsProps {
  permission: number;
  name: string;
}

export interface ItemsConsentsProps {
  consent: number;
  name: string;
}

export interface UpdateUserProps {
  folder?: string;
  field: string;
  value: string | null | number | Array<any> | object | boolean;
}

const AdminUsersPage: NextPage<ISiteProps & ITranslatesProps & IUserProps> = ({
  siteProps,
  texts,
  user,
  dispatch,
  isMobile,
}) => {
  const [activeAccording, setActiveAccording] = useState<boolean>(false);
  const [userData, setUserData] = useState<null | UserProps>(null);

  // const emailAdress = texts!.inputEmail;
  const emailAdress = "Adres e-mail użytkownika";

  let language: "pl" | "en" = "pl";
  if (siteProps?.language) {
    language = siteProps?.language;
  }

  let isSuperAdmin = false;
  if (!!user) {
    if (!!user?.permissions) {
      isSuperAdmin = user.permissions.some(
        (item) => item === EnumUserPermissions.superAdmin
      );
    }
  }

  const handleSearchUserAdmin = (
    values: FormElementsOnSubmit[],
    isValid: boolean
  ) => {
    if (isValid) {
      const findEmail = values.find((item) => item.placeholder === emailAdress);
      if (!!findEmail) {
        if (typeof findEmail.value === "string") {
          setActiveAccording(false);
          FetchData({
            url: "/api/admin/users",
            method: "POST",
            dispatch: dispatch,
            language: siteProps?.language,
            data: {
              searchedUserEmail: findEmail.value.toLowerCase(),
            },
            callback: (data) => {
              if (data.success) {
                if (!!data?.data?.user) {
                  setUserData(data.data.user);
                  setActiveAccording(true);
                } else {
                  setUserData(null);
                  setActiveAccording(false);
                }
              } else {
                setUserData(null);
                setActiveAccording(false);
              }
            },
          });
        }
      }
    }
  };

  const handleUpdateUser = (updatedProps: UpdateUserProps[]) => {
    if (!!updatedProps) {
      setUserData((prevState) => {
        const valuesToChange: UpdateUserProps[] = updatedProps;
        valuesToChange.forEach((item) => {
          if (typeof item.value !== "undefined") {
            if (!!item.folder) {
              // @ts-ignore
              if (!!prevState[item.folder]) {
                if (
                  // @ts-ignore
                  typeof prevState[item.folder][item.field] !== "undefined"
                ) {
                  // @ts-ignore
                  prevState[item.folder][item.field] = item.value;
                }
              }
            } else if (!!item.field) {
              // @ts-ignore
              if (typeof prevState[item.field] !== "undefined") {
                // @ts-ignore
                prevState[item.field] = item.value;
              }
            }
          }
        });

        return prevState;
      });
    }
  };

  let valuePermissions: ItemsPermissionsProps[] = [];
  let valueConsents: ItemsConsentsProps[] = [];
  if (!!userData) {
    if (!!userData.permissions) {
      valuePermissions = getAllNamesOfUserPermissions({
        permissions: userData.permissions,
        language: language,
      });
    }
    if (!!userData.consents) {
      valueConsents = getAllNamesOfUserConsents({
        consents: userData.consents,
        language: language,
      });
    }
  }

  const mapNamesOfPermissions = valuePermissions.map(
    (itemPermission: {name: string}) => {
      return " " + itemPermission.name;
    }
  );

  const mapNamesOfConsents = valueConsents.map(
    (itemPermission: {name: string}) => {
      return " " + itemPermission.name;
    }
  );

  return (
    <div>
      <PageSegment id="admin_users_page" maxWidth={600}>
        <TitlePage>Wyszukaj użytkownika</TitlePage>
        <Form
          id="admin_search_user"
          onSubmit={handleSearchUserAdmin}
          buttonText={"Wyszukaj użytkownika"}
          buttonColor="PRIMARY"
          marginBottom={0}
          marginTop={0}
          isFetchToBlock
          iconName="SearchIcon"
          buttonsFullWidth={isMobile}
          validation={[
            {
              placeholder: emailAdress,
              isEmail: true,
            },
          ]}
        >
          <InputIcon
            placeholder={emailAdress}
            validTextGenerate="REQUIRED"
            type="email"
            id="search_email_adres_user_admin_page_input"
            iconName="AtSymbolIcon"
          />
        </Form>
        {!!userData && (
          <According
            title={`${userData.userDetails.name?.toUpperCase()} ${userData.userDetails.surname?.toUpperCase()}`}
            id="according_searched_user"
            defaultIsOpen={false}
            active={activeAccording}
            setActive={setActiveAccording}
          >
            {!!userData && (
              <AccordingItem
                id="according_searched_user_information"
                index={0}
                userSelect
              >
                <div className="ml-10 mr-10">
                  <div>
                    <Paragraph
                      spanBold
                      spanColor="PRIMARY_DARK"
                      dangerouslySetInnerHTML={`ID użytkownika: <span>${userData._id}</span>`}
                      marginBottom={0}
                      marginTop={0}
                    />
                    <Paragraph
                      spanBold
                      spanColor="PRIMARY_DARK"
                      dangerouslySetInnerHTML={`Email: <span>${userData.email}</span>`}
                      marginBottom={0}
                      marginTop={0}
                    />
                    <Paragraph
                      spanBold
                      spanColor="PRIMARY_DARK"
                      dangerouslySetInnerHTML={`Imię: <span>${userData.userDetails.name?.toUpperCase()}</span>`}
                      marginBottom={0}
                      marginTop={0}
                    />
                    <Paragraph
                      spanBold
                      spanColor="PRIMARY_DARK"
                      dangerouslySetInnerHTML={`Nazwisko: <span>${userData.userDetails.surname?.toUpperCase()}</span>`}
                      marginBottom={0}
                      marginTop={0}
                    />
                    <Paragraph
                      spanBold
                      spanColor="PRIMARY_DARK"
                      dangerouslySetInnerHTML={`Język: <span>${userData.userDetails.language}</span>`}
                      marginBottom={0}
                      marginTop={0}
                    />
                    <Paragraph
                      spanBold
                      spanColor="PRIMARY_DARK"
                      dangerouslySetInnerHTML={`Avatar: <span>${userData.userDetails.avatarUrl}</span>`}
                      marginBottom={0}
                      marginTop={0}
                    />
                    <Paragraph
                      spanBold
                      spanColor="PRIMARY_DARK"
                      dangerouslySetInnerHTML={`Użytkownik ma hasło: <span>${userData.userDetails.hasPassword}</span>`}
                      marginBottom={0}
                      marginTop={0}
                    />
                    <Paragraph
                      spanBold
                      spanColor="PRIMARY_DARK"
                      dangerouslySetInnerHTML={`Użytkownik potwierdził adres e-mail: <span>${userData.userDetails.emailIsConfirmed}</span>`}
                      marginBottom={0}
                      marginTop={0}
                    />
                    <Paragraph
                      spanBold
                      spanColor="PRIMARY_DARK"
                      dangerouslySetInnerHTML={`Adres e-mail do potwierdzenia: <span>${userData.userDetails.toConfirmEmail}</span>`}
                      marginBottom={0}
                      marginTop={0}
                    />
                    <Paragraph
                      spanBold
                      spanColor="PRIMARY_DARK"
                      dangerouslySetInnerHTML={`Numer telefonu: ${
                        !!userData?.phoneDetails?.regionalCode &&
                        !!userData?.phoneDetails?.number
                          ? `<span>+${userData.phoneDetails.regionalCode} ${userData.phoneDetails.number}</span>`
                          : "<span>null</span>"
                      }`}
                      marginBottom={0}
                      marginTop={0}
                    />
                    <Paragraph
                      spanBold
                      spanColor="PRIMARY_DARK"
                      dangerouslySetInnerHTML={`Użytkownik ma numer telefonu: <span>${userData.phoneDetails.has}</span>`}
                      marginBottom={0}
                      marginTop={0}
                    />
                    <Paragraph
                      spanBold
                      spanColor="PRIMARY_DARK"
                      dangerouslySetInnerHTML={`Użytkownik potwierdził numer telefonu: <span>${userData.phoneDetails.isConfirmed}</span>`}
                      marginBottom={0}
                      marginTop={0}
                    />
                    <Paragraph
                      spanBold
                      spanColor="PRIMARY_DARK"
                      dangerouslySetInnerHTML={`Numer telefonu do potwierdzenia: ${
                        !!userData?.phoneDetails?.toConfirmRegionalCode &&
                        !!userData?.phoneDetails?.toConfirmNumber
                          ? `<span>+${userData.phoneDetails.toConfirmRegionalCode} ${userData.phoneDetails.toConfirmNumber}</span>`
                          : "<span>null</span>"
                      }`}
                      marginBottom={0}
                      marginTop={0}
                    />
                    <Paragraph
                      spanBold
                      spanColor="PRIMARY_DARK"
                      dangerouslySetInnerHTML={`Data ostatnio wysłanego SMS-a potwierdzający numer telefonu: <span>
                      ${
                        !!userData.phoneDetails.dateSendAgainSMS
                          ? getFullDateWithTime(
                              new Date(userData.phoneDetails.dateSendAgainSMS)
                            )
                          : "-"
                      }
                      </span>`}
                      marginBottom={0}
                      marginTop={0}
                    />
                    <Paragraph
                      spanBold
                      spanColor="PRIMARY_DARK"
                      dangerouslySetInnerHTML={`Zgody: <span>${mapNamesOfConsents}</span>`}
                      marginBottom={0}
                      marginTop={0}
                    />
                    <Paragraph
                      spanBold
                      spanColor="PRIMARY_DARK"
                      dangerouslySetInnerHTML={`Uprawnienia: <span>${mapNamesOfPermissions}</span>`}
                      marginBottom={0}
                      marginTop={0}
                    />
                    <Paragraph
                      spanBold
                      spanColor={userData.banned ? "RED_DARK" : "PRIMARY_DARK"}
                      dangerouslySetInnerHTML={`Konto zablokowane: <span>${userData.banned}</span>`}
                      marginBottom={0}
                      marginTop={0}
                    />
                    <Paragraph
                      spanBold
                      spanColor="PRIMARY_DARK"
                      dangerouslySetInnerHTML={`Ostatnia aktualizacja konta: <span>${
                        !!userData.updatedAt
                          ? getFullDateWithTime(new Date(userData.updatedAt))
                          : "-"
                      }</span>`}
                      marginBottom={0}
                      marginTop={0}
                    />
                    <Paragraph
                      spanBold
                      spanColor="PRIMARY_DARK"
                      dangerouslySetInnerHTML={`Data utowrzenia konta: <span>${
                        !!userData.createdAt
                          ? getFullDateWithTime(new Date(userData.createdAt))
                          : "-"
                      }</span>`}
                      marginBottom={0}
                      marginTop={0}
                    />
                    {!!userData && (
                      <>
                        <ChangeUserConsents
                          userData={userData}
                          handleUpdateUser={handleUpdateUser}
                        />
                        <BanUser
                          userData={userData}
                          handleUpdateUser={handleUpdateUser}
                        />
                      </>
                    )}
                  </div>
                </div>
              </AccordingItem>
            )}
          </According>
        )}
      </PageSegment>
    </div>
  );
};

export {getServerSideProps};

export default withTranslates(
  withSiteProps(withUserProps(AdminUsersPage)),
  "AdminPageUsers"
);
