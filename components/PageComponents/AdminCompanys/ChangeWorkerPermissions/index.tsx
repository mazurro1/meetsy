import {NextPage} from "next";
import {
  ButtonIcon,
  FetchData,
  Popup,
  Form,
  InputIcon,
  SelectCreated,
} from "@ui";
import type {FormElementsOnSubmit} from "@ui";
import {
  withSiteProps,
  withTranslates,
  withCompanysProps,
  withUserProps,
} from "@hooks";
import type {ISiteProps, ITranslatesProps, IWithUserProps} from "@hooks";
import type {CompanyWorkerProps} from "@/models/CompanyWorker/companyWorker.model";
import type {SelectCreatedValuesProps, ValueSelectCreatedProps} from "@ui";
import {
  EnumWorkerPermissions,
  allNamesOfPermissions,
  getEnumWorkerPermissions,
  CompanyWorkerPropsLive,
} from "@/models/CompanyWorker/companyWorker.model";
import {useEffect, useState} from "react";
import {sortArray} from "@functions";
import type {UpdateCompanyProps} from "@/pages/admin/companys";
import {z} from "zod";

interface ChangeWorkerPermissionsProps {
  showChangeWorkerPermissions: boolean;
  handleShowChangeWorkerPermissions?: () => void;
  companyId: string;
  handleUpdateCompanyWorker: (
    updatedProps: UpdateCompanyProps[],
    workerId: string
  ) => void;
  workerId: string;
  workerEmail: string | null;
  workerPermissions: number[];
}

const ChangeWorkerPermissions: NextPage<
  ITranslatesProps & ISiteProps & ChangeWorkerPermissionsProps & IWithUserProps
> = ({
  texts,
  dispatch,
  siteProps,
  showChangeWorkerPermissions,
  handleShowChangeWorkerPermissions = () => {},
  user,
  companyId,
  isMobile,
  handleUpdateCompanyWorker,
  workerId,
  workerEmail,
  workerPermissions,
}) => {
  const [selectedWorkerPermissions, setSelectedWorkerPermissions] = useState<
    SelectCreatedValuesProps[]
  >([]);

  const inputPassword: string = texts!.inputPassword;
  const optionsSelectPermissions: SelectCreatedValuesProps[] = [];

  let language: "pl" | "en" = "pl";
  if (siteProps?.language) {
    language = siteProps?.language;
  }

  allNamesOfPermissions.forEach((itemName) => {
    if (!!EnumWorkerPermissions[itemName]) {
      if (EnumWorkerPermissions[itemName] !== EnumWorkerPermissions.admin) {
        const newItem = {
          label: getEnumWorkerPermissions({
            nameEnum: itemName,
            language: language,
          }),
          value: EnumWorkerPermissions[itemName],
        };

        optionsSelectPermissions.push(newItem);
      }
    }
  });

  useEffect(() => {
    const toUpdateAllEditedWorkerPermissions: SelectCreatedValuesProps[] = [];
    if (!!workerPermissions) {
      sortArray(workerPermissions);
      workerPermissions.forEach((itemPermission) => {
        const findItemPermissionEditedWorker = optionsSelectPermissions.find(
          (item) => {
            return item.value === itemPermission;
          }
        );
        if (!!findItemPermissionEditedWorker) {
          toUpdateAllEditedWorkerPermissions.push(
            findItemPermissionEditedWorker
          );
        }
      });
    }
    setSelectedWorkerPermissions(toUpdateAllEditedWorkerPermissions);
  }, [workerPermissions]);

  const handleOnChangeEmail = (
    values: FormElementsOnSubmit[],
    isValid: boolean
  ) => {
    if (isValid) {
      const findPassword = values.find(
        (item) => item.placeholder === inputPassword
      );
      let mapWorkerPermissions = selectedWorkerPermissions.map(
        (item) => item.value
      );
      mapWorkerPermissions = mapWorkerPermissions.filter(
        (item) => item !== EnumWorkerPermissions.admin
      );
      if (!!findPassword && !!workerEmail && mapWorkerPermissions) {
        FetchData({
          url: "/api/admin/companys/workers/permissions",
          method: "PATCH",
          dispatch: dispatch,
          language: siteProps?.language,
          companyId: companyId,
          data: {
            adminPassword: findPassword.value,
            workerEmail: workerEmail,
            permissions: mapWorkerPermissions,
          },
          callback: (data) => {
            if (data.success) {
              const resultData = z
                .number()
                .array()
                .safeParse(data.data.workerPermissions);
              if (resultData.success) {
                if (!!resultData.data) {
                  handleUpdateCompanyWorker(
                    [
                      {
                        field: "permissions",
                        value: data.data.workerPermissions,
                      },
                    ],
                    workerId
                  );
                }
              } else {
                console.error(resultData.error);
              }
              handleShowChangeWorkerPermissions();
            }
          },
        });
      }
    }
  };

  const handleChangeWorkerPermissions = (value: ValueSelectCreatedProps) => {
    const savedValue = value as SelectCreatedValuesProps[];
    setSelectedWorkerPermissions(savedValue);
  };

  return (
    <>
      <div className="mt-5">
        <ButtonIcon
          id="button_change_worker_permissions_company"
          iconName="ClipboardCheckIcon"
          onClick={handleShowChangeWorkerPermissions}
          fullWidth
          color="PRIMARY"
        >
          {texts?.title}
        </ButtonIcon>
      </div>
      <Popup
        popupEnable={
          showChangeWorkerPermissions && !!!user?.userDetails.toConfirmEmail
        }
        closeUpEnable={false}
        title={texts!.title}
        maxWidth={600}
        handleClose={handleShowChangeWorkerPermissions}
        id="change_worker_permissions_company_popup"
      >
        <SelectCreated
          options={optionsSelectPermissions}
          value={selectedWorkerPermissions}
          handleChange={handleChangeWorkerPermissions}
          deleteItem
          deleteLastItem
          isMulti
          closeMenuOnSelect={false}
          placeholder="Uprawnienia"
          maxMenuHeight={150}
          onlyText
        />
        <Form
          id="change_worker_permissions_company"
          onSubmit={handleOnChangeEmail}
          buttonText={texts!.button}
          buttonColor="GREEN"
          marginBottom={0}
          marginTop={0}
          isFetchToBlock
          iconName="SaveIcon"
          buttonsFullWidth={isMobile}
          validation={[
            {
              placeholder: inputPassword,
              isString: true,
              minLength: 6,
            },
          ]}
          extraButtons={
            <>
              <ButtonIcon
                id="show_change_worker_permissions_company_button"
                onClick={handleShowChangeWorkerPermissions}
                iconName="ArrowLeftIcon"
                fullWidth={isMobile}
              >
                {texts!.cancel}
              </ButtonIcon>
            </>
          }
        >
          <InputIcon
            placeholder={inputPassword}
            validTextGenerate="MIN_6"
            type="password"
            id="admin_passowrd_input"
            iconName="LockClosedIcon"
          />
        </Form>
      </Popup>
    </>
  );
};

export default withUserProps(
  withTranslates(
    withSiteProps(withCompanysProps(ChangeWorkerPermissions)),
    "ChangeWorkerPermissions"
  )
);
