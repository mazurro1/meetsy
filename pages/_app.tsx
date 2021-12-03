import "../styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "@/components/layout";
import { wrapper } from "@/components/redux/store";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default wrapper.withRedux(MyApp);
