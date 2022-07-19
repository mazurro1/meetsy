import {NextPage} from "next";
import {According, Paragraph} from "@ui";
import {withTranslates, withSiteProps} from "@hooks";
import type {ISiteProps, ITranslatesProps} from "@hooks";
import {getFullDateWithTime} from "@functions";
import RemoveWorkerFromCompany from "../RemoveWorkerFromCompany";
import {useState} from "react";
import {EnumWorkerPermissions} from "@/models/CompanyWorker/companyWorker.model";
import ChangeWorkerAsAdmin from "@/components/PageComponents/AdminCompanys/ChangeWorkerAsAdmin";
import type {CompanyWorkerProps} from "@/models/CompanyWorker/companyWorker.model";
import ChangeWorkerPermissions from "@/components/PageComponents/AdminCompanys/ChangeWorkerPermissions";
import type {UpdateCompanyProps} from "@/pages/admin/companys";

interface CompanyWorkerInfoProps {
  item: CompanyWorkerProps;
  index: number;
  mapNamesOfPermissions: string[];
  isSuperAdmin: boolean;
  handleDeleteWorkerCompany: (workerId: string) => void;
  handleUpdateAllWorkers: (updatedProps: CompanyWorkerProps[]) => void;
  handleUpdateCompanyWorker: (
    updatedProps: UpdateCompanyProps[],
    workerId: string
  ) => void;
}

const CompanyWorkerInfo: NextPage<
  CompanyWorkerInfoProps & ITranslatesProps & ISiteProps
> = ({
  item,
  index,
  mapNamesOfPermissions,
  isSuperAdmin,
  handleDeleteWorkerCompany,
  handleUpdateAllWorkers,
  handleUpdateCompanyWorker,
  texts,
}) => {
  const [showRemoveWorkerFromCompany, setShowRemoveWorkerFromCompany] =
    useState<boolean>(false);
  const [showChangeWorkerAsAdmin, setShowChangeWorkerAsAdmin] =
    useState<boolean>(false);
  const [showChangeWorkerPermissions, setShowChangeWorkerPermissions] =
    useState<boolean>(false);

  const handleShowRemoveWorkerFromCompany = () => {
    setShowRemoveWorkerFromCompany((prevState) => !prevState);
  };

  const handleShowChangeWorkerAsAdmin = () => {
    setShowChangeWorkerAsAdmin((prevState) => !prevState);
  };

  const handleShowChangeWorkerPermissions = () => {
    setShowChangeWorkerPermissions((prevState) => !prevState);
  };

  const isAdminCompany = item.permissions.some(
    (item) => item === EnumWorkerPermissions.admin
  );

  if (typeof item.userId !== "string" && typeof item.companyId === "string") {
    return (
      <>
        <RemoveWorkerFromCompany
          showRemoveWorkerFromCompany={showRemoveWorkerFromCompany}
          handleShowRemoveWorkerFromCompany={handleShowRemoveWorkerFromCompany}
          companyId={item.companyId}
          handleDeleteWorkerCompany={handleDeleteWorkerCompany}
          workerId={item._id}
        />
        <div className="ml-10 mr-10">
          <According
            title={`${item.userId.userDetails.name?.toLocaleUpperCase()} ${item.userId.userDetails.surname?.toLocaleUpperCase()}`}
            id={`according_searched_company_worker_${index}`}
            defaultIsOpen={false}
            marginTop={1}
            marginBottom={0}
            color={item.active ? "GREEN_DARK" : "RED_DARK"}
          >
            <div className="ml-10 mr-10">
              <Paragraph
                spanBold
                spanColor="PRIMARY_DARK"
                dangerouslySetInnerHTML={`${
                  texts?.nameAndSurname
                } <span>${item.userId.userDetails.name?.toLocaleUpperCase()} ${item.userId.userDetails.surname?.toLocaleUpperCase()}</span>`}
                marginBottom={0}
                marginTop={0}
              />
              <Paragraph
                spanBold
                spanColor="PRIMARY_DARK"
                dangerouslySetInnerHTML={`${
                  texts?.email
                } <span>${item.userId.email?.toLowerCase()}</span>`}
                marginBottom={0}
                marginTop={0}
              />
              <Paragraph
                spanBold
                spanColor="PRIMARY_DARK"
                dangerouslySetInnerHTML={`${texts?.workerAcceptedInvitation} <span>${item.active}</span>`}
                marginBottom={0}
                marginTop={0}
              />
              <Paragraph
                spanBold
                spanColor="PRIMARY_DARK"
                dangerouslySetInnerHTML={`${texts?.specialization} <span>${
                  !!item.specialization ? item.specialization : "-"
                }</span>`}
                marginBottom={0}
                marginTop={0}
              />
              <Paragraph
                spanBold
                spanColor="PRIMARY_DARK"
                dangerouslySetInnerHTML={`${texts?.authorizations} <span>${mapNamesOfPermissions}</span>`}
                marginBottom={0}
                marginTop={0}
              />
              <Paragraph
                spanBold
                spanColor="PRIMARY_DARK"
                dangerouslySetInnerHTML={`${texts?.dataUpdatedWorker} <span>${
                  !!item?.updatedAt
                    ? getFullDateWithTime(new Date(item?.updatedAt))
                    : "-"
                }</span>`}
                marginBottom={0}
                marginTop={0}
              />
              <Paragraph
                spanBold
                spanColor="PRIMARY_DARK"
                dangerouslySetInnerHTML={`${texts?.dataCreatedWorker} <span>${
                  !!item?.createdAt
                    ? getFullDateWithTime(new Date(item?.createdAt))
                    : "-"
                }</span>`}
                marginBottom={0}
                marginTop={0}
              />
              {isSuperAdmin && (
                <>
                  {!isAdminCompany && (
                    <>
                      <ChangeWorkerPermissions
                        showChangeWorkerPermissions={
                          showChangeWorkerPermissions
                        }
                        workerId={item._id}
                        workerEmail={
                          !!item?.userId?.email ? item.userId.email : null
                        }
                        companyId={item.companyId}
                        handleShowChangeWorkerPermissions={
                          handleShowChangeWorkerPermissions
                        }
                        handleUpdateCompanyWorker={handleUpdateCompanyWorker}
                        workerPermissions={item.permissions}
                      />
                      <ChangeWorkerAsAdmin
                        handleShowChangeWorkerAsAdmin={
                          handleShowChangeWorkerAsAdmin
                        }
                        showChangeWorkerAsAdmin={showChangeWorkerAsAdmin}
                        companyId={item.companyId}
                        handleUpdateAllWorkers={handleUpdateAllWorkers}
                        workerId={item._id}
                        workerEmail={
                          !!item?.userId?.email ? item.userId.email : null
                        }
                      />
                    </>
                  )}
                </>
              )}
            </div>
          </According>
        </div>
      </>
    );
  } else {
    return null;
  }
};

export default withTranslates(
  withSiteProps(CompanyWorkerInfo),
  "CompanyWorkerInfo"
);
