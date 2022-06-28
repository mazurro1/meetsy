import {NextPage} from "next";
import {ButtonIcon, Popup} from "@ui";
import {withSiteProps, withTranslates, withCompanysProps} from "@hooks";
import type {ISiteProps, ITranslatesProps} from "@hooks";
import {useState} from "react";
import AddFundsCompanyProducts from "./AddFundsCompanyProducts";

interface AddFundsCompanyProps {
  companyId: string;
}

const AddFundsCompany: NextPage<
  ITranslatesProps & ISiteProps & AddFundsCompanyProps
> = ({texts, dispatch, siteProps, companyId}) => {
  const [showAddFunds, setShowAddFunds] = useState<boolean>(false);

  const handleClickShowFunds = () => {
    setShowAddFunds((prevState) => !prevState);
  };

  return (
    <>
      <div className="mt-10">
        <ButtonIcon
          id="add_funds_company_button"
          onClick={handleClickShowFunds}
          iconName="CashIcon"
          fullWidth
          color="SECOND"
          isNewIcon
        >
          Doładuj konto firmowe
        </ButtonIcon>
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
