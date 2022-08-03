import {NextPage} from "next";
import {withSiteProps, withTranslates, withCompanysProps} from "@hooks";
import type {ISiteProps, ITranslatesProps} from "@hooks";
import {FetchData, ButtonIcon, Tooltip, Form, InputIcon} from "@ui";
import {useEffect, useState} from "react";
import {addAlertItem} from "@/redux/site/actions";
import {ProductPropsLive} from "@/models/Product/product.model";
import type {ProductProps} from "@/models/Product/product.model";
import AddFundsCompanyProductsItem from "./AddFundsCompanyProductsItem";
import {MinHeight} from "./AddFundsCompany.style";
import getStripe from "@/utils/get-stripe";
import type {FormElementsOnSubmit} from "@ui";

interface AddFundsCompanyProps {
  handleClickShowFunds: () => void;
  companyId: string;
}

const AddFundsCompany: NextPage<
  ITranslatesProps & ISiteProps & AddFundsCompanyProps
> = ({texts, dispatch, siteProps, handleClickShowFunds, companyId}) => {
  const [fetchedProducts, setFetchedProducts] = useState<ProductProps[]>([]);
  const [selectedProductsId, setSelectedProductsId] = useState<string | null>(
    null
  );
  const [promotionCode, setPromotionCode] = useState<string>("");

  const inputCouponCode = texts!.inputCoupon;

  useEffect(() => {
    FetchData({
      url: "/api/product",
      method: "GET",
      dispatch: dispatch,
      language: siteProps?.language,
      disabledLoader: false,
      callback: (data) => {
        if (data.success) {
          const resultData = ProductPropsLive.array().safeParse(
            data.data.products
          );
          if (resultData.success) {
            setFetchedProducts(resultData.data);
          }
        } else {
          dispatch!(addAlertItem(texts!.errorFetchOffer, "RED"));
        }
      },
    });
  }, []);

  const handleClickProduct = (productId: string) => {
    setSelectedProductsId((prevState) => {
      const isProductIdInPrevState = prevState === productId;

      if (isProductIdInPrevState) {
        return null;
      } else {
        return productId;
      }
    });
  };

  const handleChangePromotionCode = (value: string) => {
    setPromotionCode(value);
  };

  const handleCheckPromotionCode = (
    values: FormElementsOnSubmit[],
    isValid: boolean
  ) => {
    if (isValid) {
      const findCode = values.find(
        (item) => item.placeholder === inputCouponCode
      );
      if (!!selectedProductsId) {
        if (!!findCode?.value) {
          if (typeof findCode.value === "string") {
            FetchData({
              url: "/api/coupon",
              method: "POST",
              dispatch: dispatch,
              language: siteProps?.language,
              companyId: companyId,
              data: {
                couponCode: findCode.value.toUpperCase(),
                productId: selectedProductsId,
              },
              callback: (data) => {
                if (data.success) {
                  dispatch!(
                    addAlertItem(
                      `${texts?.couponCorrect}: ${data?.data?.discount}%!`,
                      "GREEN"
                    )
                  );
                } else {
                  dispatch!(addAlertItem(texts!.couponIncorrect, "RED"));
                }
              },
            });
          }
        } else {
          dispatch!(addAlertItem(texts!.noCoupon, "RED"));
        }
      } else {
        dispatch!(addAlertItem(texts!.noSelectedProduct, "RED"));
      }
    }
  };

  const mapProducts = fetchedProducts.map((item, index) => {
    return (
      <AddFundsCompanyProductsItem
        key={index}
        itemProduct={item}
        handleClickProduct={handleClickProduct}
        selectedProductsId={selectedProductsId}
      />
    );
  });

  const handleGoToCheckout = async () => {
    const resultCheckout = await FetchData({
      url: "/api/checkout_sessions",
      method: "POST",
      dispatch: dispatch,
      language: siteProps?.language,
      disabledLoader: false,
      companyId: companyId,
      async: true,
      data: {
        productId: selectedProductsId,
        promotionCode: !!promotionCode ? promotionCode : null,
      },
    });

    if (!resultCheckout?.success) {
      return dispatch!(addAlertItem(texts!.errorVerifiedPayment, "RED"));
    }

    if (!resultCheckout?.data?.checkoutSession?.id) {
      return dispatch!(addAlertItem(texts!.errorVerifiedPayment, "RED"));
    }
    const stripe = await getStripe();
    const {error} = await stripe!.redirectToCheckout({
      sessionId: resultCheckout?.data?.checkoutSession?.id,
    });

    if (error.message) {
      console.warn(error.message);
      dispatch!(addAlertItem(texts!.errorPayment, "RED"));
    }
  };

  return (
    <div>
      <MinHeight>
        <div className="flex-center-center flex-wrap">{mapProducts}</div>
      </MinHeight>
      <div>
        <Form
          id="check_promotion_code_form"
          onSubmit={handleCheckPromotionCode}
          buttonText={texts!.checkCoupon}
          buttonColor="PRIMARY"
          marginBottom={0}
          marginTop={0}
          isFetchToBlock
          iconName="ReceiptTaxIcon"
          validation={[
            {
              placeholder: inputCouponCode,
              isString: true,
              minLength: 3,
            },
          ]}
        >
          <InputIcon
            placeholder={inputCouponCode}
            value={promotionCode}
            validTextGenerate="MIN_3"
            type="text"
            id="code_coupon_input"
            iconName="ReceiptTaxIcon"
            uppercase
            onChange={handleChangePromotionCode}
          />
        </Form>
      </div>
      <div className="flex-end-center mt-40">
        <div className="mr-10">
          <ButtonIcon
            id="close_add_funds_company_button"
            onClick={handleClickShowFunds}
            color="RED"
            iconName="ArrowLeftIcon"
          >
            {texts!.cancel}
          </ButtonIcon>
        </div>
        <div>
          <Tooltip
            enable={!!!selectedProductsId}
            text={texts!.searchProductToPayment}
          >
            <ButtonIcon
              id="checkout_add_funds_company_button"
              onClick={handleGoToCheckout}
              color="GREEN"
              iconName="CashIcon"
              disabled={!!!selectedProductsId}
            >
              {texts!.goToPayment}
            </ButtonIcon>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default withTranslates(
  withSiteProps(withCompanysProps(AddFundsCompany)),
  "AddFundsCompany"
);
