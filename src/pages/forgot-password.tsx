import LineComponent from "@/components/Icons/Line";
import {FC} from "react";
import {ErrorMessage, Form, Formik} from "formik";
import {forgotPasswordValidationSchema} from "@/src/helper/ValidationSchema";
import {Button, Col, Input, Row, Image} from "antd";
import CustomInput from "@/components/CustomInput";
import EmailIcon from "@/components/Icons/EmailIcon";
import BackIcon from "@/components/Icons/BackIcon";
import axiosInstance from "../interceptors/Axios";
import {API_ENDPOINTS} from "../interceptors/apiName";
import {useNotification} from "../components/Notification";
import {useRouter} from "next/router";

const initialValues = {email: ""};

const ForgotPassword: FC = () => {
  const router = useRouter();
  const notificationContext = useNotification();
  const handleNotifications: any = notificationContext?.handleNotifications;
  const handleSubmit = async (values: any, {resetForm}: any) => {
    try {
      localStorage.setItem("email", values.email);
      let emailSend: any = await axiosInstance.post(
        API_ENDPOINTS.ADMIN_FORGOT_PASSWORD,
        JSON.stringify(values)
      );
      if (emailSend?.settings?.success) {
        handleNotifications(
          "success",
          emailSend?.settings?.message,
          "Please check your email!",
          3
        );
        resetForm();
      } else {
        handleNotifications("error", emailSend?.settings?.message, "", 3);
      }
    } catch (error: any) {
      handleNotifications(
        "error",
        error?.response?.data?.settings?.message,
        "",
        3
      );
    }
  };
  return (
    <>
      <div className="flex min-h-[100vh]  justify-center items-center p-[10px] overflow-y-hidden bg-[#F5F6FA]">
        <div>
          <div className="flex justify-center items-center m-10 ">
            <Image
              src="/images/logo.png"
              alt="logo-image"
              preview={false}
              className="skillo-img"
            />
          </div>
          <div className="!bg-white p-10 rounded-[14px] ">
            <div className="text-[35px] text-[#313D4F]  font-bold leading-[40px] flex justify-center items-center">
              Forgot Password?
            </div>

            <div className="text-[16px]  font-normal leading-[24px] text-[#4F4F4F] py-[5px]">
              Enter your email address below and we'll get back to you.
            </div>
            <div className="flex justify-center items-center mb-[30px]">
              <LineComponent />
            </div>
            <div>
              <Formik
                initialValues={initialValues}
                validationSchema={forgotPasswordValidationSchema}
                onSubmit={handleSubmit}
              >
                {({isSubmitting, errors}) => {
                  return (
                    <Form className="w-full">
                      <Row className="sm:mb-5">
                        <Col span={24} className="text-left flex mb-5 sm:mb-0">
                          <CustomInput
                            label="Email"
                            // required
                            labelClass="!text-[#333333] !text-[16px]"
                            type="text"
                            name="email"
                            prefix={
                              <span className="p-1">
                                <EmailIcon />{" "}
                              </span>
                            }
                            as={Input}
                            className={errors.email && " !border !border-red"}
                            size="large"
                            placeholder="Enter your email"
                            status={errors.email && "error"}
                            error={<ErrorMessage name="email" />}
                          />
                        </Col>
                      </Row>

                      <Row>
                        <Col span={24}>
                          <Button
                            loading={isSubmitting}
                            type="primary"
                            htmlType="submit"
                            size="large"
                            className="w-full common-button common-button-light-blue"
                          >
                            Submit
                          </Button>
                        </Col>

                        <Col span={24} className="pt-[30px]">
                          <Button
                            type="link"
                            onClick={() => router.push("/login")}
                            size="large"
                            className="flex items-center justify-center w-full common-button common-button-light-blue"
                          >
                            <span>
                              <BackIcon />
                            </span>
                            <span>Back to sign in</span>
                          </Button>
                        </Col>
                      </Row>
                    </Form>
                  );
                }}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default ForgotPassword;
