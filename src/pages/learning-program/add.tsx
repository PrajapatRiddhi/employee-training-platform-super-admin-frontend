import CustomInput from "@/components/CustomInput";
import {Button, Card, Input} from "antd";
import {ErrorMessage, Field, Form, Formik, FormikHelpers} from "formik";
import {NextRouter, useRouter} from "next/router";
import {FC, useEffect, useState} from "react";
import Editor from "@/src/components/Editor";
import LeftArrowIcon from "@/src/components/Icons/LeftArrowIcon";
import axiosInstance from "@/src/interceptors/Axios";
import {API_ENDPOINTS} from "@/src/interceptors/apiName";
import {useNotification} from "@/src/components/Notification";
import SidebarLayout from "@/src/components/Layout/SidebarLayout";
import {NotficationTemplateSchema} from "@/src/helper/ValidationSchema";

const initialValues = {
  templateName: "",
  subject: "",
  senderEmail: "",
  senderName: "",
  content: "",
};

type InitialValuesProps = {
  templateName: string;
  subject: string;
  senderEmail: string;
  senderName: string;
  content: string;
};

interface CreateNotificationProps {
  id?: any;
  viewOnly?: boolean;
}

const CreateNotification: FC<CreateNotificationProps> = ({id, viewOnly}) => {
  const router: NextRouter = useRouter();
  const notificationContext = useNotification();
  const handleNotifications: any = notificationContext?.handleNotifications;
  const isEditing = !!id;
  const [fetchedData, setFetchedData] = useState<InitialValuesProps | null>();

  const getTemplateNotficationById = async (id: number) => {
    try {
      let getdataByIdAction: any = await axiosInstance.get(
        `${API_ENDPOINTS.VIEW_DELETE_EDIT_Notification_Template}/${id}`
      );
      if (getdataByIdAction?.settings?.success) {
        const editTempNotficationData: any = {
          templateName: getdataByIdAction?.data?.templateName ?? "",
          subject: getdataByIdAction?.data?.subject ?? "",
          senderEmail: getdataByIdAction?.data?.senderEmail ?? "",
          senderName: getdataByIdAction?.data?.senderName ?? "",
          content: getdataByIdAction?.data?.content ?? "",
        };

        setFetchedData(editTempNotficationData);
      } else {
        console.log("Get the data");
      }
    } catch (error) {
      console.error("Error deleting phishing destination:", error);
    }
  };

  useEffect(() => {
    if (isEditing) {
      getTemplateNotficationById(id);
    }
  }, [isEditing, id]);

  const handleSubmit = async (
    values: InitialValuesProps,
    {resetForm}: FormikHelpers<InitialValuesProps>
  ) => {
    try {
      const endpoint = isEditing
        ? `${API_ENDPOINTS.VIEW_DELETE_EDIT_Notification_Template}/${id}`
        : API_ENDPOINTS.Create_Notification_Template;

      const method = isEditing ? "put" : "post";
      const response: any = await axiosInstance[method](
        endpoint,
        JSON.stringify(values)
      );

      if (response?.settings?.success) {
        const successMessage = isEditing
          ? "Notification template updated successfully"
          : "Notification template added successfully";
        handleNotifications("success", successMessage, "", 5);
        resetForm({values: initialValues});
        router.push("/learning-program");
      } else {
        handleNotifications("error", response?.settings?.message, "", 3);
      }
    } catch (error: any) {
      console.error(error);
      handleNotifications("error", error?.message, "", 3);
    }
  };
  return (
    <SidebarLayout>
      <div className="flex">
        <div
          onClick={() => router.push("/learning-program")}
          className="pt-2 cursor-pointer"
        >
          <LeftArrowIcon />
        </div>
        <div className="text-[24px] font-[700] text-[#313D4F] mb-[30px] ml-2">
          {id && !viewOnly
            ? "Edit Notification Template"
            : viewOnly
            ? "View Notification Template Detail"
            : "Create Notification Template"}
        </div>
      </div>
      <Card>
        <Formik
          initialValues={fetchedData || initialValues}
          validationSchema={NotficationTemplateSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({isSubmitting, errors, values, setFieldValue}) => {
            return (
              <Form className="w-full">
                <div>
                  <div className="flex items-center  w-full space-x-2 mb-[20px]">
                    <CustomInput
                      label={
                        <div className="text-[16px] text-[#333333] font-[400] leading-[24px]">
                          Template Name
                        </div>
                      }
                      type="text"
                      name="templateName"
                      as={Input}
                      className={errors.templateName && " !border !border-red"}
                      size="large"
                      placeholder="Enter your template name"
                      status={errors.templateName && "error"}
                      error={<ErrorMessage name="templateName" />}
                      defaultValue={values.templateName}
                      maxInput={255}
                      disabled={viewOnly}
                      readOnly={viewOnly}
                    />
                  </div>
                  <div className="text-[#828282] text-[12px] font-[400]  leading-[16px] mt-[-15px] mb-[20px]">
                    Leave this field blank to use the Subject field as the
                    Template Name.
                  </div>
                </div>
                <div className="flex items-center  w-full space-x-2 mb-[20px]">
                  <CustomInput
                    label={
                      <div className="text-[16px] text-[#333333] font-[400] leading-[24px]">
                        Sender’s Email Address{" "}
                        <span className="text-[#EF4444]">*</span>
                      </div>
                    }
                    type="email"
                    name="senderEmail"
                    as={Input}
                    className={errors.senderEmail && " !border !border-red"}
                    size="large"
                    placeholder="Enter your email address "
                    status={errors.senderEmail && "error"}
                    error={<ErrorMessage name="senderEmail" />}
                    defaultValue={values.senderEmail}
                    maxInput={255}
                    disabled={viewOnly}
                    readOnly={viewOnly}
                  />
                  <CustomInput
                    label={
                      <div className="text-[16px] text-[#333333] font-[400] leading-[24px]">
                        Sender’s Email Name{" "}
                        <span className="text-[#EF4444]">*</span>
                      </div>
                    }
                    type="name"
                    name="senderName"
                    as={Input}
                    className={errors.senderName && " !border !border-red"}
                    size="large"
                    placeholder="Enter your sender name"
                    status={errors.senderName && "error"}
                    error={<ErrorMessage name="senderName" />}
                    defaultValue={values.senderName}
                    maxInput={255}
                    disabled={viewOnly}
                    readOnly={viewOnly}
                  />
                </div>
                <div className="flex items-center  w-full space-x-2 mb-[20px]">
                  <CustomInput
                    label={
                      <div className="text-[16px] text-[#333333] font-[400] leading-[24px]">
                        Subject
                        <span className="text-[#EF4444]">*</span>
                      </div>
                    }
                    type="text"
                    name="subject"
                    as={Input}
                    className={errors.subject && " !border !border-red"}
                    size="large"
                    placeholder="Enter your subject"
                    status={errors.subject && "error"}
                    error={<ErrorMessage name="subject" />}
                    defaultValue={values.subject}
                    maxInput={255}
                    disabled={viewOnly}
                    readOnly={viewOnly}
                  />
                </div>
                <div className="w-full mb-[20px]">
                  <div className="text-[16px] text-[#333333] font-[400] leading-[24px]">
                    Description
                  </div>

                  <Field name="content">
                    {({field}: any) => (
                      <Editor
                        editorData={values.content || ""}
                        handleEditorChange={(content: string) =>
                          setFieldValue("content", content)
                        }
                        readonly={viewOnly}
                        isNotficationUi={true}
                      />
                    )}
                  </Field>
                  <ErrorMessage
                    name="content"
                    component="div"
                    className="field-error"
                  />
                </div>

                <div>
                  <Button
                    className="custom-btn"
                    type="primary"
                    htmlType="submit"
                    loading={isSubmitting}
                  >
                    {id ? "Update" : "Create"}
                  </Button>
                </div>
              </Form>
            );
          }}
        </Formik>
      </Card>
    </SidebarLayout>
  );
};

export default CreateNotification;
