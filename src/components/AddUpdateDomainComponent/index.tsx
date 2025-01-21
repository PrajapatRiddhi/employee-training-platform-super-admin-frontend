import {Button, Card, Col, Input, Row, Space, Typography} from "antd";
import {FC, useEffect, useState} from "react";
import BackArrowIcon from "../Icons/BackArrowIcon";
import {ErrorMessage, Form, Formik} from "formik";
import {addUpdateDomainValidationSchema} from "@/src/helper/ValidationSchema";
import CustomInput from "../CustomInput";
import axiosInstance from "@/src/interceptors/Axios";
import {API_ENDPOINTS} from "@/src/interceptors/apiName";
import {useNotification} from "../Notification";
import {useRouter} from "next/router";
import CustomSelect from "../CustomSelect";
import {camelCase} from "@/src/helper/Utils";
const initialValues = {
  domain: "",
  subDomain: "",
};
type initialValuesProps = {
  domain: string | undefined;
  subDomain: string | undefined;
};
type AddUpdateDomainComponentProp = {
  domainType: string;
  id?: string | string[] | undefined;
};
const AddUpdateDomainComponent: FC<AddUpdateDomainComponentProp> = ({
  domainType = "Company",
  id,
}) => {
  const [domainDetails, setDomainDetails] = useState<any>({});
  const {Text} = Typography;
  let url = id
    ? `${API_ENDPOINTS.UPDATE_DOMAIN}/${id}`
    : API_ENDPOINTS.ADD_DOMAIN;
  const notificationContext = useNotification();
  const handleNotifications: any = notificationContext?.handleNotifications;
  const router = useRouter();
  const [rootDomain, setRootDomain] = useState<any>([]);

  const handleSubmit = async (values: initialValuesProps) => {
    try {
      const httpMethod = id ? "put" : "post";

      let domainAdded: any = await axiosInstance.request({
        method: httpMethod,
        url,
        data: JSON.stringify({
          rootDomainId: values.domain,
          domainUrl: values.subDomain,
          domainType,
        }),
      });

      if (domainAdded?.settings?.success) {
        handleNotifications("success", domainAdded?.settings?.message, "", 3);
        router.push("/phishing/domain");
      } else {
        handleNotifications("error", domainAdded?.settings?.message, "", 3);
      }
    } catch (error) {
      handleNotifications(
        "error",
        "An error occurred. Please try again.",
        "",
        3
      );
    }
  };

  useEffect(() => {
    fetchDomain();
  }, []);
  const fetchDomain = async () => {
    try {
      let rootDomain: any = await axiosInstance.get(
        API_ENDPOINTS.LIST_ROOT_DOMAIN
      );
      if (rootDomain?.settings?.success) {
        setRootDomain(rootDomain.data);
      }
    } catch (error) {}
  };
  useEffect(() => {
    if (id) fetchDetails();
  }, [id]);
  const fetchDetails = async () => {
    try {
      let fetchDomainDetails: any = await axiosInstance.get(
        `${API_ENDPOINTS.GET_DOMAIN}/${id}`
      );
      if (fetchDomainDetails?.settings?.success) {
        console.log("fetchDomainDetails :>> ", fetchDomainDetails);
        let domain = {
          domain: fetchDomainDetails?.data?.domainId,
          subDomain: fetchDomainDetails?.data?.domainUrl,
        };
        setDomainDetails(domain);
      }
    } catch (error) {
      console.log("error :>> ", error);
    }
  };

  return (
    <div>
      <Space className="pt-[10px] pb-[30px]">
        <div
          className="cursor-pointer"
          onClick={() => router.push("/phishing/domain")}
        >
          <BackArrowIcon />
        </div>
        <Text className="text-gray-700 text-[22px] font-semibold leading-6">
          {/* {isEditing ? 'Edit Domain' : 'Add Domain'} */}
          {id ? "Update" : "Create"} Domain
        </Text>
      </Space>
      <Card className="custom-card">
        <div className="flex items-center">
          <Formik
            initialValues={domainDetails || initialValues}
            validationSchema={addUpdateDomainValidationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({isSubmitting, errors, values, setFieldValue}) => {
              return (
                <Form className="w-full">
                  <Row gutter={{xs: 8, sm: 16, md: 24, lg: 32}}>
                    <Col className="gutter-row" span={12}>
                      <CustomInput
                        labelClass="!text-[#333] text-[16px]"
                        label="Sub Domain"
                        required
                        type={"text"}
                        name="subDomain"
                        as={Input}
                        size="large"
                        placeholder="Enter your sub domain"
                        error={<ErrorMessage name="subDomain" />}
                        // status={errors.subDomain && "error"}
                      />
                      {!values.subDomain && (
                        <p className="text-red-500">{errors.subDomain}</p>
                      )}
                    </Col>
                    <Col className="gutter-row" span={12}>
                      {/* <CustomInput
                                                label="Domain"
                                                required
                                                type="text"
                                                name="domain"
                                                as={Input}
                                                className={errors.domain && " !border !border-red"}
                                                size="large"
                                                placeholder="Please Type..."
                                                status={errors.domain && "error"}
                                                error={<ErrorMessage name="domain" />}
                                            /> */}

                      <CustomSelect
                        labelClass="!text-[#333] text-[16px]"
                        label="Domain"
                        required
                        name="domain"
                        placeholder="Select Domain"
                        defaultValue={values.domain}
                        size="large"
                        options={rootDomain.map((option: any) => ({
                          value: option.rootDomainId,
                          label: option.rootDomainUrl,
                        }))}
                        onSelect={(value) => {
                          setFieldValue("domain", value);
                        }}
                        error={<ErrorMessage name="domain" />}
                      />
                      {!values.domain && (
                        <p className="text-red-500">{errors.domain}</p>
                      )}
                    </Col>
                  </Row>
                  <div className="mt-[20px]">
                    <Button
                      loading={isSubmitting}
                      type="primary"
                      htmlType="submit"
                      size="large"
                      className="custom-heading-btn form"
                    >
                      {id ? "Update" : "Create"} Domain
                    </Button>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </div>
      </Card>
    </div>
  );
};
export default AddUpdateDomainComponent;
