import {FC} from "react";
import LineComponent from "../components/Icons/Line";
import {Formik, Form} from "formik";
import {resetPasswordValidationSchema} from "../helper/ValidationSchema";
import {Col, Row, Input, Button, Image} from "antd";
import CustomInput from "../components/CustomInput";
import {useRouter} from "next/router";
import BackIcon from "../components/Icons/BackIcon";
import PasswordIcon from "../components/Icons/PasswordIcon";
import {EyeInvisibleOutlined, EyeOutlined} from "@ant-design/icons";
import axiosInstance from "../interceptors/Axios";
import {API_ENDPOINTS} from "../interceptors/apiName";
import {useNotification} from "../components/Notification";

const initialValues = {password: "", confirmPassword: ""};

const ChangePassword: FC = () => {
  const notificationContext = useNotification();
  const handleNotifications: any = notificationContext?.handleNotifications;
  const router = useRouter();
  const handleSubmit = async (values: any) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        handleNotifications("error", `Something went wrong!`, "Try again!", 3);
        router.push("/login");
      }
      const resetPassword: any = await axiosInstance.post(
        API_ENDPOINTS.RESETPASSWORD_SUPER_ADMIN,
        JSON.stringify({
          password: values.confirmPassword,
          token,
        })
      );
      if (resetPassword?.settings?.success) {
        handleNotifications("success", resetPassword?.settings?.message, "", 3);
        localStorage.removeItem("token");
        localStorage.removeItem("otp");
        router.push("/login");
      }
    } catch (error) {
      console.log("error :>> ", error);
    }
  };
  return (
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
            Set New Password?
          </div>

          <div className="text-[16px] flex justify-center font-normal leading-[24px] text-[#4F4F4F] py-[5px]">
            Enter your new password.
          </div>
          <div className="flex justify-center items-center mb-[30px]">
            <LineComponent />
          </div>
          <div>
            <Formik
              initialValues={initialValues}
              validationSchema={resetPasswordValidationSchema}
              onSubmit={handleSubmit}
            >
              {({isSubmitting, errors}) => {
                return (
                  <Form className="w-full">
                    <Row className="sm:mb-5">
                      <Col span={24} className="text-left flex mb-5 sm:mb-0">
                        <CustomInput
                          labelClass="!text-[16px] !text-[#333] font-[400]"
                          label="New Password"
                          type={"password"}
                          name="password"
                          as={Input.Password}
                          className={errors.password && " !border !border-red"}
                          size="large"
                          placeholder="Enter Password"
                          status={errors.password && "error"}
                          // error={<ErrorMessage name="password" />}
                          prefix={
                            <span className="" p-1>
                              <PasswordIcon
                                color={errors.password ? "#ff4d4f" : "#828282"}
                              />
                            </span>
                          }
                          iconRender={(visible) => {
                            return visible ? (
                              <EyeOutlined />
                            ) : (
                              <EyeInvisibleOutlined />
                            );
                          }}
                        />
                      </Col>
                      <div className="text-red-500">{errors.password}</div>
                    </Row>

                    <Row className="sm:mb-5">
                      <Col span={24} className="text-left  mb-5 sm:mb-0">
                        <CustomInput
                          label="Confirm Password"
                          labelClass="!text-[16px] !text-[#333] font-[400]"
                          type={"password"}
                          name="confirmPassword"
                          as={Input.Password}
                          className="login-password"
                          size="large"
                          placeholder="Enter Password"
                          status={errors.confirmPassword && "error"}
                          prefix={
                            <span className="" p-1>
                              <PasswordIcon
                                color={
                                  errors.confirmPassword ? "#ff4d4f" : "#828282"
                                }
                              />
                            </span>
                          }
                          iconRender={(visible) => {
                            return visible ? (
                              <EyeOutlined />
                            ) : (
                              <EyeInvisibleOutlined />
                            );
                          }}
                        />
                        <div className="text-red-500">
                          {errors.confirmPassword}
                        </div>
                      </Col>
                    </Row>

                    <Row>
                      <Col span={24}>
                        <Button
                          loading={isSubmitting}
                          disabled={
                            isSubmitting || Object.keys(errors).length > 0
                          }
                          type="primary"
                          htmlType="submit"
                          size="large"
                          className="w-full !h-[50px] common-button custom-btn common-button-light-blue text-[16px] font-[700]"
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
  );
};
export default ChangePassword;
