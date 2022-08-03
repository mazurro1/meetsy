import {NextPage} from "next";
import {ButtonIcon, Popup, Tooltip} from "@ui";
import {withSiteProps, withTranslates, withCompanysProps} from "@hooks";
import type {ISiteProps, ITranslatesProps} from "@hooks";
import {useState} from "react";
import PaymentsCompanyProducts from "./PaymentsCompanyProducts";
import type {PaymentProps} from "@/models/Payment/payment.model";
import CancelSubscription from "./CancelSubscription";

interface AddFundsCompanyProps {
  companyId: string;
  companyBanned: boolean;
}

const AddFundsCompany: NextPage<
  ITranslatesProps & ISiteProps & AddFundsCompanyProps
> = ({texts, companyId, companyBanned}) => {
  const [fetchedPayments, setFetchedPayments] = useState<PaymentProps[]>([]);
  const [showPayments, setShowPayments] = useState<boolean>(false);
  const [cancelSubscriptionId, setCancelSubscriptionId] = useState<string>("");

  const handleClickShowPayments = () => {
    setShowPayments((prevState) => !prevState);
  };

  const handleClickSubscriptionDelete = (value: string) => {
    setCancelSubscriptionId(value);
  };

  const handleCloseCancelSubscription = () => {
    handleClickSubscriptionDelete("");
    handleClickShowPayments();
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
            {texts!.paymentsAndSubscriptions}
          </ButtonIcon>
        </Tooltip>
      </div>
      <CancelSubscription
        cancelSubscriptionId={cancelSubscriptionId}
        companyId={companyId}
        setFetchedPayments={setFetchedPayments}
        handleCloseCancelSubscription={handleCloseCancelSubscription}
      />
      <Popup
        popupEnable={showPayments}
        closeUpEnable={false}
        title={texts!.paymentsAndSubscriptions}
        handleClose={handleClickShowPayments}
        id="payments_company_popup"
        fullScreen
        maxWidth={600}
      >
        <PaymentsCompanyProducts
          companyId={companyId}
          handleClickSubscriptionDelete={handleClickSubscriptionDelete}
          handleClickShowPayments={handleClickShowPayments}
          fetchedPayments={fetchedPayments}
          setFetchedPayments={setFetchedPayments}
        />
      </Popup>
    </>
  );
};

export default withTranslates(
  withSiteProps(withCompanysProps(AddFundsCompany)),
  "PaymentsCompany"
);
