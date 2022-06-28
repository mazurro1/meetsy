import {NextPage} from "next";
import {withSiteProps, withTranslates, withCompanysProps} from "@hooks";
import type {ISiteProps, ITranslatesProps} from "@hooks";
import {FetchData, ButtonIcon, Tooltip} from "@ui";
import {useEffect, useState} from "react";
import {addAlertItem} from "@/redux/site/actions";
import {ProductPropsLive} from "@/models/Product/product.model";
import type {ProductProps} from "@/models/Product/product.model";
import AddFundsCompanyProductsItem from "./AddFundsCompanyProductsItem";
import {MinHeight} from "./AddFundsCompany.style";
import getStripe from "@/utils/get-stripe";

interface AddFundsCompanyProps {
  handleClickShowFunds: () => void;
  companyId: string;
}

const AddFundsCompany: NextPage<
  ITranslatesProps & ISiteProps & AddFundsCompanyProps
> = ({texts, dispatch, siteProps, handleClickShowFunds, companyId}) => {
  const [fetchedProducts, setFetchedProducts] = useState<ProductProps[]>([]);
  const [selectedProductsId, setSelectedProductsId] = useState<string[]>([]);

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
          dispatch!(addAlertItem("Błąd podczas pobierania oferty", "RED"));
        }
      },
    });
  }, []);

  const handleClickProduct = (productId: string) => {
    setSelectedProductsId((prevState) => {
      const isProductIdInPrevState = prevState.some(
        (item) => item === productId
      );
      if (isProductIdInPrevState) {
        const filterPrevValues = prevState.filter((item) => item !== productId);
        return filterPrevValues;
      } else {
        return [...prevState, productId];
      }
    });
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
        productsId: selectedProductsId,
      },
    });

    if (!resultCheckout?.success) {
      return dispatch!(
        addAlertItem("Błąd podczas weryfikacji płatności", "RED")
      );
    }

    if (!resultCheckout?.data?.checkoutSession?.id) {
      return dispatch!(
        addAlertItem("Błąd podczas weryfikacji płatności", "RED")
      );
    }
    const stripe = await getStripe();
    const {error} = await stripe!.redirectToCheckout({
      sessionId: resultCheckout?.data?.checkoutSession?.id,
    });

    if (error.message) {
      console.warn(error.message);
      dispatch!(addAlertItem("Błąd podczas płatności", "RED"));
    }
  };

  return (
    <div className="flex-between-end flex-column">
      <MinHeight>
        <div className="flex-center-center flex-wrap">{mapProducts}</div>
      </MinHeight>
      <div className="flex-end-center mt-40">
        <div className="mr-10">
          <ButtonIcon
            id="close_add_funds_company_button"
            onClick={handleClickShowFunds}
            color="RED"
            iconName="ArrowLeftIcon"
          >
            Anuluj
          </ButtonIcon>
        </div>
        <div>
          <Tooltip
            enable={selectedProductsId.length === 0}
            text={"Zaznacz produkt, aby przejść do płatności"}
          >
            <ButtonIcon
              id="checkout_add_funds_company_button"
              onClick={handleGoToCheckout}
              color="GREEN"
              iconName="CashIcon"
              disabled={selectedProductsId.length == 0}
            >
              Przejdz do płatności
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
