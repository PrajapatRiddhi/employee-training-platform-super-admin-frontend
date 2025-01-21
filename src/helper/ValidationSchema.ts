import * as Yup from "yup";
import validator from "validator";
import moment from "moment";
import parsePhoneNumber from "libphonenumber-js";

let commonMessage =
  "Password must be 8 characters long with at least one uppercase letter, one special character and one number.";

export const loginSchema = Yup.object().shape({
  username: Yup.string()
    .required("Enter your username")
    .email("Enter your valid username")
    .test(
      "no-spaces",
      "user name should not contain only spaces",
      (value) => !/^\s+$/.test(value)
    ),
  password: Yup.string().required("Enter your password"),
});
export const forgotPasswordValidationSchema = Yup.object().shape({
  email: Yup.string()
    .required("Enter your email")
    .email("Enter your valid email")
    .test("is-valid-email", "Invalid email format", (value) =>
      validator.isEmail(value)
    ),
});

export const companyProfileValidationSchema = Yup.object().shape({
  companyName: Yup.string(),
  companyEmail: Yup.string()
    .required("Enter your email")
    .email("Enter your valid email")
    .test("is-valid-email", "Invalid email format", (value) =>
      validator.isEmail(value)
    ),
  address: Yup.string().required("Enter your address "),
  city: Yup.string().required("Enter your city"),
  state: Yup.string().required("Enter your state"),
  country: Yup.string().required("Enter your country"),
});

export const companySupportSchema = Yup.object().shape({
  companyName: Yup.string().required("Enter your company name"),
  companyEmail: Yup.string()
    .required("Enter your email")
    .email("Enter your valid email")
    .test("is-valid-email", "Invalid email format", (value) =>
      validator.isEmail(value)
    ),
  contactNumber: Yup.string()
    .required("Enter your contact number")
    .matches(/^\d+$/, "Contact number must contain only digits")
    .min(10, "Contact number must be at least 10 digits")
    .max(15, "Contact number must not exceed 15 digits"),
  message: Yup.string()
    .required("Enter your message")
    .matches(/^\S.*$/, "Message cannot be blank or start with a space"),
});

export const companyProfileAPIKeyValidationSchema = Yup.object().shape({
  apiKey: Yup.string().required("Enter your API key"),
  postmanCollection: Yup.string()
    .required("Enter postman collection link address")
    .test("is-valid-url", "Enter a valid URL", (value) =>
      validator.isURL(value)
    ),
});
export const addUpdateDomainValidationSchema = Yup.object().shape({
  domain: Yup.string().required("Enter your domain"),
  subDomain: Yup.string()
    .required("Enter your sub domain")
    .matches(/^\S.*$/, "Sub domain cannot be blank or start with a space"),
});
export const addUpdatePhishingTemplateValidationSchema = Yup.object().shape({
  templateName: Yup.string()
    .required("Enter the template name")
    .max(250, "Template name cannot be longer than 250 characters")
    .matches(/^\S.*$/, "Template name cannot be blank or start with a space"),
  senderEmail: Yup.string()
    .required("Enter the sender email")
    .email("Enter a valid email address")
    .test("is-valid-email", "Invalid email format", (value) =>
      validator.isEmail(value)
    ),
  senderName: Yup.string()
    .required("Enter the sender name")
    .matches(/^\S.*$/, "Sender  name cannot be blank or start with a space"),

  replyToName: Yup.string()
    .required("Enter the reply to name")
    .matches(/^\S.*$/, "Reply to name cannot be blank or start with a space"),
  replyToEmail: Yup.string()
    .required("Enter the reply to email")
    .email("Enter the valid email")
    .test("is-valid-email", "Invalid email format", (value) =>
      validator.isEmail(value)
    ),
  subject: Yup.string()
    .required("Enter the subject")
    .matches(/^\S.*$/, "Subject cannot be blank or start with a space"),
  landingPageId: Yup.string().required("Select the destination page "),
  domainId: Yup.string().required("Select the destination domain"),
  categoryId: Yup.string().required("Select the category"),
  difficultyRating: Yup.string().required("Select the difficulty rating"),
  fileContent: Yup.string().required("Enter the file content"),
});

export const CategoriesValidationSchema = Yup.object().shape({
  categoryName: Yup.string()
    .required("Enter category name")
    .matches(/^\S.*$/, "Category name cannot be blank or start with a space"),
  categoryType: Yup.string().required("Enter your category type"),
});

export const companyPhishingDestinationValidationSchema = Yup.object().shape({
  title: Yup.string()
    .required("Enter title name")
    .matches(/^\S.*$/, "Title name cannot be blank or start with a space"),
  content: Yup.string()
    .required("Enter your content")
    .test(
      "no-leading-trailing-space",
      "Content cannot have leading or trailing spaces",
      (value) => {
        // Check for unwanted spaces or special characters
        const cleanedValue = value.replace(/&nbsp;/g, "").trim();
        return cleanedValue.length > 0; // Ensure content is not just empty or whitespace
      }
    ),
});

export const mergeUserValidation = Yup.object().shape({
  targetUserId: Yup.string().required("Select target user"),
  mergeUserId: Yup.string().required("Select merge user"),
});

export const updateUserRiskBooster = Yup.object().shape({
  user: Yup.string().required("Select user name"),
  email: Yup.string().required("Enter Email"),
  firstName: Yup.string().required("Enter firstName"),
  lastName: Yup.string().required("Enter lastName"),
  riskPorgress: Yup.string().required("Select riskPorgress"),
});

export const CourseValidationSchema = Yup.object().shape({
  courseTitle: Yup.string()
    .required("Enter Content Title")
    .matches(/^\S.*$/, "Content title cannot be blank or start with a space"),
  courseType: Yup.string().required("Select  Content Type"),
  description: Yup.string()
    .required("Enter your description")
    .matches(/^\S.*$/, "Description cannot be blank or start with a space"),
  duration: Yup.number()
    .typeError("Duration must be a number")
    .required("Enter your duration")
    .integer("No decimals allowed")
    .min(1, "Duration must be a positive number")
    .max(99, "Duration cannot exceed 99"),
  // image: Yup.mixed()
  //   .required("Cover image is required")
  //   .test(
  //     "fileSize",
  //     "The file size should be less than or equal to 10MB",
  //     (value: any) => {
  //       return value && value.size <= 10 * 1024 * 1024;
  //     }
  //   ),
  // categoryId: Yup.string().required("Select your category"),
});

export const ContentValidationSchema = Yup.object().shape({
  contentTitle: Yup.string().required("Enter Content Title"),
  contentType: Yup.string().required("Select  Content Type"),
  duration: Yup.number()
    .typeError("Duration must be a number")
    .required("Enter your duration")
    .min(1, "Duration must be a positive number")
    .max(9, "Duration must be a single digit"),
});
interface PhishingProgramFormValues {
  programName: string;
  sendTo: string;
  selectType?: string;
  groupDeptIds: string[];
  frequency: string;
}
export const addPhishingProgramValidationSchema1 = Yup.object().shape({
  programName: Yup.string()
    .required("Program name is required")
    .matches(/^\S.*$/, "Program name cannot be blank or start with a space")
    .max(250, "Program name cannot be longer than 250 characters"),
  sendTo: Yup.string().required("Send to is required"),
  selectType: Yup.string().required("Select type is required"),
  // groupDeptIds: Yup.array().required("Group/Department ID is required"),
  groupDeptIds: Yup.array().when(["sendTo", "selectType"], {
    is: (sendTo: string, selectType: string) =>
      sendTo !== "All" &&
      (selectType === "Department" || selectType === "Group"),
    then: (schema) =>
      schema.required().min(1, `At least one selection is required`),
    otherwise: (schema) => schema.notRequired(),
  }),
  // groupDeptIds: Yup.array().required("Field is required").min(1, "At least one selection is required"),
  frequency: Yup.string().required("Frequency is required"),
});

export const addPhishingProgramValidationSchema2 = Yup.object().shape({
  startDate: Yup.string().required("Start date is required"),
  startTime: Yup.string().required("Start time is required"),
  timeZoneName: Yup.string().required("Time zone is required"),

  emailOver: Yup.string().optional(),
  emailOverNumber: Yup.number().when(
    "emailOver",
    (endDateType: any, schema: any) => {
      console.log("endDateType :>> ", endDateType);
      return endDateType[0] === "1"
        ? schema
            .required("Email over number is required")
            .min(1, "Count must be greater than 0")
        : schema;
      // emailOverNumber: Yup.number()
      // .nullable()
      // .when('emailOver', {
      //   is: (emailOver: any) => emailOver && emailOver[0] === '1',
      //   then: (schema) => schema.required("Email over number is required"),
      //   otherwise: (schema) => schema.notRequired(),
    }
  ),
  emailOverType: Yup.string().when(
    "emailOver",
    (emailOver: any, schema: any) => {
      return emailOver[0] === 1 || emailOver[0] === "1"
        ? schema.required("Email over type is required")
        : schema.notRequired(); // optional if emailOver is not 1
    }
  ),
  isTrackReplies: Yup.boolean().required("This field is required"),
  trackNumber: Yup.number()
    .required("Track user behavior is required")
    .min(1, "The count must be greater than 0"),
  trackPeriod: Yup.string().required("Tracker send period is required"),
});

export const addPhishingProgramValidationSchema3 = Yup.object().shape({
  // categories: Yup.array()
  //   .required("Category is required")
  //   .min(1, "At least one category is required"),
  difficultyRating: Yup.string().required("Difficulty rating is required"),
  phishingTemplates: Yup.array()
    .required("Email template  is required")
    .min(1, "At least email template is required"),
  landingPageId: Yup.string().required("Landing page is required"),
  domainId: Yup.string().required("Domain is required"),
});
const uniqueOptions = (options: any) => {
  const seen = new Set();
  return options.every((option: any) => {
    const duplicate = seen.has(option.optionData);
    seen.add(option.optionData);
    return !duplicate; // Return true if it's not a duplicate
  });
};

// export const addUpdateSurveyValidationSchema = Yup.object().shape({
//   surveyTitle: Yup.string()
//     .required("Survey title is required")
//     .max(250, "Survey title cannot be longer than 250 characters"),
//   questions: Yup.array()
//     .of(
//       Yup.object().shape({
//         question: Yup.string()
//           .required("Question is required")
//           .max(250, "Question cannot be longer than 250 characters"),
//         questionType: Yup.string()
//           .required("Question type is required")
//           .oneOf(
//             ["Yes or No", "Feedback Question (text)", "Multiple Choice"],
//             "Invalid question type"
//           ),
//         options: Yup.array()
//           .of(
//             Yup.object().shape({
//               optionData: Yup.string()
//                 .required("Option text is required")
//                 .max(250, "Option text cannot be longer than 250 characters"),
//             })
//           )
//           .nullable() // Allow null or undefined for non-Multiple Choice types
//           .when("questionType", {
//             is: "Multiple Choice",
//             then: (schema) =>
//               schema
//                 .min(2, "At least two options are required for multiple choice")
//                 .required("Options are required for multiple choice questions")
//                 .test('unique-options', 'Options must be unique', function (options) {
//                   return uniqueOptions(options);
//                 }),
//             otherwise: (schema) => schema.notRequired(),
//           }),
//       })
//     )
//     .min(1, "At least one question is required")
//     .required("Questions are required"),
// });
export const addUpdateSurveyValidationSchema = Yup.object().shape({
  surveyTitle: Yup.string()
    .required("Survey title is required")
    .max(250, "Survey title cannot be longer than 250 characters")
    .matches(/^\S.*$/, "Survey title cannot be blank or start with a space"),
  questions: Yup.array()
    .of(
      Yup.object().shape({
        question: Yup.string()
          .required("Question is required")
          .max(250, "Question cannot be longer than 250 characters")
          .matches(/^\S.*$/, "Question cannot be blank or start with a space"),
        questionType: Yup.string()
          .required("Question type is required")
          .oneOf(
            ["Yes or No", "Feedback Question (text)", "Multiple Choice"],
            "Invalid question type"
          ),
        options: Yup.array()
          .of(
            Yup.object().shape({
              optionData: Yup.string()
                .required("Option text is required")
                .max(250, "Option text cannot be longer than 250 characters")
                .matches(
                  /^(?!\s*$).+$/,
                  "Option text cannot be blank or only spaces"
                ),
            })
          )
          .nullable() // Allow null or undefined for non-Multiple Choice types
          .when("questionType", {
            is: "Multiple Choice",
            then: (schema) =>
              schema
                .min(2, "At least two options are required for multiple choice")
                .required("Options are required for multiple choice questions")
                .test(
                  "unique-options",
                  "Options must be unique",
                  function (options) {
                    return uniqueOptions(options);
                  }
                ),
            otherwise: (schema) => schema.notRequired(),
          }),
      })
    )
    .min(1, "At least one question is required")
    .required("Questions are required"),
});

export const addUpdateAssessmentValidationSchema = Yup.object().shape({
  assessmentTitle: Yup.string()
    .required("Assessment title is required")
    .max(255, "Assessment title cannot be longer than 255 characters")
    .matches(
      /^\S.*$/,
      "Assessment title cannot be blank or start with a space"
    ),
  questions: Yup.array()
    .of(
      Yup.object().shape({
        question: Yup.string()
          .required("Question is required")
          .max(500, "Question cannot be longer than 500 characters")
          .matches(/^\S.*$/, "Question cannot be blank or start with a space"),
        questionType: Yup.string()
          .required("Question type is required")
          .oneOf(
            ["Yes or No", "Checkbox", "Multiple Choice"],
            "Invalid question type"
          ),
        correctAnswer: Yup.string().required("Correct answer is required"),
        correctAnsToggle: Yup.boolean().required("Correct answer is required"),
        options: Yup.array()
          .of(
            Yup.object().shape({
              optionData: Yup.string()
                .required("Option text is required")
                .max(255, "Option text cannot be longer than 255 characters")
                .matches(
                  /^\S.*$/,
                  "Option text cannot be blank or start with a space"
                ),
            })
          )
          .nullable() // Allow null or undefined for non-Multiple Choice types
          .when("questionType", {
            is: "Multiple Choice",
            then: (schema) =>
              schema
                .min(2, "At least two options are required for multiple choice")
                .required("Options are required for multiple choice questions"),
            otherwise: (schema) => schema.notRequired(),
          })
          .when("questionType", {
            is: "Checkbox",
            then: (schema) =>
              schema
                .min(2, "At least two options are required for multiple choice")
                .required("Options are required for multiple choice questions"),
            otherwise: (schema) => schema.notRequired(),
          }),
      })
    )
    .min(1, "At least one question is required")
    .required("Questions are required"),
});

export const NotficationTemplateSchema = Yup.object().shape({
  subject: Yup.string()
    .required("Enter the subject")
    .matches(/^\S.*$/, "Subject cannot be blank or start with a space"),
  templateName: Yup.string()
    .required("Enter the template name")
    .matches(/^\S.*$/, "Template name cannot be blank or start with a space"),
  senderName: Yup.string()
    .required("Enter the sender Name")
    .matches(/^\S.*$/, "Sender name cannot be blank or start with a space"),
  content: Yup.string().required("Enter the content"),

  senderEmail: Yup.string()
    .required("Enter the email address")
    .email("Enter your valid email address")
    .test(
      "no-spaces",
      "user name should not contain only spaces",
      (value) => !/^\s+$/.test(value)
    ),
});

export const PolicySchema = Yup.object().shape({
  title: Yup.string()
    .required("Enter Your title")
    .matches(/^\S.*$/, "Title cannot be blank or start with a space"),
  document: Yup.string().required("Upload a PDF file"),
  startDate: Yup.string().required("Select  start date"),
  endDate: Yup.string().required("Select end date"),
  description: Yup.string().required("Enter your description"),
});

export const DepartmentSchema = Yup.object().shape({
  departmentName: Yup.string()
    .required("Department name is required")
    .matches(/^\S.*$/, "Department cannot be blank or start with a space"),
});

export const verifyOtpPasswordValidationSchema = Yup.object().shape({
  otpCode: Yup.string()
    .matches(/^\d+$/, "OTP must contain only numbers")
    .matches(/^\d{6}$/, "Must be exactly 6 digits")
    .required("OTP is required"),
});
export const resetPasswordValidationSchema = Yup.object().shape({
  password: Yup.string()
    .required("Enter your new password.")
    .min(8, commonMessage)
    .max(16, commonMessage)
    .matches(/[0-9]/, commonMessage)
    .matches(/[a-z]/, commonMessage)
    .matches(/[A-Z]/, commonMessage)
    .matches(/[^\w]/, commonMessage),
  confirmPassword: Yup.string()
    .required("Re-enter new your password.")
    .oneOf(
      [Yup.ref("password")],
      `New Password and Confirm Password doesn't match.`
    ),
});

export const addLearningProgramValidationSchema1 = Yup.object().shape({
  programName: Yup.string()
    .required("Program name is required")
    .max(250, "Program name cannot be longer than 250 characters")
    .matches(/^\S.*$/, "Program name cannot be blank or start with a space"),
  startDate: Yup.string().required("Start date is required"),
  startTime: Yup.string().required("Start time is required"),
  timeZoneName: Yup.string().required("Time zone is required"),
  endDateType: Yup.string().required("End type is required"),
  endDate: Yup.string().when("endDateType", (endDateType: any, schema: any) => {
    return endDateType[0] === "SpecificDate"
      ? schema.required("End date is required")
      : schema;
  }),
  // endTime: Yup.string().required("End time is required"),
  // endTime: Yup.string().when("endDateType", (endDateType: any, schema: any) => {
  //   return endDateType[0] === "SpecificDate"
  //     ? schema.required("End time is required")
  //     : schema.nullable().notRequired();
  // }),

  endTime: Yup.string().when(
    ["endDateType", "startDate", "endDate", "startTime"],
    (values, schema) => {
      const [endDateType, startDate, endDate, startTime] = values;
      if (endDateType[0] === "SpecificDate") {
        console.log("endDateType :>> ", endDateType);
        return schema
          .required("End time is required")
          .test(
            "is-greater",
            "End time must be greater than start time",
            function (value) {
              const {startTime, startDate, endDate} = this.parent;
              console.log(startDate, endDate);
              if (startDate === endDate) {
                return moment(value, "HH:mm").isAfter(
                  moment(startTime, "HH:mm")
                );
              }
              return true; // No need to compare times if the dates are different
            }
          );
      } else {
        return schema.nullable().notRequired();
      }
    }
  ),

  // relativeDurationType:"",
  relativeDurationType: Yup.string().when(
    "endDateType",
    (endDateType: any, schema: any) => {
      return endDateType[0] === "RelativeDuration"
        ? schema.required("Duration type is required")
        : schema;
    }
  ),
  relativeDuration: Yup.number().when(
    "endDateType",
    (endDateType: any, schema: any) => {
      return endDateType[0] === "RelativeDuration"
        ? schema
            .required("Duration number is required")
            .min(1, "Duration greater than 0")
            .integer("No decimals allowed")
        : schema;
    }
  ),

  // allowAfterDueDate optional
});
export const addLearningProgramValidationSchema2 = Yup.object().shape({
  contents: Yup.array().min(1, "Content is required"),
  sendTo: Yup.string().required("Select send to is required"),
  selectType: Yup.string().required("Select type is required"),
  // groupDepts:Yup.array().when("sendTo", (sendTo: any, schema: any) => {
  //   console.log('sendTo :>> ', sendTo);
  //   return sendTo[0] !== "All"
  //     ? schema.required("User or Group is required")
  //     : schema;
  // }),
  groupDepts: Yup.array().when("sendTo", (sendTo: any, schema: any) => {
    return sendTo[0] === "Specific"
      ? schema.min(1, "User or Group is required")
      : schema.notRequired();
  }),
  // enrollUsersType:
});

export const addLearningProgramValidationSchema3 = Yup.object().shape({
  addCompletedUsers: Yup.array().optional(),
  removeCompletedUsers: Yup.array().optional(),
  notificationTemplates: Yup.array().optional(),
  //notification templates
  notificationType: Yup.string().optional(),
  userTemplateId: Yup.string().optional(),
  managerTemplateId: Yup.string().optional(),
  adminTemplateId: Yup.string().optional(),
});

export const addSurveyProgramValidationSchema1 = Yup.object().shape({
  programName: Yup.string()
    .required("Survey program name is required")
    .max(250, "Survey program name cannot be longer than 250 characters")
    .matches(/^\S.*$/, "Survey program cannot be blank or start with a space"),
  startDate: Yup.string().required("Start date is required"),
  startTime: Yup.string().required("Start time is required"),
  timeZoneName: Yup.string().required("Time zone is required"),
  endDateType: Yup.string().required("End type is required"),
  endDate: Yup.string().when("endDateType", (endDateType: any, schema: any) => {
    return endDateType[0] === "SpecificDate"
      ? schema.required("End date is required")
      : schema;
  }),

  endTime: Yup.string().when("endDateType", (endDateType: any, schema: any) => {
    return endDateType[0] === "SpecificDate"
      ? schema.required("End time is required")
      : schema.nullable().notRequired();
  }),

  relativeDurationType: Yup.string().when(
    "endDateType",
    (endDateType: any, schema: any) => {
      return endDateType[0] === "RelativeDuration"
        ? schema.required("Duration type is required")
        : schema;
    }
  ),
  relativeDuration: Yup.number().when(
    "endDateType",
    (endDateType: any, schema: any) => {
      return endDateType[0] === "RelativeDuration"
        ? schema
            .required("Duration number is required")
            .min(1, "Duration greater than 0")
            .integer("No decimals allowed")
        : schema;
    }
  ),

  // allowAfterDueDate optional
});
export const addSurveyProgramValidationSchema2 = Yup.object().shape({
  surveyProgramAssociations: Yup.array()
    .required("Survey is required")
    .min(1, "At least one survey is required"),
});

export const addSurveyProgramValidationSchema3 = Yup.object().shape({
  userType: Yup.string().required("Select type is required"),
  selectedType: Yup.string().required("Send to  is required"),
  // surveyProgramUsers: Yup.array().required("Select program users is required"),
  surveyProgramUsers: Yup.array().when(
    "selectedType",
    (selectedType: any, schema: any) => {
      return selectedType[0] === "Specific"
        ? schema
            .min(1, "Select program users is required")
            .required("Select program users is required")
        : schema.nullable().notRequired();
    }
  ),
});

export const addAssessmentProgramValidationSchema1 = Yup.object().shape({
  programName: Yup.string()
    .required("Assessment program name is required")
    .matches(
      /^\S.*$/,
      "Assessment program cannot be blank or start with a space"
    ),
  startDate: Yup.string().required("Start date is required"),
  startTime: Yup.string().required("Start time is required"),
  timeZoneName: Yup.string().required("Time zone is required"),
  endDateType: Yup.string().required("End type is required"),
  // endDate:  Yup.string().when('endDatetype', (endDatetype: any, schema:any) => {
  //   return endDatetype === 'SpecificDate'
  //     ? schema.required("End date is required")
  //     : schema;
  // }),
  // // endTime: Yup.string().required("End time is required"),
  // endTime: Yup.string().when('endDatetype', (endDatetype: any, schema:any) => {
  //   return endDatetype === 'SpecificDate'
  //     ? schema.required("End time is required")
  //     : schema;
  // }),
  endDate: Yup.string().when("endDateType", (endDateType: any, schema: any) => {
    return endDateType[0] === "SpecificDate"
      ? schema.required("End date is required")
      : schema;
  }),

  endTime: Yup.string().when("endDateType", (endDateType: any, schema: any) => {
    return endDateType[0] === "SpecificDate"
      ? schema.required("End time is required")
      : schema.nullable().notRequired();
  }),

  // Conditionally validate relativeDurationType and relativeDuration if endDateType is "RelativeDuration"
  relativeDurationType: Yup.string().when(
    "endDateType",
    (endDateType: any, schema: any) => {
      return endDateType[0] === "RelativeDuration"
        ? schema.required("Duration type is required")
        : schema.nullable().notRequired();
    }
  ),

  relativeDuration: Yup.number().when(
    "endDateType",
    (endDateType: any, schema: any) => {
      return endDateType[0] === "RelativeDuration"
        ? schema
            .required("Duration number is required")
            .min(1, "Duration greater than 0")
            .integer("No decimals allowed")
        : schema;
    }
  ),
  // allowAfterDueDate optional
});
export const addAssessmentProgramValidationSchema2 = Yup.object().shape({
  assessmentProgramAssociations: Yup.array()
    .required("Assessment is required")
    .min(1, "At least one assessment is required"),
});

export const addAssessmentProgramValidationSchema3 = Yup.object().shape({
  userType: Yup.string().required("Send to is required"),
  selectedType: Yup.string().required("Select type is required"),
  assessmentProgramUsers: Yup.array().when(
    "selectedType",
    (selectedType: any, schema: any) => {
      return selectedType[0] === "Specific"
        ? schema
            .min(1, "Selection enroll is required")
            .required("Selection enroll is required")
        : schema.nullable().notRequired();
    }
  ),
});

export const userProfileValidationSchema = Yup.object().shape({
  firstName: Yup.string().required("Enter Your first name"),
  lastName: Yup.string().required("Enter Your last name"),
  phoneNumber: Yup.string().required("Enter the phone number"),
  address: Yup.string().required("Enter your address "),
  city: Yup.string().required("Enter your city"),
  stateId: Yup.string().required("Enter your state"),
  countryId: Yup.string().required("Enter your country"),
  departmentId: Yup.string().required("Department is required"),
  phoneNumberWithDial: Yup.string(),
  phoneFormat: Yup.string().test({
    test: (value, context) => {
      const phoneNumber = parsePhoneNumber(
        context.parent.phoneNumberWithDial ?? ""
      );

      if (!value) {
        return true;
      }
      return phoneNumber?.isValid();
    },
    message: "Invalid phone number",
  }),
});

export const changePawValidationSchema = Yup.object().shape({
  oldPassword: Yup.string().required("Enter your current password"),
  newPassword: Yup.string()
    .required("Enter your new password")
    .notOneOf(
      [Yup.ref("oldPassword")],
      "New password cannot be the same as current password"
    ),
  confirmPassword: Yup.string()
    .required("Confirm your new password")
    .oneOf(
      [Yup.ref("newPassword")],
      "Confirm Password must be the same as New Password"
    ),
});

export const createUserSchema = Yup.object().shape({
  firstName: Yup.string()
    .required("Enter the first name")
    .matches(/^\S.*$/, "First name cannot be blank or start with a space"),
  email: Yup.string()
    .required("Enter a valid email")
    .test("valid-email", "Enter a valid email address", (value) => {
      if (!value) return false;
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return emailRegex.test(value.trim());
    }),
  lastName: Yup.string()
    .required("Enter the last name")
    .matches(/^\S.*$/, "Last name cannot be blank or start with a space"),
  departmentId: Yup.string().required("Department is required"),
});
export const importUserValidation = Yup.object().shape({
  emails: Yup.array()
    .required("Email array is required")
    .min(1, "At least one email is required")
    .test("unique-emails", "Duplicate emails found", (emails) => {
      if (!emails) return true; // If emails are undefined, skip this validation
      const emailSet = new Set(emails);
      return emailSet.size === emails.length; // Check if the size of the set is the same as the array length
    }),
  passwordToggle: Yup.boolean().optional(),
  groupToggle: Yup.boolean().optional(),
  groupId: Yup.string().required("Group is required"),
  departmentId: Yup.string().required("Department is required"),
  password: Yup.string().when(
    "passwordToggle",
    (passwordToggle: any, schema: any) => {
      return passwordToggle[0]
        ? schema
            .required("Password field is required.")
            .min(8, commonMessage)
            .max(16, commonMessage)
            .matches(/[0-9]/, commonMessage)
            .matches(/[a-z]/, commonMessage)
            .matches(/[A-Z]/, commonMessage)
            .matches(/[^\w]/, commonMessage)
        : schema.optional(); // Optional if passwordToggle is false
    }
  ),
});

export const createNormalGroupSchema = Yup.object().shape({
  groupName: Yup.string()
    .required("Group name is required")
    .matches(/^\S.*$/, "Group name cannot be blank or start with a space"),
  roles: Yup.array()
    .required("Select the roles and rights")
    .min(1, "Select at least one role and rights"),
});
