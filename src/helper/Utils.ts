import dayjs from "dayjs";

export const camelCase = (text: string | undefined): string => {
  try {
    if (!text) {
      return ""; // or throw an error, depending on your use case
    }

    const words = text.split(" ");

    for (let i = 0; i < words.length; i++) {
      if (words[i]) {
        words[i] = words[i][0].toUpperCase() + words[i].substr(1);
      } else {
        words[i] = "";
      }
    }

    return words.join(" ");
  } catch (error) {
    // Handle the error appropriately
    return ""; // or throw an error
  }
};

export const lowercase = (text: string | undefined): string => {
  try {
    if (!text) {
      return ""; // Return empty string if text is undefined
    }

    // Convert the entire text to lowercase and replace spaces with dashes
    const formattedText = text.toLowerCase().replace(/\s+/g, "-");

    return formattedText;
  } catch (error) {
    // Handle the error appropriately
    console.error("Error in lowercase function:", error);
    return ""; // or throw an error, depending on your use case
  }
};

export const handleCategoryType = (urlPath?: string) => {
  if (typeof window !== "undefined") {
    urlPath = urlPath || window.location.pathname;
    let CategoryTypeName = "LANDING_PAGE";

    switch (urlPath) {
      case "/phishing/phishing-destination":
        CategoryTypeName = "LANDING_PAGE";
        break;
      case "/phishing/domain":
        CategoryTypeName = "DOMAIN";
        break;
      case "/phishing/template":
        CategoryTypeName = "PHISHING_TEMPLATES";
        break;
      case "/learning-program/notification":
        CategoryTypeName = "NOTIFICATION_TEMPLATES";
        break;
      case "/surveys":
        CategoryTypeName = "SURVEY";
        break;
      case "/courses/create-course":
        CategoryTypeName = "COURSE";
        break;
      case "/courses/edit-course":
        CategoryTypeName = "COURSE";
        break;
      case "/content/categories":
        CategoryTypeName = "COURSE";
        break;
      case "/template/policies":
        CategoryTypeName = "POLICY";
        break;
      case "/assessment":
        CategoryTypeName = "ASSESSMENT";
        break;
      case "/phishing/template/category":
        CategoryTypeName = "PHISHING_TEMPLATES";
        break;
      case "/phishing/template/category":
        CategoryTypeName = "/blog-articles/category";
        break;

      default:
        CategoryTypeName = "LANDING_PAGE";
        break;
    }
    return CategoryTypeName;
  }

  return "LANDING_PAGE";
};

export const handleMediaType = (urlPath?: string) => {
  if (typeof window !== "undefined") {
    urlPath = urlPath || window.location.pathname;
    let mediaType = "Video";

    switch (urlPath) {
      case "/content/upload-scorm":
        mediaType = "Scorm";

        break;
      case "/content/upload-video-course":
        mediaType = "Video";
        break;
      default:
        mediaType = "Video";
        break;
    }
    return mediaType;
  }
};

export const handleTitleNames = (urlPath?: string) => {
  if (typeof window !== "undefined") {
    urlPath = urlPath || window.location.pathname + window.location.search;
    let mainTitle = "Video";
    switch (true) {
      case urlPath.startsWith("/manage-courses/upload-video-course") &&
        urlPath.includes("?id="):
        mainTitle = "Upload Video";
        break;
      case urlPath.startsWith("/manage-courses/upload-scorm") &&
        urlPath.includes("?id="):
        mainTitle = "Upload SCORM";
        break;
      case urlPath === "/manage-courses/add":
        mainTitle = "Create New Course";
        break;
      case urlPath.startsWith("/manage-courses/edit") &&
        urlPath.includes("?id="):
        mainTitle = "Edit Course";
        break;
      default:
        mainTitle = "Video";
        break;
    }
    return mainTitle;
  }
  return "Video";
};

export const handleViewButton = (urlPath?: string) => {
  if (typeof window !== "undefined") {
    urlPath = urlPath || window.location.pathname + window.location.search;
    let mainTitle = "Video";
    switch (true) {
      case urlPath.startsWith("/content/upload-video-course") &&
        urlPath.includes("?id="):
        mainTitle = "Upload Video";
        break;

      case urlPath.startsWith("/users/view"):
        mainTitle = "View User";
        break;
      default:
        mainTitle = "Video";
        break;
    }
    return mainTitle;
  }
  return "Video";
};

export const truncateMiddle = (str: any, maxLength: any) => {
  if (str.length <= maxLength) return str;
  const start = str.slice(0, Math.floor(maxLength / 2));
  const end = str.slice(-Math.floor(maxLength / 2));
  return `${start}...${end}`;
};

export const handleCategorySuccessMessage = (urlPath?: string) => {
  if (typeof window !== "undefined") {
    urlPath = urlPath || window.location.pathname;
    let successMessage = "Categories Moved successfully";

    switch (urlPath) {
      case "/phishing/phishing-destination":
        successMessage = "Phishing destination moved successfully";
        break;
      case "/phishing/domain":
        successMessage = "Domain moved successfully";
        break;
      case "/phishing/template":
        successMessage = "Phishing destination moved successfully";
        break;
      case "/learning-program/notification":
        successMessage = "Notification template moved successfully";
        break;
      case "/surveys":
        successMessage = "Survey moved successfully";
        break;
      case "/courses/create-course":
        successMessage = "Course created successfully";
        break;
      case "/courses/edit-course":
        successMessage = "Course updated successfully";
        break;
      default:
        successMessage = "Categories Moved successfully";
        break;
    }
    return successMessage;
  }

  return "Categories Moved successfully";
};

export const DateRangeToMillisecond = (dateRange: string[]) => {
  let startDate = dayjs(dateRange[0], "YYYY/MM/DD").startOf("day");
  let endDate = dayjs(dateRange[1], "YYYY/MM/DD");
  let isEndDateToday = endDate.isSame(dayjs(), "day");
  const today = dayjs(new Date());
  let endDateWithTime = isEndDateToday
    ? dayjs(endDate).set("hour", today.hour()).set("minutes", today.minute())
    : endDate.endOf("day");
  let startDateMs = startDate.valueOf();
  let endDateMs = endDateWithTime.valueOf();
  return {startDateMs, endDateMs};
};

export const disablePreviousDates = (currentDate: any) => {
  return currentDate && currentDate < dayjs().startOf("day");
};
export function generatePassword(length: number = 8): string {
  const minLength = length;
  const maxLength = 16;

  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const specialChars = "!@#$%^&*()_+{}:\"<>?|[];',./`~";

  let password = "";

  // Ensure at least one uppercase letter, one lowercase letter, one number, and one special character
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += specialChars[Math.floor(Math.random() * specialChars.length)];

  // Fill the remaining characters to meet the minimum length
  const allChars = uppercase + lowercase + numbers + specialChars;
  const remainingLength =
    Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;

  for (let i = password.length; i < remainingLength; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  // Shuffle the password to ensure randomness
  return password
    .split("")
    .sort(() => 0.5 - Math.random())
    .join("");
}

export function getCompletionPercentage(startDate: any, frequency: string) {
  const currentDate: any = new Date();
  const start: any = new Date(Number(startDate));

  // Calculate the elapsed days
  const elapsedDays = (currentDate - start) / (1000 * 60 * 60 * 24);
  console.log("currentDate - start :>> ", currentDate, start);
  // Define duration in days based on frequency
  let totalDurationDays;
  switch (frequency) {
    case "One-Time":
      totalDurationDays = elapsedDays; // One-time event, only tracks progress till current
      break;
    case "Weekly":
    case "Weeks":
      totalDurationDays = 7;
      break;
    case "Monthly":
    case "Months":
      totalDurationDays = 30; // Approximate
      break;
    case "Quarterly":
    case "Quarters":
      totalDurationDays = 90; // Approximate
      break;
    default:
      return "Invalid frequency";
  }

  // Calculate percentage, ensuring it doesn't exceed 100%
  const completionPercentage = Math.min(
    (elapsedDays / totalDurationDays) * 100,
    100
  );
  console.log("completionPercentage :>> ", completionPercentage);
  return completionPercentage.toFixed(2);
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN").format(amount);
}
