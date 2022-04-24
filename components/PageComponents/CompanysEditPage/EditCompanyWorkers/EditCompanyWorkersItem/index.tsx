import {NextPage} from "next";
import {withSiteProps, withTranslates, withCompanysProps} from "@hooks";
import type {ISiteProps, ITranslatesProps} from "@hooks";
import type {CompanyWorkerProps} from "@/models/CompanyWorker/companyWorker.model";
import {AccordingItem, According, Paragraph} from "@ui";
import {useState} from "react";
import {getFullDateWithTime} from "@functions";
import {
  getAllNamesOfWorkerPermissions,
  EnumWorkerPermissions,
} from "@/models/CompanyWorker/companyWorker.model";
import type {LanguagesProps} from "@Texts";
import {worker} from "shortid";

interface EditCompanyWorkersItemWorkerProps {
  workerItem: CompanyWorkerProps;
  index: number;
  userIsAdmin: boolean;
  handleEditWorker: (value: string) => void;
  handleDeleteWorker: (value: string) => void;
}

const EditCompanyWorkersItemWorker: NextPage<
  ITranslatesProps & ISiteProps & EditCompanyWorkersItemWorkerProps
> = ({
  workerItem,
  index,
  siteProps,
  userIsAdmin,
  handleEditWorker,
  handleDeleteWorker,
}) => {
  let workerId: string = "";
  let workerName: string = "";
  let workerSpecialization: string = "";
  let workerStatusIsActive: boolean = false;
  let dateAddWorker: string = "";
  let dateUpdateWorker: string = "";
  let sitePropsLanguage: LanguagesProps = "pl";
  let workerAllPermissions: string = "";
  let workerIsAdmin: boolean = false;

  if (!!siteProps?.language) {
    sitePropsLanguage = siteProps.language;
  }

  if (!!workerItem) {
    if (!!workerItem._id) {
      workerId = workerItem._id;
    }

    if (!!workerItem.permissions) {
      const valuePermissions = getAllNamesOfWorkerPermissions({
        permissions: workerItem.permissions,
        language: sitePropsLanguage,
      });
      const mapNamesOfPermissions = valuePermissions.map((itemPermission) => {
        return itemPermission.name;
      });
      workerAllPermissions = mapNamesOfPermissions.join(", ");

      workerIsAdmin = workerItem.permissions.some((itemPermission) => {
        return itemPermission === EnumWorkerPermissions.admin;
      });
    }
    if (!!workerItem.specialization) {
      workerSpecialization = workerItem.specialization;
    }
    if (!!workerItem.active) {
      workerStatusIsActive = workerItem.active;
    }
    if (!!workerItem.createdAt) {
      dateAddWorker = getFullDateWithTime(new Date(workerItem.createdAt));
    }
    if (!!workerItem.updatedAt) {
      dateUpdateWorker = getFullDateWithTime(new Date(workerItem.updatedAt));
    }
    if (!!workerItem.userId) {
      if (typeof workerItem.userId !== "string") {
        if (!!workerItem.userId.userDetails) {
          if (
            !!workerItem.userId.userDetails.name &&
            !!workerItem.userId.userDetails.surname
          ) {
            workerName = `${workerItem.userId.userDetails.name.toUpperCase()} ${workerItem.userId.userDetails.surname.toUpperCase()}`;
          }
        }
      }
    }
  }

  const colorAccording: "PRIMARY" | "RED" = workerStatusIsActive
    ? "PRIMARY"
    : "RED";

  const colorAccordingItem: "DEFAULT" | "RED" = workerStatusIsActive
    ? "DEFAULT"
    : "RED";

  const colorSpan: "PRIMARY_DARK" | "RED_DARK" = workerStatusIsActive
    ? "PRIMARY_DARK"
    : "RED_DARK";

  const itemsAccording = workerIsAdmin
    ? userIsAdmin
      ? {
          handleEdit: () => handleEditWorker(workerId),
        }
      : {}
    : {
        handleDelete: () => handleDeleteWorker(workerId),
        handleEdit: () => handleEditWorker(workerId),
      };

  return (
    <div className="mt-10">
      <According
        title={workerName}
        id={workerItem._id}
        marginTop={0}
        marginBottom={0}
        color={colorAccording}
        {...itemsAccording}
      >
        <AccordingItem
          index={0}
          id={`company_worker_${index}`}
          color={colorAccordingItem}
        >
          <Paragraph
            spanBold
            marginTop={0}
            marginBottom={0.5}
            spanColor={colorSpan}
            dangerouslySetInnerHTML={`Nazwa stanowiska: <span>${
              !!workerSpecialization ? workerSpecialization : "Brak"
            }<span/>`}
          />
          <Paragraph
            spanBold
            marginTop={0}
            marginBottom={0.5}
            spanColor={colorSpan}
            dangerouslySetInnerHTML={`Uprawnienia: <span>${workerAllPermissions}</span>`}
          />
          <Paragraph
            spanBold
            marginTop={0}
            marginBottom={0.5}
            spanColor={colorSpan}
            dangerouslySetInnerHTML={`Status: <span>${
              workerStatusIsActive ? "AKTYWNY" : "OCZEKUJĄCY NA POTWIERDZENIE"
            }</span>`}
          />
          <Paragraph
            spanBold
            marginTop={0}
            marginBottom={0.5}
            spanColor={colorSpan}
            dangerouslySetInnerHTML={`Data dodania: <span>${dateAddWorker}</span>`}
          />
          <Paragraph
            spanBold
            marginTop={0}
            marginBottom={0}
            spanColor={colorSpan}
            dangerouslySetInnerHTML={`Data ostatniej modyfikacji: <span>${dateUpdateWorker}</span>`}
          />
        </AccordingItem>
      </According>
    </div>
  );
};

export default withTranslates(
  withSiteProps(withCompanysProps(EditCompanyWorkersItemWorker)),
  "EditCompanyWorkersItem"
);
