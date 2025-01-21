import {ChangeEvent, useEffect, useState} from "react";
import SidebarLayout from "@/src/components/Layout/SidebarLayout";
import {FC} from "react";
import {NextRouter, useRouter} from "next/router";
import LeftArrowIcon from "@/src/components/Icons/LeftArrowIcon";
import DownArrow from "@/src/components/Icons/DownArrow";
import {Button, Col, Input, Row, Select} from "antd";
import CommonButton from "@/src/components/Button";
import axiosInstance from "@/src/interceptors/Axios";
import {API_ENDPOINTS} from "@/src/interceptors/apiName";
import {useNotification} from "@/src/components/Notification";
import {ErrorMessage, Formik, Form} from "formik";
import {createNormalGroupSchema} from "@/src/helper/ValidationSchema";
import CustomInput from "@/src/components/CustomInput";
import CustomSelect from "@/src/components/CustomSelect";
import {useLoader} from "@/src/components/Loader/LoaderProvider";

const createNormalGroupInitialValues = {
  groupName: "",
  roles: [],
};
const ManageGroups: FC = () => {
  const router: NextRouter = useRouter();
  const notificationContext = useNotification();
  const handleNotifications: any = notificationContext?.handleNotifications;
  const loaderContext = useLoader();
  const {showLoader, hideLoader} = loaderContext;
  // const [loading, setLoading] = useState<boolean>(false);
  // const [groupName, setGroupName] = useState<string | number>("");
  const [roleList, setRoleList] = useState<any>([]);
  // const [roleIds, setRoleIds] = useState<number[]>([]);

  type payloadType = {
    groupName: string | number;
    roleIds?: number[];
  };

  // const handleChangeGroupName = (e: ChangeEvent<HTMLInputElement>) => {
  //   setGroupName(e.target.value);
  // };
  // const handleSelectRole = (value: number[]) => {
  //   setRoleIds(value);
  // };

  const getRoleList = async () => {
    showLoader();
    try {
      const result: any = await axiosInstance.get(`${API_ENDPOINTS.ROLE_LIST}`);

      if (Object.keys(result).length && result?.settings?.success) {
        setRoleList(result.data);
      }
    } catch (e) {
    } finally {
      hideLoader();
    }
  };

  useEffect(() => {
    getRoleList();
  }, []);

  const handleSubmit = async (values: any) => {
    try {
      showLoader();
      const result: any = await axiosInstance.post(
        `${API_ENDPOINTS.CREATE_GROUP}`,
        JSON.stringify(values)
      );
      if (Object.keys(result).length && result?.settings?.success) {
        handleNotifications(`success`, `${result?.settings?.message}`, ``, 3);
      }
      hideLoader();
      router.push("/users/manage-groups");
    } catch (error) {
      hideLoader();
    }
  };
  return (
    <SidebarLayout>
      <div>
        <div className="flex items-center text-[24px] font-[700] text-[#313D4F] mb-[30px]">
          <span
            className="cursor-pointer"
            onClick={() => router.push("/users/manage-groups")}
          >
            <LeftArrowIcon />
          </span>
          <span className="pl-[15px]">Create Normal Group</span>
        </div>
        <Formik
          initialValues={createNormalGroupInitialValues}
          validationSchema={createNormalGroupSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({isSubmitting, errors, values, setFieldValue}) => {
            console.log("errors :>> ", errors);
            console.log("values", values);
            return (
              <Form className="w-full">
                <div className="rounded-[14px] bg-[#FFFFFF] border border-[#E8E8E8] py-[21px] px-[31px]">
                  <Row>
                    <Col xs={24} lg={12}>
                      <CustomInput
                        as={Input}
                        defaultValue={values.groupName}
                        placeholder="Please Type..."
                        type="text"
                        name="groupName"
                        error={<ErrorMessage name="groupName" />}
                        label="Group Name"
                        labelClass="!text-[16px] !font-[400] !text-[#000000]"
                        size={"large"}
                        required
                      />
                    </Col>
                  </Row>
                  <Row className="mt-[20px]">
                    <Col xs={24} lg={12}>
                      <CustomSelect
                        // @ts-ignore
                        value={values.roles}
                        placeholder="Please Select Roles and Rights"
                        name="roles"
                        options={roleList.map((role: any) => ({
                          label: role.roleName,
                          value: role.roleId,
                        }))}
                        required
                        label="Roles and Rights"
                        labelClass="!text-[16px] !font-[400] !text-[#000000]"
                        size={"large"}
                        error={<ErrorMessage name="roles" />}
                        onSelect={(value) => {
                          const updatedRoleIds = [...values.roles, value];
                          setFieldValue("roles", updatedRoleIds);
                        }}
                        onDeselect={(value: any) => {
                          const updatedRoleIds = values.roles.filter(
                            (id) => id !== value
                          );
                          setFieldValue("roles", updatedRoleIds);
                        }}
                      />
                    </Col>
                  </Row>

                  <Row className="mt-[30px]">
                    <Col xs={24} sm={24} md={8} lg={5}>
                      <Button
                        // disabled={!groupName}
                        type="primary"
                        htmlType="submit"
                        className="custom-heading-btn max-w-[164px] w-full form"
                        // onClick={handleCreateGroup}
                      >
                        Create Group
                      </Button>
                    </Col>
                  </Row>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    </SidebarLayout>
  );
};

export default ManageGroups;
