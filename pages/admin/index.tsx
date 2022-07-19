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
        <TitlePage>Panel administracyjny</TitlePage>
      </PageSegment>
      <PageSegment id="admin_page" maxWidth={400}>
        <div className="flex-center-center flex-column flex-wrap">
          <div className="mt-10 width-100">
            <LinkEffect path="/admin/companys">
              <ButtonIcon
                id="button_registration"
                iconName="BriefcaseIcon"
                onClick={() => {}}
                fullWidth
              >
                Wyszukaj firmę
              </ButtonIcon>
            </LinkEffect>
          </div>
          <div className="mt-10 width-100">
            <LinkEffect path="/admin/users">
              <ButtonIcon
                id="button_registration"
                iconName="UserIcon"
                onClick={() => {}}
                fullWidth
              >
                Wyszukaj użytkownika
              </ButtonIcon>
            </LinkEffect>
          </div>
          {isSuperAdmin && (
            <>
              <div className="mt-10 width-100">
                <ButtonIcon
                  id="button_registration"
                  iconName="UserAddIcon"
                  onClick={() => {}}
                  fullWidth
                >
                  Kody rabatowe
                </ButtonIcon>
              </div>
              <div className="mt-10 width-100">
                <ButtonIcon
                  id="button_registration"
                  iconName="UserAddIcon"
                  onClick={() => {}}
                  fullWidth
                >
                  Subskrypcje
                </ButtonIcon>
              </div>
              <div className="mt-10 width-100">
                <ButtonIcon
                  id="button_registration"
                  iconName="UserAddIcon"
                  onClick={() => {}}
                  fullWidth
                >
                  Pakiety
                </ButtonIcon>
              </div>
              <div className="mt-10 width-100">
                <ButtonIcon
                  id="button_registration"
                  iconName="UserAddIcon"
                  onClick={() => {}}
                  fullWidth
                >
                  Statystyki
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
