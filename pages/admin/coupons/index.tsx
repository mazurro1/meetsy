import {NextPage} from "next";
import {PageSegment, TitlePage, FetchData} from "@ui";
import {withSiteProps, withTranslates} from "@hooks";
import type {ISiteProps, ITranslatesProps} from "@hooks";
import {getServerSideProps} from "@/lib/VerifiedAdmins";
import AdminCoupons from "@/components/PageComponents/AdminCoupons";
import {useEffect, useState} from "react";
import {CouponPropsLive} from "@/models/Coupon/coupon.model";
import type {CouponProps} from "@/models/Coupon/coupon.model";
import type {ProductProps} from "@/models/Product/product.model";
import {ProductPropsLive} from "@/models/Product/product.model";

const AdminPageCoupons: NextPage<ISiteProps & ITranslatesProps> = ({
  siteProps,
  texts,
  dispatch,
}) => {
  const [dataCoupons, setDataCouponss] = useState<CouponProps[]>([]);
  const [dataProducts, setDataProducts] = useState<ProductProps[]>([]);

  const handleFetchAllCoupons = async () => {
    const dataFetch = await FetchData({
      url: "/api/admin/coupon",
      method: "GET",
      dispatch: dispatch,
      language: siteProps?.language,
      async: true,
    });

    if (!!dataFetch?.data?.coupons) {
      const resultCoupons = CouponPropsLive.array().safeParse(
        dataFetch.data.coupons
      );

      if (!resultCoupons.success) {
        console.warn(resultCoupons.error);
      }

      setDataCouponss(dataFetch?.data?.coupons);
    }
  };

  const handleFetchAllPackages = async () => {
    const dataFetch = await FetchData({
      url: "/api/admin/product",
      method: "GET",
      dispatch: dispatch,
      language: siteProps?.language,
      async: true,
    });
    if (!!dataFetch?.data?.products) {
      const resultPackages = ProductPropsLive.array().safeParse(
        dataFetch.data.products
      );

      if (!resultPackages.success) {
        console.warn(resultPackages.error);
      }
      setDataProducts(dataFetch?.data?.products);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    handleFetchAllCoupons();
    handleFetchAllPackages();
    return () => controller.abort();
  }, []);

  const handleAddCoupon = (coupon: CouponProps) => {
    setDataCouponss((prevState) => {
      return [...prevState, coupon];
    });
  };

  const handleUpdateAllCoupon = (couponData: CouponProps) => {
    if (!!couponData) {
      setDataCouponss((prevState) => {
        const mapCouponss = prevState.map((item) => {
          if (item?._id === couponData._id) {
            return couponData;
          } else {
            return item;
          }
        });
        return mapCouponss;
      });
    }
  };

  const handleDeleteCoupon = (couponId: string) => {
    if (!!couponId) {
      setDataCouponss((prevState) => {
        const filterCouponss = prevState.filter(
          (item) => item?._id !== couponId
        );
        return filterCouponss;
      });
    }
  };
  return (
    <div>
      <PageSegment id="admin_users_page" maxWidth={600}>
        <TitlePage>{texts!.coupons}</TitlePage>
        <AdminCoupons
          coupons={dataCoupons}
          handleAddCoupon={handleAddCoupon}
          handleUpdateAllCoupon={handleUpdateAllCoupon}
          handleDeleteCoupon={handleDeleteCoupon}
          title={texts!.titleCoupons}
          titleNew={texts!.titleNewCoupon}
          titleEdit={texts!.titleEditCoupon}
          titleDelete={texts!.titleDeleteCoupon}
          dataProducts={dataProducts}
        />
      </PageSegment>
    </div>
  );
};

export {getServerSideProps};

export default withTranslates(
  withSiteProps(AdminPageCoupons),
  "AdminPageCoupons"
);
