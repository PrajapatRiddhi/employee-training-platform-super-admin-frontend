import {camelCase} from "@/src/helper/Utils";

import axiosInstance from "@/src/interceptors/Axios";
import {API_ENDPOINTS} from "@/src/interceptors/apiName";
import {
  Button,
  Card,
  Checkbox,
  Col,
  DatePicker,
  Divider,
  Input,
  InputNumber,
  Radio,
  Row,
  Space,
  Steps,
  TimePicker,
  Typography,
} from "antd";
import dayjs from "dayjs";
import {ErrorMessage, Field, FieldArray, Form, Formik} from "formik";
import {useRouter} from "next/router";
import {FC, useCallback, useEffect, useMemo, useState} from "react";
import CustomInput from "../CustomInput";
import CustomSelect from "../CustomSelect";
import BackArrowIcon from "../Icons/BackArrowIcon";
import DateIcon from "../Icons/DateIcon";
import TimeIcon from "../Icons/TimeIcon";
import {useLoader} from "@/src/components/Loader/LoaderProvider";
import {useNotification} from "../Notification";
import {
  addLearningProgramValidationSchema1,
  addLearningProgramValidationSchema2,
  addLearningProgramValidationSchema3,
} from "@/src/helper/ValidationSchema";
import {MdRefresh} from "react-icons/md";
import FileUpload from "../FileUpload";
import {MinusCircleFilled, PlusOutlined} from "@ant-design/icons";
import CommonModal from "../Modals";
import {notificationTypesDropdown} from "@/src/helper/Constant";
import {set} from "lodash";
import {FaMinus} from "react-icons/fa";
import QuestionMinusIcon from "../Icons/QuestionMinusIcon";
import React from "react";
import * as moment from "moment-timezone";

// var qs = require("qs");
function debounce(func: Function, wait: number) {
  let timeout: any;
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
type AddUpdateLearningProgramProp = {
  id?: string | string[] | undefined;
};

function convertOffsetToHoursAndMinutes(offset: any) {
  const hours = Math.floor(Math.abs(offset) / 60);
  const minutes = Math.abs(offset) % 60;
  const sign = offset >= 0 ? "+" : "-";
  return `${sign}${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}`;
}

const AddUpdateLearningProgram: FC<AddUpdateLearningProgramProp> = ({id}) => {
  const {Text} = Typography;
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  // const [timezones, setTimezones] = useState<any>([]);

  const timezones = useMemo(
    () =>
      moment.tz.names().map((timezone) => {
        const offset = moment.tz.zone(timezone)?.utcOffset(0);
        return {
          offset: convertOffsetToHoursAndMinutes(
            offset !== undefined ? Math.round(offset) : 0
          ),
          name: timezone,
        };
      }),
    []
  );

  const initialValues = {
    programName: "",
    startDate: "",
    startTime: "",
    timeZoneId: 0,
    timeZoneName: moment.tz.guess(),
    endDateType: "SpecificDate",
    endDate: "",
    endTime: "",
    relativeDurationType: "",
    relativeDuration: "",
    allowAfterDueDate: false,
    sendTo: "",
    selectType: "",
    enableContentSurvey: false,
    allowComments: false,
    trackScores: false,
    anonymizeScores: false,
    enableAutoEnrollment: false,
    enableProgressReset: false,
    groupDepts: [],
    //users manage
    addCompletedUsers: [],
    removeCompletedUsers: [],
    contents: [],
    //notification templates
    notificationTemplates: [],
  };

  // = moment.tz.names();
  const next = () => setCurrent(current + 1);
  const prev = () => setCurrent(current - 1);
  const [department, setDepartment] = useState([]);
  const [group, setGroup] = useState([]);

  const [users, setUsers] = useState([]);
  const [submitObj, setSubmitObj] = useState<any>(initialValues);
  const loaderContext = useLoader();
  const {showLoader, hideLoader} = loaderContext;
  const notificationContext = useNotification();
  const [contentData, setContentData] = useState<any>([]);
  const [notificationTemplatesSource, setNotificationTemplatesSource] =
    useState<any>([]);
  const handleNotifications: any = notificationContext?.handleNotifications;
  const [contentLoading, setContentLoading] = useState(false);
  useEffect(() => {
    fetchDeptGroup();
  }, []);

  useEffect(() => {
    if (id) fetchProgramDetails();
  }, [id]);
  const fetchProgramDetails = async () => {
    showLoader();
    try {
      let fetchData: any = await axiosInstance.get(
        `${API_ENDPOINTS.CAMPAIGN_GET}/${id}`
      );
      if (fetchData?.settings?.success) {
        let date = dayjs(parseInt(fetchData.data.startDate));
        delete fetchData.data.addedDate;
        delete fetchData.data.modifiedDate;
        delete fetchData.data.timezone;
        console.log("fetchData.data :>> ", fetchData.data);
        let finalObj = {
          ...fetchData.data,
          endDate: fetchData.data.endDate
            ? dayjs(parseInt(fetchData.data.endDate))
            : "",
          startDate: date,
          addCompletedUsers: fetchData.data.users.filter(
            (user: any) => user?.actionType === "Enrolled"
          ),
          removeCompletedUsers: fetchData.data.users.filter(
            (user: any) => user?.actionType === "Removed"
          ),
          emailOverType:
            fetchData.data.emailOverType === null
              ? ""
              : fetchData.data.emailOverType,
          notificationTemplates: fetchData.data.notificationTemplates.map(
            (option: any) => {
              return {
                // ...option,
                notificationType: option.notificationType,
                isUserToggle: option?.userTemplateId ? true : false,
                isManagerToggle: option?.managerTemplateId ? true : false,
                isAdminToggle: option?.adminTemplateId ? true : false,
                userTemplateId: option?.userTemplateId,
                managerTemplateId: option?.managerTemplateId,
                adminTemplateId: option?.adminTemplateId,
              };
            }
          ),
          allowAfterDueDate:
            fetchData.data.allowAfterDueDate === 1 ? true : false,
          enableContentSurvey:
            fetchData.data.enableContentSurvey === 1 ? true : false,
          allowComments: fetchData.data.allowComments === 1 ? true : false,
          trackScores: fetchData.data.trackScores === 1 ? true : false,
          anonymizeScores: fetchData.data.anonymizeScores === 1 ? true : false,
          enableProgressReset:
            fetchData.data.enableProgressReset === 1 ? true : false,
          enableAutoEnrollment:
            fetchData.data.enableAutoEnrollment === 1 ? true : false,
          contents: fetchData.data.contents.map((content: any) => {
            return {
              contentId: content?.contentId,
              isSystem: content?.isSystem === "Yes" ? 1 : 0,
              moduleName: content?.moduleName || "",
              duration: parseInt(content?.duration) || 0,
            };
          }),
          groupDepts:
            fetchData.data.sendTo === "All"
              ? []
              : fetchData.data.groupDepts.map(
                  (groupDept: any) =>
                    groupDept?.departmentId || groupDept?.groupId
                ),
        };
        setSubmitObj(finalObj);
      }
      hideLoader();
    } catch (error) {
      hideLoader();
    }
  };
  const fetchDeptGroup = async () => {
    try {
      showLoader();
      // Fetch department
      const deptGroup: any = await axiosInstance.get(
        `${API_ENDPOINTS.DROPDOWN_LIST_DEPARTMENT}?isAll=No`
      );
      if (deptGroup?.settings?.success) {
        setDepartment(deptGroup?.data);
      }
      // Fetch group
      const groupList: any = await axiosInstance.get(
        `${API_ENDPOINTS.DROPDOWN_LIST_GROUP}?allGroups=No`
      );
      if (groupList?.settings?.success) {
        setGroup(groupList?.data);
      }

      // Time zone listing
      // let timezoneList: any = await axiosInstance.get(
      //   `${API_ENDPOINTS.TIMEZONES}`
      // );
      // if (timezoneList?.settings?.success) {
      //   setTimezones(timezoneList.data);
      // }
      let usersGet: any = await axiosInstance.get(API_ENDPOINTS.USER_DROPDOWN);
      if (usersGet?.settings?.success) {
        setUsers(usersGet.data);
      }
      const notificationTemp: any = await axiosInstance.get(
        `${API_ENDPOINTS.NOTIFICATION_DROPDOWN}?isAll=Yes`
      );
      console.log("notificationTemp.data :>> ", notificationTemp.data);
      if (notificationTemp?.settings?.success) {
        const userDefined = notificationTemp.data.filter(
          (category: any) => category?.isSystemNotificationTemplate === "No"
        );
        const systemDefined = notificationTemp.data.filter(
          (category: any) => category?.isSystemNotificationTemplate === "Yes"
        );
        const groupedOptionsDomain: any = [
          {
            label: (
              <span className="text-[16px] bold">
                User Defined Notification Type
              </span>
            ),
            title: "User Defined Notification Type",
            options: userDefined.map((category: any) => ({
              label: <span>{camelCase(category.templateName)}</span>,
              value: category.notificationTemplateId,
              isSystemNotificationTemplate:
                category.isSystemNotificationTemplate,
            })),
          },
          {
            label: (
              <span className="text-[16px] bold">
                System Defined Notification Type
              </span>
            ),
            title: "System Defined Notification Type",
            options: systemDefined.map((category: any) => ({
              label: <span>{camelCase(category.templateName)}</span>,
              value: category.notificationTemplateId,
              isSystemNotificationTemplate:
                category.isSystemNotificationTemplate,
            })),
          },
        ];
        setNotificationTemplatesSource(groupedOptionsDomain);
      }
      fetchContent();
      hideLoader();
    } catch (error) {
      console.log("error", error);
      hideLoader();
      handleNotifications(
        `error`,
        `Something went wrong in phishing program`,
        ``,
        3
      );
    }
  };
  const fetchContent = async () => {
    setContentLoading(true);
    let fetchContent: any = await axiosInstance.get(
      `${API_ENDPOINTS.ALL_CONTENT_LIST}`
    );
    if (fetchContent?.settings?.success) {
      const groupedOptions = fetchContent.data.map((module: any) => {
        const isSystemDefined = module.data.some(
          (item: any) => item.isSystem === "Yes"
        );
        const label = `${module.moduleName} ${
          module.moduleName === "Policy"
            ? ""
            : `(${isSystemDefined ? "System Defined" : "User Defined"})`
        }`;

        return {
          label: <span className="text-[16px] bold">{label}</span>,
          title: label,
          options: module.data.map((item: any) => ({
            label: (
              <span>
                {item.contentTitle || item.title || item.assessmentTitle}
              </span>
            ),
            value: item.contentId || item.policyId || item.assessmentId,
            isSystem: item.isSystem,
            duration: item?.duration || 0,
            moduleName: module.moduleName,
          })),
        };
      });
      setContentData(groupedOptions);
    }
    setContentLoading(false);
  };

  const StepButton = ({props}: any) => (
    <div>
      <div className="flex justify-between">
        {!(current === 0) && (
          <Button
            onClick={handleBackClick}
            htmlType="submit"
            className="mt-[20px] common-button text-[#4379EE] border border-[#4379EE] !h-[50px] w-[117px] text-[16px] font-[700]"
          >
            Back
          </Button>
        )}
        <Button
          {...props}
          type="primary"
          htmlType="submit"
          className="mt-[20px] common-button bg-[#4379EE] !h-[50px] min-w-[117px] w-fit text-[16px] font-[700]"
        >
          {current === 2 ? (id ? "Update Program " : "Create Program") : "Next"}
        </Button>
      </div>
    </div>
  );

  const onChange = (value: number) => {
    if (current > value) {
      setCurrent(value);
    }
  };
  const fetchCategoriesOfEmailTemplate = async (cat: any) => {
    try {
      let categoryList: any = await axiosInstance.post(
        `${API_ENDPOINTS.DROPDOWN_PHISHING_TEMPLATE}?isAll=Yes`,
        JSON.stringify({
          cat,
        })
      );
      return categoryList.data;
    } catch (error) {
      console.log("error :>> ", error);
    }
  };
  const organizeTemplate = (currentTemplates: any, categoryList: any) => {
    const mergedTemplates = currentTemplates
      ? [...currentTemplates, ...categoryList]
      : [...categoryList];
    const uniqueTemplates = mergedTemplates.filter(
      (template, index, self) =>
        index ===
        self.findIndex(
          (t) => t.phishingTemplateId === template.phishingTemplateId
        )
    );
    // const userDefinedTemplates = uniqueTemplates.filter(
    //   (template: any) => template?.isSystemPhishingTemplate?.toLowerCase() === "no"
    // );
    // const systemDefinedTemplates = uniqueTemplates.filter(
    //   (template: any) => template?.isSystemPhishingTemplate?.toLowerCase() === "yes"
    // );
    // const groupedOptions = [
    //   {
    //     label: (
    //       <span className="text-[16px] bold">
    //         User Defined Destination Page
    //       </span>
    //     ),
    //     title: "User Defined Destination Page",
    //     options: userDefinedTemplates.map((template: any) => ({
    //       label: <span>{template.title}</span>,
    //       value: template.phishingTemplateId,
    //     })),
    //   },
    //   {
    //     label: (
    //       <span className="text-[16px] bold">
    //         System Defined Destination Page
    //       </span>
    //     ),
    //     title: "System Defined Destination Page",
    //     options: systemDefinedTemplates.map((template: any) => ({
    //       label: <span>{template.title}</span>,
    //       value: template.phishingTemplateId,
    //     })),
    //   },
    // ];

    return uniqueTemplates;
  };

  const handleSubmit = async (values: any) => {
    try {
      showLoader();
      if (!values.emailOver) {
        delete values.emailOverType;
        delete values.emailOverNumber;
      }

      delete values.failedGroupId;
      delete values.phishingDropDownTemplates;
      const httpMethod = id ? "put" : "post";

      // let submitObj: any = await axiosInstance.post(
      //   API_ENDPOINTS.CREATE_PHISHING_SIMULATION_PROGRAM,
      //   JSON.stringify(values)
      // );
      if (id) {
        delete values.addedDate;
        delete values.modifiedDate;
        delete values.timezone;
        delete values.domainName;
        delete values?.title;
        delete values?.enrolledGroups;
        delete values?.status;
      }
      const cleanedNotificationTemplates = values.notificationTemplates
        .filter((template: any) => {
          // Remove templates where all these fields are blank
          return (
            template.notificationType ||
            template.userTemplateId ||
            template.managerTemplateId ||
            template.adminTemplateId
          );
        })
        .map((template: any) => {
          // Remove unwanted properties for non-blank templates
          const {isUserToggle, isManagerToggle, isAdminToggle, ...rest} =
            template;
          return rest;
        });
      let objValues = {
        ...values,
        users: [...values.addCompletedUsers, ...values.removeCompletedUsers],
        startDate: dayjs(values?.startDate).valueOf(),
        endDate: values?.endDate ? dayjs(values?.endDate).valueOf() : "",
        notificationTemplates: cleanedNotificationTemplates,
        contents: values.contents.map((template: any) => {
          const {contentTitle, ...rest} = template;
          return rest;
        }),
      };
      delete objValues.addCompletedUsers;
      delete objValues.removeCompletedUsers;

      // return false;
      const submitObj: any = await axiosInstance.request({
        method: httpMethod,
        url: id
          ? `${API_ENDPOINTS.CAMPAIGN_UPDATE}/${id}`
          : API_ENDPOINTS.CAMPAIGN_ADD,
        data: JSON.stringify(objValues),
      });
      if (submitObj?.settings?.success) {
        hideLoader();
        handleNotifications(
          `success`,
          `${submitObj?.settings?.message}`,
          ``,
          3
        );

        router.push("/learning-program");
      }
      hideLoader();
    } catch (error) {
      console.log("error :>> ", error);
      hideLoader();
    }
  };
  const Steps1 = () => {
    return (
      <>
        <Formik
          initialValues={submitObj || initialValues}
          onSubmit={(values) => {
            if (
              values?.endDateType === "SpecificDate" &&
              values.endDate &&
              values.startTime &&
              values.endTime
            ) {
              // Format both dates to compare only the date part
              const startDateFormatted = dayjs(values.startDate).format(
                "YYYY-MM-DD"
              );
              const endDateFormatted = dayjs(values.endDate).format(
                "YYYY-MM-DD"
              );

              if (endDateFormatted === startDateFormatted) {
                // If the dates are the same, compare the times
                const startDateTime = dayjs(
                  `${startDateFormatted} ${values.startTime}`,
                  "YYYY-MM-DD hh:mm A"
                );
                const endDateTime = dayjs(
                  `${endDateFormatted} ${values.endTime}`,
                  "YYYY-MM-DD hh:mm A"
                );

                if (startDateTime.isAfter(endDateTime)) {
                  console.log("true");
                  // Show error notification
                  return handleNotifications(
                    "error",
                    "End Time should be greater than Start Time",
                    "",
                    3
                  );
                }
              }
            }

            setSubmitObj({...values});
            next();
          }}
          enableReinitialize
          validationSchema={addLearningProgramValidationSchema1}
        >
          {({isSubmitting, errors, values, setFieldValue}) => {
            console.log("values :>> ", values);
            return (
              <Form className="px-[98px]">
                <Row gutter={{xs: 8, sm: 16, md: 24, lg: 32}}>
                  <Col className="gutter-row" span={24}>
                    <CustomInput
                      label="Program Name"
                      labelClass=" !text-[16px] !text-[#333]"
                      type={"text"}
                      name="programName"
                      as={Input}
                      size="large"
                      required
                      placeholder="Please Type..."
                      error={<ErrorMessage name="programName" />}
                      status={errors.programName && "error"}
                      maxInput={250}
                    />
                  </Col>
                </Row>

                <div
                  className="flex-col mt-[20px] "
                  // gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
                >
                  <div className="!text-[16px] !text-[#333]">
                    Start Date<span className="text-red-500">*</span>
                  </div>
                  <div className="flex  gap-[20px]">
                    <div className="">
                      <DatePicker
                        className="w-full min-w-[176px] custom-date-time-picker"
                        value={
                          values.startDate ? dayjs(values.startDate) : null
                        } // Handle default value
                        onChange={(date) => {
                          if (date) {
                            const unixTimestamp = dayjs(date).valueOf();
                            setFieldValue("startDate", unixTimestamp);
                          } else {
                            setFieldValue("startDate", null);
                          }
                        }}
                        suffixIcon={
                          <div className="rounded-l-md border flex items-center justify-center w-full">
                            {" "}
                            <DateIcon />
                          </div>
                        }
                        disabledDate={(current) => {
                          const today = dayjs().startOf("day");
                          const selectedEndDate = values.endDate
                            ? dayjs(values.endDate)
                            : null;

                          // If endDate is selected, only allow current date to endDate
                          if (selectedEndDate) {
                            return (
                              current &&
                              (current < today ||
                                current > selectedEndDate.endOf("day"))
                            );
                          } else {
                            // If no endDate is selected, only disable past dates (before today)
                            return current && current < today;
                          }
                        }}
                        format={"MM/DD/YYYY"}
                      />
                      <ErrorMessage name="startDate" component={"div"}>
                        {(msg) => <div className="text-red-500">{msg}</div>}
                      </ErrorMessage>
                    </div>
                    <div className=" min-w-[176px] ">
                      <TimePicker
                        value={
                          values.startTime
                            ? dayjs(values.startTime, "hh:mm A")
                            : null
                        }
                        rootClassName=" h-[38px] custom-date-time-picker  "
                        onChange={(date) => {
                          // convert to milliseconds
                          if (date) {
                            const formattedTime = dayjs(date).format("hh:mm A");
                            setFieldValue("startTime", formattedTime);
                          }
                        }}
                        format="HH:mm A"
                        suffixIcon={
                          <div className="rounded-l-md border flex items-center justify-center w-full">
                            {" "}
                            <TimeIcon />
                          </div>
                        }
                      />
                      <ErrorMessage name="startTime" component={"div"}>
                        {(msg) => <div className="text-red-500">{msg}</div>}
                      </ErrorMessage>
                    </div>
                    <div className=" w-full">
                      <CustomSelect
                        defaultValue={values.timeZoneName}
                        name="timeZoneName"
                        className="!h-[40px]"
                        placeholder="Select Time Zone"
                        options={timezones.map((timezone) => {
                          const offset = timezone.offset.startsWith("-")
                            ? `GMT${timezone.offset}`
                            : `GMT+${timezone.offset}`;
                          return {
                            value: timezone.name,
                            label: `(${offset}) ${timezone.name.replace(
                              "Calcutta",
                              "Kolkata"
                            )}`,
                          };
                        })}
                        error={<ErrorMessage name="timeZoneName" />}
                      />
                    </div>
                  </div>
                </div>
                <div
                  className="flex-col mt-[20px] w-full"
                  // gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
                >
                  <div className="!text-[16px] !text-[#333]">End Date</div>
                  <div className="flex items-center gap-[20px]">
                    <Radio.Group
                      defaultValue={values.endDateType || "SpecificDate"}
                      size="large"
                      name="endDateType"
                      id="endDateType"
                      className="w-full mt-[5px] custom-tab-frequency"
                      onChange={(e) => {
                        console.log("e.target.value :>> ", e.target.value);
                        setFieldValue("endDateType", e.target.value);
                      }}
                    >
                      <Radio.Button
                        className="w-[33.33%] text-center "
                        value="SpecificDate"
                      >
                        Specific Date
                      </Radio.Button>
                      <Radio.Button
                        className="w-[33.33%] text-center "
                        value="RelativeDuration"
                      >
                        Relative Duration
                      </Radio.Button>
                      <Radio.Button
                        className="w-[33.33%] text-center "
                        value="NoEndDate"
                      >
                        No End Date
                      </Radio.Button>
                    </Radio.Group>
                  </div>
                </div>
                {values.endDateType !== "NoEndDate" && (
                  <div
                    className={`rounded-md border border-[#D5D5D5] bg-[#F9F9FB] px-[25px] ${
                      errors?.relativeDuration
                        ? "min-h-[170px] mt-[10px]  py-[25px]"
                        : "mt-[10px] min-h-[130px]  py-[21px]"
                    }`}
                  >
                    {values.endDateType == "SpecificDate" ? (
                      <>
                        <div className="text-[#000] text-[16px] font-[600]">
                          Select Date and Time
                          <span className="text-red-500">*</span>
                        </div>
                        <div className="flex gap-[20px] items-center">
                          <div className="flex flex-col">
                            <DatePicker
                              className="!w-[222px] h-[38px] custom-date-time-picker"
                              value={
                                values.endDate ? dayjs(values.endDate) : null
                              } // Handle default value
                              onChange={(date) => {
                                if (date) {
                                  const unixTimestamp = dayjs(date).valueOf();
                                  setFieldValue("endDate", unixTimestamp);
                                } else {
                                  setFieldValue("endDate", null);
                                }
                              }}
                              suffixIcon={
                                <div className="rounded-l-md border flex items-center justify-center w-full">
                                  {" "}
                                  <DateIcon />
                                </div>
                              }
                              disabledDate={(current: any) => {
                                const startDate = values.startDate
                                  ? dayjs(parseInt(values.startDate)).startOf(
                                      "day"
                                    )
                                  : null;
                                return (
                                  current &&
                                  (current < dayjs().startOf("day") ||
                                    (startDate && current.isBefore(startDate)))
                                );
                              }}
                              format={"MM/DD/YYYY"}
                            />{" "}
                            <ErrorMessage name="endDate" component={"div"}>
                              {(msg) => (
                                <div className="text-red-500">{msg}</div>
                              )}
                            </ErrorMessage>
                          </div>
                          <span className="text-[#4F4F4F] text-[16px] font-[400]">
                            to
                          </span>
                          <div className="flex  items-center">
                            <div className="flex flex-col">
                              <TimePicker
                                value={
                                  values.endTime
                                    ? dayjs(values.endTime, "hh:mm A")
                                    : null
                                }
                                rootClassName="!w-[222px]  custom-date-time-picker"
                                onChange={(date) => {
                                  // convert to milliseconds
                                  if (date) {
                                    const formattedTime =
                                      dayjs(date).format("hh:mm A");
                                    setFieldValue("endTime", formattedTime);
                                  }
                                }}
                                format="HH:mm A"
                                suffixIcon={
                                  <div className="rounded-l-md border flex items-center justify-center w-full">
                                    {" "}
                                    <TimeIcon />
                                  </div>
                                }
                              />
                              <ErrorMessage name="endTime" component={"div"}>
                                {(msg) => (
                                  <div className="text-red-500">{msg}</div>
                                )}
                              </ErrorMessage>
                            </div>
                            <span className="ml-[10px]">
                              {/* <QuestionMarkSuggestion title=" End Date and Time" /> */}
                            </span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-[#000] text-[16px] font-[600]">
                          Relative-Duration
                          <span className="text-red-500">*</span>
                        </div>
                        <div className="flex  gap-[20px]">
                          <div
                            className={`${
                              errors?.relativeDuration
                                ? "!max-w-[134px]"
                                : "!max-w-[80px]"
                            } w-full`}
                          >
                            <Field name="emailOverNumber">
                              {({field}: any) => (
                                <InputNumber
                                  {...field}
                                  defaultValue={values.relativeDuration}
                                  labelClass=" !text-[16px] !text-[#333]"
                                  name="relativeDuration"
                                  className="custom-number-input w-full"
                                  size={"small"}
                                  min={0}
                                  placeholder={"0"}
                                  error={
                                    <ErrorMessage name="relativeDuration" />
                                  }
                                  onChange={(value) => {
                                    setFieldValue("relativeDuration", value);
                                  }}
                                />
                              )}
                            </Field>
                            <ErrorMessage
                              name="relativeDuration"
                              component={"div"}
                            >
                              {(msg) => (
                                <div className="text-red-500 pb-[10px]">
                                  {msg}
                                </div>
                              )}
                            </ErrorMessage>
                            {/* <CustomInput
                              type={"number"}
                              name="relativeDuration"
                              as={Input}
                              size="large"
                              placeholder=""
                              minInput={0}
                              error={<ErrorMessage name="relativeDuration" />}
                              status={errors.relativeDuration && "error"}
                            /> */}
                          </div>
                          <div className="flex  ">
                            <CustomSelect
                              name="relativeDurationType"
                              placeholder="Select Type"
                              defaultValue={values.relativeDurationType}
                              options={[
                                {value: "Days", label: "Days"},
                                {value: "Weeks", label: "Weeks"},
                                {value: "Months", label: "Months"},
                              ]}
                              error={
                                <ErrorMessage name="relativeDurationType" />
                              }
                            />

                            <span className="ml-[10px] flex pt-[7px]">
                              {/* <QuestionMarkSuggestion title="" /> */}
                            </span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}
                {values.endDateType !== "NoEndDate" && (
                  <Row className="flex items-center mt-[23px]">
                    <Checkbox
                      defaultChecked={values.allowAfterDueDate}
                      name="allowAfterDueDate"
                      onChange={(e) => {
                        setFieldValue("allowAfterDueDate", e.target.checked);
                      }}
                    >
                      Allow assignments to be completed after due date{" "}
                    </Checkbox>
                    {/* <QuestionMarkSuggestion title="" /> */}
                  </Row>
                )}
                <StepButton />
              </Form>
            );
          }}
        </Formik>
      </>
    );
  };
  const Steps2 = () => {
    return (
      <>
        <Formik
          initialValues={submitObj || initialValues}
          onSubmit={(values) => {
            setSubmitObj({...values});
            next();
          }}
          enableReinitialize
          validationSchema={addLearningProgramValidationSchema2}
        >
          {({isSubmitting, errors, values, setFieldValue}) => {
            return (
              <Form className="px-[98px]">
                <div
                  className="flex  gap-[10px]"
                  // gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
                >
                  <CustomSelect
                    name="contents"
                    label="Content"
                    required
                    labelClass="!text-[16px] !text-[#333]"
                    mode="multiple"
                    className=""
                    placeholder="Select one or more items from the list"
                    defaultValue={values.contents.map(
                      (item: any) => item.contentId
                    )}
                    options={contentData}
                    error={<ErrorMessage name="contents" />}
                    onSelect={(value: any, opx: any) => {
                      console.log("value,opx :>> ", value, opx);
                      const lastSelectedValue = opx[opx.length - 1];
                      let mapFormate = opx.map((i: any) => ({
                        contentId: i?.value,
                        isSystem: i?.isSystem === "Yes" ? 1 : 0,
                        moduleName: i?.moduleName || "",
                        duration: i?.duration,
                      }));
                      setFieldValue("contents", mapFormate);
                    }}
                    onDeselect={(value: any) => {
                      setFieldValue(
                        "contents",
                        values.contents.filter(
                          (item: any) => item.contentId !== value
                        )
                      );
                    }}
                  />

                  <Button
                    className="refresh-btn mt-[25px]"
                    icon={
                      <MdRefresh className="text-white h-[20px] w-[20px]" />
                    }
                    loading={contentLoading}
                    onClick={fetchContent}
                  ></Button>
                </div>
                <div className="mt-[20px] flex flex-col align-center">
                  <div className="flex items-center gap-[5px]">
                    <Checkbox
                      defaultChecked={values.enableContentSurvey}
                      name="enableContentSurvey"
                      onChange={(e) => {
                        setFieldValue("enableContentSurvey", e.target.checked);
                      }}
                      className="text-[16px] text-[#333333] flex items-center"
                    >
                      Enable Content Survey
                    </Checkbox>
                    <div>{/* <QuestionMarkSuggestion title="" /> */}</div>
                  </div>
                  <div className="h-[50px] rounded-sm bg-[#F2F2F2] items-center px-[20px] py-[15px]">
                    <Checkbox
                      defaultChecked={values.allowComments}
                      name="allowComments"
                      onChange={(e) => {
                        setFieldValue("allowComments", e.target.checked);
                      }}
                      className="text-[16px] text-[#333333]"
                    >
                      Allow user to leave comments
                    </Checkbox>
                  </div>
                </div>
                <div className="mt-[20px] flex items-center justify-between">
                  <div className="flex">
                    <Checkbox
                      defaultChecked={values.trackScores}
                      className="text-[16px] text-[#333333]"
                      name="trackScores"
                      onChange={(e) => {
                        setFieldValue("trackScores", e.target.checked);
                      }}
                    >
                      Track Scores
                    </Checkbox>
                    {/* <QuestionMarkSuggestion title="Track Scores" /> */}
                  </div>
                  <div className="flex">
                    <Checkbox
                      defaultChecked={values.anonymizeScores}
                      className="text-[16px] text-[#333333]"
                      name="anonymizeScores"
                      onChange={(e) => {
                        setFieldValue("anonymizeScores", e.target.checked);
                      }}
                    >
                      Track Replies to Phishing Emails
                    </Checkbox>
                    {/* <QuestionMarkSuggestion title="Track Scores" /> */}
                  </div>
                </div>
                <Row
                  gutter={{xs: 8, sm: 16, md: 24, lg: 32}}
                  className="mt-[20px]"
                >
                  <Col className="gutter-row" span={12}>
                    <CustomSelect
                      label="Send To"
                      name="sendTo"
                      labelClass="!text-[16px] !text-[#333]"
                      placeholder="Send To"
                      defaultValue={values.sendTo}
                      size="large"
                      required
                      options={[
                        {value: "All", label: "All"},
                        {value: "Specific", label: "Specific"},
                      ]}
                      onSelect={(value) => {
                        setFieldValue("sendTo", value);
                        setFieldValue("groupDepts", []);
                      }}
                      error={<ErrorMessage name="sendTo" />}
                    />
                  </Col>
                  <Col className="gutter-row" span={12}>
                    <CustomSelect
                      label="Select Type"
                      labelClass="!text-[16px] !text-[#333]"
                      name="selectType"
                      placeholder="Select Type"
                      required
                      defaultValue={values.selectType}
                      size="large"
                      options={[
                        {value: "Group", label: "Group"},
                        {value: "Department", label: "Department"},
                      ]}
                      onSelect={(value) => {
                        setFieldValue("selectType", value);
                        setFieldValue("groupDepts", []);
                      }}
                      error={<ErrorMessage name="selectType" />}
                    />
                  </Col>
                </Row>
                {values?.sendTo === "Specific" && values?.selectType && (
                  <Row
                    gutter={{xs: 8, sm: 16, md: 24, lg: 32}}
                    className="mt-[20px]"
                  >
                    <Col className="gutter-row" span={12}>
                      <CustomSelect
                        label={
                          <div className="flex items-center">
                            <div>
                              {values?.selectType === "Department"
                                ? "Department"
                                : "Group"}
                            </div>
                            {/* <QuestionMarkSuggestion
                              title={`${
                                values?.selectType === "Department"
                                  ? "Department"
                                  : "Group"
                              } selection`}
                              size={16}
                            /> */}
                          </div>
                        }
                        labelClass="!text-[16px] !text-[#333]"
                        mode="multiple"
                        name="groupDepts"
                        placeholder={
                          values?.selectType === "Department"
                            ? "Select Department"
                            : "Select Group"
                        }
                        defaultValue={values.groupDepts}
                        size="large"
                        options={
                          values?.selectType === "Department"
                            ? department.map((option: any) => ({
                                value: option.departmentId,
                                label: option.departmentName,
                              }))
                            : group.map((option: any) => ({
                                value: option.groupId,
                                label: option.groupName,
                              }))
                        }
                        onSelect={(value) => {
                          setFieldValue("groupDepts", value);
                        }}
                        // error={<ErrorMessage name="groupDepts" />}
                      />
                      <ErrorMessage name="groupDepts" component={"div"}>
                        {(msg) => (
                          <div className="text-red-500">{`${
                            values?.selectType === "Department"
                              ? "Department is required"
                              : "Group is required"
                          }`}</div>
                        )}
                      </ErrorMessage>
                    </Col>
                  </Row>
                )}
                <StepButton />
              </Form>
            );
          }}
        </Formik>
      </>
    );
  };
  const initialFormValues = useMemo(
    () => submitObj || initialValues,
    [submitObj, initialValues]
  );

  const Steps3 = () => {
    // const debouncedFetchCatEmailTemplate = useCallback(
    //   debounce(fetchCatEmailTemplate, 300),
    //   []
    // );
    return (
      <Formik
        initialValues={initialFormValues}
        onSubmit={handleSubmit}
        enableReinitialize
        validationSchema={addLearningProgramValidationSchema3}
      >
        {({isSubmitting, errors, values, setFieldValue, setFieldTouched}) => {
          return (
            <Form className="px-[98px]">
              <Row className="mt-[20px] flex-col w-full ">
                <Checkbox
                  defaultChecked={values.enableAutoEnrollment}
                  name="enableAutoEnrollment"
                  onChange={(e) => {
                    setFieldValue("enableAutoEnrollment", e.target.checked);
                  }}
                  className="text-[16px] text-[#333333]"
                >
                  <span className="flex">
                    {" "}
                    Enable automatic enrollment for new users{" "}
                    {/* <QuestionMarkSuggestion title="Enable automatic enrollment for new users" /> */}
                  </span>
                </Checkbox>
                <div className="h-[50px] rounded-sm bg-[#F2F2F2] !items-center px-[20px] py-[15px] mt-[10px]">
                  <Checkbox
                    defaultChecked={values.enableProgressReset}
                    name="enableProgressReset"
                    onChange={(e) => {
                      setFieldValue("enableProgressReset", e.target.checked);
                    }}
                    className="!text-[16px] text-[#333333]"
                  >
                    <span className="flex">
                      Enable progress reset for remedial training{" "}
                      {/* <QuestionMarkSuggestion title="Enable automatic enrollment for new users" /> */}
                    </span>
                  </Checkbox>
                </div>
              </Row>

              <div className="mt-[20px] flex w-full items-center">
                <div className="w-full">
                  <CustomSelect
                    label="Add Completed Users To"
                    labelClass="!text-[16px] !text-[#333]"
                    mode="multiple"
                    name="addCompletedUsers"
                    placeholder="Select one or more items from the list"
                    defaultValue={values.addCompletedUsers.map(
                      (user: any) => user.userId
                    )}
                    size="large"
                    options={users
                      .filter(
                        (option: any) =>
                          !values.removeCompletedUsers?.some(
                            (user: any) => user.userId === option.userId
                          )
                      ) // Exclude users being removed
                      .map((option: any) => ({
                        value: option.userId,
                        label: `${camelCase(option.name)} (${option.email})`,
                      }))}
                    onSelect={(value, px) => {
                      console.log("value :>> ", value, px);
                      const lastSelectedValue = value[value.length - 1];

                      setFieldValue("addCompletedUsers", [
                        ...values.addCompletedUsers,
                        {
                          userId: lastSelectedValue,
                          actionType: "Enrolled",
                        },
                      ]);
                    }}
                    onDeselect={(value: any) => {
                      setFieldValue(
                        "addCompletedUsers",
                        values.addCompletedUsers.filter(
                          (user: any) => user.userId !== value
                        )
                      );
                    }}
                    error={<ErrorMessage name="addCompletedUsers" />}
                  />
                </div>
                <div className="mt-[25px]  ml-[10px] flex items-center">
                  {/* <QuestionMarkSuggestion title="Select one or more items from the list" /> */}
                </div>
              </div>
              <div className="mt-[20px] flex w-full items-center">
                <div className="w-full">
                  <CustomSelect
                    label="Remove Completed Users From"
                    labelClass="!text-[16px] !text-[#333]"
                    mode="multiple"
                    name="removeCompletedUsers"
                    placeholder="Select one or more items from the list"
                    defaultValue={values.removeCompletedUsers.map(
                      (user: any) => user.userId
                    )}
                    size="large"
                    options={users
                      .filter(
                        (option: any) =>
                          !values.addCompletedUsers.some(
                            (user: any) => user.userId === option.userId
                          )
                      ) // Exclude added users
                      .map((option: any) => ({
                        value: option.userId,
                        label: `${camelCase(option.name)} (${option.email})`,
                      }))}
                    onDeselect={(value: any) => {
                      setFieldValue(
                        "removeCompletedUsers",
                        values.removeCompletedUsers.filter(
                          (user: any) => user.userId !== value
                        )
                      );
                    }}
                    onSelect={(value) => {
                      const lastSelectedValue = value[value.length - 1];

                      setFieldValue("removeCompletedUsers", [
                        ...values.removeCompletedUsers,
                        {
                          userId: lastSelectedValue,
                          actionType: "Removed",
                        },
                      ]);
                    }}
                    error={<ErrorMessage name="removeCompletedUsers" />}
                  />
                </div>
                <div className="mt-[25px] ml-[10px] flex items-center">
                  {/* <QuestionMarkSuggestion title="Select one or more items from the list" /> */}
                </div>
              </div>
              <div className="mt-[20px] flex-col">
                <div className="text-[#333333] text-[16px] font-[400] leading-[24px]">
                  Training Email Notification Selection
                </div>
                <Button
                  className="mt-[5px] mb-[30px] w-fit rounded-[4px] border border-[#4379EE] text-[#4379EE] text-[16px] flex justify-center items-center cursor-pointer h-[40px]"
                  onClick={() => {
                    setFieldValue("notificationTemplates", [
                      ...values.notificationTemplates,
                      {
                        notificationType: "",
                        isUserToggle: false,
                        isManagerToggle: false,
                        isAdminToggle: false,
                        userTemplateId: "",
                        managerTemplateId: "",
                        adminTemplateId: "",
                      },
                    ]);
                  }}
                >
                  <PlusOutlined />
                  Add Notification
                </Button>
              </div>
              {values.notificationTemplates.length > 0 && (
                <>
                  <FieldArray name="notificationTemplates">
                    {({push, remove}) => (
                      <>
                        {values.notificationTemplates.map(
                          (option: any, index: number) => (
                            <div
                              key={index}
                              className="rounded-[4px] border border-[#D5D5D5] bg-[#F9F9FB] px-[30px] py-[21px] mb-[20px]"
                            >
                              <div className="text-[#000] text-[16px] font-[600] mb-[36px]">
                                Add Automatic Learning Notification
                              </div>

                              <div className="flex flex-col">
                                <div className="flex items-center gap-[20px]">
                                  <div className="text-[16px] text-[#333] text-nowrap">
                                    Notification Type
                                  </div>
                                  <CustomSelect
                                    className="flex"
                                    placeholder="Select Notification Type"
                                    options={notificationTypesDropdown}
                                    name={`notificationTemplates[${index}].notificationType`}
                                    defaultValue={
                                      values.notificationTemplates[index]
                                        ?.notificationType
                                    }
                                  />
                                </div>

                                <Divider className="custom-divider-menu" />

                                <div className="text-[16px] text-[#333]">
                                  Select Recipients and Template
                                </div>
                                <div className="flex flex-col">
                                  <div className="flex items-center gap-[10px] py-[10px]">
                                    <Col span={3} className="flex items-center">
                                      <Checkbox
                                        className="text-[16px] text-[#333]"
                                        defaultChecked={
                                          values.notificationTemplates[index]
                                            ?.isUserToggle
                                        }
                                        onChange={(e) =>
                                          setFieldValue(
                                            `notificationTemplates[${index}].isUserToggle`,
                                            e.target.checked
                                          )
                                        }
                                      >
                                        Users
                                      </Checkbox>
                                    </Col>
                                    <Col
                                      span={21}
                                      className="flex items-center"
                                    >
                                      {/* <QuestionMarkSuggestion title="Notification Type" /> */}
                                      <CustomSelect
                                        placeholder="Select Template"
                                        options={notificationTemplatesSource}
                                        defaultValue={
                                          values.notificationTemplates[index]
                                            ?.userTemplateId
                                        }
                                        disabled={
                                          !values.notificationTemplates[index]
                                            ?.isUserToggle
                                        }
                                        name={`notificationTemplates[${index}].userTemplateId`}
                                        onSelect={(value, opx) => {
                                          setFieldValue(
                                            `notificationTemplates[${index}].userTemplateId`,
                                            value
                                          );
                                          setFieldValue(
                                            `notificationTemplates[${index}].isSystemUserTemplate`,
                                            opx?.isSystemNotificationTemplate ===
                                              "Yes"
                                              ? 1
                                              : 0
                                          );
                                        }}
                                      />
                                    </Col>
                                  </div>

                                  {/* Manager Section */}
                                  <div className="flex items-center gap-[10px] py-[10px]">
                                    <Col span={3} className="flex items-center">
                                      {" "}
                                      <Checkbox
                                        className="text-[16px] text-[#333]"
                                        defaultChecked={
                                          values.notificationTemplates[index]
                                            ?.isManagerToggle
                                        }
                                        onChange={(e) =>
                                          setFieldValue(
                                            `notificationTemplates[${index}].isManagerToggle`,
                                            e.target.checked
                                          )
                                        }
                                      >
                                        Manager
                                      </Checkbox>
                                    </Col>
                                    <Col
                                      span={21}
                                      className="flex items-center"
                                    >
                                      {/* <QuestionMarkSuggestion title="Notification Type" /> */}
                                      <CustomSelect
                                        defaultValue={
                                          values.notificationTemplates[index]
                                            ?.managerTemplateId
                                        }
                                        placeholder="Select Template"
                                        options={notificationTemplatesSource}
                                        name={`notificationTemplates[${index}].managerTemplateId`}
                                        disabled={
                                          !values.notificationTemplates[index]
                                            ?.isManagerToggle
                                        }
                                        onSelect={(value, opx) => {
                                          setFieldValue(
                                            `notificationTemplates[${index}].managerTemplateId`,
                                            value
                                          );
                                          setFieldValue(
                                            `notificationTemplates[${index}].isSystemManagerTemplate`,
                                            opx?.isSystemNotificationTemplate ===
                                              "Yes"
                                              ? 1
                                              : 0
                                          );
                                        }}
                                      />
                                    </Col>
                                  </div>

                                  {/* Admin Section */}
                                  <div className="flex items-center gap-[10px] py-[10px]">
                                    <Col span={3} className="flex items-center">
                                      <Checkbox
                                        className="text-[16px] text-[#333]"
                                        defaultChecked={
                                          values.notificationTemplates[index]
                                            ?.isAdminToggle
                                        }
                                        onChange={(e) =>
                                          setFieldValue(
                                            `notificationTemplates[${index}].isAdminToggle`,
                                            e.target.checked
                                          )
                                        }
                                      >
                                        Admin
                                      </Checkbox>
                                    </Col>
                                    <Col
                                      span={21}
                                      className="flex items-center"
                                    >
                                      {/* <QuestionMarkSuggestion title="Notification Type" /> */}
                                      <CustomSelect
                                        placeholder="Select Template"
                                        defaultValue={
                                          values.notificationTemplates[index]
                                            ?.adminTemplateId
                                        }
                                        options={notificationTemplatesSource}
                                        name={`notificationTemplates[${index}].adminTemplateId`}
                                        disabled={
                                          !values.notificationTemplates[index]
                                            ?.isAdminToggle
                                        }
                                        onSelect={(value, opx) => {
                                          setFieldValue(
                                            `notificationTemplates[${index}].adminTemplateId`,
                                            value
                                          );
                                          setFieldValue(
                                            `notificationTemplates[${index}].isSystemAdminTemplate`,
                                            opx?.isSystemNotificationTemplate ===
                                              "Yes"
                                              ? 1
                                              : 0
                                          );
                                        }}
                                      />
                                    </Col>
                                  </div>
                                </div>
                              </div>

                              <div className="flex  mt-[20px]">
                                {/* <Button
                                  type="primary"
                                  className="common-button bg-[#313D4F] hover:!bg-[#313D4F] !h-[40px] !w-[84px] text-[16px] font-[700]"
                                  onClick={() => {
                                    setFieldValue(
                                      "notificationTemplates",
                                      values.notificationTemplates
                                    );
                                  }}
                                >
                                  Save
                                </Button> */}

                                <Button
                                  type="default"
                                  onClick={() => remove(index)}
                                  className="flex items-center border-[#313D4F] gap-[5px] text-[#313D4F] hover:!text-[#313D4F] "
                                >
                                  <QuestionMinusIcon color={"#313D4F"} /> Remove
                                </Button>
                              </div>
                            </div>
                          )
                        )}

                        {/* Add Button
                        <Button
                          type="dashed"
                          onClick={() =>
                            push(initialValues.notificationTemplates[0])
                          }
                        >
                          + Add Notification Template
                        </Button> */}
                      </>
                    )}
                  </FieldArray>
                </>
              )}
              <StepButton />
            </Form>
          );
        }}
      </Formik>
    );
  };

  const steps: any = [
    {
      title: "Schedule",
      content: <Steps1 />,
    },
    {
      title: "Details",
      content: <Steps2 />,
    },
    {
      title: "Settings",
      content: <Steps3 />,
    },
  ];

  const handleBackClick = () => {
    if (current === 1) {
      setCurrent(0);
    } else if (current === 2) {
      setCurrent(1);
    } else {
      router.push("/learning-program");
    }
  };

  return (
    <div>
      <Space className="pt-[10px] pb-[30px]">
        <div className="cursor-pointer" onClick={handleBackClick}>
          <BackArrowIcon />
        </div>
        <div className="text-gray-700 text-[24px] font-[700] leading-6">
          {id ? "Edit" : "Create New"} Learning Program
        </div>
      </Space>
      <Steps
        onChange={onChange}
        current={current}
        items={steps}
        className="custom-steps"
        labelPlacement="vertical"
      />
      <div className="">
        <Card>
          <div>{steps[current].content}</div>
        </Card>
      </div>
      {/* <CommonModal
        isOpen={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          // setSelectedSweetTooth([]);
        }}
        onOk={() => {
          setIsModalVisible(false);
        }}
        footer={false}
        centered={true}
        closable={true}
        maskClosable={true}
        width={1000}
        title={
          <div className="text-[24px] font-[700]">
            Add Automatic Training Notification
          </div>
        }
      > */}{" "}
      {/* </CommonModal> */}
    </div>
  );
};
export default AddUpdateLearningProgram;
