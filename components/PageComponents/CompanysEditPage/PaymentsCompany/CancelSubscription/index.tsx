import {NextPage} from "next";
import {ButtonIcon, FetchData, Popup, Form, InputIcon} from "@ui";
import type {FormElementsOnSubmit} from "@ui";
import {
  withSiteProps,
  withTranslates,
  withCompanysProps,
  withUserProps,
} from "@hooks";
import type {ISiteProps, ITranslatesProps, IWithUserProps} from "@hooks";
import type {PaymentProps} from "@/models/Payment/payment.model";
import {addAlertItem} from "@/redux/site/actions";

interface CancelSubscriptionProps {
  setFetchedPayments: React.Dispatch<React.SetStateAction<PaymentProps[]>>;
  cancelSubscriptionId: string;
  companyId: string;
  handleCloseCancelSubscription: () => void;
}

const CancelSubscription: NextPage<
  ITranslatesProps & ISiteProps & CancelSubscriptionProps & IWithUserProps
> = ({
  texts,
  dispatch,
  siteProps,
  user,
  isMobile,
  setFetchedPayments,
  cancelSubscriptionId,
  companyId,
  handleCloseCancelSubscription,
}) => {
  const inputPassword: string = texts!.inputPassword;

  const handleOnChangeEmail = (
    values: FormElementsOnSubmit[],
    isValid: boolean
  ) => {
    if (isValid) {
      const findPassword = values.find(
        (item) => item.placeholder === inputPassword
      );
      if (!!findPassword) {
        FetchData({
          url: "/api/companys/payment",
          method: "DELETE",
          dispatch: dispatch,
          language: siteProps?.language,
          disabledLoader: false,
          companyId: companyId,
          data: {
            paymentId: cancelSubscriptionId,
            password: findPassword.value,
          },
          callback: (data) => {
            if (data.success) {
              if (
                data.data.isCanceled !== undefined &&
                data.data.status !== undefined
              ) {
                setFetchedPayments((prevState) => {
                  const toSavePrevState: PaymentProps[] = [];
                  for (const payment of prevState) {
                    if (payment?._id === cancelSubscriptionId) {
                      payment.isCanceled = data.data.isCanceled;
                      payment.status = data.data.status;
                    }
                    toSavePrevState.push(payment);
                  }

                  return toSavePrevState;
                });
              }
              dispatch!(addAlertItem(texts!.subscriptionCanceled, "GREEN"));
              handleCloseCancelSubscription();
            }
          },
        });
      }
    }
  };

  return (
    <Popup
      popupEnable={!!cancelSubscriptionId}
      closeUpEnable={false}
      title={texts!.cancelSubscription}
      handleClose={handleCloseCancelSubscription}
      id="subscription_cancel_company_popup"
      color="RED"
      maxWidth={500}
    >
      <Form
        id="cancel_subscription_company"
        onSubmit={handleOnChangeEmail}
        buttonText={texts!.cancelSubscription}
        buttonColor="RED"
        marginBottom={0}
        marginTop={0}
        isFetchToBlock
        iconName="TrashIcon"
        buttonsFullWidth={isMobile}
        validation={[
          {
            placeholder: inputPassword,
            isString: true,
            minLength: 6,
          },
        ]}
        extraButtons={
          <>
            <ButtonIcon
              id="show_cancel_subscription_company_button"
              onClick={handleCloseCancelSubscription}
              iconName="ArrowLeftIcon"
              fullWidth={isMobile}
              isFetchToBlock
            >
              {texts!.cancel}
            </ButtonIcon>
          </>
        }
      >
        <InputIcon
          placeholder={inputPassword}
          validTextGenerate="MIN_6"
          validText={texts!.minLetter}
          type="password"
          id="admin_passowrd_input"
          iconName="LockClosedIcon"
        />
      </Form>
    </Popup>
  );
};

export default withUserProps(
  withTranslates(
    withSiteProps(withCompanysProps(CancelSubscription)),
    "CancelSubscription"
  )
);
