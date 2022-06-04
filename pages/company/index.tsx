import {NextPage} from "next";
import {GetServerSideProps} from "next";

const ShowCompany: NextPage = () => {
  return <div></div>;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const {params} = context;
  return {
    props: {...params},
    redirect: {
      destination: "/",
      permament: false,
    },
  };
};

export default ShowCompany;
