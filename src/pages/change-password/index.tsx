import CustomInput from "@/components/CustomInput";
import {changePawValidationSchema} from "@/src/helper/ValidationSchema";
import {Button, Card, Input} from "antd";
import {ErrorMessage, Form, Formik} from "formik";
import {NextRouter, useRouter} from "next/router";
import {FC} from "react";
import axiosInstance from "@/src/interceptors/Axios";
import {useNotification} from "@/src/components/Notification";
import {API_ENDPOINTS} from "@/src/interceptors/apiName";
import SidebarLayout from "@/src/components/Layout/SidebarLayout";
import PasswordIcon from "@/src/components/Icons/PasswordIcon";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";

const initialValues = {
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
};

type initialValuesProps = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const ChangePassword: FC = () => {
  const router: NextRouter = useRouter();
  const notificationContext = useNotification();
  const handleNotifications: any = notificationContext?.handleNotifications;

  const handleSubmit = async (values: initialValuesProps) => {
    try {
      const {oldPassword, newPassword} = values;
      const passwordChange: any = await axiosInstance.post(
        API_ENDPOINTS.COMPANY_CHANGE_PASSWORD,
        {
          oldPassword: oldPassword.trim(),
          newPassword: newPassword.trim(),
        }
      );
      if (passwordChange?.settings?.success) {
        handleNotifications("success", "Password changed successfully", "", 3);
        router.push("/login");
      } else {
        handleNotifications("error", passwordChange?.settings?.message, "", 3);
      }
    } catch (error: any) {
      console.log(error);
      handleNotifications("error", error?.message, "", 3);
    }
  };

  return (
    <SidebarLayout>
      <div className="flex">
        <div className="text-[24px] font-[700] text-[#313D4F] mb-[30px] ml-2">
          Change Password
        </div>
      </div>
      <Card>
        <Formik
          initialValues={initialValues}
          validationSchema={changePawValidationSchema}
          onSubmit={handleSubmit}
        >
          {({isSubmitting, errors, values}) => (
            <Form className="w-full">
              <div className="flex items-center w-[50%] space-x-2 mb-[20px] ">
                <CustomInput
                  label={
                    <span className="text-[#333333] text-[16px] font-[400] leading-[24px] font-[Nunito Sans]">
                      Old Password
                    </span>
                  }
                  type="password"
                  name="oldPassword"
                  as={Input.Password}
                  className={`py-[2px] ${
                    errors.oldPassword ? "!border !border-red" : ""
                  }`}
                  size="large"
                  placeholder="Enter Current Password"
                  status={errors.oldPassword && "error"}
                  error={<ErrorMessage name="oldPassword" />}
                  defaultValue={values.oldPassword}
                  maxInput={255}
                  style={{color: "#828282"}}
                />
              </div>
              <div className="flex items-center w-[50%] space-x-2 mb-[20px]">
                <CustomInput
                  label={
                    <span className="text-[#333333] text-[16px] font-[400] leading-[24px] font-[Nunito Sans]">
                      New Password
                    </span>
                  }
                  type="password"
                  name="newPassword"
                  as={Input.Password}
                  className={`py-[2px] ${
                    errors.newPassword ? "!border !border-red" : ""
                  }`}
                  size="large"
                  placeholder="Enter New Password"
                  status={errors.newPassword && "error"}
                  error={<ErrorMessage name="newPassword" />}
                  defaultValue={values.newPassword}
                  maxInput={255}
                  style={{color: "#828282"}}
                />
              </div>
              <div className="flex items-center w-[50%] space-x-2 mb-[20px]">
                <CustomInput
                  label={
                    <span className="text-[#333333] text-[16px] font-[400] leading-[24px] font-[Nunito Sans]">
                      Confirm Password
                    </span>
                  }
                  type="password"
                  name="confirmPassword"
                  as={Input.Password}
                  className={`py-[2px] ${
                    errors.confirmPassword ? "!border !border-red" : ""
                  }`}
                  size="large"
                  placeholder="Confirm New Password"
                  status={errors.confirmPassword && "error"}
                  error={<ErrorMessage name="confirmPassword" />}
                  defaultValue={values.confirmPassword}
                  maxInput={255}
                  style={{color: "#828282"}}
                />
              </div>
              <Button
                loading={isSubmitting}
                type="primary"
                htmlType="submit"
                size="large"
                className="h-[50px] common-button common-button-light-blue text-[16px] font-[700]"
              >
                Change Password
              </Button>
            </Form>
          )}
        </Formik>
      </Card>
    </SidebarLayout>
  );
};

export default ChangePassword;
