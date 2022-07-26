import {NextPage} from "next";
import {ButtonIcon, Popup, Tooltip} from "@ui";
import {withSiteProps, withTranslates, withCompanysProps} from "@hooks";
import type {ISiteProps, ITranslatesProps} from "@hooks";
import {useState} from "react";
import PaymentsCompanyProducts from "./PaymentsCompanyProducts";

interface AddFundsCompanyProps {
  companyId: string;
  companyBanned: boolean;
}

const AddFundsCompany: NextPage<
  ITranslatesProps & ISiteProps & AddFundsCompanyProps
> = ({texts, dispatch, siteProps, companyId, companyBanned}) => {
  const [showPayments, setShowPayments] = useState<boolean>(false);

  const handleClickShowPayments = () => {
    setShowPayments((prevState) => !prevState);
  };

  return (
    <>
      <div className="mt-10">
        <Tooltip fullWidth textBanned enable={companyBanned} text="">
          <ButtonIcon
            id="payments_company_button"
            onClick={handleClickShowPayments}
            iconName="CashIcon"
            fullWidth
            color="SECOND"
            disabled={companyBanned}
          >
            Płatności firmowe
          </ButtonIcon>
        </Tooltip>
      </div>
      <Popup
        popupEnable={showPayments}
        closeUpEnable={false}
        title="Płatności firmowe"
        handleClose={handleClickShowPayments}
        id="payments_company_popup"
        fullScreen
      >
        <PaymentsCompanyProducts companyId={companyId} />
      </Popup>
    </>
  );
};

export default withTranslates(
  withSiteProps(withCompanysProps(AddFundsCompany)),
  "AddFundsCompany"
);
