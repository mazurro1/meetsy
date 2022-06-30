import {GetServerSideProps} from "next";
import {FetchData} from "@ui";
import {getSession} from "next-auth/react";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession({req: context.req});
  const {params} = context;
  const contentRedirect = {
    props: {},
    redirect: {
      destination: "/",
      permament: false,
    },
  };

  if (!!!session) {
    return contentRedirect;
  }
  if (!!!session.user?.email) {
    return contentRedirect;
  }

  const fetchedCompany = await FetchData({
    url: `${process.env.NEXTAUTH_URL}/api/admin`,
    method: "GET",
    disabledLoader: true,
    ssr: true,
    async: true,
    userEmail: session.user.email,
  });

  if (!!!fetchedCompany?.success) {
    return {
      props: {...params},
      redirect: {
        destination: "/",
        permament: false,
      },
    };
  }

  return {
    props: {...params},
  };
};
