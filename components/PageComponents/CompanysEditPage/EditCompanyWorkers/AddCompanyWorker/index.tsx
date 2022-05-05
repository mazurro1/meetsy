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
  CompanyWorkerPropsLive,
} from "@/models/CompanyWorker/companyWorker.model";
import type {CompanyWorkerProps} from "@/models/CompanyWorker/companyWorker.model";
import type {SelectCreatedValuesProps, ValueSelectCreatedProps} from "@ui";
import {useEffect, useState} from "react";

interface AddCompanyWorkerProps {
  companyId: string;
  handleAddCompanyWorker: () => void;
  handleAddCompanyWorkerToAll: (value: CompanyWorkerProps) => void;
}

const AddCompanyWorker: NextPage<
  ITranslatesProps & ISiteProps & AddCompanyWorkerProps
> = ({
  dispatch,
  siteProps,
  companyId,
  handleAddCompanyWorker,
  handleAddCompanyWorkerToAll,
}) => {
  const [selectedWorkerPermissions, setSelectedWorkerPermissions] = useState<
    SelectCreatedValuesProps[]
  >([]);

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
    const findItemPermission = optionsSelectPermissions.find(
      (item) => item.value === EnumWorkerPermissions.editAllServices
    );
    if (!!findItemPermission) {
      setSelectedWorkerPermissions([findItemPermission]);
    }
  }, []);

  const inputEmail = "Email";
  const inputPosition = "Stanowisko";

  const handleOnChangeEmail = (
    values: FormElementsOnSubmit[],
    isValid: boolean
  ) => {
    if (isValid) {
      const findEmail = values.find((item) => item.placeholder === inputEmail);
      const findPosition = values.find(
        (item) => item.placeholder === inputPosition
      );

      if (!!findEmail) {
        FetchData({
          url: "/api/companys/edit/workers",
          method: "POST",
          dispatch: dispatch,
          language: siteProps?.language,
          companyId: companyId,
          data: {
            workerEmail: findEmail.value,
            permissions: selectedWorkerPermissions.map((item) => item.value),
            specialization: !!findPosition ? findPosition.value : null,
          },
          callback: (data) => {
            if (data.success) {
              if (!!data?.data?.newCompanyWorker) {
                const resultDataCompanyWorker =
                  CompanyWorkerPropsLive.safeParse(data.data.newCompanyWorker);

                if (resultDataCompanyWorker.success) {
                  handleAddCompanyWorkerToAll(data.data.newCompanyWorker);
                }
              }
              handleAddCompanyWorker();
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
      <Paragraph bold marginTop={0}>
        Uwaga: Użytkownik musi posiadać konto na platformie, by móc go dodać do
        firmy
      </Paragraph>
      <Form
        id="add_company_worker"
        onSubmit={handleOnChangeEmail}
        buttonText={"Dodaj pracownika"}
        marginBottom={0}
        marginTop={0}
        isFetchToBlock
        iconName="UserAddIcon"
        validation={[
          {
            placeholder: inputEmail,
            isEmail: true,
          },
        ]}
        extraButtons={
          <>
            <ButtonIcon
              id="cancel_add_company_worker_button"
              onClick={handleAddCompanyWorker}
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
          placeholder={inputEmail}
          type="email"
          id="add_company_worker_email_input"
          iconName="AtSymbolIcon"
          validTextGenerate="REQUIRED"
        />
        <InputIcon
          placeholder={inputPosition}
          type="text"
          id="add_company_worker_email_input"
          iconName="IdentificationIcon"
          validTextGenerate="OPTIONAL"
        />
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
      </Form>
    </>
  );
};

export default withTranslates(
  withSiteProps(withCompanysProps(AddCompanyWorker)),
  "AddCompanyWorker"
);
