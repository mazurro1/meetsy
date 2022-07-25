import {NextPage} from "next";
import {
  AccordingItem,
  Paragraph,
  Popup,
  Form,
  ButtonIcon,
  InputIcon,
  Checkbox,
  FetchData,
} from "@ui";
import {withSiteProps, withTranslates, withUserProps} from "@hooks";
import type {ISiteProps, ITranslatesProps, IUserProps} from "@hooks";
import {getServerSideProps} from "@/lib/VerifiedAdmins";
import {getFullDateWithTime} from "@functions";
import {useState} from "react";
import type {FormElementsOnSubmit} from "@ui";
import type {CouponProps} from "@/models/Coupon/coupon.model";
import type {ProductProps} from "@/models/Product/product.model";

interface AdminSubscriptionsItemProps {
  coupon: CouponProps;
  index: number;
  handleUpdateAllCoupon: (value: CouponProps) => void;
  handleDeleteCoupon: (value: string) => void;
  titleEdit: string;
  titleDelete: string;
  dataProducts: ProductProps[];
}

const AdminSubscriptionsItem: NextPage<
  ISiteProps & ITranslatesProps & IUserProps & AdminSubscriptionsItemProps
> = ({
  siteProps,
  texts,
  dispatch,
  isMobile,
  coupon,
  index,
  handleUpdateAllCoupon,
  handleDeleteCoupon,
  titleEdit,
  titleDelete,
}) => {
  const [showDeleteProduct, setShowDeleteProduct] = useState<boolean>(false);
  const [showEditPromotion, setShowEditPromotion] = useState<boolean>(false);

  const inputPassword = texts!.inputPassword;
  const inputActive = texts!.inputActive;

  const handleShowDeleteProduct = () => {
    setShowDeleteProduct((prevState) => !prevState);
  };

  const handleEditPromotion = () => {
    setShowEditPromotion((prevState) => !prevState);
  };

  const handleSaveEditSubscription = (
    values: FormElementsOnSubmit[],
    isValid: boolean
  ) => {
    if (isValid) {
      const findPassword = values.find(
        (item) => item.placeholder === inputPassword
      );
      const findActive = values.find(
        (item) => item.placeholder === inputActive
      );

      if (!!findPassword && findActive !== undefined) {
        FetchData({
          url: "/api/admin/coupon",
          method: "PATCH",
          dispatch: dispatch,
          language: siteProps?.language,
          data: {
            _id: coupon?._id,
            userPassword: findPassword.value,
            isActive: findActive.value,
          },
          callback: (data) => {
            if (data.success) {
              if (!!data.data.coupon) {
                handleUpdateAllCoupon(data.data.coupon);
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
          url: "/api/admin/coupon",
          method: "DELETE",
          dispatch: dispatch,
          language: siteProps?.language,
          data: {
            couponId: coupon?._id,
            userPassword: findPassword.value,
          },
          callback: (data) => {
            if (data.success) {
              if (data.data.couponId) {
                handleDeleteCoupon(data.data.couponId);
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
        id={`product_coupon_${index + 1}`}
        handleEdit={handleEditPromotion}
        handleDelete={handleShowDeleteProduct}
      >
        <Paragraph
          spanBold
          spanColor="PRIMARY_DARK"
          dangerouslySetInnerHTML={`Nazwa: <span>${coupon?.name}</span>`}
          marginBottom={0}
          marginTop={0}
        />
        <Paragraph
          spanBold
          spanColor="PRIMARY_DARK"
          dangerouslySetInnerHTML={`Zniżka: <span>${coupon?.discount}%</span>`}
          marginBottom={0}
          marginTop={0}
        />
        <Paragraph
          spanBold
          spanColor="PRIMARY_DARK"
          dangerouslySetInnerHTML={`${texts?.dateStartOffer}: <span>${
            !!coupon?.dateStart
              ? getFullDateWithTime(new Date(coupon?.dateStart))
              : "-"
          }</span>`}
          marginBottom={0}
          marginTop={0}
        />
        <Paragraph
          spanBold
          spanColor="PRIMARY_DARK"
          dangerouslySetInnerHTML={`${texts?.dateEndtOffer}: <span>${
            !!coupon?.dateEnd
              ? getFullDateWithTime(new Date(coupon?.dateEnd))
              : "-"
          }</span>`}
          marginBottom={0}
          marginTop={0}
        />
        <Paragraph
          spanBold
          spanColor="PRIMARY_DARK"
          dangerouslySetInnerHTML={`${texts?.inputActive}: <span>${coupon?.isAcitve}</span>`}
          marginBottom={0}
          marginTop={0}
        />
      </AccordingItem>

      <Popup
        id="edit_coupon_admin"
        popupEnable={showEditPromotion}
        position="fixed"
        title={titleEdit}
        handleClose={handleEditPromotion}
      >
        <Form
          id="edit_coupon_admin"
          onSubmit={handleSaveEditSubscription}
          buttonText={titleEdit}
          buttonColor="GREEN"
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
                id="cancel_edit_coupon_admin_button"
                onClick={handleEditPromotion}
                iconName="ArrowLeftIcon"
                fullWidth={isMobile}
              >
                {texts?.cancel}
              </ButtonIcon>
            </>
          }
        >
          <Checkbox
            id="active_coupon_checkbox"
            placeholder={inputActive}
            defaultValue={coupon?.isAcitve}
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
        id="delete_coupon_admin"
        popupEnable={showDeleteProduct}
        position="fixed"
        title={titleDelete}
        handleClose={handleShowDeleteProduct}
        color="RED"
      >
        <Form
          id="delete_coupon_admin"
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
                id="cancel_edit_coupon_admin_button"
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
  "AdminCouponItem"
);
