import {NextPage} from "next";
import {withSiteProps, withTranslates, withCompanysProps} from "@hooks";
import type {ISiteProps, ITranslatesProps} from "@hooks";
import {FetchData, LinkEffect, Paragraph, According, AccordingItem} from "@ui";
import {useEffect, useState} from "react";
import {addAlertItem} from "@/redux/site/actions";
import {PaymentPropsLive} from "@/models/Payment/payment.model";
import type {PaymentProps} from "@/models/Payment/payment.model";
import e from "express";

interface PaymentsCompanyProductsProps {
  companyId: string;
}

const PaymentsCompanyProducts: NextPage<
  ITranslatesProps & ISiteProps & PaymentsCompanyProductsProps
> = ({texts, dispatch, siteProps, companyId}) => {
  const [fetchedPayments, setFetchedPayments] = useState<PaymentProps[]>([]);
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
          dispatch!(addAlertItem("Błąd podczas pobierania oferty", "RED"));
        }
      },
    });
  };

  const mapPayments = fetchedPayments.map((item, index) => {
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
              dangerouslySetInnerHTML={`Zastosowany kupon: <span>${item.couponId.discount}%</span>`}
            />
          </div>
        );
      }
    }
    console.log(item);
    if (typeof item?.productId !== "string")
      return (
        <AccordingItem
          key={index}
          index={index}
          id={`payments_according_company_item_${index}`}
        >
          <Paragraph
            marginBottom={0}
            marginTop={0}
            spanBold
            spanColor="PRIMARY_DARK"
            dangerouslySetInnerHTML={`Nazwa produktu: <span>${item?.productId?.name}</span>`}
          />
          <Paragraph
            marginBottom={0}
            marginTop={0}
            spanBold
            spanColor="PRIMARY_DARK"
            dangerouslySetInnerHTML={`Liczba Meetsy punktów: <span>${item?.productId?.platformPointsCount}</span>`}
          />
          <Paragraph
            marginBottom={0}
            marginTop={0}
            spanBold
            spanColor="PRIMARY_DARK"
            dangerouslySetInnerHTML={`Liczba dodatkowych miesięcy ważności konta: <span>${item?.productId?.platformSubscriptionMonthsCount}</span>`}
          />
          <Paragraph
            marginBottom={0}
            marginTop={0}
            spanBold
            spanColor="PRIMARY_DARK"
            dangerouslySetInnerHTML={`Liczba SMS: <span>${item?.productId?.platformSMSCount}</span>`}
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
                    spanColor="PRIMARY_DARK"
                    dangerouslySetInnerHTML={`Cena bazowa: <span>${item?.productId?.price}zł</span>`}
                  />
                  {couponContent}
                  <Paragraph
                    marginBottom={0}
                    marginTop={0}
                    spanBold
                    spanColor="GREEN_DARK"
                    dangerouslySetInnerHTML={`Cena po obniżce: <span>${
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
                  dangerouslySetInnerHTML={`Cena: <span>${item?.productId?.price}zł</span>`}
                />
              )}
            </>
          )}
          <Paragraph
            marginBottom={0}
            marginTop={0}
            spanBold
            spanColor={item?.status === "paid" ? "PRIMARY_DARK" : "RED_DARK"}
            dangerouslySetInnerHTML={`Status: <span>${
              item?.status === "paid" ? "Zapłacono" : "Nie zapłacono"
            }</span>`}
          />
          {isValidLinkCheckout ? (
            !!item?.stripeCheckoutUrl &&
            item?.status !== "paid" && (
              <div className="flex-start-center">
                <div className="mr-5">
                  <Paragraph
                    marginBottom={0}
                    marginTop={0}
                    spanBold
                    spanColor="PRIMARY_DARK"
                    dangerouslySetInnerHTML={`Link:`}
                  />
                </div>
                <div>
                  <LinkEffect path={item.stripeCheckoutUrl} inNewWindow>
                    <Paragraph
                      marginBottom={0}
                      marginTop={0}
                      bold
                      color="PRIMARY_DARK"
                      dangerouslySetInnerHTML={`Przejdz do płatności`}
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
              dangerouslySetInnerHTML={`Link: <span>Wygasł</span>`}
            />
          )}
        </AccordingItem>
      );
  });

  return (
    <According
      title="Płatności"
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
  "AddFundsCompany"
);
