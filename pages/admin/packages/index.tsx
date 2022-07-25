import {NextPage} from "next";
import {PageSegment, TitlePage, FetchData} from "@ui";
import {withSiteProps, withTranslates} from "@hooks";
import type {ISiteProps, ITranslatesProps} from "@hooks";
import {getServerSideProps} from "@/lib/VerifiedAdmins";
import AdminSubscriptions from "@/components/PageComponents/AdminPackages/AdminSubscriptions";
import {useEffect, useState} from "react";
import type {ProductProps} from "@/models/Product/product.model";
import {ProductPropsLive} from "@/models/Product/product.model";

export interface UpdateProductProps {
  folder?: string;
  field: string;
  value: string | null | number | Array<any> | object | boolean;
}

const AdminPagePackages: NextPage<ISiteProps & ITranslatesProps> = ({
  siteProps,
  texts,
  dispatch,
}) => {
  const [dataProducts, setDataProducts] = useState<ProductProps[]>([]);

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
    handleFetchAllPackages();
    return () => controller.abort();
  }, []);

  const handleAddProduct = (product: ProductProps) => {
    setDataProducts((prevState) => {
      return [...prevState, product];
    });
  };

  const handleUpdateAllProduct = (productData: ProductProps) => {
    if (!!productData) {
      setDataProducts((prevState) => {
        const mapProducts = prevState.map((item) => {
          if (item?._id === productData._id) {
            return productData;
          } else {
            return item;
          }
        });
        return mapProducts;
      });
    }
  };

  const handleDeleteProduct = (productId: string) => {
    if (!!productId) {
      setDataProducts((prevState) => {
        const filterProducts = prevState.filter(
          (item) => item?._id !== productId
        );
        return filterProducts;
      });
    }
  };

  const handleUpdateProduct = (
    productId: string,
    productData: UpdateProductProps[]
  ) => {
    if (!!productData && !!productId) {
      setDataProducts((prevState) => {
        const valuesToChange: UpdateProductProps[] = productData;

        const indexCompanyWorker = prevState.findIndex(
          (item) => item?._id === productId
        );
        if (indexCompanyWorker >= 0) {
          valuesToChange?.forEach((item) => {
            if (typeof item.value !== "undefined") {
              if (!!item.folder) {
                // @ts-ignore
                if (!!prevState[indexCompanyWorker][item.folder]) {
                  if (
                    // @ts-ignore
                    typeof prevState[indexCompanyWorker][item.folder][
                      item.field
                    ] !== "undefined"
                  ) {
                    // @ts-ignore
                    prevState[indexCompanyWorker][item.folder][item.field] =
                      item.value;
                  }
                }
              } else if (!!item.field) {
                if (
                  // @ts-ignore
                  typeof prevState[indexCompanyWorker][item.field] !==
                  "undefined"
                ) {
                  // @ts-ignore
                  prevState[indexCompanyWorker][item.field] = item.value;
                }
              }
            }
          });
        }

        return prevState;
      });
    }
  };

  const filterSubscriptions = dataProducts.filter(
    (item) => item?.method === "subscription"
  );

  const filterPayments = dataProducts.filter(
    (item) => item?.method === "payment"
  );

  return (
    <div>
      <PageSegment id="admin_users_page" maxWidth={600}>
        <TitlePage>{texts!.packages}</TitlePage>
        <AdminSubscriptions
          products={filterSubscriptions}
          handleAddProduct={handleAddProduct}
          handleUpdateProduct={handleUpdateProduct}
          handleUpdateAllProduct={handleUpdateAllProduct}
          handleDeleteProduct={handleDeleteProduct}
          method="subscription"
          title={texts!.titleSubscriptions}
          titleNew={texts!.titleNewSubscription}
          titleEdit={texts!.titleEditSubscription}
          titleDelete={texts!.titleDeleteSubscription}
        />
        <AdminSubscriptions
          products={filterPayments}
          handleAddProduct={handleAddProduct}
          handleUpdateProduct={handleUpdateProduct}
          handleUpdateAllProduct={handleUpdateAllProduct}
          handleDeleteProduct={handleDeleteProduct}
          method="payment"
          title={texts!.titleTopUps}
          titleNew={texts!.titleNewTopUp}
          titleEdit={texts!.titleEditTopUp}
          titleDelete={texts!.titleDeleteTopUp}
        />
      </PageSegment>
    </div>
  );
};

export {getServerSideProps};

export default withTranslates(
  withSiteProps(AdminPagePackages),
  "AdminPagePackages"
);
