import CustomInput from "@/src/components/CustomInput";
import CustomSelect from "@/src/components/CustomSelect";
import SidebarLayout from "@/src/components/Layout/SidebarLayout";
import {useNotification} from "@/src/components/Notification";
import {updateUserRiskBooster} from "@/src/helper/ValidationSchema";
import {API_ENDPOINTS} from "@/src/interceptors/apiName";
import axiosInstance from "@/src/interceptors/Axios";
import {Card, Col, Form, Row, Input, Button} from "antd";
import {ErrorMessage, Formik} from "formik";
import {useRouter} from "next/router";

const initialValues = {
  user: "",
  email: "",
  firstName: "",
  lastName: "",
  riskPorgress: "",
};

const RiskBoosterPage = () => {
  const notificationContext = useNotification();
  const handleNotifications: any = notificationContext?.handleNotifications;
  const router = useRouter();

  var id = "121";
  const handleSubmit = async (values: any) => {
    try {
      let updateRisk: any = await axiosInstance.request({
        method: "put",
        url: `${API_ENDPOINTS.UPDATE_PHISHING_TEMPLATE}/${id}`,
        data: JSON.stringify({
          user: values.user,
          email: values.email,
          firstName: values.firstName,
          lastName: values.lastName,
          riskPorgress: values.riskPorgress,
        }),
      });
      if (updateRisk?.settings?.success) {
        handleNotifications("success", updateRisk?.settings?.message, "", 3);
        router.push("/users");
      } else {
        handleNotifications("error", updateRisk?.settings?.message, "", 3);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SidebarLayout>
      <div className="w-full">
        <div className="flex  items-center mb-[20px]">
          <div className="heading-title">Risk Booster</div>
        </div>

        <Card className="custom-card">
          <div className="flex items-center">
            <Formik
              initialValues={initialValues}
              validationSchema={updateUserRiskBooster}
              onSubmit={handleSubmit}
              enableReinitialize
            >
              {({isSubmitting, errors, resetForm, values, setFieldValue}) => {
                console.log("errors", errors);
                return (
                  <Form className="w-full">
                    <Row
                      className="flex items-center mt-[20px]"
                      gutter={{xs: 8, sm: 16, md: 24, lg: 32}}
                    >
                      <Col className="gutter-row" span={12}>
                        <CustomSelect
                          labelClass="!!text-[#333] text-[16px]"
                          name={"user"}
                          id={"user"}
                          label="Type"
                          placeholder="Select Type"
                          defaultValue={values.user}
                          size="large"
                          options={[]}
                          onSelect={(value) => {
                            setFieldValue("user", value);
                          }}
                          error={<ErrorMessage name="user" />}
                        />
                      </Col>

                      <Col className="gutter-row" span={12}>
                        <CustomInput
                          label="Email"
                          labelClass="!text-[#333] text-[16px]"
                          type="email"
                          name="email"
                          as={Input}
                          className={errors.email && " !border !border-red"}
                          size="large"
                          placeholder="Please Enter"
                          status={errors.email && "error"}
                          error={<ErrorMessage name="email" />}
                        />
                      </Col>
                    </Row>

                    <Row
                      className="flex items-center mt-[20px]"
                      gutter={{xs: 8, sm: 16, md: 24, lg: 32}}
                    >
                      <Col className="gutter-row" span={12}>
                        <CustomInput
                          label="First Name"
                          labelClass="!text-[#333] text-[16px]"
                          type="text"
                          name="firstName"
                          as={Input}
                          className={errors.firstName && " !border !border-red"}
                          size="large"
                          placeholder="Please Type..."
                          status={errors.firstName && "error"}
                          error={<ErrorMessage name="firstName" />}
                        />
                      </Col>

                      <Col className="gutter-row" span={12}>
                        <CustomInput
                          label="Last Name" 
                          labelClass="!text-[#333] text-[16px]"
                          type="text"
                          name="lastName"
                          as={Input}
                          className={errors.lastName && " !border !border-red"}
                          size="large"
                          placeholder="Please Type..."
                          status={errors.lastName && "error"}
                          error={<ErrorMessage name="lastName" />}
                        />
                      </Col>
                    </Row>

                    <Row
                      className="flex items-center mt-[20px]"
                      gutter={{xs: 8, sm: 16, md: 24, lg: 32}}
                    >
                      <Col className="gutter-row" span={12}>
                        <div className="text-[16px] leading-[24px] font-[400] text-[#333333]">
                          Risk Booster
                        </div>
                      </Col>
                    </Row>

                    <div className="mt-[20px]">
                      <Button
                        loading={isSubmitting}
                        type="primary"
                        htmlType="submit"
                        size="large"
                        className="custom-heading-btn !w-[150px]"
                      >
                        Update User
                      </Button>
                    </div>
                  </Form>
                );
              }}
            </Formik>
          </div>
        </Card>
      </div>
    </SidebarLayout>
  );
};

export default RiskBoosterPage;
