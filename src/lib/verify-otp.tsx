import {FC, useEffect} from "react";
import {useRouter} from "next/router";
import axiosInstance from "../interceptors/Axios";
import {API_ENDPOINTS} from "../interceptors/apiName";
import {useNotification} from "../components/Notification";
import {config} from "../helper/config";

const ResetPassword: FC = () => {
  const router = useRouter();
  const notificationContext = useNotification();
  const handleNotifications: any = notificationContext?.handleNotifications;
  const {t} = router.query;

  useEffect(() => {
    const verifyTokenOnLoad = async () => {
      try {

        const response = await axiosInstance.post(
          API_ENDPOINTS.COMPANY_OTP_VERIFY,
          {token: t}
        );
        console.log(response, "response");
        // @ts-ignore
        const {success, message} = response?.settings || {};
        if (success) {
          if (
            message === "Email verified successfully." ||
            message === "Your password has not been created. Please reset it"
          ) {
            // handleNotifications("success", "Verified successfully!", "", 3);
            router.push("/reset-password");
          } else if (message === "Your account is already activated.") {
            handleNotifications("success", "Account already activated.", "", 3);
            router.push("/login");
          } else {
            handleNotifications("success", message, "", 3);
          }
        } else {
          handleNotifications("error", message || "An error occurred", "", 3);
        }
      } catch (error) {
        handleNotifications(
          "error",
          "Something went wrong. Please try again.",
          "",
          3
        );
      }
    };

    if (t) {
      localStorage.setItem("token", t.toString());
      router.replace(router.pathname, undefined, {shallow: true});

      verifyTokenOnLoad();
    }
  }, [t]);

  return <div>{/* <h1 className="text-red-800">Progrssing</h1> */}</div>;
};

export default ResetPassword;
