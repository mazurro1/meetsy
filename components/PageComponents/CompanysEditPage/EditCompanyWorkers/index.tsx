import {NextPage} from "next";
import {ButtonIcon, Popup, Form} from "@ui";
import {withSiteProps, withTranslates, withCompanysProps} from "@hooks";
import type {ISiteProps, ITranslatesProps} from "@hooks";
import {useState} from "react";
import EditCompanyWorkersItem from "./EditCompanyWorkersItem";
import type {CompanyWorkerProps} from "@/models/CompanyWorker/companyWorker.model";
import AddCompanyWorker from "./AddCompanyWorker";

interface EditCompanyWorkersProps {
  companyWorkers: CompanyWorkerProps[];
  userIsAdmin: boolean;
  companyId: string;
  handleAddCompanyWorkerToAll: (value: CompanyWorkerProps) => void;
}

const EditCompanyWorkers: NextPage<
  ITranslatesProps & ISiteProps & EditCompanyWorkersProps
> = ({companyWorkers, companyId, userIsAdmin, handleAddCompanyWorkerToAll}) => {
  const [showEditCompanyWorkers, setshowEditCompanyWorkers] =
    useState<boolean>(false);
  const [showAddCompanyWorker, setShowAddCompanyWorker] =
    useState<boolean>(false);

  const handleShowEditCompanyWorkers = () => {
    setshowEditCompanyWorkers((prevState) => !prevState);
  };

  const handleEditWorker = (workerId: string) => {
    console.log("edit ", workerId);
  };

  const handleDeleteWorker = (workerId: string) => {
    console.log("delete ", workerId);
  };

  const handleAddCompanyWorker = () => {
    setshowEditCompanyWorkers((prevState) => !prevState);
    setShowAddCompanyWorker((prevState) => !prevState);
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
    </>
  );
};

export default withTranslates(
  withSiteProps(withCompanysProps(EditCompanyWorkers)),
  "EditCompanyWorkers"
);
