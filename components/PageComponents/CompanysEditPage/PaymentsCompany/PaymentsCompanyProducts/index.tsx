import {NextPage} from "next";
import {withSiteProps, withTranslates, withCompanysProps} from "@hooks";
import type {ISiteProps, ITranslatesProps} from "@hooks";
import {
  FetchData,
  LinkEffect,
  Paragraph,
  According,
  AccordingItem,
  ButtonIcon,
} from "@ui";
import {useState} from "react";
import {addAlertItem} from "@/redux/site/actions";
import {PaymentPropsLive} from "@/models/Payment/payment.model";
import type {
  PaymentProps,
  PaymentStatusProps,
} from "@/models/Payment/payment.model";
import {getFullDateWithTime} from "@functions";

interface PaymentsCompanyProductsProps {
  companyId: string;
  handleClickSubscriptionDelete: (value: string) => void;
  handleClickShowPayments: () => void;
  fetchedPayments: PaymentProps[];
  setFetchedPayments: React.Dispatch<React.SetStateAction<PaymentProps[]>>;
}

const PaymentsCompanyProducts: NextPage<
  ITranslatesProps & ISiteProps & PaymentsCompanyProductsProps
> = ({
  texts,
  dispatch,
  siteProps,
  companyId,
  handleClickSubscriptionDelete,
  handleClickShowPayments,
  fetchedPayments,
  setFetchedPayments,
}) => {
  const [blockNextPage, setBlockNextPage] = useState<boolean>(false);

  const handleChangePage = (page: number) => {
    FetchData({
      url: "/api/companys/payment",
      method: "POST",
      dispatch: dispatch,
      language: siteProps?.language,
      disabledLoader: false,
      companyId: companyId,
      data: {
        page: page,
      },
      callback: (data) => {
        if (data.success) {
          const resultData = PaymentPropsLive.array().safeParse(
            data.data.payments
          );
          if (resultData.success) {
            if (resultData?.data?.length === 0) {
              setBlockNextPage(true);
            } else {
              if (resultData?.data?.length < 10) {
                setBlockNextPage(true);
              } else {
                setBlockNextPage(false);
              }
              setFetchedPayments(resultData.data);
            }
          } else {
            console.warn(resultData?.error);
          }
        } else {
          dispatch!(addAlertItem(texts!.errorFetchProduct, "RED"));
        }
      },
    });
  };

  const handleCancelSubscription = (paymentId: string | undefined) => {
    if (!!!paymentId) {
      return;
    }

    handleClickShowPayments();
    handleClickSubscriptionDelete(paymentId);
  };

  const mapPayments = fetchedPayments.map(
    (item: PaymentProps, index: number) => {
      let isValidLinkCheckout: boolean = false;
      if (!!item?.expiresAt) {
        isValidLinkCheckout = new Date().getTime() < item?.expiresAt;
      }

      let couponContent = null;
      if (!!item?.couponId) {
        if (typeof item?.couponId !== "string" && item.couponId !== null) {
          couponContent = (
            <div className="mr-5">
              <Paragraph
                marginBottom={0}
                marginTop={0}
                spanBold
                spanColor="PRIMARY_DARK"
                dangerouslySetInnerHTML={`${texts!.addedCoupon}: <span>${
                  item.couponId.discount
                }%</span>`}
              />
            </div>
          );
        }
      }

      let lastStatus: PaymentStatusProps | null = null;
      if (!!item?.status) {
        if (item.status.length > 0) {
          lastStatus = item.status[item.status.length - 1];
        }
      }

      const mapInvoices = item?.stripeLinkInvoice.map(
        (itemInvoice, indexInvoice) => {
          return (
            <div className="flex-start-center" key={indexInvoice}>
              {!!itemInvoice?.date && (
                <div>
                  <LinkEffect path={itemInvoice.url} inNewWindow>
                    <Paragraph
                      marginBottom={0}
                      marginTop={0}
                      bold
                      color="PRIMARY_DARK"
                      dangerouslySetInnerHTML={`${
                        texts!.invoiceFrom
                      }: ${getFullDateWithTime(new Date(itemInvoice.date))}`}
                    />
                  </LinkEffect>
                </div>
              )}
            </div>
          );
        }
      );

      if (typeof item?.productId !== "string")
        return (
          <AccordingItem
            key={index}
            index={index}
            id={`payments_according_company_item_${index}`}
            color={
              !!lastStatus
                ? lastStatus.value === "paid"
                  ? "GREEN"
                  : lastStatus.value === "draft"
                  ? "SECOND"
                  : "RED"
                : "RED"
            }
            handleDelete={
              !!lastStatus &&
              lastStatus.value === "paid" &&
              item?.productId?.method === "subscription" &&
              !!!item.isCanceled
                ? () => handleCancelSubscription(item._id)
                : undefined
            }
            tooltipDelete={texts!.cancelSubscription}
          >
            <Paragraph
              marginBottom={0}
              marginTop={0}
              spanBold
              spanColor="PRIMARY_DARK"
              dangerouslySetInnerHTML={`${texts!.productName}: <span>${
                item?.productId?.name
              }</span>`}
            />
            <Paragraph
              marginBottom={0}
              marginTop={0}
              spanBold
              spanColor="PRIMARY_DARK"
              dangerouslySetInnerHTML={`${texts!.countPoints}: <span>${
                item?.productId?.platformPointsCount
              }</span>`}
            />
            <Paragraph
              marginBottom={0}
              marginTop={0}
              spanBold
              spanColor="PRIMARY_DARK"
              dangerouslySetInnerHTML={`${texts!.countSMS}: <span>${
                item?.productId?.platformSMSCount
              }</span>`}
            />
            <Paragraph
              marginBottom={0}
              marginTop={0}
              spanBold
              spanColor="PRIMARY_DARK"
              dangerouslySetInnerHTML={`${
                texts!.countMonthsSubscription
              }: <span>${
                item?.productId?.platformSubscriptionMonthsCount
              }</span>`}
            />
            {!!item?.productId?.price && (
              <>
                {typeof item.couponId !== "string" &&
                item.couponId !== null &&
                !!item?.couponId?.discount ? (
                  <>
                    <Paragraph
                      marginBottom={0}
                      marginTop={0}
                      spanBold
                      spanColor="GREEN_DARK"
                      dangerouslySetInnerHTML={`${texts!.startPrice}: <span>${
                        item?.productId?.price
                      }zł</span>`}
                    />
                    {couponContent}
                    <Paragraph
                      marginBottom={0}
                      marginTop={0}
                      spanBold
                      spanColor="GREEN_DARK"
                      dangerouslySetInnerHTML={`${texts!.priceAfter}: <span>${
                        (item?.productId?.price / 100) *
                        (100 - item.couponId.discount)
                      }zł</span>`}
                    />
                  </>
                ) : (
                  <Paragraph
                    marginBottom={0}
                    marginTop={0}
                    spanBold
                    spanColor="GREEN_DARK"
                    dangerouslySetInnerHTML={`${texts!.price}: <span>${
                      item?.productId?.price
                    }zł</span>`}
                  />
                )}
              </>
            )}
            {!!lastStatus && (
              <>
                <Paragraph
                  marginBottom={0}
                  marginTop={0}
                  spanBold
                  spanColor={
                    lastStatus.value === "paid"
                      ? "PRIMARY_DARK"
                      : lastStatus.value === "draft"
                      ? "SECOND_DARK"
                      : "RED_DARK"
                  }
                  dangerouslySetInnerHTML={`${texts!.status}: <span>${
                    lastStatus.value === "paid"
                      ? texts!.paid
                      : lastStatus.value === "canceled"
                      ? texts!.canceled
                      : texts!.noPaid
                  }</span>`}
                />
                {isValidLinkCheckout ? (
                  !!item?.stripeCheckoutUrl &&
                  lastStatus.value !== "paid" && (
                    <div className="flex-start-center">
                      <div className="mr-5">
                        <Paragraph
                          marginBottom={0}
                          marginTop={0}
                          spanBold
                          spanColor="PRIMARY_DARK"
                          dangerouslySetInnerHTML={`${texts!.link}:`}
                        />
                      </div>
                      <div>
                        <LinkEffect path={item.stripeCheckoutUrl} inNewWindow>
                          <Paragraph
                            marginBottom={0}
                            marginTop={0}
                            bold
                            color="PRIMARY_DARK"
                            dangerouslySetInnerHTML={texts!.goToPayment}
                          />
                        </LinkEffect>
                      </div>
                    </div>
                  )
                ) : (
                  <Paragraph
                    marginBottom={0}
                    marginTop={0}
                    spanBold
                    spanColor="RED_DARK"
                    dangerouslySetInnerHTML={`${texts!.link}: <span>${
                      texts!.hasExpired
                    }</span>`}
                  />
                )}
                {!!mapInvoices && mapInvoices.length > 0 && (
                  <div className="flex-start-center">
                    <According
                      marginTop={0.5}
                      marginBottom={0}
                      title={texts!.invoice}
                      id="companys_invoices"
                      color="PRIMARY_DARK"
                    >
                      {mapInvoices}
                    </According>
                  </div>
                )}
              </>
            )}
          </AccordingItem>
        );
    }
  );

  return (
    <According
      title={texts!.paymentsAndScubscriptions}
      id="payments_according_company"
      defaultIsOpen
      handleChangePage={handleChangePage}
      blockNextPage={blockNextPage}
    >
      {mapPayments}
    </According>
  );
};

export default withTranslates(
  withSiteProps(withCompanysProps(PaymentsCompanyProducts)),
  "PaymentsCompanyProducts"
);
