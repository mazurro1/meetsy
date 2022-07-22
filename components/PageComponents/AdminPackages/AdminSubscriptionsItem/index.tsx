import {NextPage} from "next";
import {
  AccordingItem,
  Paragraph,
  Popup,
  Form,
  ButtonIcon,
  InputIcon,
  DateWithTime,
  Checkbox,
  FetchData,
} from "@ui";
import {withSiteProps, withTranslates, withUserProps} from "@hooks";
import type {ISiteProps, ITranslatesProps, IUserProps} from "@hooks";
import {getServerSideProps} from "@/lib/VerifiedAdmins";
import type {ProductProps} from "@/models/Product/product.model";
import {getFullDateWithTime} from "@functions";
import {useState} from "react";
import type {FormElementsOnSubmit} from "@ui";
import type {UpdateProductProps} from "@/pages/admin/packages";
import type {TypeProductMethod} from "@/models/Product/product.model";

interface AdminSubscriptionsItemProps {
  product: ProductProps;
  index: number;
  handleUpdateProduct: (productId: string, data: UpdateProductProps[]) => void;
  handleUpdateAllProduct: (value: ProductProps) => void;
  handleDeleteProduct: (value: string) => void;
  titleEdit: string;
  titleDelete: string;
  method: TypeProductMethod;
}

const AdminSubscriptionsItem: NextPage<
  ISiteProps & ITranslatesProps & IUserProps & AdminSubscriptionsItemProps
> = ({
  siteProps,
  texts,
  user,
  dispatch,
  isMobile,
  product,
  index,
  handleUpdateProduct,
  handleUpdateAllProduct,
  handleDeleteProduct,
  titleEdit,
  titleDelete,
  method,
}) => {
  const [showDeleteProduct, setShowDeleteProduct] = useState<boolean>(false);
  const [showEditPromotion, setShowEditPromotion] = useState<boolean>(false);
  const [dateStart, setDateStart] = useState<Date | null>(
    !!product?.dateStart ? new Date(product?.dateStart) : null
  );
  const [dateEnd, setDateEnd] = useState<Date | null>(
    !!product?.dateEnd ? new Date(product?.dateEnd) : null
  );

  const inputPassword = texts!.inputPassword;
  const inputName = texts!.inputName;
  const inputDescription = texts!.inputDescription;
  const inputReneving = texts!.inputReneving;
  const inputActiveSubscription = texts!.inputActiveSubscription;
  const inputPoints = texts!.inputPoints;
  const inputPremium = texts!.inputPremium;
  const inputSMS = texts!.inputSMS;
  const inputPromotion = texts!.inputPromotion;

  const handleShowDeleteProduct = () => {
    setShowDeleteProduct((prevState) => !prevState);
  };

  const handleEditPromotion = () => {
    setShowEditPromotion((prevState) => !prevState);
  };

  const handleUpdateTimeStart = (time: Date | null) => {
    setDateStart(time);
  };

  const handleUpdateTimeEnd = (time: Date | null) => {
    setDateEnd(time);
  };

  const handleSaveEditSubscription = (
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
          method: "PATCH",
          dispatch: dispatch,
          language: siteProps?.language,
          data: {
            _id: product?._id,
            userPassword: findPassword.value,
            name: findName.value,
            description: findDescription.value,
            isActive: findActiveSubscription.value,
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
              if (!!data.data.product) {
                handleUpdateAllProduct(data.data.product);
              }
              handleEditPromotion();
            }
          },
        });
      }
    }
  };

  const handleSaveDeleteSubscription = (
    values: FormElementsOnSubmit[],
    isValid: boolean
  ) => {
    if (isValid) {
      const findPassword = values.find(
        (item) => item.placeholder === inputPassword
      );

      if (!!findPassword) {
        FetchData({
          url: "/api/admin/product",
          method: "DELETE",
          dispatch: dispatch,
          language: siteProps?.language,
          data: {
            productId: product?._id,
            userPassword: findPassword.value,
          },
          callback: (data) => {
            if (data.success) {
              if (data.data.productId) {
                handleDeleteProduct(data.data.productId);
              }
              handleShowDeleteProduct();
            }
          },
        });
      }
    }
  };

  return (
    <>
      <AccordingItem
        index={index}
        id={`product_subscription_${index + 1}`}
        handleEdit={handleEditPromotion}
        handleDelete={handleShowDeleteProduct}
      >
        <Paragraph
          spanBold
          spanColor="PRIMARY_DARK"
          dangerouslySetInnerHTML={`${inputName}: <span>${product?.name}</span>`}
          marginBottom={0}
          marginTop={0}
        />
        <Paragraph
          spanBold
          spanColor="PRIMARY_DARK"
          dangerouslySetInnerHTML={`${inputDescription}: <span>${product?.description}</span>`}
          marginBottom={0}
          marginTop={0}
        />
        {method === "subscription" && (
          <Paragraph
            spanBold
            spanColor="PRIMARY_DARK"
            dangerouslySetInnerHTML={`${inputReneving}: <span>${product?.reneving}</span>`}
            marginBottom={0}
            marginTop={0}
          />
        )}
        <Paragraph
          spanBold
          spanColor="PRIMARY_DARK"
          dangerouslySetInnerHTML={`${inputPoints}: <span>${product?.platformPointsCount}</span>`}
          marginBottom={0}
          marginTop={0}
        />
        <Paragraph
          spanBold
          spanColor="PRIMARY_DARK"
          dangerouslySetInnerHTML={`${inputPremium}: <span>${product?.platformSubscriptionMonthsCount}</span>`}
          marginBottom={0}
          marginTop={0}
        />
        <Paragraph
          spanBold
          spanColor="PRIMARY_DARK"
          dangerouslySetInnerHTML={`${inputSMS}: <span>${product?.platformSMSCount}</span>`}
          marginBottom={0}
          marginTop={0}
        />
        <Paragraph
          spanBold
          spanColor="PRIMARY_DARK"
          dangerouslySetInnerHTML={`${texts?.inputPrice}: <span>${product?.price}</span>`}
          marginBottom={0}
          marginTop={0}
        />
        <Paragraph
          spanBold
          spanColor="PRIMARY_DARK"
          dangerouslySetInnerHTML={`${texts?.dateStartOffer}: <span>${
            !!product?.dateStart
              ? getFullDateWithTime(new Date(product?.dateStart))
              : "-"
          }</span>`}
          marginBottom={0}
          marginTop={0}
        />
        <Paragraph
          spanBold
          spanColor="PRIMARY_DARK"
          dangerouslySetInnerHTML={`${texts?.dateEndtOffer}: <span>${
            !!product?.dateEnd
              ? getFullDateWithTime(new Date(product?.dateEnd))
              : "-"
          }</span>`}
          marginBottom={0}
          marginTop={0}
        />
        <Paragraph
          spanBold
          spanColor="PRIMARY_DARK"
          dangerouslySetInnerHTML={`${texts?.inputActiveSubscription}: <span>${product?.isAcitve}</span>`}
          marginBottom={0}
          marginTop={0}
        />
        <Paragraph
          spanBold
          spanColor="PRIMARY_DARK"
          dangerouslySetInnerHTML={`${texts?.inputPromotion}: <span>${product?.promotion}</span>`}
          marginBottom={0}
          marginTop={0}
        />
      </AccordingItem>

      <Popup
        id="edit_subscription_admin"
        popupEnable={showEditPromotion}
        position="fixed"
        title={titleEdit}
        handleClose={handleEditPromotion}
      >
        <Form
          id="edit_subscription_admin"
          onSubmit={handleSaveEditSubscription}
          buttonText={titleEdit}
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
                id="cancel_edit_subscription_admin_button"
                onClick={handleEditPromotion}
                iconName="ArrowLeftIcon"
                fullWidth={isMobile}
              >
                {texts?.cancel}
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
            defaultValue={product?.name}
          />
          <InputIcon
            placeholder={inputDescription}
            validTextGenerate="MIN_3"
            type="text"
            id="subscription_description_input"
            iconName="MenuIcon"
            defaultValue={product?.description}
          />
          {method === "subscription" && (
            <InputIcon
              placeholder={inputReneving}
              validTextGenerate="REQUIRED"
              type="number"
              id="subscription_reneving_input"
              iconName="RefreshIcon"
              defaultValue={product?.reneving?.toString()}
            />
          )}
          <InputIcon
            placeholder={inputPoints}
            validTextGenerate="REQUIRED"
            type="number"
            id="subscription_points_input"
            iconName="CurrencyDollarIcon"
            defaultValue={product?.platformPointsCount?.toString()}
          />
          <InputIcon
            placeholder={inputPremium}
            validTextGenerate="REQUIRED"
            type="number"
            id="subscription_premium_input"
            iconName="ClockIcon"
            defaultValue={product?.platformSubscriptionMonthsCount?.toString()}
          />
          <InputIcon
            placeholder={inputSMS}
            validTextGenerate="REQUIRED"
            type="number"
            id="subscription_sms_input"
            iconName="PhoneOutgoingIcon"
            defaultValue={product?.platformSMSCount?.toString()}
          />
          <div className="mt-20 mb-40">
            <DateWithTime
              handleUpdateTime={handleUpdateTimeStart}
              id="time_start"
              resetDate
              placeholder={texts!.dateStartOffer}
              defaultDate={dateStart}
            />
          </div>
          <div className="mt-40 mb-40">
            <DateWithTime
              handleUpdateTime={handleUpdateTimeEnd}
              id="time_end"
              resetDate
              placeholder={texts!.dateEndtOffer}
              defaultDate={dateEnd}
            />
          </div>
          <Checkbox
            id="active_subscription_checkbox"
            placeholder={inputActiveSubscription}
            defaultValue={product?.isAcitve}
          />
          <Checkbox
            id="promotion_subscription_checkbox"
            placeholder={inputPromotion}
            defaultValue={product?.promotion}
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
      <Popup
        id="delete_subscription_admin"
        popupEnable={showDeleteProduct}
        position="fixed"
        title={titleDelete}
        handleClose={handleShowDeleteProduct}
        color="RED"
      >
        <Form
          id="delete_subscription_admin"
          onSubmit={handleSaveDeleteSubscription}
          buttonText={titleDelete}
          buttonColor="RED"
          marginBottom={0}
          marginTop={0}
          isFetchToBlock
          iconName="SaveIcon"
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
                id="cancel_edit_subscription_admin_button"
                onClick={handleShowDeleteProduct}
                iconName="ArrowLeftIcon"
                fullWidth={isMobile}
              >
                {texts!.cancel}
              </ButtonIcon>
            </>
          }
        >
          <InputIcon
            placeholder={inputPassword}
            validTextGenerate="MIN_6"
            type="password"
            id="admin_password_input"
            iconName="LockClosedIcon"
          />
        </Form>
      </Popup>
    </>
  );
};

export {getServerSideProps};

export default withTranslates(
  withSiteProps(withUserProps(AdminSubscriptionsItem)),
  "AdminSubscriptionsItem"
);
