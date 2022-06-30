import {NextPage} from "next";
import {ButtonIcon, Popup, Tooltip} from "@ui";
import {withSiteProps, withTranslates, withCompanysProps} from "@hooks";
import type {ISiteProps, ITranslatesProps} from "@hooks";
import {useState} from "react";
import AddFundsCompanyProducts from "./AddFundsCompanyProducts";

interface AddFundsCompanyProps {
  companyId: string;
  companyBanned: boolean;
}

const AddFundsCompany: NextPage<
  ITranslatesProps & ISiteProps & AddFundsCompanyProps
> = ({texts, dispatch, siteProps, companyId, companyBanned}) => {
  const [showAddFunds, setShowAddFunds] = useState<boolean>(false);

  const handleClickShowFunds = () => {
    setShowAddFunds((prevState) => !prevState);
  };

  return (
    <>
      <div className="mt-10">
        <Tooltip fullWidth textBanned enable={companyBanned} text="">
          <ButtonIcon
            id="add_funds_company_button"
            onClick={handleClickShowFunds}
            iconName="CashIcon"
            fullWidth
            color="SECOND"
            isNewIcon
            disabled={companyBanned}
          >
            Doładuj konto firmowe
          </ButtonIcon>
        </Tooltip>
      </div>
      <Popup
        popupEnable={showAddFunds}
        closeUpEnable={false}
        title="Doładuj konto firmowe"
        handleClose={handleClickShowFunds}
        id="add_funds_company_popup"
      >
        <AddFundsCompanyProducts
          handleClickShowFunds={handleClickShowFunds}
          companyId={companyId}
        />
      </Popup>
    </>
  );
};

export default withTranslates(
  withSiteProps(withCompanysProps(AddFundsCompany)),
  "AddFundsCompany"
);
