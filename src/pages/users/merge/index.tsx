import {FC, useEffect, useState} from "react";
import SidebarLayout from "@/src/components/Layout/SidebarLayout";
import {AutoComplete, Card, Input, Button} from "antd";
import {CaretDownOutlined} from "@ant-design/icons";
import axiosInstance from "@/src/interceptors/Axios";
import {API_ENDPOINTS} from "@/src/interceptors/apiName";
import {useNotification} from "@/src/components/Notification";
import {Formik, Form, FormikHelpers, Field} from "formik";
import {mergeUserValidation} from "@/src/helper/ValidationSchema";
import {useRouter} from "next/router";
import {camelCase} from "@/src/helper/Utils";
import TragetUserIocn from "../../../components/Icons/TragetUserIocn";
import MergeUserInputIcon from "@/src/components/Icons/MergeUserInputIcon";

const MergeUsers: FC = () => {
  const [options, setOptions] = useState([]);
  const [optionsMerge, setMegeOptions] = useState([]);
  const [userDropDownData, setUserDropDownData] = useState<any>([]);
  const [selectedTargetUser, setSelectedTargetUser] = useState<any>(null);
  const [selectedMergeUser, setSelectedMergeUser] = useState<any>(null);
  const notificationContext = useNotification();
  const handleNotifications: any = notificationContext?.handleNotifications;
  const router = useRouter();

  const fetchUserDropDown = async () => {
    try {
      const response: any = await axiosInstance.get(
        `${API_ENDPOINTS.USER_DROPDOWN}`
      );
      if (response?.settings?.success) {
        setUserDropDownData(response?.data || []);
        const initialOptions = response?.data?.map((user: any) => ({
          label: user?.name.trim() ? camelCase(user?.name) : user?.email,
          value: `${user?.userId}`,
        }));
        setOptions(initialOptions);
        setMegeOptions(initialOptions);
      }
    } catch (error) {
      console.error("Error fetching dropdown data:", error);
    }
  };

  useEffect(() => {
    fetchUserDropDown();
  }, []);

  const initialValues = {
    targetUserId: "",
    mergeUserId: "",
  };

  type InitialValuesProps = {
    targetUserId: number;
    mergeUserId: number;
  };

  const handleSubmit = async (
    values: InitialValuesProps,
    {resetForm}: FormikHelpers<InitialValuesProps>
  ) => {
    try {
      if (!selectedMergeUser && !selectedTargetUser) {
        handleNotifications(
          "error",
          "Please select both users from the dropdown.",
          "",
          3
        );
        return;
      }

      if (!selectedMergeUser) {
        handleNotifications(
          "error",
          "Please select the user from the merge user dropdown.",
          "",
          3
        );
        return;
      }

      if (!selectedTargetUser) {
        handleNotifications(
          "error",
          "Please select the user from the target user dropdown.",
          "",
          3
        );
        return;
      }

      if (values.targetUserId === values.mergeUserId) {
        handleNotifications(
          "error",
          "You cannot select the same user for both fields. Please select another user for Merge User.",
          "",
          3
        );
        return;
      }

      const updatedValues = {
        ...values,
        mergeUserId: Number(values?.mergeUserId),
        targetUserId: Number(values?.targetUserId),
      };

      const response: any = await axiosInstance.post(
        `${API_ENDPOINTS.MERGE_USER}`,
        updatedValues
      );

      if (response?.settings?.success) {
        handleNotifications("success", "Users updated successfully", "", 3);
        resetForm();
        fetchUserDropDown();
        router.push("/users");
      } else {
        handleNotifications("error", response?.settings?.message, "", 3);
      }
    } catch (error: any) {
      console.error(error);
      handleNotifications("error", error?.message, "", 3);
    }
  };

  const handleSearchTargetUser = (searchText: string) => {
    const filteredOptions = userDropDownData
      .filter(
        (user: any) =>
          user?.name?.toLowerCase().includes(searchText.toLowerCase()) ||
          user?.email?.toLowerCase().includes(searchText.toLowerCase())
      )
      .map((user: any) => ({
        label: camelCase(user?.name?.trim() ? user?.name : user?.email),
        value: `${user?.userId}`,
      }));

    if (filteredOptions.length === 0) {
      // @ts-ignore
      setOptions([{label: "No results found", value: ""}]);
    } else {
      setOptions(filteredOptions);
    }
  };

  const handleSearchMergeUserUser = (searchText: string) => {
    const filteredOptions = userDropDownData
      .filter(
        (user: any) =>
          user?.name?.toLowerCase().includes(searchText.toLowerCase()) ||
          user?.email?.toLowerCase().includes(searchText.toLowerCase())
      )
      .map((user: any) => ({
        label: camelCase(user?.name?.trim() ? user?.name : user?.email),
        value: `${user?.userId}`,
      }));

    if (filteredOptions.length === 0) {
      // @ts-ignore
      setMegeOptions([{label: "No results found", value: ""}]);
    } else {
      setMegeOptions(filteredOptions);
    }
  };

  const onSelect = (
    value: string,
    option: any,
    field: any,
    setFieldValue: any
  ) => {
    const selectedUser = userDropDownData.find(
      (user: any) => `${user?.userId}` === value
    );
    if (selectedUser) {
      field.onChange(value);
      setFieldValue(field?.name, value);
      const displayName = selectedUser?.name?.trim()
        ? selectedUser?.name
        : selectedUser?.email;

      if (field?.name === "targetUserId") {
        setSelectedTargetUser({
          ...selectedUser,
          displayName,
        });
      } else if (field?.name === "mergeUserId") {
        setSelectedMergeUser({
          ...selectedUser,
          displayName,
        });
      }
    }
  };

  const handleClear = (field: any, setFieldValue: any, userType: string) => {
    setFieldValue(field?.name, "");
    if (userType === "target") {
      setSelectedTargetUser(null);
    } else if (userType === "merge") {
      setSelectedMergeUser(null);
    }
  };

  return (
    <SidebarLayout>
      <div className="h-[90%]">
        <div className="text-[24px] font-[700] text-[#313D4F] mb-5">
          Merge Users
        </div>

        <Card className="border border-[#E8E8E8] bg-[#FFF] rounded-[14px] h-full">
          <Formik
            // @ts-ignore
            initialValues={initialValues}
            validationSchema={mergeUserValidation}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({isSubmitting, errors, values, touched, setFieldValue}) => (
              <div className="space-y-4 w-full">
                <Form className="space-y-4 w-full">
                  <div className="flex justify-between space-x-4 w-full">
                    <div className="w-full">
                      <p className="text-[16px]">
                        Select Target User
                        <span className="text-red-500">*</span>
                      </p>
                      <Field name="targetUserId">
                        {({field}: any) => (
                          <AutoComplete
                            id="targetUserId"
                            options={options}
                            onChange={(value, option) => {
                              if (!value) {
                                handleClear(field, setFieldValue, "target");
                              } else {
                                onSelect(value, option, field, setFieldValue);
                              }
                            }}
                            onSearch={handleSearchTargetUser}
                            onFocus={() => handleSearchTargetUser("")}
                            size="large"
                            className="mt-2 w-full"
                            value={
                              selectedTargetUser?.displayName || field.value
                            }
                          >
                            <Input
                              {...field}
                              size="large"
                              placeholder="Search"
                              addonBefore={<TragetUserIocn />}
                              suffix={
                                <CaretDownOutlined
                                  style={{
                                    width: "20px",
                                    height: "20px",
                                    color: "#8C9196",
                                  }}
                                />
                              }
                              onChange={(e) => {
                                const value = e.target.value;
                                setFieldValue(field.name, value);
                                setSelectedTargetUser(null);
                                handleSearchTargetUser(value);
                              }}
                            />
                          </AutoComplete>
                        )}
                      </Field>

                      {errors.targetUserId && touched.targetUserId && (
                        <div className="text-red-500 mt-1">
                          {errors.targetUserId}
                        </div>
                      )}
                    </div>
                    <div className="w-full">
                      <p className="text-[16px]">
                        Select Merge User<span className="text-red-500">*</span>
                      </p>
                      <Field name="mergeUserId">
                        {({field}: any) => (
                          <AutoComplete
                            id="mergeUserId"
                            options={optionsMerge}
                            onChange={(value, option) =>
                              onSelect(value, option, field, setFieldValue)
                            }
                            onSearch={handleSearchMergeUserUser}
                            onFocus={() => handleSearchMergeUserUser("")}
                            size="large"
                            className="mt-2 w-full"
                            value={
                              selectedMergeUser?.displayName || field.value
                            }
                          >
                            <Input
                              {...field}
                              size="large"
                              addonBefore={
                                <div>
                                  <MergeUserInputIcon />
                                </div>
                              }
                              placeholder="Search by name or email..."
                              suffix={
                                <CaretDownOutlined
                                  style={{
                                    width: "20px",
                                    height: "20px",
                                    color: "#8C9196",
                                  }}
                                />
                              }
                              onChange={(e) => {
                                const inputValue = e.target.value;
                                setFieldValue(field.name, inputValue);
                                setSelectedMergeUser(null);
                                handleSearchMergeUserUser(inputValue);
                              }}
                            />
                          </AutoComplete>
                        )}
                      </Field>

                      {errors.mergeUserId && touched.mergeUserId && (
                        <div className="text-red-500 mt-1">
                          {errors.mergeUserId}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="w-full">
                    <Button
                      className="custom-btn mt-5"
                      type="primary"
                      htmlType="submit"
                      loading={isSubmitting}
                    >
                      Merge User
                    </Button>
                  </div>
                </Form>
              </div>
            )}
          </Formik>
        </Card>
      </div>
    </SidebarLayout>
  );
};

export default MergeUsers;
