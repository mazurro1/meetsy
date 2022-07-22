import {NextPage} from "next";
import {
  According,
  AccordingItem,
  Popup,
  Form,
  ButtonIcon,
  InputIcon,
  Checkbox,
  FetchData,
  DateWithTime,
} from "@ui";
import {withSiteProps, withTranslates, withUserProps} from "@hooks";
import type {ISiteProps, ITranslatesProps, IUserProps} from "@hooks";
import {getServerSideProps} from "@/lib/VerifiedAdmins";
import {useState} from "react";
import type {FormElementsOnSubmit} from "@ui";
import type {ProductProps} from "@/models/Product/product.model";
import AdminSubscriptionsItem from "../AdminSubscriptionsItem";
import type {UpdateProductProps} from "@/pages/admin/packages";
import type {TypeProductMethod} from "@/models/Product/product.model";

interface AdminSubscriptionsProps {
  products: ProductProps[];
  handleAddProduct: (value: ProductProps) => void;
  handleUpdateProduct: (productId: string, data: UpdateProductProps[]) => void;
  handleUpdateAllProduct: (value: ProductProps) => void;
  handleDeleteProduct: (value: string) => void;
  method: TypeProductMethod;
  title: string;
  titleNew: string;
  titleEdit: string;
  titleDelete: string;
}

const AdminSubscriptions: NextPage<
  ISiteProps & ITranslatesProps & IUserProps & AdminSubscriptionsProps
> = ({
  siteProps,
  texts,
  user,
  dispatch,
  isMobile,
  products = [],
  handleAddProduct,
  handleUpdateProduct,
  handleUpdateAllProduct,
  handleDeleteProduct,
  method,
  title,
  titleNew,
  titleEdit,
  titleDelete,
}) => {
  const [showCreateSubscription, setShowCreateSubscription] =
    useState<boolean>(false);
  const [dateStart, setDateStart] = useState<Date | null>(null);
  const [dateEnd, setDateEnd] = useState<Date | null>(null);

  const inputPassword = texts!.inputPassword;
  const inputName = texts!.inputName;
  const inputDescription = texts!.inputDescription;
  const inputReneving = texts!.inputReneving;
  const inputActiveSubscription = texts!.inputActiveSubscription;
  const inputPoints = texts!.inputPoints;
  const inputPremium = texts!.inputPremium;
  const inputSMS = texts!.inputSMS;
  const inputPromotion = texts!.inputPromotion;
  const inputPrice = texts!.inputPrice;

  const handleAddNewSubscription = () => {
    setShowCreateSubscription((prevState) => !prevState);
  };

  const handleCreateSubscription = (
    values: FormElementsOnSubmit[],
    isValid: boolean
  ) => {
    if (isValid) {
      const findPassword = values.find(
        (item) => item.placeholder === inputPassword
      );
      const findName = values.find((item) => item.placeholder === inputName);
      const findDescription = values.find(
        (item) => item.placeholder === inputDescription
      );
      const findReneving = values.find(
        (item) => item.placeholder === inputReneving
      );
      const findPrice = values.find((item) => item.placeholder === inputPrice);
      const findActiveSubscription = values.find(
        (item) => item.placeholder === inputActiveSubscription
      );
      const findPoints = values.find(
        (item) => item.placeholder === inputPoints
      );
      const findPremium = values.find(
        (item) => item.placeholder === inputPremium
      );
      const findSMS = values.find((item) => item.placeholder === inputSMS);

      const findPromotion = values.find(
        (item) => item.placeholder === inputPromotion
      );

      if (
        !!findPassword &&
        !!findName &&
        !!findDescription &&
        findActiveSubscription !== undefined &&
        findPrice !== undefined &&
        findPoints !== undefined &&
        inputSMS !== undefined &&
        findPromotion !== undefined &&
        findPremium !== undefined &&
        !!dateStart
      ) {
        const extraDataSubscription =
          method === "subscription" && findReneving !== undefined
            ? {
                reneving: findReneving.value,
              }
            : {};

        FetchData({
          url: "/api/admin/product",
          method: "POST",
          dispatch: dispatch,
          language: siteProps?.language,
          data: {
            userPassword: findPassword.value,
            name: findName.value,
            description: findDescription.value,
            price: findPrice.value,
            isActive: findActiveSubscription.value,
            method: method,
            points: findPoints.value,
            premium: findPremium.value,
            sms: findSMS?.value,
            promotion: findPromotion.value,
            dateStart: dateStart,
            dateEnd: dateEnd,
            ...extraDataSubscription,
          },
          callback: (data) => {
            if (data.success) {
              if (!!data.data.subscription) {
                handleAddProduct(data.data.subscription);
              }
              handleAddNewSubscription();
            }
          },
        });
      }
    }
  };

  const handleUpdateTimeStart = (time: Date | null) => {
    setDateStart(time);
  };

  const handleUpdateTimeEnd = (time: Date | null) => {
    setDateEnd(time);
  };

  const mapProducts = products?.map((item, index) => {
    return (
      <AdminSubscriptionsItem
        product={item}
        key={index}
        index={index}
        handleUpdateProduct={handleUpdateProduct}
        handleUpdateAllProduct={handleUpdateAllProduct}
        handleDeleteProduct={handleDeleteProduct}
        titleEdit={titleEdit}
        titleDelete={titleDelete}
        method={method}
      />
    );
  });

  return (
    <div>
      <According
        id="according_subscriptions"
        title={title}
        defaultIsOpen
        handleAdd={handleAddNewSubscription}
      >
        {mapProducts}
      </According>
      <Popup
        id="create_subscription_admin"
        popupEnable={showCreateSubscription}
        position="fixed"
        title={titleNew}
        handleClose={handleAddNewSubscription}
      >
        <Form
          id="create_subscription_admin"
          onSubmit={handleCreateSubscription}
          buttonText={titleNew}
          buttonColor="GREEN"
          marginBottom={0}
          marginTop={0}
          isFetchToBlock
          iconName="SaveIcon"
          buttonsFullWidth={isMobile}
          validation={
            method === "subscription"
              ? [
                  {
                    placeholder: inputPassword,
                    isString: true,
                    minLength: 6,
                  },
                  {
                    placeholder: inputName,
                    isString: true,
                    minLength: 6,
                  },
                  {
                    placeholder: inputDescription,
                    isString: true,
                    minLength: 6,
                  },
                  {
                    placeholder: inputReneving,
                    isNumber: true,
                    maxNumber: 12,
                    minNumber: 1,
                  },
                  {
                    placeholder: inputPrice,
                    isNumber: true,
                    maxNumber: 10000,
                    minNumber: 1,
                  },
                  {
                    placeholder: inputPoints,
                    isNumber: true,
                    maxNumber: 1000,
                    minNumber: 0,
                  },
                  {
                    placeholder: inputPremium,
                    isNumber: true,
                    maxNumber: 20,
                    minNumber: 0,
                  },
                  {
                    placeholder: inputSMS,
                    isNumber: true,
                    maxNumber: 5000,
                    minNumber: 0,
                  },
                ]
              : [
                  {
                    placeholder: inputPassword,
                    isString: true,
                    minLength: 6,
                  },
                  {
                    placeholder: inputName,
                    isString: true,
                    minLength: 6,
                  },
                  {
                    placeholder: inputDescription,
                    isString: true,
                    minLength: 6,
                  },
                  {
                    placeholder: inputPrice,
                    isNumber: true,
                    maxNumber: 10000,
                    minNumber: 1,
                  },
                  {
                    placeholder: inputPoints,
                    isNumber: true,
                    maxNumber: 1000,
                    minNumber: 0,
                  },
                  {
                    placeholder: inputPremium,
                    isNumber: true,
                    maxNumber: 20,
                    minNumber: 0,
                  },
                  {
                    placeholder: inputSMS,
                    isNumber: true,
                    maxNumber: 5000,
                    minNumber: 0,
                  },
                ]
          }
          extraButtons={
            <>
              <ButtonIcon
                id="cancel_create_subscription_admin_button"
                onClick={handleAddNewSubscription}
                iconName="ArrowLeftIcon"
                fullWidth={isMobile}
              >
                {texts!.cancel}
              </ButtonIcon>
            </>
          }
        >
          <InputIcon
            placeholder={inputName}
            validTextGenerate="MIN_3"
            type="text"
            id="subscription_name_input"
            iconName="PencilAltIcon"
          />
          <InputIcon
            placeholder={inputDescription}
            validTextGenerate="MIN_3"
            type="text"
            id="subscription_description_input"
            iconName="MenuIcon"
          />
          {method === "subscription" && (
            <InputIcon
              placeholder={inputReneving}
              validTextGenerate="REQUIRED"
              type="number"
              id="subscription_reneving_input"
              iconName="RefreshIcon"
            />
          )}
          <InputIcon
            placeholder={inputPoints}
            validTextGenerate="REQUIRED"
            type="number"
            id="subscription_points_input"
            iconName="CurrencyDollarIcon"
          />
          <InputIcon
            placeholder={inputPremium}
            validTextGenerate="REQUIRED"
            type="number"
            id="subscription_premium_input"
            iconName="ClockIcon"
          />
          <InputIcon
            placeholder={inputSMS}
            validTextGenerate="REQUIRED"
            type="number"
            id="subscription_sms_input"
            iconName="PhoneOutgoingIcon"
          />
          <InputIcon
            placeholder={inputPrice}
            validTextGenerate="REQUIRED"
            type="number"
            id="subscription_price_input"
            iconName="CashIcon"
          />
          <div className="mt-20 mb-40">
            <DateWithTime
              handleUpdateTime={handleUpdateTimeStart}
              id="time_start"
              resetDate
              placeholder={texts!.dateStartOffer}
            />
          </div>
          <div className="mt-40 mb-40">
            <DateWithTime
              handleUpdateTime={handleUpdateTimeEnd}
              id="time_end"
              resetDate
              placeholder={texts!.dateEndtOffer}
            />
          </div>
          <Checkbox
            id="active_subscription_checkbox"
            placeholder={inputActiveSubscription}
            defaultValue={false}
          />
          <Checkbox
            id="promotion_subscription_checkbox"
            placeholder={inputPromotion}
            defaultValue={false}
          />
          <InputIcon
            placeholder={inputPassword}
            validTextGenerate="MIN_6"
            type="password"
            id="admin_password_input"
            iconName="LockClosedIcon"
          />
        </Form>
      </Popup>
    </div>
  );
};

export {getServerSideProps};

export default withTranslates(
  withSiteProps(withUserProps(AdminSubscriptions)),
  "AdminSubscriptions"
);
