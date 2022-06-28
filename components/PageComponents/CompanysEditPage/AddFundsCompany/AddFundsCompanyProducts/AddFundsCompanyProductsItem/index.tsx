import {NextPage} from "next";
import {withSiteProps, withTranslates, withCompanysProps} from "@hooks";
import type {ISiteProps, ITranslatesProps} from "@hooks";
import type {ProductProps} from "@/models/Product/product.model";
import {ProductStyle} from "./AddFundsCompanyProductsItem.style";
import {Colors} from "@constants";
import {Paragraph} from "@ui";

interface AddFundsCompanyProductsItemProps {
  itemProduct: ProductProps;
  handleClickProduct: (value: string) => void;
  selectedProductsId: string[];
}

const AddFundsCompanyProductsItem: NextPage<
  ITranslatesProps & ISiteProps & AddFundsCompanyProductsItemProps
> = ({
  texts,
  dispatch,
  siteProps,
  itemProduct,
  handleClickProduct,
  selectedProductsId,
}) => {
  const productBackground: string = Colors(siteProps).primaryColorDark;
  const productBackgroundHover: string = Colors(siteProps).primaryColor;

  const handleClick = () => {
    if (!!itemProduct?._id) {
      handleClickProduct(itemProduct?._id);
    }
  };

  const isActiveItem = selectedProductsId.some(
    (item) => item === itemProduct?._id
  );

  return (
    <ProductStyle
      productBackground={productBackground}
      productBackgroundHover={productBackgroundHover}
      isActiveItem={isActiveItem}
      onClick={handleClick}
    >
      <Paragraph
        color="WHITE"
        spanColor="WHITE"
        spanBold
        marginBottom={0}
        marginTop={0}
        dangerouslySetInnerHTML={`
          <span>${
            itemProduct?.method === "subscription"
              ? "Subskrypcja"
              : "Płatność jednorazowa"
          }</span>
        `}
      />
      {!!itemProduct?.platformSubscriptionMonthsCount && (
        <Paragraph
          color="WHITE"
          spanColor="WHITE"
          spanBold
          marginBottom={0}
          marginTop={0}
          dangerouslySetInnerHTML={`
        Ilość subskrypcji: 
          <span>${itemProduct?.platformSubscriptionMonthsCount} Miesiące</span>
        `}
        />
      )}
      {!!itemProduct?.platformSMSCount && (
        <Paragraph
          color="WHITE"
          spanColor="WHITE"
          spanBold
          marginBottom={0}
          marginTop={0}
          dangerouslySetInnerHTML={`
        Ilość SMS: 
          <span>${itemProduct?.platformSMSCount} Miesiące</span>
        `}
        />
      )}
      {!!itemProduct?.platformPointsCount && (
        <Paragraph
          color="WHITE"
          spanColor="WHITE"
          spanBold
          marginBottom={0}
          marginTop={0}
          dangerouslySetInnerHTML={`
        Ilość punktów: 
          <span>${itemProduct?.platformPointsCount} Miesiące</span>
        `}
        />
      )}
      <Paragraph
        color="WHITE"
        spanColor="WHITE"
        spanBold
        marginBottom={0}
        marginTop={0}
        dangerouslySetInnerHTML={`
        Cena: 
          <span>${itemProduct?.price}zł</span>
        `}
      />
      {!!itemProduct?.promotionPrice && (
        <Paragraph
          color="WHITE"
          spanColor="WHITE"
          spanBold
          marginBottom={0}
          marginTop={0}
          dangerouslySetInnerHTML={`
        Cena promocyjna: 
          <span>${itemProduct?.promotionPrice}zł</span>
        `}
        />
      )}
    </ProductStyle>
  );
};

export default withTranslates(
  withSiteProps(withCompanysProps(AddFundsCompanyProductsItem)),
  "AddFundsCompanyProductsItem"
);
