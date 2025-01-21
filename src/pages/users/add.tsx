import CustomInput from "@/src/components/CustomInput";
import SidebarLayout from "@/src/components/Layout/SidebarLayout";
import {useLoader} from "@/src/components/Loader/LoaderProvider";
import {useNotification} from "@/src/components/Notification";
import ProfileUpload from "@/src/components/ProfileUploader";
import uploadFile from "@/src/helper/UploadFIle";
import {createUserSchema} from "@/src/helper/ValidationSchema";
import {API_ENDPOINTS} from "@/src/interceptors/apiName";
import axiosInstance from "@/src/interceptors/Axios";
import {Button, Card, Col, Image, Input, Row, Space, Typography} from "antd";
import {ErrorMessage, Form, Formik} from "formik";
import {FC, useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {useSelector} from "react-redux";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import BackArrowIcon from "@/src/components/Icons/BackArrowIcon";
import {NextRouter, useRouter} from "next/router";
import React from "react";
import CustomSelect from "@/src/components/CustomSelect";
import {HoverDelete} from "@/src/components/Icons/HoverDelete";

type AddUsersProps = {
  id?: string | string[] | undefined;
  viewOnly?: boolean;
};

const initialValues = {
  firstName: "",
  lastName: "",
  email: "",
  image: "",
  phoneNumber: "9900112233",
  // roleId: 1,
  departmentId: "",
};

const AddUsers: FC<AddUsersProps> = ({id, viewOnly}) => {
  const currentUser = useSelector((state: any) => state.userReducer.user);
  const [userDetails, setUserDetails] = useState<any>(null);
  const [companyLogo, setCompanyLogo] = useState<any>(null);
  const [companyLogoFile, setCompanyLogoFile] = useState<any>(null);
  const [companyLogoToggle, setCompanyLogoToggle] = useState(false);
  const [departmentList, setDepartmentList] = useState<any>([]);
  const [logoName, setLogoName] = useState<any>(null);
  const [image, setImage] = useState<any>(null);
  const defaultImg = "/DefaultImage.png";
  const notificationContext = useNotification();
  const handleNotifications: any = notificationContext?.handleNotifications;
  const loaderContext = useLoader();
  const dispatch = useDispatch();
  const {showLoader, hideLoader} = loaderContext;
  const router: NextRouter = useRouter();
  const Text = Typography;
  const [isUplaod, setIsUpload] = useState(false);

  const fetchUserDetailsByID = async () => {
    showLoader();
    try {
      let userDetails: any = await axiosInstance.get(
        `${API_ENDPOINTS.USER_Details_API}/${id}`
      );
      if (userDetails?.settings?.success) {
        const transformedData = {
          firstName: userDetails?.data?.firstName || "",
          lastName: userDetails?.data?.lastName || "",
          email: userDetails?.data?.email || "",
          image: userDetails?.data?.image || "",
          // roleId: 1,
          phoneNumber: userDetails?.data?.phoneNumber || "",
          departmentId: userDetails?.data?.departmentId || "",
          departmentName: userDetails?.data?.departmentName || "",
        };
        setUserDetails(transformedData);
        setCompanyLogo(userDetails?.data?.imageUrl);
        setLogoName(userDetails?.data?.imageUrl);
        hideLoader();
      }
    } catch (error) {
      console.log(error, "error");
      hideLoader();
    }
  };

  useEffect(() => {
    if (id) fetchUserDetailsByID();
  }, [id]);

  const fetchDepartmentList = async () => {
    showLoader();
    try {
      let depatmentDetails: any = await axiosInstance.get(
        `${API_ENDPOINTS.AUTOCOMPLETE_DEPARTMENT_DATA}`
      );
      if (depatmentDetails?.settings?.success) {
        setDepartmentList(depatmentDetails?.data);
        hideLoader();
      }
    } catch (error) {
      console.log(error, "error");
      hideLoader();
    }
  };

  useEffect(() => {
    const hasDepartment = departmentList?.find(
      (el: any) => el.departmentId === userDetails.departmentId
    );
    if (!hasDepartment) {
      setUserDetails((prev: any) => ({...prev, departmentId: null}));
    }
  }, [departmentList, userDetails?.departmentId]);

  useEffect(() => {
    fetchDepartmentList();
  }, []);

  const handleSubmit = async (values: any) => {
    try {
      const httpMethod = id ? "put" : "post";
      let apiData: any = {};
      apiData.firstName = values.firstName;
      apiData.lastName = values.lastName;
      apiData.phoneNumber = values.phoneNumber;
      apiData.departmentId = values.departmentId;
      apiData.email = values.email;
      apiData.image = image;
      // apiData.roleId = 1;
      let usersAdded: any = await axiosInstance.request({
        method: httpMethod,
        url: id ? `${API_ENDPOINTS.USER_UPDATE}/${id}` : API_ENDPOINTS.USER_ADD,
        //   ? `${API_ENDPOINTS.VIEW_EDIT_DELETE_POLICY}/${id}`
        //   : API_ENDPOINTS.USER_ADD,
        data: JSON.stringify({
          ...apiData,
        }),
      });
      if (usersAdded?.settings?.success) {
        handleNotifications("success", "User added successfully", "", 3);
        router.push("/users");
      } else {
        handleNotifications("error", usersAdded?.settings?.message, "", 3);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fileUploading = async () => {
    try {
      let uploadRes = await uploadFile(companyLogoFile);
      if (uploadRes?.settings?.success) {
        setLogoName(uploadRes?.data?.url);
        setImage(uploadRes?.data?.name);
        setIsUpload(false);
      }
    } catch (error) {}
  };
  useEffect(() => {
    if (companyLogoToggle && companyLogo) {
      fileUploading();
      setCompanyLogo(companyLogo);
      setIsUpload(false);
    }
  }, [companyLogo]);

  const removeImage = () => {
    setImage("");
    setCompanyLogo(defaultImg);
    setCompanyLogoFile(defaultImg);
    setLogoName(defaultImg);
    setCompanyLogoToggle(false);
    setIsUpload(true);
  };

  const [dialCode, setDialCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const handlePhoneChange = (value: any) => {
    const dialCode = value.startsWith("+") ? value.split(" ")[0] : "";
    const number = value.startsWith("+")
      ? value.slice(dialCode.length).trim()
      : value;
    setDialCode(dialCode);
    setPhoneNumber(number);
  };

  useEffect(() => {
    if (userDetails) {
      setImage(userDetails.imageUrl);
    }
  }, [userDetails]);

  return (
    <>
      <SidebarLayout>
        <Space className="pt-[10px] pb-[30px]">
          <div className="cursor-pointer" onClick={() => router.push("/users")}>
            <BackArrowIcon />
          </div>
          <Text className="text-gray-700 font-[700] text-[24px] font-[Nunito Sans] leading-6">
            {viewOnly ? "View User" : id ? "Edit User" : "Create a New User "}
          </Text>
        </Space>
        <Card className="rounded-[14px] border border-[#E8E8E8] bg-white bordered-[14px]">
          <div className="w-full flex items-center justify-center">
            <div className="mt-2 mb-6 w-[110px] relative group">
              {/* <ProfileUpload
                onImageChange={(value) => {
                  setCompanyLogo(value.base64);
                  setCompanyLogoFile(value?.file);
                  setCompanyLogoToggle(true);
                }}
                defaultImage={companyLogo || logoName || defaultImg}
              />

              {(companyLogo || logoName) && (
                <button
                  className="profile-icon absolute top-0 right-2 group-hover:flex hidden"
                  onClick={removeImage}
                >
                  <HoverDelete
                    className="w-10 h-10 rounded-full bg-white flex justify-center items-center opacity-75"
                    size={20}
                    color="red"
                  />
                </button>
              )} */}

              {viewOnly ? (
                <Image
                  preview={false}
                  src={companyLogo || logoName || defaultImg}
                  width={100}
                  height={100}
                  className="rounded-full border-2 border-black"
                />
              ) : (
                <>
                  <ProfileUpload
                    onImageChange={(value) => {
                      setCompanyLogo(value.base64);
                      setCompanyLogoFile(value?.file);
                      setCompanyLogoToggle(true);
                    }}
                    defaultImage={companyLogo || logoName || defaultImg}
                  />

                  {(companyLogo || logoName) && (
                    <button
                      className="profile-icon absolute top-0 right-2 group-hover:flex hidden"
                      onClick={removeImage}
                    >
                      <HoverDelete
                        className="w-10 h-10 rounded-full bg-white flex justify-center items-center opacity-75"
                        size={20}
                        color="red"
                      />
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
          <Formik
            initialValues={userDetails || initialValues}
            validationSchema={createUserSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({isSubmitting, errors, values, setFieldValue, touched}) => {
              return (
                <Form className="w-full ">
                  <div className="flex justify-between w-full space-x-2 mb-[20px] gap-5">
                    <CustomInput
                      label="First Name"
                      labelClass="!text-[#333] !text-[16px]"
                      type="text"
                      name="firstName"
                      as={Input}
                      className={
                        errors.firstName && " !border !border-red !text-[#333]"
                      }
                      size="large"
                      placeholder="Enter the first name"
                      status={errors.firstName && "error"}
                      error={<ErrorMessage name="firstName" />}
                      defaultValue={values?.firstName}
                      required
                      disabled={viewOnly}
                      readOnly={viewOnly}
                    />

                    <CustomInput
                      label="Last Name"
                      labelClass="!text-[#333] !text-[16px]"
                      type="text"
                      name="lastName"
                      as={Input}
                      className={
                        errors.lastName && " !border !border-red !text-[#333]"
                      }
                      size="large"
                      placeholder="Enter the last name"
                      status={errors.lastName && "error"}
                      error={<ErrorMessage name="lastName" />}
                      defaultValue={values?.lastName}
                      required
                      disabled={viewOnly}
                      readOnly={viewOnly}
                    />
                  </div>
                  <Row gutter={{xs: 8, sm: 16, md: 24, lg: 32}}>
                    <Col className="gutter-row" span={12}>
                      <CustomInput
                        labelClass="!text-[#333] !text-[16px]"
                        label="Email Address"
                        type="text"
                        name="email"
                        as={Input}
                        className={errors.email && " !border !border-red"}
                        size="large"
                        placeholder="Enter the email"
                        status={errors.email && "error"}
                        error={<ErrorMessage name="email" />}
                        defaultValue={values.email}
                        maxInput={255}
                        disabled={viewOnly}
                        readOnly={viewOnly}
                        required
                      />
                    </Col>{" "}
                    <Col className="gutter-row" span={12}>
                      <CustomSelect
                        label="Departments"
                        required
                        placeholder="Select department"
                        labelClass="!text-[16px] !text-[#333]"
                        options={departmentList?.map((department: any) => ({
                          label: department?.departmentName,
                          value: department?.departmentId,
                        }))}
                        defaultValue={values.departmentId}
                        name="departmentId"
                        error={<ErrorMessage name="departmentId" />}
                        disabled={viewOnly}
                      />
                    </Col>
                  </Row>

                  {!viewOnly && (
                    <div className="flex items-center justify-center mt-10">
                      <Button
                        className="custom-btn"
                        type="primary"
                        htmlType="submit"
                        loading={isSubmitting}
                      >
                        {id ? "Update" : "Save"}
                      </Button>
                    </div>
                  )}
                </Form>
              );
            }}
          </Formik>
        </Card>
      </SidebarLayout>
    </>
  );
};
export default AddUsers;
