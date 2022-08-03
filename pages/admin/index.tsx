import {NextPage} from "next";
import {PageSegment, TitlePage} from "@ui";
import {withSiteProps, withTranslates, withUserProps} from "@hooks";
import type {ISiteProps, ITranslatesProps, IUserProps} from "@hooks";
import {ButtonIcon, LinkEffect} from "@ui";
import {EnumUserPermissions} from "@/models/User/user.model";
import {getServerSideProps} from "@/lib/VerifiedAdmins";

const AdminPage: NextPage<ISiteProps & ITranslatesProps & IUserProps> = ({
  siteProps,
  texts,
  user,
}) => {
  let isSuperAdmin = false;
  if (!!user) {
    if (!!user?.permissions) {
      isSuperAdmin = user.permissions.some(
        (item) => item === EnumUserPermissions.superAdmin
      );
    }
  }

  return (
    <div>
      <PageSegment id="admin_page">
        <TitlePage>{texts?.title}</TitlePage>
      </PageSegment>
      <PageSegment id="admin_page" maxWidth={400}>
        <div className="flex-center-center flex-column flex-wrap">
          <div className="mt-10 width-100">
            <LinkEffect path="/admin/companys">
              <ButtonIcon
                id="button_edit_company_admin"
                iconName="BriefcaseIcon"
                onClick={() => {}}
                fullWidth
                loadingToChangeRouteLink="/admin/companys"
              >
                {texts?.searchCompany}
              </ButtonIcon>
            </LinkEffect>
          </div>
          <div className="mt-10 width-100">
            <LinkEffect path="/admin/users">
              <ButtonIcon
                id="button_edit_user_admin"
                iconName="UserIcon"
                onClick={() => {}}
                fullWidth
                loadingToChangeRouteLink="/admin/users"
              >
                {texts?.searchUser}
              </ButtonIcon>
            </LinkEffect>
          </div>
          {isSuperAdmin && (
            <>
              <div className="mt-10 width-100">
                <LinkEffect path="/admin/packages">
                  <ButtonIcon
                    id="button_packages_admin"
                    iconName="ShoppingCartIcon"
                    onClick={() => {}}
                    fullWidth
                    loadingToChangeRouteLink="/admin/packages"
                  >
                    {texts?.packages}
                  </ButtonIcon>
                </LinkEffect>
              </div>
              <div className="mt-10 width-100">
                <LinkEffect path="/admin/coupons">
                  <ButtonIcon
                    id="button_discount_codes"
                    iconName="ReceiptTaxIcon"
                    onClick={() => {}}
                    fullWidth
                    loadingToChangeRouteLink="/admin/coupons"
                  >
                    {texts?.discountCodes}
                  </ButtonIcon>
                </LinkEffect>
              </div>
              <div className="mt-10 width-100">
                <ButtonIcon
                  id="button_statistics"
                  iconName="UserAddIcon"
                  onClick={() => {}}
                  fullWidth
                  disabled
                >
                  {texts?.statistics}
                </ButtonIcon>
              </div>
            </>
          )}
        </div>
      </PageSegment>
    </div>
  );
};

export {getServerSideProps};

export default withTranslates(
  withSiteProps(withUserProps(AdminPage)),
  "AdminPage"
);
