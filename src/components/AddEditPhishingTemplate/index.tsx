import { Button, Card, Col, Input, Row, Space, Typography } from "antd";
import { FC, useEffect, useState } from "react";
import BackArrowIcon from "../Icons/BackArrowIcon";
import { useRouter } from "next/router";
import { ErrorMessage, Field, Formik, Form } from "formik";
import { addUpdatePhishingTemplateValidationSchema } from "@/src/helper/ValidationSchema";
import CustomInput from "../CustomInput";
import CustomSelect from "../CustomSelect";
import axiosInstance from "@/src/interceptors/Axios";
import { API_ENDPOINTS } from "@/src/interceptors/apiName";
import { camelCase } from "@/src/helper/Utils";
import RateComponent from "../RateComponent";
import Editor from "../Editor";
import { useNotification } from "../Notification";
import { read } from "fs";
import React from "react";

type AddEditPhishingTemplateProp = {
  id?: string | string[] | undefined;
  viewOnly?: boolean;
};
const initialValuesProps = {};
const initialValues = {
  templateName: "",
  senderEmail: "",
  senderName: "",
  replyToName: "",
  replyToEmail: "",
  subject: "",
  file: "",
  fileType: "",
  fileContent: "",
  landingPageId: "",
  domainId: "",
  categoryId: "",
  difficultyRating: 0,
};
const AddEditPhishingTemplate: FC<AddEditPhishingTemplateProp> = ({
  id,
  viewOnly,
}) => {
  const router = useRouter();
  const Text = Typography;
  const [categoryList, setCategoryList] = useState<any>([]);
  const [landingList, setLandingList] = useState<any>([]);
  const [domainList, setDomainList] = useState<any>([]);
  const [templateDetails, setTemplateDetails] = useState();
  const notificationContext = useNotification();
  const handleNotifications: any = notificationContext?.handleNotifications;
  useEffect(() => {
    fetchListing();
  }, []);

  useEffect(() => {
    if (id) fetchEmailTemplate();
  }, [id]);
  const fetchEmailTemplate = async () => {
    try {
      let fetchPhishingTemplate: any = await axiosInstance.get(
        `${API_ENDPOINTS.GET_DETAILS_PHISHING_TEMPLATE}/${id}`
      );
      if (fetchPhishingTemplate?.settings?.success) {
        setTemplateDetails(fetchPhishingTemplate?.data);
      }
    } catch (error) {}
  };
  const fetchListing = async () => {
    try {
      let categoryList: any = await axiosInstance.get(
        `${API_ENDPOINTS.DROPDOWN_LIST_CATEGORIES}?categoryType=PHISHING_TEMPLATES`
      );
      if (categoryList?.settings?.success) {
        // const userDefinedCategories = categoryList.data.filter(
        //   (category: any) => category.isSystem.toLowerCase() === "no"
        // );
        // const systemDefinedCategories = categoryList.data.filter(
        //   (category: any) => category.isSystem.toLowerCase() === "yes"
        // );
        // const groupedOptions = [
        //   {
        //     label: <span>User Defined Categories</span>,
        //     title: 'User Defined Categories',
        //     options: userDefinedCategories.map((category: any) => ({
        //       label: <span>{category.categoryName}</span>,
        //       value: category.myCategoryId,
        //     })),
        //   },
        //   {
        //     label: <span>System Defined Categories</span>,
        //     title: 'System Defined Categories',
        //     options: systemDefinedCategories.map((category: any) => ({
        //       label: <span>{category.categoryName}</span>,
        //       value: category.myCategoryId,
        //     })),
        //   },
        // ];
        setCategoryList(categoryList.data);
      }
      let landingList: any = await axiosInstance.get(
        `${API_ENDPOINTS.DROPDOWN_LIST_LANDING_PAGE}/?isAll=Yes`
      );
      if (landingList?.settings?.success) {
        // console.log('landingList.data :>> ', landingList.data);
        const userDefinedDestination = landingList.data.filter(
          (category: any) =>
            category?.isSystemLandingPage?.toLowerCase() === "no"
        );
        const systemDefinedDestination = landingList.data.filter(
          (category: any) =>
            category?.isSystemLandingPage?.toLowerCase() === "yes"
        );
        console.log("landingList.data :>> ", landingList.data);
        const groupedOptions = [
          {
            label: (
              <span className="text-[16px] bold">
                User Defined Destination Page
              </span>
            ),
            title: "User Defined Destination Page",
            options: userDefinedDestination.map((category: any) => ({
              label: <span>{category.title}</span>,
              value: category.landingPageId,
            })),
          },
          {
            label: (
              <span className="text-[16px] bold">
                System Defined Destination Page
              </span>
            ),
            title: "System Defined Destination Page",
            options: systemDefinedDestination.map((category: any) => ({
              label: <span>{category.title}</span>,
              value: category.landingPageId,
            })),
          },
        ];
        console.log("groupedOptions :>> ", groupedOptions);
        setLandingList(groupedOptions);
      }
      let domainList: any = await axiosInstance.get(
        `${API_ENDPOINTS.DROPDOWN_LIST_DOMAIN}/?isAll=Yes`
      );
      console.log("domainList?.settings", domainList?.data);
      if (domainList?.settings?.success) {
        const userDefinedDomain = domainList.data.filter(
          (category: any) => category?.isSystemDomain?.toLowerCase() === "no"
        );
        const systemDefinedDomain = domainList.data.filter(
          (category: any) => category?.isSystemDomain?.toLowerCase() === "yes"
        );
        const groupedOptionsDomain = [
          {
            label: (
              <span className="text-[16px] bold">User Defined Domains</span>
            ),
            title: "User Defined Domains",
            options: userDefinedDomain.map((category: any) => ({
              label: <span>{category.domainUrl}</span>,
              value: category.domainId,
            })),
          },
          {
            label: (
              <span className="text-[16px] bold">System Defined Domains</span>
            ),
            title: "System Defined Domains",
            options: systemDefinedDomain.map((category: any) => ({
              label: <span>{category.domainUrl}</span>,
              value: category.domainId,
            })),
          },
        ];
        setDomainList(groupedOptionsDomain);
      }
    } catch (error) {
      console.log("error :>> ", error);
    }
  };
  const handleSubmit = async (values: any) => {
    try {
      const httpMethod = id ? "put" : "post";
      let phishingTemplateAdded: any = await axiosInstance.request({
        method: httpMethod,
        url: id
          ? `${API_ENDPOINTS.UPDATE_PHISHING_TEMPLATE}/${id}`
          : API_ENDPOINTS.ADD_PHISHING_TEMPLATE,
        data: JSON.stringify({
          templateName: values.templateName || values.subject,
          senderEmail: values.senderEmail,
          senderName: values.senderName,
          replyToName: values.replyToName,
          replyToEmail: values.replyToEmail,
          subject: values.subject,
          fileContent: values.fileContent,
          landingPageId: values.landingPageId,
          domainId: values.domainId,
          categoryId: values.categoryId,
          difficultyRating: parseFloat(values.difficultyRating),
        }),
      });
      if (phishingTemplateAdded?.settings?.success) {
        handleNotifications(
          "success",
          phishingTemplateAdded?.settings?.message,
          "",
          3
        );
        router.push("/phishing/template");
      } else {
        handleNotifications(
          "error",
          phishingTemplateAdded?.settings?.message,
          "",
          3
        );
      }
    } catch (error) {
      console.log(error);
    }
  };
  console.log("object :>> ", templateDetails);
  return (
    <>
      <div>
        <Space className="pt-[10px] pb-[30px]">
          <div
            className="cursor-pointer"
            onClick={() => router.push("/phishing/template")}
          >
            <BackArrowIcon />
          </div>
          <Text className="text-gray-700 text-[22px] font-semibold leading-6">
            {/* {isEditing ? 'Edit Domain' : 'Add Domain'} */}
            {id && !viewOnly
              ? "UpdatePhishing Email Template"
              : viewOnly
              ? "View Phishing Email Template"
              : "New Phishing Email Template"}
          </Text>
        </Space>
        <Card className="custom-card">
          <div className="flex items-center">
            <Formik
              initialValues={templateDetails || initialValues}
              validationSchema={addUpdatePhishingTemplateValidationSchema}
              onSubmit={handleSubmit}
              enableReinitialize
            >
              {({ isSubmitting, errors, resetForm, values, setFieldValue }) => {
                console.log("errors", errors);
                return (
                  <Form className="w-full">
                    <Row
                      className="flex items-center"
                      gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
                    >
                      <Col className="gutter-row" span={12}>
                        <CustomSelect
                          labelClass="!!text-[#333] text-[16px]"
                          name={"categoryId"}
                          id={"categoryId"}
                          required
                          label="Category"
                          placeholder="Select Category"
                          defaultValue={values.categoryId}
                          size="large"
                          options={categoryList.map((option: any) => ({
                            value: option.myCategoryId,
                            label: camelCase(option.categoryName),
                          }))}
                          onSelect={(value) => {
                            setFieldValue("categoryId", value);
                          }}
                          error={<ErrorMessage name="categoryId" />}
                          disabled={viewOnly}
                        />
                      </Col>
                    </Row>
                    <Row
                      className="mt-[20px]"
                      gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
                    >
                      <Col className="gutter-row" span={24}>
                        <CustomInput
                          labelClass="!text-[#333] text-[16px]"
                          label="Template Name"
                          type="text"
                          required
                          name="templateName"
                          as={Input}
                          className={
                            errors.templateName && " !border !border-red"
                          }
                          size="large"
                          placeholder="Please Type..."
                          status={errors.templateName && "error"}
                          error={<ErrorMessage name="templateName" />}
                          disabled={viewOnly}
                          readOnly={viewOnly}
                          maxInput={250}
                        />
                      </Col>
                    </Row>
                    <Row
                      className="flex items-center mt-[20px]"
                      gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
                    >
                      <Col className="gutter-row" span={12}>
                        <CustomInput
                          label="Sender’s Email Address"
                          labelClass="!text-[#333] text-[16px]"
                          type="text"
                          name="senderEmail"
                          as={Input}
                          required
                          className={
                            errors.senderEmail && " !border !border-red"
                          }
                          size="large"
                          placeholder="Please Type..."
                          status={errors.senderEmail && "error"}
                          error={<ErrorMessage name="senderEmail" />}
                          disabled={viewOnly}
                          readOnly={viewOnly}
                        />
                      </Col>

                      <Col className="gutter-row" span={12}>
                        <CustomInput
                          label="Sender’s Name"
                          labelClass="!text-[#333] text-[16px]"
                          type="text"
                          name="senderName"
                          as={Input}
                          required
                          className={
                            errors.senderName && " !border !border-red"
                          }
                          size="large"
                          placeholder="Please Type..."
                          status={errors.senderName && "error"}
                          error={<ErrorMessage name="senderName" />}
                          disabled={viewOnly}
                          readOnly={viewOnly}
                        />
                      </Col>
                    </Row>
                    <Row
                      className="flex items-center mt-[20px]"
                      gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
                    >
                      <Col className="gutter-row" span={12}>
                        <CustomInput
                          label="Reply-To Email Address"
                          labelClass="!text-[#333] text-[16px]"
                          type="text"
                          name="replyToEmail"
                          as={Input}
                          required
                          className={
                            errors.replyToEmail && " !border !border-red"
                          }
                          size="large"
                          placeholder="Please Type..."
                          status={errors.replyToEmail && "error"}
                          error={<ErrorMessage name="replyToEmail" />}
                          disabled={viewOnly}
                          readOnly={viewOnly}
                        />
                      </Col>

                      <Col className="gutter-row" span={12}>
                        <CustomInput
                          label="Reply-To Name"
                          labelClass="!text-[#333] text-[16px]"
                          type="text"
                          name="replyToName"
                          required
                          as={Input}
                          className={
                            errors.replyToName && " !border !border-red"
                          }
                          size="large"
                          placeholder="Please Type..."
                          status={errors.replyToName && "error"}
                          error={<ErrorMessage name="replyToName" />}
                          disabled={viewOnly}
                          readOnly={viewOnly}
                        />
                      </Col>
                    </Row>
                    <Row
                      className="mt-[20px] "
                      gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
                    >
                      <Col className="gutter-row" span={24}>
                        <CustomInput
                          label="Subject"
                          labelClass="!text-[#333] text-[16px]"
                          type="text"
                          name="subject"
                          required
                          as={Input}
                          className={errors.subject && " !border !border-red"}
                          defaultValue={values?.subject}
                          size="large"
                          placeholder="Please Type..."
                          status={errors.subject && "error"}
                          error={<ErrorMessage name="subject" />}
                          disabled={viewOnly}
                          readOnly={viewOnly}
                          maxInput={255}
                        />
                      </Col>
                    </Row>
                    <Row
                      className="mt-[20px]"
                      gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
                    >
                      <Col className="gutter-row" span={24}>
                        {/* <div className="mb-[5px]">
                          <Text className="!text-[#333] text-[16px] leading-[24px]">
                            Difficulty Rating
                          </Text>
                        </div> */}
                        <Field name="fileContent">
                          {({ field }: any) => (
                            <Editor
                              editorData={values.fileContent || ""}
                              handleEditorChange={(content: string) =>
                                setFieldValue("fileContent", content)
                              }
                              readonly={viewOnly}
                            />
                          )}
                        </Field>
                        <ErrorMessage
                          name="fileContent"
                          component="div"
                          className="field-error"
                        />
                      </Col>
                    </Row>
                    <Row
                      className="mt-[20px]"
                      gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
                    >
                      <Col className="gutter-row" span={12}>
                        <CustomSelect
                          name={"landingPageId"}
                          required
                          labelClass="!text-[#333] text-[16px]"
                          // id={"landingPageId"}
                          label="Phishing Destination Page"
                          placeholder="Default Phishing Destination Page"
                          defaultValue={values.landingPageId || ""}
                          size="large"
                          // options={landingList.map((option: any) => ({
                          //   value: option.landingPageId,
                          //   label: camelCase(option.title),
                          // }))}
                          options={landingList}
                          onSelect={(value) => {
                            setFieldValue("landingPageId", value);
                          }}
                          error={<ErrorMessage name="landingPageId" />}
                          disabled={viewOnly}
                        />
                      </Col>
                      <Col className="gutter-row" span={12}>
                        <CustomSelect
                          name={"domainId"}
                          labelClass="!text-[#333] text-[16px]"
                          id={"domainId"}
                          required
                          label="Destination Domain"
                          placeholder="Default(secure.encryptedconnection.net)"
                          defaultValue={values.domainId}
                          size="large"
                          options={domainList}
                          // options={domainList.map((option: any) => ({
                          //   value: option.domainId,
                          //   label: option.domainUrl,
                          // }))}
                          onSelect={(value) => {
                            setFieldValue("domainId", value);
                          }}
                          error={<ErrorMessage name="domainId" />}
                          disabled={viewOnly}
                        />
                      </Col>
                    </Row>
                    <Row
                      className="mt-[20px]"
                      gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
                    >
                      <Col className="gutter-row" span={12}>
                        <div className="mb-[5px]">
                          <div className="!text-[#333] text-[16px] leading-[24px]">
                            Difficulty Rating
                          </div>
                        </div>
                        <div className="flex">
                        <Field name="difficultyRating">
                          {({ field }: any) => (
                            <RateComponent
                              value={field.value || 0}
                              onChange={(value: number) =>
                                setFieldValue("difficultyRating", value)
                              }
                              disabled={viewOnly}
                            />
                          )}
                        </Field>
                        <div className="text-[#4F4F4F] font-[400] text-[16px] ml-[13px]">
                          {values?.difficultyRating === 0 
                            ? "Not Rated"
                            : values?.difficultyRating === 1
                            ? "Very Easy"
                            : values?.difficultyRating === 2
                            ? "Easy"
                            : values?.difficultyRating === 3
                            ? "Moderate"
                            : values?.difficultyRating === 4
                            ? "Difficult"
                            : values?.difficultyRating === 5
                            ? "Very Difficult"
                            : ""}
                        </div>
                        </div>
                        <ErrorMessage
                          name="difficultyRating"
                          component="div"
                          className="field-error"
                        />
                      </Col>
                    </Row>
                    {!viewOnly && <div
                      className="mt-[14px] mb-[20px] underline text-[#4379EE] text-[16px] font-[400] cursor-pointer w-fit"
                      onClick={() => resetForm()}
                    >
                      Reset
                    </div>}
                    {!viewOnly && (
                      <div className="mt-[20px]">
                        <Button
                          loading={isSubmitting}
                          type="primary"
                          htmlType="submit"
                          size="large"
                          className="custom-heading-btn !w-[150px]"
                        >
                          {id ? "Update" : "Save"}
                        </Button>
                      </div>
                    )}
                  </Form>
                );
              }}
            </Formik>
          </div>
        </Card>
      </div>
    </>
  );
};
export default AddEditPhishingTemplate;
