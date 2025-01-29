import BackArrowIcon from "@/src/components/Icons/BackArrowIcon";
import {addUpdateSurveyValidationSchema} from "@/src/helper/ValidationSchema";
import {Button, Card, Input, Modal, Select, Space, Typography} from "antd";
import {ErrorMessage, Field, FieldArray, Form, Formik} from "formik";
import {useRouter} from "next/router";
import {FC, useEffect, useState} from "react";
import {useNotification} from "../Notification";
import axiosInstance from "@/src/interceptors/Axios";
import {API_ENDPOINTS} from "@/src/interceptors/apiName";
import CustomInput from "../CustomInput";
import CustomDropdownIcon from "../Icons/CustomDropdownIcon";
import SurveyFeedback from "../Icons/SurveyFeedbackIcon";
import MultiChoiceIcon from "../Icons/MultiChoiceIcon";
import CheckMarkIcon from "../Icons/CheckMarkIcon";
import QuestionMinusIcon from "../Icons/QuestionMinusIcon";
import QuestionPlusIcon from "../Icons/QuestionPlusIcon";
import QuestionCirclePlusIcon from "../Icons/QuestionCirclePlusIcon";

type AddEditSurveyProps = {
  id?: string | string[] | undefined;
  multiPage?: boolean;
};
type QuestionOption = {
  option: string;
};

type Question = {
  question: string;
  questionType:
    | ""
    | "Yes or No"
    | "Feedback Question (text)"
    | "Multiple Choice";
  options?: [];
};

type Survey = {
  surveyTitle: string;
  questions: Question[];
};

const initialValues: Survey = {
  surveyTitle: "",
  questions: [{question: "", questionType: ""}],
};
const AddEditSurvey: FC<AddEditSurveyProps> = ({id, multiPage = false}) => {
  const router = useRouter();
  const {Text} = Typography;
  const {Option} = Select;
  const notificationContext = useNotification();
  const handleNotifications: any = notificationContext?.handleNotifications;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [pastedQuestions, setPastedQuestions] = useState("");
  const [surveyDetails, setSurveyDetails] = useState();
  const [multiPageConfiguration, setMultiPageConfiguration] =
    useState<any>(null);
  const getSurveyDetails = async () => {
    const getSurvey: any = await axiosInstance.get(
      `${API_ENDPOINTS.GET_SURVEY_DETAILS}/${id}`
    );
    if (getSurvey?.settings?.success) {
      console.log("getSurvey :>> ", getSurvey);
      setSurveyDetails(getSurvey?.data);
    }
  };
  useEffect(() => {
    if (id) getSurveyDetails();
  }, [id]);

  useEffect(() => {
    if (multiPage) {
      fetchMultiPageConfiguration();
    }
  }, [multiPage]);

  const fetchMultiPageConfiguration = async () => {
    try {
      let fetchConfiguration: any = await axiosInstance.get(
        `${API_ENDPOINTS.USER_IDENTITY}`
      );
      if (fetchConfiguration?.settings?.success) {
        setMultiPageConfiguration(fetchConfiguration?.data?.multiPageLimit);
      }
    } catch (error) {}
  };
  const handleCopyQuestions = (questions: Question[]) => {
    if (navigator.clipboard) {
      const questionsJSON = JSON.stringify(questions, null, 2);
      navigator.clipboard
        .writeText(questionsJSON)
        .then(() => {
          handleNotifications(
            "success",
            "Questions copied to clipboard",
            "",
            3
          );
        })
        .catch((err) => {
          handleNotifications(
            "error",
            "Failed to copy questions to clipboard",
            "",
            3
          );
          console.error("Failed to copy: ", err);
        });
    } else {
      handleNotifications(
        "error",
        "Clipboard API not supported in this environment",
        "",
        3
      );
    }
  };

  const handlePasteQuestions = (setFieldValue: any) => {
    try {
      const parsedQuestions = JSON.parse(pastedQuestions);
      if (Array.isArray(parsedQuestions)) {
        setFieldValue("questions", parsedQuestions);
        setIsModalVisible(false);
        handleNotifications("success", "Questions pasted successfully", "", 3);
      } else {
        handleNotifications(
          "error",
          "Invalid format. Please check your input.",
          "",
          3
        );
      }
    } catch (error) {
      handleNotifications(
        "error",
        "Failed to parse questions. Please check your input.",
        "",
        3
      );
    }
  };

  const handleSubmit = async (values: Survey | any) => {
    const httpMethod = id ? "put" : "post";
    if (id) {
      delete values.addedDate;
      delete values.addedBy;
      delete values.isDeleted;
      delete values.modifiedDate;
      delete values.updatedBy;
    }
    const surveyAdd: any = await axiosInstance.request({
      method: httpMethod,
      url: id
        ? `${API_ENDPOINTS.UPDATE_SURVEY_DETAILS}/${id}`
        : API_ENDPOINTS.SURVEY_ADD,
      data: JSON.stringify(values),
    });
    if (surveyAdd.settings?.success) {
      handleNotifications("success", surveyAdd?.settings?.message, "", 3);
      router.push("/surveys");
    }
  };

  console.log("surveyDetails", surveyDetails);
  return (
    <>
      <div>
        <Space className="pt-[10px] pb-[30px]">
          <div
            className="cursor-pointer"
            onClick={() => router.push("/surveys")}
          >
            <BackArrowIcon />
          </div>
          <Text className="text-gray-700 text-[24px] font-semibold leading-6">
            {/* {isEditing ? 'Edit Domain' : 'Add Domain'} */}
            {!id ? "Create New Survey" : "Edit Survey"}
          </Text>
        </Space>
        <div className="flex items-center">
          <Formik
            initialValues={surveyDetails || initialValues}
            validationSchema={addUpdateSurveyValidationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({isSubmitting, errors, resetForm, values, setFieldValue}) => {
              console.log("errors :>> ", values, errors);
              return (
                <Form className="w-full">
                  <Card className="custom-card !py-[18px] !pb-[0px] !pt-[0px] !px-[0px] !h-[93px] ">
                    <div className="flex items-center px-[2px]   w-full space-x-[34px]">
                      <div className="text-[16px] font-[400] text-[#333] text-nowrap">
                        Survey Title<span className="text-red-500">*</span>
                      </div>

                      <div className="w-full ">
                        <CustomInput
                          name="surveyTitle"
                          // label="Survey Title"
                          // required
                          type="text"
                          as={Input}
                          size="large"
                          placeholder="Enter your survey title"
                          error={<ErrorMessage name="surveyTitle" />}
                          maxInput={255}
                        />
                      </div>
                    </div>
                  </Card>

                  <Card
                    className={`custom-card  !py-[18px] !pb-[0px] !pt-[0px] mt-[20px] !px-[0px] ${
                      values?.questions?.length > 1 && "survey-question-card"
                    }`}
                  >
                    <FieldArray name="questions">
                      {({push, remove}) => (
                        <>
                          {values.questions.map((question, index) => (
                            <Card
                              key={index}
                              className="!bg-[#F9F9FB] custom-card  !py-[18px] !pb-[0px] !pt-[0px] !px-[0px] mt-[20px]"
                            >
                              <div className="flex h-[60px]">
                                <div className="px-[20px] text-[16px] font-[700] text-[#333] max-w-[146px] w-full items-center flex justify-center rounded-l-md border border-[#E8E8E8] bg-[#F2F2F2]">
                                  Question {index + 1}
                                </div>
                                <CustomInput
                                  className="w-full survey-input !h-[60px] flex justify-start items-center px-[20px] mt-0 !border rounded-none !border-[#E8E8E8]"
                                  name={`questions[${index}].question`}
                                  type="text"
                                  as={Input}
                                  error={
                                    <ErrorMessage
                                      name={`questions[${index}].question`}
                                    />
                                  }
                                  size="large"
                                  placeholder="Enter your question..."
                                  maxInput={255}
                                />
                                <div className="w-[100%] max-w-[249px]">
                                  <Field
                                    name={`questions[${index}].questionType`}
                                  >
                                    {({field}: any) => (
                                      <Select
                                        {...field}
                                        suffixIcon={<CustomDropdownIcon />}
                                        className="custom-select-dropdown relative max-w-[249px] w-full !h-[60px] !rounded-none border-remove items-center"
                                        placeholder="Select Question Type"
                                        onChange={(value) => {
                                          setFieldValue(
                                            `questions[${index}].questionType`,
                                            value
                                          );
                                          if (value === "Multiple Choice") {
                                            setFieldValue(
                                              `questions[${index}].options`,
                                              [{optionData: ""}]
                                            );
                                          } else {
                                            setFieldValue(
                                              `questions[${index}].options`,
                                              []
                                            ); // Clear options if not Multiple Choice
                                          }
                                        }}
                                        // id={`questions[${index}].questionType`}
                                      >
                                        <Option value={""}>
                                          Select Question Type
                                        </Option>
                                        <Option value="Yes or No">
                                          <div className="flex items-center gap-[8px] truncate">
                                            <CheckMarkIcon /> Yes or No
                                          </div>
                                        </Option>
                                        <Option value="Feedback Question (text)">
                                          <div className="flex items-center gap-[8px] truncate">
                                            <SurveyFeedback /> Feedback Question
                                            (text)
                                          </div>
                                        </Option>
                                        <Option value="Multiple Choice">
                                          <div className="flex items-center gap-[8px] truncate">
                                            <MultiChoiceIcon />
                                            Multiple Choice
                                          </div>
                                        </Option>
                                      </Select>
                                    )}
                                  </Field>
                                  <ErrorMessage
                                    name={`questions[${index}].questionType`}
                                  >
                                    {(msg) => (
                                      <div className="text-red-500">{msg}</div>
                                    )}
                                  </ErrorMessage>
                                </div>
                              </div>

                              {question.questionType === "Multiple Choice" && (
                                <FieldArray
                                  name={`questions[${index}].options`}
                                >
                                  {({
                                    push: pushOption,
                                    remove: removeOption,
                                  }) => (
                                    <div className="mt-[20px]">
                                      {question.options?.map(
                                        (option, optionIndex) => (
                                          <div
                                            key={optionIndex}
                                            className="flex items-center mt-[10px]"
                                          >
                                            <CustomInput
                                              className="w-full !h-[50px] flex justify-start items-center px-[20px] mt-0 !border rounded-none !border-[#E8E8E8]"
                                              name={`questions[${index}].options[${optionIndex}].optionData`}
                                              type="text"
                                              as={Input}
                                              error={
                                                <ErrorMessage
                                                  name={`questions[${index}].options[${optionIndex}].optionData`}
                                                />
                                              }
                                              size="large"
                                              placeholder="Enter an answer choice"
                                              maxInput={255}
                                            />
                                            <div className="flex items-center">
                                              <span
                                                onClick={() =>
                                                  removeOption(optionIndex)
                                                }
                                                className="ml-[10px] cursor-pointer"
                                              >
                                                <QuestionMinusIcon />
                                              </span>
                                              {question.options?.length ==
                                                optionIndex + 1 && (
                                                <span
                                                  onClick={() =>
                                                    pushOption({
                                                      optionData: "",
                                                    })
                                                  }
                                                  className="ml-[10px] cursor-pointer"
                                                >
                                                  <QuestionPlusIcon />
                                                </span>
                                              )}
                                            </div>
                                          </div>
                                        )
                                      )}
                                    </div>
                                  )}
                                </FieldArray>
                              )}
                              {values.questions.length > 1 && (
                                <Button
                                  type="link"
                                  onClick={() => remove(index)}
                                  className="mt-[10px]"
                                >
                                  Remove Question
                                </Button>
                              )}
                            </Card>
                          ))}
                          <div className="h-[137px] flex justify-center items-center w-full rounded-md border border-[#E8E8E8] bg-[#F5F6FA] mt-[30px]">
                            <div className="flex flex-col items-center justify-center">
                              <span
                                className="flex h-[50px] px-[32px] py-[16px] items-center gap-2 cursor-pointer rounded-lg border border-[#263A67]"
                                onClick={() =>
                                  push({
                                    question: "",
                                    questionType: "",
                                    options: [],
                                  })
                                }
                              >
                                <QuestionCirclePlusIcon /> New Question
                              </span>
                              <span className="mt-[17px] text-[16px] text-[#263A67]">
                                <span className="font-[600]">or</span> Copy and
                                paste questions
                              </span>
                              {/* <Button
                            type="link"
                            onClick={() => handleCopyQuestions(values.questions)}
                            className="mt-[10px]"
                          >
                            Copy Questions
                          </Button>
                          <Button
                            type="link"
                            onClick={() => setIsModalVisible(true)}
                            className="mt-[10px]"
                          >
                            Paste Questions
                          </Button> */}
                            </div>
                          </div>
                        </>
                      )}
                    </FieldArray>
                    <div className="my-[30px] flex justify-center items-center">
                      <Button
                        loading={isSubmitting}
                        type="link"
                        size="large"
                        className="ml-[30px]"
                        onClick={() => router.push("/surveys")}
                      >
                        Cancel
                      </Button>
                      <Button
                        loading={isSubmitting}
                        type="primary"
                        htmlType="submit"
                        size="large"
                        className="custom-heading-btn !w-[150px] form"
                      >
                        {id ? "Update" : "Create"} Survey
                      </Button>
                    </div>
                  </Card>
                  <Modal
                    title="Paste Questions"
                    open={isModalVisible}
                    onOk={() => handlePasteQuestions(setFieldValue)}
                    onCancel={() => setIsModalVisible(false)}
                  >
                    <Input.TextArea
                      rows={4}
                      value={pastedQuestions}
                      onChange={(e) => setPastedQuestions(e.target.value)}
                      placeholder="Paste your JSON formatted questions here..."
                    />
                  </Modal>
                </Form>
              );
            }}
          </Formik>
        </div>
      </div>
    </>
  );
};
export default AddEditSurvey;
