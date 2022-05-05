import {NextPage} from "next";
import {withSiteProps, withTranslates, withCompanysProps} from "@hooks";
import type {ISiteProps, ITranslatesProps} from "@hooks";
import {ButtonIcon, Paragraph, FetchData} from "@ui";
import type {CompanyWorkerProps} from "@/models/CompanyWorker/companyWorker.model";

interface DeleteCompanyWorkerProps {
  companyId: string;
  deleteComapnyWorkerId: string;
  companyWorkers: CompanyWorkerProps[];
  handleCloseDeleteWorker: () => void;
  handleRemoveCompanyWorkerFromAll: (workerId: string) => void;
}

const DeleteCompanyWorker: NextPage<
  ITranslatesProps & ISiteProps & DeleteCompanyWorkerProps
> = ({
  dispatch,
  siteProps,
  companyId,
  deleteComapnyWorkerId,
  companyWorkers,
  handleCloseDeleteWorker,
  handleRemoveCompanyWorkerFromAll,
}) => {
  const findWorkerToDelete = companyWorkers.find(
    (item) => item._id === deleteComapnyWorkerId
  );

  const handleConfirmDeleteWorker = () => {
    if (!!findWorkerToDelete) {
      if (!!findWorkerToDelete._id) {
        FetchData({
          url: "/api/companys/edit/workers",
          method: "DELETE",
          dispatch: dispatch,
          language: siteProps?.language,
          companyId: companyId,
          data: {
            workerId: findWorkerToDelete._id,
          },
          callback: (data) => {
            if (data.success) {
              handleRemoveCompanyWorkerFromAll(findWorkerToDelete._id);
              handleCloseDeleteWorker();
            }
          },
        });
      }
    }
  };

  let workerName = "";

  if (!!findWorkerToDelete) {
    if (!!findWorkerToDelete.userId) {
      if (typeof findWorkerToDelete.userId !== "string") {
        if (
          !!findWorkerToDelete.userId.userDetails.name &&
          !!findWorkerToDelete.userId.userDetails.surname
        ) {
          workerName = `${findWorkerToDelete.userId.userDetails.name.toUpperCase()} ${findWorkerToDelete.userId.userDetails.surname.toUpperCase()}`;
        }
      }
    }
  }

  return (
    <div>
      <Paragraph bold marginTop={0}>
        Uwaga: Podczas usuwania pracownika wszystkie jego
        rezerwacje/dojazdy/serwisy zostaną usunięte.
      </Paragraph>
      <Paragraph bold marginTop={0} marginBottom={2}>
        Czy napewno chcesz usunąć pracownika: {workerName}?
      </Paragraph>
      <div className="flex-between-center">
        <ButtonIcon
          id="company_close_delete_worker"
          onClick={handleCloseDeleteWorker}
          iconName="ArrowLeftIcon"
          color="GREEN"
        >
          Anuluj usuwanie
        </ButtonIcon>
        <ButtonIcon
          id="company_delete_worker"
          onClick={handleConfirmDeleteWorker}
          iconName="TrashIcon"
          color="RED"
        >
          Usuń pracownika
        </ButtonIcon>
      </div>
    </div>
  );
};

export default withTranslates(
  withSiteProps(withCompanysProps(DeleteCompanyWorker)),
  "DeleteCompanyWorker"
);
