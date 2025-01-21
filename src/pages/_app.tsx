import "@/styles/globals.scss";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "@/src/store";
import { NotificationProvider } from "@/src/components/Notification";
import { LoaderProvider } from "@/src/components/Loader/LoaderProvider";
export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
      <LoaderProvider>
        <NotificationProvider>
        <Component {...pageProps} />
        </NotificationProvider>
      </LoaderProvider>
      </PersistGate>
    </Provider>
  );
}
