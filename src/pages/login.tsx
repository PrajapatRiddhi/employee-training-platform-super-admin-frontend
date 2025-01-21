import CustomInput from "@/components/CustomInput";
import LineComponent from "@/components/Icons/Line";
import PasswordIcon from "@/components/Icons/PasswordIcon";
import {loginSchema} from "@/src/helper/ValidationSchema";
import {EyeInvisibleOutlined, EyeOutlined} from "@ant-design/icons";
import {Button, Col, Image, Input, Row} from "antd";
import {ErrorMessage, Form, Formik} from "formik";
import {NextRouter, useRouter} from "next/router";
import {FC, useEffect} from "react";
import axiosInstance from "@/src/interceptors/Axios";
import {API_ENDPOINTS} from "../interceptors/apiName";
import {useNotification} from "../components/Notification";
import {useDispatch} from "react-redux";
import {setUserAction} from "../store/user";
import {useSelector} from "react-redux";
import LoginAvatar from "../components/Icons/LoginAvatar";

const initialValues = {
  username: "",
  password: "",
};
type initialValuesProps = {
  username: string | undefined;
  password: string | undefined;
};

const Login: FC = () => {
  const router: NextRouter = useRouter();
  const notificationContext = useNotification();
  const handleNotifications: any = notificationContext?.handleNotifications;
  const dispatch = useDispatch();
  const currentUser = useSelector((state: any) => state.userReducer.user);
  const accessToken =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  useEffect(() => {
    console.log("accessToken :>> ", accessToken, currentUser);
    if (accessToken && Object.keys(currentUser).length !== 0) {
      router.push("/dashboard");
    }
  }, []);
  const handleSubmit = async (values: initialValuesProps) => {
    try {
      const {username, password} = values;
      if (username && password) {
        const loginManually: any = await axiosInstance.post(
          API_ENDPOINTS.Employee_LOGIN,
          {
            email: username.trim(),
            password: password.trim(),
          }
        );
        if (loginManually?.settings?.success) {
          handleNotifications("success", "Successfully Logged In", "", 3);
          dispatch(setUserAction(loginManually.data));
          console.log("object :>> ", loginManually.data.access_token);
          localStorage.setItem("token", loginManually.data.access_token);

          router.push("/dashboard");
        } else {
          handleNotifications("error", loginManually?.settings?.message, "", 3);
        }
      }
    } catch (error: any) {
      console.log(error);
      handleNotifications("error", error?.message, "", 3);
    }
  };
  return (
    <div className="flex min-h-[100vh]  justify-center items-center p-[10px] overflow-y-hidden ">
      <div>
        <div className="flex justify-center items-center m-10 ">
          <Image
            src="/images/logo.png"
            alt="logo-image"
            preview={false}
            className="skillo-img"
          />
        </div>
        <div className="border border-blue-800 p-10 rounded-[14px] bg-red-800">
          <div className="text-[35px] text-[#313D4F]  font-bold leading-[40px] flex justify-center items-center">
            Login Page
          </div>

          <div className="text-[16px]  font-normal leading-[24px] text-[#4F4F4F] py-[5px]">
            Enter your email address and password to log in.
          </div>
          <div className="flex justify-center items-center mb-[30px]">
            <LineComponent />
          </div>
          <div>
            <Formik
              initialValues={initialValues}
              validationSchema={loginSchema}
              onSubmit={handleSubmit}
            >
              {({isSubmitting, errors}) => {
                return (
                  <Form className="w-full">
                    <Row className="sm:mb-5">
                      <Col span={24} className="text-left flex mb-5 sm:mb-0">
                        <CustomInput
                          labelClass="!text-[16px] !text-[#333] font-[400]"
                          label="User Name"
                          required
                          type="text"
                          name="username"
                          prefix={
                            <LoginAvatar
                              color={errors.username ? "#ff4d4f" : "#828282"}
                            />
                          }
                          as={Input}
                          className={errors.username && " !border !border-red"}
                          size="large"
                          placeholder="Enter your username"
                          status={errors.username && "error"}
                          error={<ErrorMessage name="username" />}
                        />
                      </Col>
                    </Row>

                    <Row className="sm:mb-5">
                      <Col span={24} className="text-left  mb-5 sm:mb-0">
                        <CustomInput
                          label="Password"
                          labelClass="!text-[16px] !text-[#333] font-[400]"
                          required
                          type={"password"}
                          name="password"
                          as={Input.Password}
                          className="login-password"
                          size="large"
                          placeholder="Enter your password"
                          error={<ErrorMessage name="password" />}
                          status={errors.password && "error"}
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
                    </Row>
                    <div className="mb-[30px] mt-[20px] sm:flex sm:justify-end sm:my-3">
                      <Row gutter={16} className=" sm:mt-0">
                        <Col span={24}>
                          <div
                            className="cursor-pointer text-[#4379EE] text-[16px] leading-[22px] font-[600] text-right"
                            onClick={() => router.push("/forgot-password")}
                          >
                            Forgot Password?
                          </div>
                        </Col>
                      </Row>
                    </div>

                    <Row>
                      <Col span={24}>
                        <Button
                          loading={isSubmitting}
                          type="primary"
                          htmlType="submit"
                          size="large"
                          className="w-full h-[50px] common-button common-button-light-blue text-[16px] font-[700]"
                        >
                          Login
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

export default Login;
