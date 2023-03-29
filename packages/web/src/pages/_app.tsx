import { Layout } from "@/components";
import TRPCProvider from "@/providers/TRPCProvider";
import "@coreui/coreui/dist/css/coreui.min.css";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function BlackJack({ Component, pageProps }: AppProps) {
  return (
    <TRPCProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </TRPCProvider>
  );
}
