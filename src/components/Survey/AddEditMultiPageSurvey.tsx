import BackArrowIcon from "@/src/components/Icons/BackArrowIcon";
import {addUpdateSurveyValidationSchema} from "@/src/helper/ValidationSchema";
import axiosInstance from "@/src/interceptors/Axios";
import {API_ENDPOINTS} from "@/src/interceptors/apiName";
import {Button, Card, Input, Select, Space, Typography} from "antd";
import {ErrorMessage, Field, FieldArray, Form, Formik} from "formik";
import {useRouter} from "next/router";
import {FC, useEffect, useState} from "react";
import {useNotification} from "../Notification";
import {useLoader} from "../Loader/LoaderProvider";
import CustomInput from "../CustomInput";
import CustomDropdownIcon from "../Icons/CustomDropdownIcon";
import CheckMarkIcon from "../Icons/CheckMarkIcon";
import SurveyFeedback from "../Icons/SurveyFeedbackIcon";
import MultiChoiceIcon from "../Icons/MultiChoiceIcon";
import QuestionMinusIcon from "../Icons/QuestionMinusIcon";
import QuestionPlusIcon from "../Icons/QuestionPlusIcon";
import QuestionCirclePlusIcon from "../Icons/QuestionCirclePlusIcon";

type AddEditSurveyProps = {
  id?: string | string[] | undefined;
  multiPage?: boolean;
};
type optionDataType = {
  optionData?: string;
};

type Question = {
  question: string;
  questionType:
    | ""
    | "Yes or No"
    | "Feedback Question (text)"
    | "Multiple Choice";
  options?: optionDataType[];
};

type Survey = {
  surveyTitle: string;
  questions: Question[];
};

const initialValues: Survey = {
  surveyTitle: "",
  questions: [{question: "", questionType: ""}],
};
const AddEditMultiPageSurvey: FC<AddEditSurveyProps> = ({
  id,
  multiPage = false,
}) => {
  const router = useRouter();
  const {Text} = Typography;
  const {Option} = Select;
  const notificationContext = useNotification();
  const handleNotifications: any = notificationContext?.handleNotifications;

  const [surveyDetails, setSurveyDetails] = useState(null);
  const [multiPageConfiguration, setMultiPageConfiguration] = useState<any>(2);
  const [currentPage, setCurrentPage] = useState(1);
  const loaderContext = useLoader();
  const {showLoader, hideLoader} = loaderContext;
  const getSurveyDetails = async () => {
    const getSurvey: any = await axiosInstance.get(
      `${API_ENDPOINTS.GET_SURVEY_DETAILS}/${id}`
    );
    if (getSurvey?.settings?.success) {
      setSurveyDetails(getSurvey?.data);
    }
  };
  useEffect(() => {
    if (id) getSurveyDetails();
  }, [id]);

  useEffect(() => {
    fetchMultiPageConfiguration();
  }, []);

  const fetchMultiPageConfiguration = async () => {
    try {
      showLoader();
      let fetchConfiguration: any = await axiosInstance.get(
        `${API_ENDPOINTS.USER_IDENTITY}`
      );
      if (fetchConfiguration?.settings?.success) {
        setMultiPageConfiguration(fetchConfiguration?.data?.multiPageLimit);
      }
      hideLoader();
    } catch (error) {
      hideLoader();
    }
  };

  const handleSubmit = async (values: Survey | any) => {
    try {
      hideLoader();

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
        data: JSON.stringify({...values, isMultiPage: true}),
      });
      if (surveyAdd.settings?.success) {
        handleNotifications("success", surveyAdd?.settings?.message, "", 3);
        router.push("/surveys");
      }
      hideLoader();
    } catch (error) {
      hideLoader();
    }
  };

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
          <div className="text-gray-700 text-[24px] font-[700] leading-6">
            {/* {isEditing ? 'Edit Domain' : 'Add Domain'} */}
            {!id ? "Create New Survey" : "Edit Survey"}
          </div>
        </Space>
        <div className="flex items-center">
          <Formik
            initialValues={surveyDetails || initialValues}
            validationSchema={addUpdateSurveyValidationSchema}
            onSubmit={async (values, {setErrors, validateForm}) => {
              const errors = await validateForm();
              const errorKeys = Object.keys(errors);
              if (errorKeys.length > 0) {
                // Find the first question with an error
                const firstErrorKey = errorKeys.find((key) =>
                  key.startsWith("questions[")
                );
                if (firstErrorKey) {
                  // Extract the question index from the key
                  const match = firstErrorKey.match(/\[(\d+)\]/);
                  const questionIndex = match ? parseInt(match[1], 10) : 0;

                  // Calculate the page number based on multiPageConfiguration
                  const errorPage =
                    Math.floor(questionIndex / multiPageConfiguration) + 1;
                  console.log("errorPage :>> ", errorPage);
                  setCurrentPage(errorPage); // Redirect to the error page
                }
              } else {
                // No errors, proceed with submission
                handleSubmit(values);
              }
            }}
            enableReinitialize
          >
            {({
              isSubmitting,
              errors,
              values,
              setFieldValue,
              validateForm,
              setFieldTouched,
            }) => {
              const startIndex = (currentPage - 1) * multiPageConfiguration;
              const endIndex = Math.min(
                startIndex + multiPageConfiguration,
                values.questions.length
              );

              const questionsToShow = values.questions.slice(
                startIndex,
                endIndex
              );
              const showNextButton =
                questionsToShow.length === multiPageConfiguration;

              const canAddNewQuestion =
                questionsToShow.length < multiPageConfiguration;
              console.log("errors", errors);
              const getErrorPage = () => {
                if (!errors.questions) return currentPage; // No errors

                const firstErrorIndex = values.questions.findIndex(
                  (_, index) => errors.questions?.[index]
                );

                if (firstErrorIndex === -1) return currentPage; // No error found in questions

                // Determine the page of the first error
                return Math.floor(firstErrorIndex / multiPageConfiguration) + 1;
              };
              return (
                <Form className="w-full">
                  <Card className="custom-card !py-[18px] !pb-[0px] !pt-[0px] !h-[93px] ">
                    <div className="flex items-center px-[2px] w-full space-x-[34px]">
                      <div className="text-[16px] font-[400] text-[#333] text-nowrap">
                        Survey Title<span className="text-red-500">*</span>
                      </div>
                      <div className="w-full">
                        <CustomInput
                          name="surveyTitle"
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
                  <Card className="custom-card !py-[18px] !pb-[0px] !pt-[0px] mt-[20px] !px-[0px] ">
                    <FieldArray name="questions">
                      {({push, remove}) => (
                        <>
                          {questionsToShow.map((question, index) => {
                            const globalIndex = startIndex + index;
                            return (
                              <Card
                                key={globalIndex}
                                className={`!bg-[#F9F9FB] custom-card !py-[18px] !pb-[0px] !pt-[0px] !px-[0px] mt-[20px] ${
                                  questionsToShow.length > 1 &&
                                  "survey-question-card"
                                }`}
                              >
                                <div className="flex h-[60px]">
                                  <div className="px-[20px] text-[16px] font-[700] text-[#333] max-w-[146px] w-full items-center flex justify-center rounded-l-md border border-[#E8E8E8] bg-[#F2F2F2]">
                                    Question {globalIndex + 1}
                                  </div>
                                  <CustomInput
                                    className="w-full survey-input !h-[60px] flex justify-start items-center px-[20px] mt-0 !border rounded-none !border-[#E8E8E8]"
                                    name={`questions[${globalIndex}].question`}
                                    type="text"
                                    as={Input}
                                    error={
                                      <ErrorMessage
                                        name={`questions[${globalIndex}].question`}
                                      />
                                    }
                                    size="large"
                                    placeholder="Enter your question..."
                                    maxInput={255}
                                  />
                                  <div className="w-[100%] max-w-[249px]">
                                    <Field
                                      name={`questions[${globalIndex}].questionType`}
                                    >
                                      {({field}: any) => (
                                        <Select
                                          {...field}
                                          suffixIcon={<CustomDropdownIcon />}
                                          className="custom-select-dropdown relative max-w-[249px] w-full !h-[60px] !rounded-none border-remove items-center"
                                          placeholder="Select Question Type"
                                          onChange={(value) => {
                                            setFieldValue(
                                              `questions[${globalIndex}].questionType`,
                                              value
                                            );
                                            if (value === "Multiple Choice") {
                                              setFieldValue(
                                                `questions[${globalIndex}].options`,
                                                [{optionData: ""}]
                                              );
                                            } else {
                                              setFieldValue(
                                                `questions[${globalIndex}].options`,
                                                []
                                              ); // Clear options if not Multiple Choice
                                            }
                                          }}
                                        >
                                          <Option value="">
                                            Select Question Type
                                          </Option>
                                          <Option value="Yes or No">
                                            <div className="flex items-center gap-[8px] truncate">
                                              <CheckMarkIcon /> Yes or No
                                            </div>
                                          </Option>
                                          <Option value="Feedback Question (text)">
                                            <div className="flex items-center gap-[8px] truncate">
                                              <SurveyFeedback /> Feedback
                                              Question (text)
                                            </div>
                                          </Option>
                                          <Option value="Multiple Choice">
                                            <div className="flex items-center gap-[8px] truncate">
                                              <MultiChoiceIcon /> Multiple
                                              Choice
                                            </div>
                                          </Option>
                                        </Select>
                                      )}
                                    </Field>
                                    <ErrorMessage
                                      name={`questions[${globalIndex}].questionType`}
                                    >
                                      {(msg) => (
                                        <div className="text-red-500">
                                          {msg}
                                        </div>
                                      )}
                                    </ErrorMessage>
                                  </div>
                                </div>

                                {question.questionType ===
                                  "Multiple Choice" && (
                                  <>
                                    <FieldArray
                                      name={`questions[${globalIndex}].options`}
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
                                                  name={`questions[${globalIndex}].options[${optionIndex}].optionData`}
                                                  type="text"
                                                  as={Input}
                                                  error={
                                                    <ErrorMessage
                                                      name={`questions[${globalIndex}].options[${optionIndex}].optionData`}
                                                    />
                                                  }
                                                  defaultValue={
                                                    option?.optionData || ""
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
                                                  {(question.options?.length ??
                                                    0) < 5 &&
                                                    question.options?.length ===
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
                                  </>
                                )}
                                {values.questions.length > 1 && (
                                  <Button
                                    type="link"
                                    onClick={() => {
                                      remove(globalIndex);
                                      if (
                                        questionsToShow.length === 1 &&
                                        currentPage > 1
                                      ) {
                                        setCurrentPage(currentPage - 1);
                                      }
                                    }}
                                    className="mt-[10px]"
                                  >
                                    Remove Question
                                  </Button>
                                )}
                              </Card>
                            );
                          })}

                          {canAddNewQuestion && (
                            <div className="h-[137px] flex justify-center items-center w-full rounded-md border border-[#E8E8E8] bg-[#F5F6FA] mt-[30px]">
                              <div className="flex flex-col items-center justify-center">
                                <span
                                  className="flex h-[50px] px-[32px] py-[16px] items-center gap-2 cursor-pointer rounded-lg border border-[#263A67]"
                                  onClick={() => {
                                    push({
                                      question: "",
                                      questionType: "",
                                      options: [],
                                    });
                                  }}
                                >
                                  <QuestionCirclePlusIcon /> New Question
                                </span>
                                <span className="mt-[17px] text-[16px] text-[#263A67]">
                                  <span className="font-[600]">or</span> Copy
                                  and paste questions
                                </span>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </FieldArray>
                    <div className="mY-[30px] flex justify-center gap-[30px] items-center">
                      {multiPageConfiguration - 1 < values.questions.length &&
                        currentPage !== 1 && (
                          <Button
                            loading={isSubmitting}
                            type="link"
                            size="large"
                            // disabled= {Object.keys(errors).length > 0}
                            className="ml-[30px]"
                            onClick={() => setCurrentPage(currentPage - 1)}
                          >
                            Back
                          </Button>
                        )}
                      {showNextButton && (
                        <Button
                          loading={isSubmitting}
                          type="primary"
                          size="large"
                          className="custom-heading-btn text-[#fff] !bg-[#313D4F] !w-[150px] form"
                          onClick={async (e) => {
                            e.preventDefault();

                            // Validate the form and log errors
                            await validateForm();

                            // Mark fields as touched
                            await Promise.all([
                              setFieldTouched("surveyTitle"),
                              ...(values.questions?.map((question, index) => {
                                if (question) {
                                  return Promise.all([
                                    setFieldTouched(
                                      `questions[${index}].question`
                                    ),
                                    setFieldTouched(
                                      `questions[${index}].questionType`
                                    ),
                                    ...(question.options?.map(
                                      (_, optionIndex) =>
                                        setFieldTouched(
                                          `questions[${index}].options[${optionIndex}].optionData`
                                        )
                                    ) || []),
                                  ]);
                                }
                              }) || []),
                            ]);

                            // Find the page of the first error and redirect if necessary
                            const errorPage = getErrorPage();
                            if (
                              Object.keys(errors).length > 0 &&
                              errorPage !== currentPage
                            ) {
                              setCurrentPage(errorPage); // Redirect to page with the first error
                            } else {
                              if (
                                showNextButton &&
                                startIndex + multiPageConfiguration ===
                                  values.questions.length
                              ) {
                                setFieldValue("questions", [
                                  ...values.questions,
                                  {
                                    question: "",
                                    questionType: "",
                                    options: [],
                                  },
                                ]);
                              }
                              setCurrentPage(currentPage + 1);
                            }
                          }}
                        >
                          Next
                        </Button>
                      )}
                      <Button
                        loading={isSubmitting}
                        onClick={() => {
                          let err = getErrorPage();
                          console.log("err :>> ", err);
                          if (err) {
                            setCurrentPage(err);
                          }
                        }}
                        type="primary"
                        htmlType="submit"
                        size="large"
                        className="custom-heading-btn !w-[150px] form my-[5px]"
                      >
                        {id ? "Update" : "Create"} Survey
                      </Button>
                    </div>
                  </Card>
                </Form>
              );
            }}
          </Formik>
        </div>
      </div>
    </>
  );
};
export default AddEditMultiPageSurvey;
