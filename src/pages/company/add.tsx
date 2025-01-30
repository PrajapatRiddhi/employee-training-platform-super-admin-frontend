import CustomInput from "@/components/CustomInput";
import {companyPhishingDestinationValidationSchema} from "@/src/helper/ValidationSchema";
import {Button, Card, Col, DatePicker, Input, Row} from "antd";
import {ErrorMessage, Field, Form, Formik, FormikHelpers} from "formik";
import {NextRouter, useRouter} from "next/router";
import {FC, useEffect, useState} from "react";
import Editor from "@/src/components/Editor";
import SidebarLayout from "@/src/components/Layout/SidebarLayout";
import LeftArrowIcon from "@/src/components/Icons/LeftArrowIcon";
import axiosInstance from "@/src/interceptors/Axios";
import {API_ENDPOINTS} from "@/src/interceptors/apiName";
import {useNotification} from "@/src/components/Notification";
import CustomSelect from "@/src/components/CustomSelect";
import {PlusCircleOutlined} from "@ant-design/icons";
import dayjs from "dayjs";
import DateIcon from "@/src/components/Icons/DateIcon";

const initialValues = {
  title: "",
  content: "",
  url: "",
};

type InitialValuesProps = {
  title: string;
  content: string;
  url: string;
};

interface CreatePhishingProps {
  id?: any;
  viewOnly?: boolean;
}

const AddNewCompany: FC<CreatePhishingProps> = ({id, viewOnly}) => {
  const router: NextRouter = useRouter();

  const handleData = () => {
    console.log("data");
  };
  //   const notificationContext = useNotification();
  //   const handleNotifications: any = notificationContext?.handleNotifications;
  //   const isEditing = !!id;
  //   const [fetchedData, setFetchedData] = useState<InitialValuesProps | null>();

  //   const getPhishingListById = async (id: number) => {
  //     try {
  //       let getPhishingById: any = await axiosInstance.get(
  //         `${API_ENDPOINTS.Delete_View_Phishing}/${id}`
  //       );
  //       if (getPhishingById?.settings?.success) {
  //         const editPhishingData = {
  //           title: getPhishingById?.data?.title ?? "",
  //           content: getPhishingById?.data?.content ?? "",
  //           url: getPhishingById?.data?.url ?? "",
  //         };
  //         setFetchedData(editPhishingData);
  //       } else {
  //         console.log("Get the data");
  //       }
  //     } catch (error) {
  //       console.error("Error deleting phishing destination:", error);
  //     }
  //   };

  //   useEffect(() => {
  //     if (isEditing) {
  //       getPhishingListById(id);
  //     }
  //   }, [isEditing, id]);

  //   const handleSubmit = async (
  //     values: InitialValuesProps,
  //     {resetForm}: FormikHelpers<InitialValuesProps>
  //   ) => {
  //     try {
  //       const endpoint = isEditing
  //         ? `${API_ENDPOINTS.Delete_View_Phishing}/${id}`
  //         : API_ENDPOINTS.Create_Phishing_Destination;

  //       const method = isEditing ? "put" : "post";
  //       const response: any = await axiosInstance[method](
  //         endpoint,
  //         JSON.stringify(values)
  //       );

  //       if (response?.settings?.success) {
  //         const successMessage = isEditing
  //           ? "Phishing destination updated successfully"
  //           : "Phishing destination page added successfully";
  //         handleNotifications("success", successMessage, "", 3);
  //         router.push("/phishing/phishing-destination");
  //         resetForm({values: initialValues});
  //       } else {
  //         if (response?.settings?.status == 409) {
  //           handleNotifications(
  //             "error",
  //             "Phishing destination page is already exist",
  //             "",
  //             3
  //           );
  //         } else {
  //           handleNotifications("error", response?.settings?.message, "", 3);
  //         }
  //       }
  //     } catch (error: any) {
  //       console.error(error);
  //       handleNotifications("error", error?.message, "", 3);
  //     }
  //   };

  //   const sanitizeContent = (content: any) => {
  //     const div = document.createElement("div");
  //     div.innerHTML = content;
  //     div.innerHTML = div.innerHTML.replace(/&nbsp;/g, "").trim();
  //     return div.innerHTML;
  //   };
  var startDate = "";
  return (
    <SidebarLayout>
      <div className="flex">
        <div
          onClick={() => router.push("/company")}
          className="pt-2 cursor-pointer"
        >
          <LeftArrowIcon />
        </div>
        <div className="text-[24px] font-[700] text-[#313D4F] mb-[30px] ml-2">
          {/* {id && !viewOnly ? "Edit" : viewOnly ? "View Company" : "Add"} */}
          Add New Company
        </div>
      </div>
      <Card>
        <Formik
          initialValues={initialValues}
          validationSchema={companyPhishingDestinationValidationSchema}
          onSubmit={handleData}
          enableReinitialize
        >
          {({isSubmitting, errors, values, setFieldValue}) => {
            return (
              <Form className="w-full">
                <div>
                  <div className="text-[#000000] text-[20px] font-[600] leading-[28px]">
                    Company Information
                  </div>
                  <div className="mt-5 flex justify-between gap-5">
                    <div className="w-full">
                      <CustomInput
                        label={
                          <span className="text-[#333333]">Company Name</span>
                        }
                        required
                        type="text"
                        name="title"
                        as={Input}
                        className={errors.title && " !border !border-red"}
                        size="large"
                        placeholder="Enter company name"
                        status={errors.title && "error"}
                        error={<ErrorMessage name="title" />}
                        defaultValue={values.title}
                        maxInput={255}
                        disabled={viewOnly}
                        readOnly={viewOnly}
                        style={{color: "#828282"}}
                      />
                    </div>
                    <div className="w-full">
                      <CustomInput
                        label={
                          <span className="text-[#333333]">
                            Company Primary Admin Email
                          </span>
                        }
                        required
                        type="text"
                        name="title"
                        as={Input}
                        className={errors.title && " !border !border-red"}
                        size="large"
                        placeholder="Enter company primary admin email"
                        status={errors.title && "error"}
                        error={<ErrorMessage name="title" />}
                        defaultValue={values.title}
                        maxInput={255}
                        disabled={viewOnly}
                        readOnly={viewOnly}
                        style={{color: "#828282"}}
                      />
                    </div>
                  </div>

                  <div className="mt-5 flex justify-between gap-5">
                    <div className="w-full">
                      <CustomInput
                        label={
                          <span className="text-[#333333]">First Name</span>
                        }
                        required
                        type="text"
                        name="title"
                        as={Input}
                        className={errors.title && " !border !border-red"}
                        size="large"
                        placeholder="Enter first name"
                        status={errors.title && "error"}
                        error={<ErrorMessage name="title" />}
                        defaultValue={values.title}
                        maxInput={255}
                        disabled={viewOnly}
                        readOnly={viewOnly}
                        style={{color: "#828282"}}
                      />
                    </div>
                    <div className="w-full">
                      <CustomInput
                        label={
                          <span className="text-[#333333]">Last Name</span>
                        }
                        required
                        type="text"
                        name="title"
                        as={Input}
                        className={errors.title && " !border !border-red"}
                        size="large"
                        placeholder="Enter last name"
                        status={errors.title && "error"}
                        error={<ErrorMessage name="title" />}
                        defaultValue={values.title}
                        maxInput={255}
                        disabled={viewOnly}
                        readOnly={viewOnly}
                        style={{color: "#828282"}}
                      />
                    </div>
                  </div>

                  <div className="mt-5 flex justify-between gap-5">
                    <div className="w-full">
                      <CustomInput
                        label={
                          <span className="text-[#333333]">Mobile Number</span>
                        }
                        required
                        type="text"
                        name="title"
                        as={Input}
                        className={errors.title && " !border !border-red"}
                        size="large"
                        placeholder="Enter first name"
                        status={errors.title && "error"}
                        error={<ErrorMessage name="title" />}
                        defaultValue={values.title}
                        maxInput={255}
                        disabled={viewOnly}
                        readOnly={viewOnly}
                        style={{color: "#828282"}}
                      />
                    </div>
                    <div className="w-full">
                      <div className="text-[#333333] text-[16px] font-[400] leading-[24px]">
                        API Key / URL
                        <span className="text-red-500">*</span>
                      </div>
                      <label
                        className={`flex border rounded-[5px] cursor-pointer mt-1 ${
                          viewOnly ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        <div
                          className="w-full pl-[12px] flex justify-start items-center  text-[16px]"
                          aria-readonly={viewOnly}
                        >
                          {/* {document ? document : "Please select a file"} */}
                        </div>

                        {viewOnly ? (
                          <a
                            // href={policyDetails?.documentUrl}
                            // download={`${policyDetails?.title}.pdf`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <div
                              className={`flex justify-center items-center px-[16px] py-[8px] ${
                                viewOnly ? "bg-[#e0e0e0]" : "bg-[#f2f2f2]"
                              } hover:text-[#333333] hover:text-[16px] hover:font-[400] hover:leading-[24px] transition-all duration-200`}
                            >
                              View
                            </div>
                          </a>
                        ) : (
                          <div
                            className={`flex justify-center items-center px-[16px] py-[8px] ${
                              viewOnly ? "bg-[#e0e0e0]" : "bg-[#f2f2f2]"
                            }`}
                          >
                            Generate
                          </div>
                        )}
                        <input
                          disabled={viewOnly}
                          id="document"
                          name="document"
                          placeholder="Please select a file"
                          type="file"
                          accept=".pdf"
                          onChange={(event) => {
                            if (!viewOnly) {
                              // fileUploading(event);
                              setFieldValue(
                                "document",
                                event.currentTarget.files?.[0] || ""
                              );
                            }
                          }}
                          style={{display: "none"}}
                        />
                      </label>
                    </div>
                  </div>

                  <div className="flex gap-5 mt-5">
                    <div className="w-[94%]">
                      <CustomInput
                        label={
                          <span className="text-[#333333]">
                            Company Domain Name
                          </span>
                        }
                        required
                        type="text"
                        name="title"
                        as={Input}
                        className={errors.title && " !border !border-red"}
                        size="large"
                        placeholder="Enter first name"
                        status={errors.title && "error"}
                        error={<ErrorMessage name="title" />}
                        defaultValue={values.title}
                        maxInput={255}
                        disabled={viewOnly}
                        readOnly={viewOnly}
                        style={{color: "#828282"}}
                      />
                    </div>
                    <div className="flex">
                      <div className="mt-[40px] flex gap-2">
                        <PlusCircleOutlined className="mt-[1px]" />
                        Add
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 flex justify-between gap-5">
                    <div className="w-full">
                      <CustomInput
                        label={<span className="text-[#333333]">Address</span>}
                        required
                        type="text"
                        name="title"
                        as={Input}
                        className={errors.title && " !border !border-red"}
                        size="large"
                        placeholder="Enter address"
                        status={errors.title && "error"}
                        error={<ErrorMessage name="title" />}
                        defaultValue={values.title}
                        maxInput={255}
                        disabled={viewOnly}
                        readOnly={viewOnly}
                        style={{color: "#828282"}}
                      />
                    </div>
                    <div className="w-full">
                      <CustomInput
                        label={
                          <span className="text-[#333333]">API Key / URL</span>
                        }
                        required
                        type="text"
                        name="title"
                        as={Input}
                        className={errors.title && " !border !border-red"}
                        size="large"
                        placeholder="Enter last name"
                        status={errors.title && "error"}
                        error={<ErrorMessage name="title" />}
                        defaultValue={values.title}
                        maxInput={255}
                        disabled={viewOnly}
                        readOnly={viewOnly}
                        style={{color: "#828282"}}
                      />
                    </div>
                  </div>

                  <div className="mt-5 flex justify-between gap-5">
                    <div className="w-full">
                      <CustomInput
                        label={<span className="text-[#333333]">State</span>}
                        required
                        type="text"
                        name="title"
                        as={Input}
                        className={errors.title && " !border !border-red"}
                        size="large"
                        placeholder="Enter state"
                        status={errors.title && "error"}
                        error={<ErrorMessage name="title" />}
                        defaultValue={values.title}
                        maxInput={255}
                        disabled={viewOnly}
                        readOnly={viewOnly}
                        style={{color: "#828282"}}
                      />
                    </div>
                    <div className="w-full">
                      <CustomInput
                        label={<span className="text-[#333333]">Country</span>}
                        required
                        type="text"
                        name="title"
                        as={Input}
                        className={errors.title && " !border !border-red"}
                        size="large"
                        placeholder="Enter country"
                        status={errors.title && "error"}
                        error={<ErrorMessage name="title" />}
                        defaultValue={values.title}
                        maxInput={255}
                        disabled={viewOnly}
                        readOnly={viewOnly}
                        style={{color: "#828282"}}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="text-[#000000] text-[20px] font-[600] leading-[28px] mt-5">
                      Subscription Plan
                    </div>

                    <div className="mt-5 flex justify-between gap-5">
                      <div className="w-full">
                        <CustomInput
                          label={
                            <span className="text-[#333333]">
                              Mobile Number
                            </span>
                          }
                          required
                          type="text"
                          name="title"
                          as={Input}
                          className={errors.title && " !border !border-red"}
                          size="large"
                          placeholder="Enter first name"
                          status={errors.title && "error"}
                          error={<ErrorMessage name="title" />}
                          defaultValue={values.title}
                          maxInput={255}
                          disabled={viewOnly}
                          readOnly={viewOnly}
                          style={{color: "#828282"}}
                        />
                      </div>
                      <div className="w-full">
                        <CustomInput
                          label={
                            <span className="text-[#333333]">
                              Number of Users
                            </span>
                          }
                          required
                          type="text"
                          name="title"
                          as={Input}
                          className={errors.title && " !border !border-red"}
                          size="large"
                          placeholder="Enter number of users"
                          status={errors.title && "error"}
                          error={<ErrorMessage name="title" />}
                          defaultValue={values.title}
                          maxInput={255}
                          disabled={viewOnly}
                          readOnly={viewOnly}
                          style={{color: "#828282"}}
                        />
                      </div>
                    </div>

                    <div className="mt-5 flex justify-between gap-5 w-full">
                      <div className="w-full">
                        <div className="!text-[16px] !text-[#333333] ">
                          Start Date<span className="text-red-500">*</span>
                        </div>
                        <div className="flex w-full  gap-[20px]">
                          <div className="w-full ">
                            <DatePicker
                              className="w-full h-[38px] custom-date-time-picker"
                              format="DD/MM/YYYY"
                              value={
                                startDate ? dayjs(Number(startDate)) : null
                              }
                              onChange={(date, dateString) =>
                                setFieldValue(
                                  "startDate",
                                  date ? date.valueOf() : null
                                )
                              }
                              disabled={viewOnly}
                              disabledDate={(current) => {
                                const today = dayjs().startOf("day");
                                const selectedEndDate = startDate
                                  ? dayjs(startDate)
                                  : null;

                                if (selectedEndDate) {
                                  return (
                                    current &&
                                    (current < today ||
                                      current > selectedEndDate.endOf("day"))
                                  );
                                } else {
                                  return current && current < today;
                                }
                              }}
                              suffixIcon={
                                <div className="flex items-center justify-center w-full">
                                  {" "}
                                  <DateIcon />
                                </div>
                              }
                            />
                            <ErrorMessage name="startDate" component={"div"}>
                              {(msg) => (
                                <div className="text-red-500">{msg}</div>
                              )}
                            </ErrorMessage>
                          </div>
                        </div>
                      </div>
                      <div className="w-full">
                        <div className="!text-[16px] !text-[#333333] ">
                          End Date<span className="text-red-500">*</span>
                        </div>
                        <div className="flex w-full  gap-[20px]">
                          <div className="w-full">
                            <DatePicker
                              className="w-full h-[38px] custom-date-time-picker"
                              format="DD/MM/YYYY"
                              value={
                                startDate ? dayjs(Number(startDate)) : null
                              }
                              onChange={(date, dateString) =>
                                setFieldValue(
                                  "startDate",
                                  date ? date.valueOf() : null
                                )
                              }
                              disabled={viewOnly}
                              disabledDate={(current) => {
                                const today = dayjs().startOf("day");
                                const selectedEndDate = startDate
                                  ? dayjs(startDate)
                                  : null;

                                if (selectedEndDate) {
                                  return (
                                    current &&
                                    (current < today ||
                                      current > selectedEndDate.endOf("day"))
                                  );
                                } else {
                                  return current && current < today;
                                }
                              }}
                              suffixIcon={
                                <div className="flex items-center justify-center w-full">
                                  {" "}
                                  <DateIcon />
                                </div>
                              }
                            />
                            <ErrorMessage name="startDate" component={"div"}>
                              {(msg) => (
                                <div className="text-red-500">{msg}</div>
                              )}
                            </ErrorMessage>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  {viewOnly ? (
                    ""
                  ) : (
                    <Button
                      className="custom-btn mt-5"
                      type="primary"
                      htmlType="submit"
                      loading={isSubmitting}
                    >
                      {id ? "Update" : "Enroll Company"}
                    </Button>
                  )}
                </div>
              </Form>
            );
          }}
        </Formik>
      </Card>
    </SidebarLayout>
  );
};

export default AddNewCompany;
