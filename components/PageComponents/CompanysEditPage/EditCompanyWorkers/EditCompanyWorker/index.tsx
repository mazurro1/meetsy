import {NextPage} from "next";
import {withSiteProps, withTranslates, withCompanysProps} from "@hooks";
import type {ISiteProps, ITranslatesProps} from "@hooks";
import {
  ButtonIcon,
  Form,
  FetchData,
  InputIcon,
  SelectCreated,
  Paragraph,
} from "@ui";
import type {FormElementsOnSubmit} from "@ui";
import {
  EnumWorkerPermissions,
  allNamesOfPermissions,
  getEnumWorkerPermissions,
} from "@/models/CompanyWorker/companyWorker.model";
import type {CompanyWorkerProps} from "@/models/CompanyWorker/companyWorker.model";
import type {SelectCreatedValuesProps, ValueSelectCreatedProps} from "@ui";
import {useEffect, useState} from "react";
import {sortArray, compareAllItems} from "@functions";
import {addAlertItem} from "@/redux/site/actions";
import type {UpdateCompanyWorker} from "pages/account/companys/edit/[companyId]";

interface EditCompanyWorkerProps {
  companyId: string;
  editComapnyWorkerId: string;
  companyWorkers: CompanyWorkerProps[];
  handleCloseEditWorker: () => void;
  handleUpdateCompanyWorkerProps: (
    workerId: string,
    values: UpdateCompanyWorker[]
  ) => void;
}

const EditCompanyWorker: NextPage<
  ITranslatesProps & ISiteProps & EditCompanyWorkerProps
> = ({
  dispatch,
  siteProps,
  companyId,
  editComapnyWorkerId,
  companyWorkers,
  handleCloseEditWorker,
  handleUpdateCompanyWorkerProps,
}) => {
  const [selectedWorkerPermissions, setSelectedWorkerPermissions] = useState<
    SelectCreatedValuesProps[]
  >([]);

  let language: "pl" | "en" = "pl";
  if (siteProps?.language) {
    language = siteProps?.language;
  }

  const optionsSelectPermissions: SelectCreatedValuesProps[] = [];

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

  let allEditedWorkerPermissions: SelectCreatedValuesProps[] = [];
  let editedWorkerSpecialization: string = "";
  let workerIsAdmin: boolean = true;

  const findedWorker = companyWorkers.find(
    (item) => item._id === editComapnyWorkerId
  );

  if (!!findedWorker) {
    if (!!findedWorker.permissions) {
      workerIsAdmin = findedWorker.permissions.some((itemPermission) => {
        return itemPermission === EnumWorkerPermissions.admin;
      });
    }

    if (!!findedWorker.specialization) {
      editedWorkerSpecialization = findedWorker.specialization;
    }
    if (!!findedWorker.permissions) {
      sortArray(findedWorker.permissions);
      findedWorker.permissions.forEach((itemPermission) => {
        const findItemPermissionEditedWorker = optionsSelectPermissions.find(
          (item) => item.value === itemPermission
        );
        if (!!findItemPermissionEditedWorker) {
          allEditedWorkerPermissions.push(findItemPermissionEditedWorker);
        }
      });
    }
  }

  useEffect(() => {
    const findedWorker = companyWorkers.find(
      (item) => item._id === editComapnyWorkerId
    );
    const toUpdateAllEditedWorkerPermissions: SelectCreatedValuesProps[] = [];
    if (!!findedWorker) {
      if (!!findedWorker.permissions) {
        sortArray(findedWorker.permissions);
        findedWorker.permissions.forEach((itemPermission) => {
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
    }
    setSelectedWorkerPermissions(toUpdateAllEditedWorkerPermissions);
  }, [companyWorkers, editComapnyWorkerId]);

  const inputPosition = "Stanowisko";

  const handleOnChangeWorker = (
    values: FormElementsOnSubmit[],
    isValid: boolean
  ) => {
    if (isValid) {
      const findPosition = values.find(
        (item) => item.placeholder === inputPosition
      );

      const mapWorkerPermissions = selectedWorkerPermissions.map(
        (item) => item.value
      );
      sortArray(mapWorkerPermissions);

      const mapOldWorkerPermissions = allEditedWorkerPermissions.map(
        (item) => item.value
      );
      sortArray(mapOldWorkerPermissions);

      const isTheSmaePermissions = compareAllItems(
        mapWorkerPermissions,
        mapOldWorkerPermissions
      );

      const isTheSameSpecialization = compareAllItems(
        editedWorkerSpecialization,
        !!findPosition ? findPosition.value : ""
      );

      if (isTheSmaePermissions && isTheSameSpecialization) {
        return dispatch!(
          addAlertItem("Wprowadzone dane są takie same!", "RED")
        );
      }

      FetchData({
        url: "/api/companys/edit/workers",
        method: "PATCH",
        dispatch: dispatch,
        language: siteProps?.language,
        companyId: companyId,
        data: {
          permissions: workerIsAdmin ? null : mapWorkerPermissions,
          specialization: !!findPosition ? findPosition.value : null,
          workerId: editComapnyWorkerId,
        },
        callback: (data) => {
          if (data.success) {
            if (
              typeof data.data.permissions !== "undefined" &&
              typeof data.data.specialization !== "undefined"
            ) {
              if (workerIsAdmin) {
                handleUpdateCompanyWorkerProps(editComapnyWorkerId, [
                  {
                    objectName: "specialization",
                    value: data.data.specialization,
                  },
                ]);
              } else {
                handleUpdateCompanyWorkerProps(editComapnyWorkerId, [
                  {
                    objectName: "specialization",
                    value: data.data.specialization,
                  },
                  {
                    objectName: "permissions",
                    value: data.data.permissions,
                  },
                ]);
              }
            }
            handleCloseEditWorker();
          }
        },
      });
    }
  };

  const handleChangeWorkerPermissions = (value: ValueSelectCreatedProps) => {
    const savedValue = value as SelectCreatedValuesProps[];
    setSelectedWorkerPermissions(savedValue);
  };

  return (
    <>
      <Form
        id="add_company_worker"
        onSubmit={handleOnChangeWorker}
        buttonText={"Zapisz"}
        buttonColor="GREEN"
        marginBottom={0}
        marginTop={0}
        isFetchToBlock
        iconName="SaveIcon"
        validation={[]}
        extraButtons={
          <>
            <ButtonIcon
              id="cancel_add_company_worker_button"
              onClick={handleCloseEditWorker}
              iconName="ArrowLeftIcon"
              fullWidth
              color="RED"
            >
              Anuluj
            </ButtonIcon>
          </>
        }
        buttonsInColumn
        buttonsFullWidth
      >
        <InputIcon
          placeholder={inputPosition}
          type="text"
          id="add_company_worker_email_input"
          iconName="IdentificationIcon"
          validTextGenerate="OPTIONAL"
          defaultValue={editedWorkerSpecialization}
        />
        {!workerIsAdmin && (
          <div className="mt-20 mb-40">
            <Paragraph marginTop={0} marginBottom={0} bold>
              Uprawnienia pracownika
            </Paragraph>
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
              top
            />
          </div>
        )}
      </Form>
    </>
  );
};

export default withTranslates(
  withSiteProps(withCompanysProps(EditCompanyWorker)),
  "EditCompanyWorker"
);
