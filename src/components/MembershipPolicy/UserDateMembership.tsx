import {FC, useEffect, useState} from "react";
import {NextRouter, useRouter} from "next/router";

import type {FormProps} from "antd";
import {Button, Col, Form, Input, InputNumber, Radio, Row, Select} from "antd";

import DownArrow from "../Icons/DownArrow";
import axiosInstance from "@/src/interceptors/Axios";
import {API_ENDPOINTS} from "@/src/interceptors/apiName";
import {useNotification} from "../Notification";
import dayjs from "dayjs";
import DateRangePicker from "../DateRangePicker";
import moment from "moment";
import React from "react";

type UserDateMembershipProps = {
  membershipFormDetails: any;
  setGroupId: React.Dispatch<React.SetStateAction<any>>;
  setUsers: React.Dispatch<React.SetStateAction<any>>;
};

type FieldType = {
  groupName: string;
  dateType: string;
  timeFrame: string;
  daterange?: string;
  duration?: string;
  unitOfTime?: string;
  condition: string;
  value: string | number;
};

type GetFormFieldType = {
  label?: string;
  name:
    | "dateType"
    | "condition"
    | "timeFrame"
    | "daterange"
    | "duration"
    | "unitOfTime"
    | "value";
  type: string;
  errorMsg: string;
  required: boolean;
};

const getFormLabel = (name?: string | number) =>
  name && (
    <div
      className="text-[16px] font-[400] text-[#000000]"
      style={{marginBottom: -10}}
    >
      {name}
    </div>
  );

const timeFrame = [
  {
    key: "range",
    name: "Range",
  },
  {
    key: "duration",
    name: "Duration",
  },
  {
    key: "any",
    name: "Any",
  },
];

const durationExtraFields = ["In the last", "Prior to Last"];

const unitOfTimeExtraFields = ["Days", "Weeks", "Months"];

const UserDateMembership: FC<UserDateMembershipProps> = ({
  membershipFormDetails,
  setGroupId,
  setUsers,
}) => {
  const [form] = Form.useForm();
  const router: NextRouter = useRouter();
  const notificationContext = useNotification();
  const handleNotifications: any = notificationContext?.handleNotifications;
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [timeframeValue, setTimeframeValue] = useState<
    "range" | "duration" | "any"
  >("range");
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | any>(
    []
  );

  const [value, setValue] = useState<number>(1);
  const setFormFieldsValue = (key: string, value: any) => {
    form.setFieldsValue({
      [key]: value,
    });
  };

  const onDecreaseValue = () => {
    setValue((pevVal) => (pevVal > 1 ? pevVal - 1 : 1));
    setFormFieldsValue("value", value);
  };

  const onIncreaseValue = () => {
    setValue((pevVal) => pevVal + 1);
    setFormFieldsValue("value", value);
  };

  const handleDateChange = (
    dates: [dayjs.Dayjs, dayjs.Dayjs] | null,
    dateStrings: [string, string]
  ) => {
    setDateRange(dates);
  };

  const handleDurationExtraFields = () =>
    durationExtraFields.map((field) => (
      <Select.Option key={field} value={field}>
        {field}
      </Select.Option>
    ));

  const handleUnitOfTimeExtraFields = () =>
    unitOfTimeExtraFields.map((field) => (
      <Select.Option key={field} value={field}>
        {field}
      </Select.Option>
    ));

  const getSelectElementOptions = (
    fieldName: string,
    extraFields?: boolean,
    handler?: any
  ) => {
    return (
      membershipFormDetails?.formFields?.length &&
      membershipFormDetails?.formFields?.map((field: any) => {
        if (field.fieldName === fieldName) {
          if (extraFields) {
            return handler(field);
          } else {
            return (
              field?.fieldValues?.length &&
              field?.fieldValues?.map((fieldValue: any) => {
                return (
                  <Select.Option
                    key={fieldValue.valueId}
                    value={fieldValue.valueId}
                  >
                    {fieldValue.value}
                  </Select.Option>
                );
              })
            );
          }
        }
      })
    );
  };

  const getElement = (fieldName: string) => {
    if (fieldName === "dateType") {
      return getSelectElementOptions("Date Type");
    }
    if (fieldName === "condition") {
      return getSelectElementOptions("Condition");
    }
    if (fieldName === "duration") {
      return getSelectElementOptions(
        "Time Frame",
        true,
        handleDurationExtraFields
      );
    }
    if (fieldName === "unitOfTime") {
      return getSelectElementOptions(
        "Time Frame",
        true,
        handleUnitOfTimeExtraFields
      );
    }
  };

  const getRadioOptions = () =>
    timeFrame.map((time) => (
      <Radio.Button value={time.key} className="flex-1 text-center">
        {time.name}
      </Radio.Button>
    ));
  const handleValueChange = (value: number | null) => {
    if (value !== null && value % 1 !== 0) {
      setErrorMessage("No decimals allowed");
    } else {
      setErrorMessage(null);
    }
    setValue(value ?? 0);
  };
  const getDynamicField = (type: string, name: string) => {
    if (type === "select") {
      return (
        <Select
          size={"large"}
          showSearch={false}
          style={{height: "40px", width: "100%"}}
          className="custom-select"
          placeholder="Please Select"
          suffixIcon={<DownArrow />}
        >
          {getElement(name)}
        </Select>
      );
    }
    if (type === "input") {
      return (
        <Input
          style={{height: "40px"}}
          className="custom-input"
          placeholder="Please Enter Value"
        />
      );
    }
    if (type === "radio") {
      return (
        <>
          <Radio.Group
            defaultValue={timeframeValue}
            buttonStyle="solid"
            className="flex justify-between w-full custom-radio"
            onChange={(e) => setTimeframeValue(e.target.value)}
          >
            {getRadioOptions()}
          </Radio.Group>
        </>
      );
    }
    if (type === "daterange") {
      return (
        <>
          <DateRangePicker
            defaultValue={dateRange}
            value={dateRange}
            onChange={handleDateChange}
          />
        </>
      );
    }
    if (type === "inputNumber") {
      return (
        <div>
          <InputNumber
            className="flex flex-1 text-center "
            addonBefore={
              <div
                className="cursor-pointer select-none"
                onClick={onDecreaseValue}
              >
                -
              </div>
            }
            addonAfter={
              <div
                className="cursor-pointer select-none"
                onClick={onIncreaseValue}
              >
                +
              </div>
            }
            defaultValue={value}
            value={value}
            onChange={handleValueChange}
            controls={false}
            min={1}
          />
          {errorMessage && (
            <div className="text-[#ff4d4f] mt-2">{errorMessage}</div>
          )}{" "}
        </div>
      );
    }
  };

  const getFormField = ({
    label,
    required,
    name,
    errorMsg,
    type,
  }: GetFormFieldType) => (
    <Form.Item<FieldType>
      label={getFormLabel(label)}
      name={name}
      rules={[{required, message: errorMsg}]}
      labelCol={{span: 24}}
      wrapperCol={{span: 24}}
      style={{marginBottom: 0}}
    >
      {getDynamicField(type, name)}
    </Form.Item>
  );

  const getFieldId = (fieldName: string) =>
    membershipFormDetails?.formFields?.length
      ? membershipFormDetails.formFields.find(
          (field: any) => field.fieldName === fieldName
        )?.fieldId
      : null;

  const getMilisecondsmoment = (date: any) => moment(date).valueOf();

  const getValueId = (fieldName: string, childFieldName: string) =>
    membershipFormDetails?.formFields?.length
      ? membershipFormDetails.formFields
          .find((field: any) => field.fieldName === fieldName)
          ?.fieldValues?.find(
            (childField: any) => childField.value === childFieldName
          )?.valueId
      : null;

  const handleExtraFields = () => {
    if (timeframeValue === "range") {
      return (
        <Row gutter={[30, 10]} className="mt-[20px]">
          <Col xs={24} lg={12}>
            {getFormField({
              name: "daterange",
              errorMsg: "Please select date range",
              type: "daterange",
              required: true,
            })}
          </Col>
        </Row>
      );
    }
    if (timeframeValue === "duration") {
      return (
        <>
          <Row gutter={[30, 10]} className="mt-[20px] w-[50%]">
            <Col xs={24} lg={12}>
              {getFormField({
                name: "duration",
                errorMsg: "Please select duration",
                type: "select",
                required: true,
              })}
            </Col>
          </Row>
          <Row gutter={[30, 10]} className="mt-[20px] w-[50%]">
            <Col xs={24} lg={12}>
              {getFormField({
                name: "value",
                errorMsg: "Please select duration",
                type: "inputNumber",
                required: false,
              })}
            </Col>
          </Row>
          <Row gutter={[30, 10]} className="mt-[20px] w-[50%]">
            <Col xs={24} lg={12}>
              {getFormField({
                name: "unitOfTime",
                errorMsg: "Please select time unit",
                type: "select",
                required: true,
              })}
            </Col>
          </Row>
        </>
      );
    }
  };

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    setGroupId(null);
    setUsers([]);
    if (Object.keys(values).length) {
      const payload = {
        isNormalGroup: false,
        formId: membershipFormDetails?.formId,
        groupName: values.groupName,
        formContent: {
          condition: {
            fieldId: getFieldId("Condition"),
            valueId: values.condition,
          },
          dateType: {
            fieldId: getFieldId("Date Type"),
            valueId: values.dateType,
          },
          timeFrame: {},
        },
      };

      if (values.timeFrame === "range") {
        const [startDate, endDate]: any = values.daterange;
        const formattedStartDate = startDate?.format();
        const formattedEndDate = endDate?.format();

        payload.formContent.timeFrame = {
          fieldId: getFieldId("Time Frame"),
          valueId: getValueId("Time Frame", "Range"),
          value: "Range",
          extraFields: {
            startDate:
              values?.daterange && getMilisecondsmoment(formattedStartDate),
            endDate:
              values?.daterange && getMilisecondsmoment(formattedEndDate),
          },
        };
      }

      if (values.timeFrame === "duration") {
        payload.formContent.timeFrame = {
          fieldId: getFieldId("Time Frame"),
          valueId: getValueId("Time Frame", "Duration"),
          value: "Duration",
          extraFields: {
            duration: values.duration,
            unitOfTime: values.unitOfTime,
            value: values.value || 1,
          },
        };
      }

      if (values.timeFrame === "any") {
        payload.formContent.timeFrame = {
          fieldId: getFieldId("Time Frame"),
          valueId: getValueId("Time Frame", "Any"),
          value: "Any",
        };
      }

      setLoading(true);
      try {
        const result: any = await axiosInstance.post(
          `${API_ENDPOINTS.CREATE_GROUP}`,
          payload
        );
        if (Object.keys(result).length && result?.settings?.success) {
          resetData();
          setGroupId(result?.data?.groupId);
          handleNotifications(`success`, "Group added successfully", ``, 3);
        } else {
          handleNotifications(`error`, `${result?.settings?.message}`, ``, 3);
        }
      } catch (e) {
      } finally {
        setLoading(false);
      }
    }
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };

  const resetData = (alsoUsers = false) => {
    form.resetFields();
    setDateRange([]);
    setValue(1);
    setTimeframeValue("range");
    setFormFieldsValue("timeFrame", "range");
    if (alsoUsers) {
      setUsers([]);
      setGroupId(null);
    }
  };

  useEffect(() => {
    setFormFieldsValue("value", value);
    setFormFieldsValue("timeFrame", "range");
    return () => {
      resetData(true);
    };
  }, []);

  return (
    <div>
      <Form
        form={form}
        name="UserFieldMembershipForm"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        requiredMark={false}
      >
        <Form.Item<FieldType>
          label={getFormLabel("Group Name")}
          name="groupName"
          rules={[
            {required: true, message: "Please input your group name"},
            {
              pattern: /^\S.*$/,
              message: "Group name cannot be blank or start with a space",
            },
          ]}
          labelCol={{span: 24}}
          wrapperCol={{span: 24}}
        >
          <Input
            // value={groupName}
            // onChange={handleChangeGroupName}
            style={{height: "40px"}}
            className="custom-input"
            placeholder="Please Type..."
          />
        </Form.Item>

        <div className="mt-[30px] text-[18px] font-[700] text-[#333333]">
          {membershipFormDetails?.formName}
        </div>

        <Row gutter={[30, 10]}>
          <Col xs={24} lg={12}>
            {getFormField({
              label: "Condition",
              name: "condition",
              errorMsg: "Please select condition",
              type: "select",
              required: true,
            })}
          </Col>
          <Col xs={24} lg={12}>
            {getFormField({
              label: "Date Type",
              name: "dateType",
              errorMsg: "Please select datetype",
              type: "select",
              required: true,
            })}
          </Col>
        </Row>

        <Row gutter={[30, 10]}>
          <Col xs={24} lg={12}>
            {getFormField({
              label: "Time Frame",
              name: "timeFrame",
              errorMsg: "Please select timeFrame",
              type: "radio",
              required: false,
            })}
          </Col>
        </Row>

        {handleExtraFields()}

        <Form.Item wrapperCol={{offset: 0, span: 24}}>
          <div className="flex mt-5 text-[16px] font-[700]">
            <Button
              className="text-[16px] font-[700] py-3 px-6 flex items-center"
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
            >
              Save
            </Button>
            <Button
              disabled={loading}
              className="text-[16px] font-[700] text-[#4379EE] py-3 px-6 flex items-center"
              type="link"
              size="large"
              onClick={() => router.push("/users/manage-groups")}
            >
              Cancel
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default UserDateMembership;
