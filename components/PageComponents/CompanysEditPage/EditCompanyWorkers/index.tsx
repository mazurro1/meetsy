import {NextPage} from "next";
import {ButtonIcon, Popup, Form} from "@ui";
import {withSiteProps, withTranslates, withCompanysProps} from "@hooks";
import type {ISiteProps, ITranslatesProps} from "@hooks";
import {useState} from "react";
import EditCompanyWorkersItem from "./EditCompanyWorkersItem";
import type {CompanyWorkerProps} from "@/models/CompanyWorker/companyWorker.model";
import AddCompanyWorker from "./AddCompanyWorker";
import DeleteCompanyWorker from "./DeleteCompanyWorker";
import EditCompanyWorker from "./EditCompanyWorker";
import type {UpdateCompanyWorker} from "pages/account/companys/edit/[companyId]";

interface EditCompanyWorkersProps {
  companyWorkers: CompanyWorkerProps[];
  userIsAdmin: boolean;
  companyId: string;
  handleAddCompanyWorkerToAll: (value: CompanyWorkerProps) => void;
  handleRemoveCompanyWorkerFromAll: (workerId: string) => void;
  handleUpdateCompanyWorkerProps: (
    workerId: string,
    values: UpdateCompanyWorker[]
  ) => void;
}

const EditCompanyWorkers: NextPage<
  ITranslatesProps & ISiteProps & EditCompanyWorkersProps
> = ({
  companyWorkers,
  companyId,
  userIsAdmin,
  handleAddCompanyWorkerToAll,
  handleRemoveCompanyWorkerFromAll,
  handleUpdateCompanyWorkerProps,
}) => {
  const [showEditCompanyWorkers, setshowEditCompanyWorkers] =
    useState<boolean>(false);
  const [showAddCompanyWorker, setShowAddCompanyWorker] =
    useState<boolean>(false);
  const [deleteComapnyWorkerId, setDeleteComapnyWorkerId] =
    useState<string>("");
  const [editComapnyWorkerId, setEditComapnyWorkerId] = useState<string>("");

  const handleShowEditCompanyWorkers = () => {
    setshowEditCompanyWorkers((prevState) => !prevState);
  };

  const handleEditWorker = (workerId: string) => {
    if (!!workerId) {
      setEditComapnyWorkerId(workerId);
      setshowEditCompanyWorkers(false);
    }
  };

  const handleDeleteWorker = (workerId: string) => {
    if (!!workerId) {
      setshowEditCompanyWorkers(false);
      setDeleteComapnyWorkerId(workerId);
    }
  };

  const handleAddCompanyWorker = () => {
    setshowEditCompanyWorkers((prevState) => !prevState);
    setShowAddCompanyWorker((prevState) => !prevState);
  };

  const handleCloseDeleteWorker = () => {
    setshowEditCompanyWorkers(true);
    setDeleteComapnyWorkerId("");
  };

  const handleCloseEditWorker = () => {
    setshowEditCompanyWorkers(true);
    setEditComapnyWorkerId("");
  };

  const mapWorkers = companyWorkers.map((itemMap, index) => {
    return (
      <EditCompanyWorkersItem
        workerItem={itemMap}
        index={index}
        key={index}
        userIsAdmin={userIsAdmin}
        handleEditWorker={handleEditWorker}
        handleDeleteWorker={handleDeleteWorker}
      />
    );
  });

  return (
    <>
      <div className="mt-10">
        <ButtonIcon
          id="company_edit_workers"
          onClick={handleShowEditCompanyWorkers}
          iconName="UserGroupIcon"
          fullWidth
        >
          Pracownicy
        </ButtonIcon>
      </div>
      <Popup
        popupEnable={showEditCompanyWorkers}
        closeUpEnable={false}
        title={"Pracownicy"}
        maxWidth={800}
        handleClose={handleShowEditCompanyWorkers}
        id="edit_company_workers_popup"
        heightFull
      >
        <div className="mb-20 mt-10">
          <ButtonIcon
            id="company_add_worker"
            onClick={handleAddCompanyWorker}
            iconName="UserAddIcon"
            fullWidth
            fontSize="LARGE"
          >
            Dodaj pracownika
          </ButtonIcon>
        </div>
        {mapWorkers}
      </Popup>
      <Popup
        popupEnable={showAddCompanyWorker}
        closeUpEnable={false}
        title={"Dodaj pracownika"}
        maxWidth={800}
        handleClose={handleAddCompanyWorker}
        id="add_company_worker_popup"
      >
        <AddCompanyWorker
          companyId={companyId}
          handleAddCompanyWorker={handleAddCompanyWorker}
          handleAddCompanyWorkerToAll={handleAddCompanyWorkerToAll}
        />
      </Popup>
      <Popup
        popupEnable={!!deleteComapnyWorkerId}
        closeUpEnable={false}
        title={"Usuń pracownika"}
        maxWidth={600}
        handleClose={handleCloseDeleteWorker}
        id="delete_company_worker_popup"
      >
        <DeleteCompanyWorker
          companyId={companyId}
          deleteComapnyWorkerId={deleteComapnyWorkerId}
          companyWorkers={companyWorkers}
          handleCloseDeleteWorker={handleCloseDeleteWorker}
          handleRemoveCompanyWorkerFromAll={handleRemoveCompanyWorkerFromAll}
        />
      </Popup>
      <Popup
        popupEnable={!!editComapnyWorkerId}
        closeUpEnable={false}
        title={"Edytuj pracownika"}
        maxWidth={600}
        handleClose={handleCloseEditWorker}
        id="edit_company_worker_popup"
      >
        <EditCompanyWorker
          companyId={companyId}
          companyWorkers={companyWorkers}
          editComapnyWorkerId={editComapnyWorkerId}
          handleCloseEditWorker={handleCloseEditWorker}
          handleUpdateCompanyWorkerProps={handleUpdateCompanyWorkerProps}
        />
      </Popup>
    </>
  );
};

export default withTranslates(
  withSiteProps(withCompanysProps(EditCompanyWorkers)),
  "EditCompanyWorkers"
);
