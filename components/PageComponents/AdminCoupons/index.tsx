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
  SelectCreated,
} from "@ui";
import {withSiteProps, withTranslates, withUserProps} from "@hooks";
import type {ISiteProps, ITranslatesProps, IUserProps} from "@hooks";
import {getServerSideProps} from "@/lib/VerifiedAdmins";
import {useState} from "react";
import type {FormElementsOnSubmit} from "@ui";
import type {CouponProps} from "@/models/Coupon/coupon.model";
import type {SelectCreatedValuesProps, ValueSelectCreatedProps} from "@ui";
import type {ProductProps} from "@/models/Product/product.model";
import AdminCouponsItem from "./AdminCouponsItem";

interface AdminCouponsProps {
  coupons: CouponProps[];
  handleAddCoupon: (value: CouponProps) => void;
  handleUpdateAllCoupon: (value: CouponProps) => void;
  handleDeleteCoupon: (value: string) => void;
  title: string;
  titleNew: string;
  titleEdit: string;
  titleDelete: string;
  dataProducts: ProductProps[];
}

const AdminCoupons: NextPage<
  ISiteProps & ITranslatesProps & IUserProps & AdminCouponsProps
> = ({
  siteProps,
  texts,
  user,
  dispatch,
  isMobile,
  coupons = [],
  handleAddCoupon,
  handleUpdateAllCoupon,
  handleDeleteCoupon,
  title,
  titleNew,
  titleEdit,
  titleDelete,
  dataProducts,
}) => {
  const [showCreateCoupon, setShowCreateCoupon] = useState<boolean>(false);
  const [dateStart, setDateStart] = useState<Date | null>(null);
  const [dateEnd, setDateEnd] = useState<Date | null>(null);
  const [selectedPackagesInCoupon, setSelectedPackagesInCoupon] = useState<
    SelectCreatedValuesProps[]
  >([]);

  const inputPassword = texts!.inputPassword;
  const inputActive = texts!.inputActive;
  const inputPercent = texts!.inputPercent;
  const inputName = texts!.inputName;
  const inputLimit = texts!.inputLimit;

  const handleAddNewCoupon = () => {
    setShowCreateCoupon((prevState) => !prevState);
  };

  const handleCreateCoupon = (
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
      const findPercent = values.find(
        (item) => item.placeholder === inputPercent
      );
      const findLimit = values.find((item) => item.placeholder === inputLimit);
      const findName = values.find((item) => item.placeholder === inputName);

      if (
        !!findPassword &&
        findActive !== undefined &&
        !!dateStart &&
        !!dateEnd &&
        findPercent !== undefined &&
        !!findName
      ) {
        const mapPackagesValue = selectedPackagesInCoupon.map(
          (item) => item.value
        );

        FetchData({
          url: "/api/admin/coupon",
          method: "POST",
          dispatch: dispatch,
          language: siteProps?.language,
          data: {
            userPassword: findPassword.value,
            packagesIds: mapPackagesValue,
            discount: findPercent.value,
            isActive: findActive.value,
            dateStart: dateStart,
            dateEnd: dateEnd,
            name: findName.value,
            limit: !!findLimit?.value ? findLimit.value : null,
          },
          callback: (data) => {
            if (data.success) {
              if (!!data.data.coupon) {
                handleAddCoupon(data.data.coupon);
              }
              handleAddNewCoupon();
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

  const handleChangePackagesInCoupon = (value: ValueSelectCreatedProps) => {
    const savedValue = value as SelectCreatedValuesProps[];
    setSelectedPackagesInCoupon(savedValue);
  };

  const mapCoupons = coupons?.map((item, index) => {
    return (
      <AdminCouponsItem
        coupon={item}
        key={index}
        index={index}
        handleUpdateAllCoupon={handleUpdateAllCoupon}
        handleDeleteCoupon={handleDeleteCoupon}
        titleEdit={titleEdit}
        titleDelete={titleDelete}
        dataProducts={dataProducts}
      />
    );
  });

  const optionsPackages: SelectCreatedValuesProps[] = dataProducts?.map(
    (item) => {
      return {
        label: !!item?.name ? item.name : "",
        value: !!item?._id ? item._id : "",
      };
    }
  );

  return (
    <div>
      <According
        id="according_coupons"
        title={title}
        defaultIsOpen
        handleAdd={handleAddNewCoupon}
      >
        {mapCoupons}
      </According>
      <Popup
        id="create_coupon_admin"
        popupEnable={showCreateCoupon}
        position="fixed"
        title={titleNew}
        handleClose={handleAddNewCoupon}
      >
        <Form
          id="create_coupon_admin"
          onSubmit={handleCreateCoupon}
          buttonText={titleNew}
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
            {
              placeholder: inputPercent,
              isNumber: true,
              minNumber: 1,
              maxNumber: 99,
            },
            {
              placeholder: inputLimit,
              isNumber: true,
              minNumber: 0,
            },
            {
              placeholder: inputName,
              isString: true,
              minLength: 6,
            },
          ]}
          extraButtons={
            <>
              <ButtonIcon
                id="cancel_create_coupon_admin_button"
                onClick={handleAddNewCoupon}
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
            validTextGenerate="MIN_6"
            type="text"
            id="admin_name_input"
            iconName="PencilAltIcon"
          />
          <InputIcon
            placeholder={inputPercent}
            validTextGenerate="REQUIRED"
            type="number"
            id="admin_percent_input"
            iconName="ReceiptTaxIcon"
          />
          <InputIcon
            placeholder={inputLimit}
            validTextGenerate="REQUIRED"
            type="number"
            id="admin_limit_input"
            iconName="UploadIcon"
          />
          <SelectCreated
            options={optionsPackages}
            value={selectedPackagesInCoupon}
            handleChange={handleChangePackagesInCoupon}
            deleteItem
            deleteLastItem
            isMulti
            closeMenuOnSelect={true}
            placeholder="Pakiety w ofercie"
            maxMenuHeight={150}
            onlyText
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
            id="active_coupon_checkbox"
            placeholder={inputActive}
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
  withSiteProps(withUserProps(AdminCoupons)),
  "AdminCoupons"
);
