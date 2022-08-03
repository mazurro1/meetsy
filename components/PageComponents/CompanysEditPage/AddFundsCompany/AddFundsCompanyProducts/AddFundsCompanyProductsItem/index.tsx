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
  selectedProductsId: string | null;
}

const AddFundsCompanyProductsItem: NextPage<
  ITranslatesProps & ISiteProps & AddFundsCompanyProductsItemProps
> = ({
  texts,
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

  const isActiveItem = selectedProductsId === itemProduct?._id;

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
              ? texts?.subscription
              : texts?.oneTimePayment
          }</span>
        `}
      />
      <div>
        {!!itemProduct?.platformSubscriptionMonthsCount && (
          <Paragraph
            color="WHITE"
            spanColor="WHITE"
            spanBold
            marginBottom={0}
            marginTop={0}
            dangerouslySetInnerHTML={`
        ${texts?.subscriptionCountMonths}: 
          <span>${itemProduct?.platformSubscriptionMonthsCount}</span>
        `}
          />
        )}
        <div>
          {!!itemProduct?.platformSMSCount && (
            <Paragraph
              color="WHITE"
              spanColor="WHITE"
              spanBold
              marginBottom={0}
              marginTop={0}
              dangerouslySetInnerHTML={`
        ${texts?.countSMS}: 
          <span>${itemProduct?.platformSMSCount}</span>
        `}
            />
          )}
        </div>
        <div>
          {!!itemProduct?.platformPointsCount && (
            <Paragraph
              color="WHITE"
              spanColor="WHITE"
              spanBold
              marginBottom={0}
              marginTop={0}
              dangerouslySetInnerHTML={`
        ${texts?.countPoints}: 
          <span>${itemProduct?.platformPointsCount}</span>
        `}
            />
          )}
        </div>
        <div>
          <Paragraph
            color="WHITE"
            spanColor="WHITE"
            spanBold
            marginBottom={0}
            marginTop={0}
            dangerouslySetInnerHTML={`
        ${texts?.price}: 
          <span>${itemProduct?.price}zł</span>
        `}
          />
        </div>
      </div>
    </ProductStyle>
  );
};

export default withTranslates(
  withSiteProps(withCompanysProps(AddFundsCompanyProductsItem)),
  "AddFundsCompanyProductsItem"
);
