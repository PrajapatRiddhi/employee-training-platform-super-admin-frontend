import {camelCase, generatePassword} from "@/src/helper/Utils";
import {importUserValidation} from "@/src/helper/ValidationSchema";
import {CsvToJson, CsvValidation} from "@/src/helper/csvVlidaiton";
import axiosInstance from "@/src/interceptors/Axios";
import {API_ENDPOINTS} from "@/src/interceptors/apiName";
import {
  Button,
  Card,
  Checkbox,
  Col,
  Input,
  Popover,
  Radio,
  Row,
  Space,
  Tooltip,
  Typography,
} from "antd";
import {ErrorMessage, Form, Formik} from "formik";
import {FC, useEffect, useState} from "react";
import CustomInput from "../CustomInput";
import CustomSelect from "../CustomSelect";
import FileUpload from "../FileUpload";
import QuestionIcon from "../Icons/QuestionIcon";
import {useLoader} from "../Loader/LoaderProvider";
import MultiEmail from "../MultipleEmail";
import {useNotification} from "../Notification";
import React from "react";
// const MultiEmail = dynamic(() => import('../MultipleEmail'), { ssr: false });

const initialValues = {
  emails: [],
  password: "",
  passwordToggle: false,
  groupId: "",
  departmentId: "",
  groupToggle: false,
  userIds: [],
  file: null,
};
const ImportUsers: FC = () => {
  const [importType, setImportType] = useState("quickImport");
  const [group, setGroup] = useState<any>([]);
  const [departName, setDepartName] = useState<any>([]);
  const [file, setFile] = useState<any>(null);
  const [users, setUsers] = useState([]);
  const [fileError, setFilesError] = useState([]);
  const [selectKey, setSelectKey] = useState(0);
  const loaderContext = useLoader();
  const {showLoader, hideLoader} = loaderContext;
  const notificationContext = useNotification();
  const handleNotifications: any = notificationContext?.handleNotifications;
  const {Text} = Typography;
  useEffect(() => {
    fetchGroups();
  }, []);
  const fetchGroups = async () => {
    const groupList: any = await axiosInstance.get(
      `${API_ENDPOINTS.DROPDOWN_LIST_GROUP}?allGroups=No`
    );
    if (groupList?.settings?.success) {
      console.log("groupList?.data :>> ", groupList?.data);
      setGroup(groupList?.data);
    }

    const departmentList: any = await axiosInstance.get(
      API_ENDPOINTS.AUTOCOMPLETE_DEPARTMENT_DATA
    );
    if (departmentList?.settings?.success) {
      console.log("groupList?.data :>> ", departmentList?.data);
      setDepartName(departmentList?.data);
    }

    let fetchUser: any = await axiosInstance.get(
      `${API_ENDPOINTS.USER_DROPDOWN}`
    );
    if (fetchUser?.settings?.success) {
      setUsers(fetchUser.data);
    }
  };
  const CheckFileValidation = async (file: any) => {
    const header = ["Email"];
    const convertData = await CsvToJson(file);
    const csvRes: any = await CsvValidation(
      convertData as any[],
      header,
      "user"
    );
    if (csvRes?.errors?.length > 0) {
      setFilesError(csvRes?.errors);
      hideLoader();
      return false;
    }
    return true;
  };
  const handleSubmit = async (values: any, {resetForm, setFieldValue}: any) => {
    showLoader();
    console.log(values);
    try {
      if (importType === "quickImport") {
        delete values.passwordToggle;
        delete values.groupToggle;
        if (values.groupId === "") {
          values.groupId = 0;
        }
        const userCreate: any = await axiosInstance.post(
          API_ENDPOINTS.USER_QUICK_IMPORT,
          JSON.stringify(values)
        );
        if (userCreate?.settings?.success) {
          handleNotifications("success", userCreate?.settings?.message);

          resetForm();
          setFieldValue("groupId", "");
          setSelectKey((prevKey) => prevKey + 1);
        }
      } else {
        if (!file) {
          handleNotifications("error", "Please select a file");
          hideLoader();
          return;
        }
        let checkValidContain = await CheckFileValidation(file.target.files);
        if (!checkValidContain) {
          hideLoader();
          setTimeout(() => {
            setFilesError([]);
            setFile(null);
          }, 5000);
          return;
        }
        const formData = new FormData();
        formData.append("file", file.target.files[0]);
        if (values.userIds.length > 0) {
          formData.append("userIds", values.userIds);
        }
        const userCreate: any = await axiosInstance.post(
          API_ENDPOINTS.USER_CSV_IMPORT,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (userCreate?.settings?.success) {
          handleNotifications("success", userCreate?.settings?.message);

          resetForm();
          setFieldValue("groupId", "");
          setSelectKey((prevKey) => prevKey + 1);
          setFile(null);
        }
      }
    } catch (error) {
      console.log(error, "error");
    }
    hideLoader();
  };

  return (
    <>
      <Space className="pt-[10px] pb-[30px] flex justify-between">
        <Text className="text-gray-700 text-[22px] font-semibold leading-6">
          Import Users
        </Text>
        <Radio.Group
          defaultValue={importType}
          size="large"
          className="w-full bg-[#F9F9FB] custom-tab-frequency"
          onChange={(e) => setImportType(e.target.value)}
        >
          <Radio.Button
            className=" text-center    w-[200px] font-[700] "
            value="quickImport"
          >
            Quick Import
          </Radio.Button>
          <Radio.Button
            className=" text-center  w-[200px] font-[700] "
            value="csvImport"
          >
            CSV Import
          </Radio.Button>
        </Radio.Group>
      </Space>

      <Card className="custom-card ">
        {importType === "quickImport" ? (
          <>
            <Formik
              initialValues={initialValues}
              validationSchema={importUserValidation}
              onSubmit={handleSubmit}
              enableReinitialize
            >
              {({isSubmitting, errors, resetForm, values, setFieldValue}) => {
                console.log("errors", values, errors);
                return (
                  <Form className="w-full">
                    <Row
                      className="flex items-center"
                      gutter={{xs: 8, sm: 16, md: 24, lg: 32}}
                    >
                      <Col className="gutter-row" span={24}>
                        <div
                          className={` text-[#828282] text-[14px] leading-[22px] custom-input-label `}
                        >
                          <div className="flex gap-[5px]">
                            <span className="text-[16px] text-[#333] font-[400] ">
                              Enter one user email per line
                              <span className="text-red-500">*</span>
                            </span>
                            <Popover
                              color="#F5F6FA"
                              placement="rightTop"
                              title={
                                <div className="text-[400] font-[600]">
                                  Email Addresses should have the following
                                  formats:
                                </div>
                              }
                              content={
                                <div className="flex flex-col text-[14px] font-[300]">
                                  user1@xyz.com <br />
                                  user1@xyz.com <br />
                                  user1@xyz.com
                                  <br />
                                </div>
                              }
                            >
                              <div className="cursor-pointer">
                                <QuestionIcon size={20} />
                              </div>
                            </Popover>
                          </div>
                        </div>
                        {/* <Field name="emails" as={TextArea}>
                                                    {({ field }: any) => ( */}
                        <div className="mt-2">
                          <MultiEmail
                            emails={values.emails}
                            setEmails={(emails: string[]) =>
                              setFieldValue("emails", emails)
                            }
                            focus={true}
                          />
                          <ErrorMessage name="emails">
                            {(msg) => <Text type="danger">{msg}</Text>}
                          </ErrorMessage>
                        </div>
                        {/* )}
                                                </Field> */}
                      </Col>
                    </Row>
                    <Row
                      className="flex items-center mt-[20px]"
                      gutter={{xs: 8, sm: 16, md: 24, lg: 32}}
                    >
                      <Col className="gutter-row" span={12}>
                        <span>
                          {" "}
                          Select Groups <span className="text-red-500">*</span>
                        </span>
                        <CustomSelect
                          key={selectKey}
                          name="groupId"
                          className="w-full"
                          placeholder="Select Group"
                          size={"large"}
                          options={group.map((item: any) => ({
                            label: camelCase(item.groupName),
                            value: item.groupId,
                          }))}
                          error={<ErrorMessage name="groupId" />}
                        />
                      </Col>
                      <Col className="gutter-row" span={12}>
                        <span>
                          {" "}
                          Select Departments{" "}
                          <span className="text-red-500">*</span>
                        </span>
                        <CustomSelect
                          key={selectKey}
                          name="departmentId"
                          className="w-full"
                          placeholder="Select Department"
                          size={"large"}
                          options={departName?.map((item: any) => ({
                            label: camelCase(item.departmentName),
                            value: item.departmentId,
                          }))}
                          error={<ErrorMessage name="departmentId" />}
                        />
                      </Col>
                      <Col className="gutter-row mt-3" span={12}>
                        <div className="flex justify-between items-center">
                          <Checkbox
                            className="text-[16px] font-[400] text-[#333]"
                            checked={values.passwordToggle}
                            onChange={(e) =>
                              setFieldValue("passwordToggle", e.target.checked)
                            }
                          >
                            Set Password for Users
                          </Checkbox>
                          {!values.passwordToggle ? (
                            ""
                          ) : (
                            <div
                              className="text-[16px] font-[400] text-[#4379ee] cursor-pointer"
                              onClick={() => {
                                let pass = generatePassword();
                                console.log("pass :>> ", pass);
                                setFieldValue("password", pass);
                              }}
                            >
                              {" "}
                              Password Generate{" "}
                            </div>
                          )}
                        </div>
                        <CustomInput
                          name="password"
                          type="password"
                          placeholder="Password"
                          className="w-full"
                          //   label="Password"
                          disabled={!values.passwordToggle}
                          size={"large"}
                          as={Input.Password}
                          error={<ErrorMessage name="password" />}
                        />{" "}
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
                        Import Users
                      </Button>
                    </div>
                  </Form>
                );
              }}
            </Formik>
          </>
        ) : (
          <>
            {" "}
            <Formik
              initialValues={initialValues}
              onSubmit={handleSubmit}
              enableReinitialize
            >
              {({isSubmitting, errors, resetForm, values, setFieldValue}) => {
                console.log("6562", isSubmitting, isSubmitting && !file);
                return (
                  <Form className="w-full">
                    <Row
                      className="flex items-center"
                      gutter={{xs: 8, sm: 16, md: 24, lg: 32}}
                    >
                      <Col className="gutter-row " span={12}>
                        <div className="text-[#333333] text-[16px] font-[400] leading-[24px] flex gap-[2px]">
                          <span>Upload a CSV file</span>
                          <div className="cursor-pointer">
                            <Tooltip title="Upload your document">
                              <div>
                                <QuestionIcon size={20} />
                              </div>
                            </Tooltip>
                          </div>
                        </div>
                        <div className="flex w-full items-center mt-[5px]">
                          <div className="w-full">
                            <FileUpload
                              labelText="Please select a file..."
                              buttonText="Browse"
                              onFileChange={(file: any) => {
                                console.log("file :>> ", file);
                                setFile(file);
                              }}
                              accept=".csv,.xlsx,.xls"
                              file={file}
                            />
                          </div>
                        </div>
                      </Col>
                      <Col span={12}>
                        <CustomSelect
                          name="userIds"
                          className="w-full"
                          placeholder="Select User"
                          mode="multiple"
                          size={"large"}
                          defaultValue={values.userIds}
                          label={
                            <div className="text-[16px]">
                              Notify upon Import Completion (Optional)
                            </div>
                          }
                          //   options={users.map((item: any) => ({
                          //     value: item.userId,
                          //     label: camelCase(item.name || item.userName),
                          //   }))}
                          options={users.map((item: any) => ({
                            value: item.userId,
                            label: camelCase(item.name || "User name is null"),
                          }))}
                          error={<ErrorMessage name="userIds" />}
                          onSelect={(value: any) => {
                            setFieldValue("userIds", value);
                          }}
                          onDeselect={(value: any) => {
                            setFieldValue(
                              "userIds",
                              values.userIds.filter(
                                (item: any) => item !== value
                              )
                            );
                          }}
                        />
                      </Col>
                    </Row>
                    {fileError.length > 0 && (
                      <div className="text-red-500">
                        {fileError.map((item: any, key: number) => (
                          <div key={key}>{item}</div>
                        ))}
                      </div>
                    )}
                    <div className="mt-[20px]">
                      <Button
                        loading={isSubmitting}
                        type="primary"
                        htmlType="submit"
                        size="large"
                        className="custom-heading-btn !w-[150px]"
                      >
                        Import Users
                      </Button>
                    </div>
                  </Form>
                );
              }}
            </Formik>
          </>
        )}
      </Card>
      {importType === "csvImport" && (
        <>
          <Card className="custom-card csv-import-guide-card my-[20px]">
            <div className="heading">
              Your imported CSV file must include Email in the header row. Each
              value should be separated by a comma (.).
            </div>
            <div className="contain mt-[20px]">
              You can use any of these fields in your CSV header:
            </div>
            <div className="contain mt-[10px]">
              Email, First Name, Last Name, Phone Number, Extension, Group,
              Location, Division, Manager Name, Manager Email, Employee Number,
              Job Title, Password, Mobile, Onboarding Managed, Risk Booster,
              Organization, Department, Language, Comment, Employee Start Date,
              Custom Field 1, Custom Field 2, Custom Field 3, Custom Field 4,
              Custom Date 1, Custom Date 2, Time Zone, Admin Language, Phishing
              Language, Training Language, Email Alias
            </div>
            <div className="contain mt-[10px]">
              For more information about how to set up your CSV,{" "}
              <a href="#" className="text-[#4379EE]">
                view this article.
              </a>
            </div>
            <div className="contain mt-[10px]">
              CSV with email addresses only <br />
              CSV with email addresses and group membership <br />
              CSV with all fields
            </div>
          </Card>
          <Card className="custom-card csv-import-guide-card my-[20px]">
            <div className="heading">
              Should I use the Password field in my CSV?
            </div>
            <div className="contain mt-[20px]">
              We do not recommend using this field, except in special cases. If
              you do not set a password, users will be prompted to set up their
              own passwords upon their first login.
            </div>
          </Card>
        </>
      )}
    </>
  );
};

export default ImportUsers;
