import { NextPage } from "next";
import { withSiteProps, withTranslates } from "@hooks";
import type { ISiteProps, ITranslatesProps } from "@hooks";
import { PageSegment, ButtonIcon } from "@ui";
import { signOut } from "next-auth/react";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";

const Home: NextPage<ISiteProps & ITranslatesProps> = ({}) => {
  return (
    <PageSegment id="account_page" maxWidth={400} paddingTop={2}>
      <ButtonIcon
        id="button_logout"
        iconName="LogoutIcon"
        onClick={() => signOut()}
        fontSize="SMALL"
        color="RED"
        isFetchToBlock
        widthFull
      >
        WYLOGUJ
      </ButtonIcon>
    </PageSegment>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession({ req: context.req });
  if (!session) {
    return {
      props: {},
      redirect: {
        destination: "/",
        permament: false,
      },
    };
  }
  return {
    props: {},
  };
};

export default withTranslates(withSiteProps(Home), "AccountPage");
