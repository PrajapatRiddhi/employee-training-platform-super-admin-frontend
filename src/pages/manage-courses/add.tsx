import {
  Button,
  Card,
  Checkbox,
  Input,
  Space,
  Tooltip,
  Typography,
  Image,
} from "antd";
import {FC, useEffect, useState} from "react";
import {useRouter} from "next/router";
import {ErrorMessage, Formik, Form, FormikHelpers} from "formik";
import {CourseValidationSchema} from "@/src/helper/ValidationSchema";
import axiosInstance from "@/src/interceptors/Axios";
import {API_ENDPOINTS} from "@/src/interceptors/apiName";
import BackArrowIcon from "@/src/components/Icons/BackArrowIcon";
import CustomSelect from "@/src/components/CustomSelect";
import CustomInput from "@/src/components/CustomInput";
import {useNotification} from "@/src/components/Notification";
import SidebarLayout from "@/src/components/Layout/SidebarLayout";
import CircleQuestionIcon from "@/src/components/Icons/CircleQuestionIcon";
import {
  camelCase,
  handleCategoryType,
  handleMediaType,
  handleTitleNames,
} from "@/src/helper/Utils";
import ImageUplaoder from "@/src/components/ManageCourse/ImageUplaoder";
import XmarkLargeIcon from "@/src/components/Icons/XmarkLargeIcon";
import uploadFile from "@/src/helper/UploadFIle";

type CreateCourseProps = {
  id?: string | string[] | undefined;
  uploadVideo?: boolean;
  uploadScorm?: boolean;
};
const initialValues = {
  courseTitle: "",
  courseType: "",
  description: "",
  duration: "",
  isDisplayLibrary: 1,
  image: "",
  categoryId: "",
  isSystemCategory: 0,
};

type InitialValuesProps = {
  imageUrl(imageUrl: any): unknown;
  courseTitle: string;
  courseType: string;
  description: string;
  duration: number;
  isDisplayLibrary: any;
  image?: any;
  categoryId?: number;
  isSystemCategory: any;
  mediaType: any;
  mediaName: any;
};
const CreateCourses: FC<CreateCourseProps> = ({
  id,
  uploadVideo,
  uploadScorm,
}) => {
  const router = useRouter();
  const Text = Typography;
  const notificationContext = useNotification();
  const handleNotifications: any = notificationContext?.handleNotifications;
  const [fetchedData, setFetchedData] = useState<InitialValuesProps | null>();
  const isEditing = !!id;
  const [image, setImage] = useState<any>(null);
  const [imageUrl, setImageUrl] = useState<any>(null);
  const [categoriesList, setCategoriesList] = useState<any[]>([]);
  const [openImageModel, setOpenImageModel] = useState<any>(false);
  const [imageUploadError, setImageUploadError] = useState<boolean>(false);
  const [mediaName, setMediaName] = useState<any>(null);
  const [isWideScreen, setIsWideScreen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedVideoName, setUploadedVideoName] = useState<string | null>(
    null
  );
  const [uploadedZipName, setUploadedZipName] = useState<string | null>(null);
  const handleImageModel = () => {
    setOpenImageModel(!openImageModel);
  };

  const ContentTypesData = [
    {label: "Training/Course Content", value: "Training/Course Content"},
    {label: "Blog/Article", value: "Blog/Article"},
    {label: "Video Module", value: "Video Module"},
  ];

  const fetchCategoriesList = async () => {
    try {
      const categoryType = handleCategoryType();
      let response: any = await axiosInstance.get(
        `${API_ENDPOINTS.DROPDOWN_LIST_CATEGORIES}?categoryType=COURSE`
      );
      if (response?.settings?.success) {
        setCategoriesList(response?.data);
      }
    } catch (error) {
      console.log(error, "Something Went Wrong.");
    }
  };

  useEffect(() => {
    fetchCategoriesList();
  }, []);

  const handleSubmit = async (
    values: InitialValuesProps,
    {resetForm}: FormikHelpers<InitialValuesProps>
  ) => {
    try {
      if (!image) {
        setImageUploadError(true);
        return false;
      }

      if (!values?.isDisplayLibrary) {
        delete values.categoryId;
      }

      const duration = Number(values.duration);
      if (isNaN(duration)) {
        handleNotifications("error", "Duration must be a valid number.", "", 3);
        return false;
      }

      const updatedValues = {
        ...values,
        duration,
        image: image,
        mediaType: handleMediaType(),
        mediaName: mediaName,
      };

      const endpoint = isEditing
        ? `${API_ENDPOINTS.Update_Course_API}/${id}`
        : API_ENDPOINTS.Create_Course_API;
      const method = isEditing ? "put" : "post";

      const response: any = await axiosInstance[method](
        endpoint,
        JSON.stringify(updatedValues)
      );

      if (response?.settings?.success) {
        const successMessage = isEditing
          ? "Course updated successfully"
          : "Course added successfully";
        handleNotifications("success", successMessage, "", 3);
        // @ts-ignore
        resetForm({values: initialValues});
        router.push("/manage-courses");
      } else {
        handleNotifications("error", response?.settings?.message, "", 3);
      }
    } catch (error: any) {
      console.error(error);
      handleNotifications("error", error?.message, "", 3);
    }
  };

  const getCoursesListById = async (id: any) => {
    try {
      let getCoursListActionId: any = await axiosInstance.get(
        `${API_ENDPOINTS.Update_Course_API}/${id}`
      );
      if (getCoursListActionId?.settings?.success) {
        const editCoursData = {
          courseTitle: getCoursListActionId?.data?.courseTitle ?? "",
          description: getCoursListActionId?.data?.description ?? "",
          courseType: getCoursListActionId?.data?.courseType ?? "",
          duration: getCoursListActionId?.data?.duration ?? "",
          isDisplayLibrary: getCoursListActionId?.data?.isDisplayLibrary ?? "",
          categoryId: getCoursListActionId?.data?.categoryId ?? "",
          image: getCoursListActionId?.data?.image ?? "",
          mediaName:
            uploadScorm && getCoursListActionId?.data?.mediaType === "Scorm"
              ? getCoursListActionId?.data?.mediaName
              : uploadVideo && getCoursListActionId?.data?.mediaType === "Video"
              ? getCoursListActionId?.data?.mediaName
              : "",
          mediaType: getCoursListActionId?.data?.mediaType ?? "",
        };

        setImageUrl(getCoursListActionId?.data?.imageUrl);
        // @ts-ignore
        setFetchedData(editCoursData);
      } else {
        console.log("Something Went Wrong.");
      }
    } catch (error) {
      console.error("Error deleting phishing destination:", error);
    }
  };

  const fetchTheTypeName = fetchedData?.mediaType;

  useEffect(() => {
    if (isEditing) {
      getCoursesListById(id);
    }
  }, [isEditing, id]);

  useEffect(() => {
    if (fetchedData) {
      setImage(fetchedData.image);
      if (uploadScorm && fetchTheTypeName === "Scorm") {
        setMediaName(fetchedData.mediaName);
      }
      if (uploadVideo && fetchTheTypeName === "Video") {
        setMediaName(fetchedData.mediaName);
      }
    }
  }, [fetchedData]);

  useEffect(() => {
    const handleResize = () => {
      setIsWideScreen(window.innerWidth === 1920);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fileUploading = async (file: File) => {
    try {
      setUploading(true);
      let uploadRes = await uploadFile(file);
      if (uploadRes?.settings?.success) {
        setUploading(false);
        setMediaName(uploadRes?.data?.name);
        const uploadedName = uploadRes?.data?.name;
        await setUploadedVideoName(uploadedName);
        await setUploadedZipName(uploadedName);
        handleNotifications("success", "File uploaded successfully!");
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      setUploading(false);
      console.error("Error during file upload:", error);
      handleNotifications("error", "File upload failed.");
    }
  };

  const videoUploading = async (file: File) => {
    try {
      if (file.size > 2 * 1024 * 1024) {
        handleNotifications(
          "error",
          "File size exceeds the 2MB limit. Please upload a smaller file."
        );
        return;
      }
      setUploading(true);
      let uploadRes = await uploadFile(file);
      if (uploadRes?.settings?.success) {
        setUploading(false);
        setMediaName(uploadRes?.data?.name);
        const uploadedName = uploadRes?.data?.name;
        await setUploadedVideoName(uploadedName);
        await setUploadedZipName(uploadedName);
        handleNotifications("success", "File uploaded successfully!");
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      setUploading(false);
      console.error("Error during file upload:", error);
      handleNotifications("error", "File upload failed.");
    }
  };

  const handleBackNavigation = () => {
    if (id) {
      router.push(`/manage-courses/view?id=${id}`);
    } else {
      router.push("/manage-courses");
    }
  };
  return (
    <SidebarLayout>
      <div>
        <Space className="pt-[10px] pb-[30px]">
          <div className="flex gap-2  justify-center items-center">
            <div className="cursor-pointer" onClick={handleBackNavigation}>
              <BackArrowIcon />
            </div>
            <Text className="text-gray font-[700] text-[24px] font-[Nunito Sans]  leading-6">
              {handleTitleNames()}
            </Text>
          </div>
        </Space>
        <Card className="custom-card">
          <div className="flex items-center">
            <Formik
              // @ts-ignore
              initialValues={fetchedData || initialValues}
              validationSchema={CourseValidationSchema}
              onSubmit={handleSubmit}
              enableReinitialize
            >
              {({isSubmitting, errors, values, setFieldValue}) => {
                return (
                  <Form className="w-full">
                    <div className="flex flex-col gap-[20px]">
                      <div className="flex flex-row  !w-full items-center ">
                        <div
                          className={`${
                            isWideScreen ? "w-[23%]" : "w-[35%]"
                          } text-[16px] font-Nunito Sans leading-[24px] text-[#333333]`}
                        >
                          Content Title<span className="text-red-500">*</span>
                        </div>
                        <div className="flex flex-row gap-4 items-center w-full ">
                          <div className="w-[60%]">
                            {" "}
                            <CustomInput
                              label=""
                              type="text"
                              name="courseTitle"
                              as={Input}
                              className={
                                errors.courseTitle && " !border !border-red"
                              }
                              size="large"
                              placeholder=""
                              status={errors.courseTitle && "error"}
                              error={<ErrorMessage name="courseTitle" />}
                              defaultValue={values.courseTitle}
                              maxInput={255}
                              style={{color: "#828282"}}
                            />
                          </div>
                          <div>
                            <Tooltip
                              title={
                                <div>
                                  Content Title to be displayed on the Course
                                  title
                                </div>
                              }
                              placement="right"
                              className="!cursor-pointer"
                            >
                              <div>
                                <CircleQuestionIcon />
                              </div>
                            </Tooltip>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-row  !w-full items-center">
                        <div
                          className={`${
                            isWideScreen ? "w-[23%]" : "w-[35%]"
                          } text-[16px] font-Nunito Sans leading-[24px] text-[#333333]`}
                        >
                          Course Type<span className="text-red-500">*</span>
                        </div>
                        <div className="flex flex-row gap-4 items-center w-full ">
                          <div className="w-[60%] ">
                            {" "}
                            <CustomSelect
                              label=""
                              name="courseType"
                              className={`cursor-pointer ${
                                errors.courseType &&
                                "!border !border-red cursor-pointer"
                              }`}
                              placeholder="Select "
                              onSelect={(value: any) => {
                                setFieldValue("courseType", value);
                              }}
                              defaultValue={values.courseType}
                              options={ContentTypesData}
                              error={<ErrorMessage name="courseType" />}
                              // style={{color: "#828282"}}
                            />
                          </div>
                          <div>
                            <Tooltip
                              title={
                                <div>
                                  Course Type to be displayed on the Course Type
                                </div>
                              }
                              placement="right"
                              className="cursor-pointer"
                            >
                              <div>
                                <CircleQuestionIcon />
                              </div>
                            </Tooltip>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-row !w-full items-center">
                        <div
                          className={`${
                            isWideScreen ? "w-[23%]" : "w-[35%]"
                          } text-[16px] font-Nunito Sans leading-[24px] text-[#333333]`}
                        >
                          Description<span className="text-red-500">*</span>
                        </div>
                        <div className="flex flex-row gap-4 items-center w-full">
                          <div className="w-[60%]">
                            <CustomInput
                              type={"text"}
                              name={"description"}
                              as={Input.TextArea}
                              size="large"
                              placeholder={""}
                              status={errors.description && "error"}
                              defaultValue={values.description}
                              error={<ErrorMessage name="description" />}
                              autoSize={{minRows: 4, maxRows: 6}}
                              maxInput={500}
                              style={{color: "#828282"}}
                              className={
                                errors.description && " !border !border-red "
                              }
                            />
                          </div>
                          <div>
                            <Tooltip
                              title={
                                <div>
                                  Description to be displayed on the Course
                                  Description
                                </div>
                              }
                              placement="right"
                              className="cursor-pointer"
                            >
                              <div>
                                <CircleQuestionIcon />
                              </div>
                            </Tooltip>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-row  !w-full items-center">
                        <div
                          className={`${
                            isWideScreen ? "w-[23%]" : "w-[35%]"
                          } text-[16px] font-Nunito Sans leading-[24px] text-[#333333]`}
                        >
                          Expected Duration (Minutes)
                          <span className="text-red-500">*</span>
                        </div>
                        <div className="flex flex-row gap-4 items-center w-full ">
                          <div className="w-[60%]">
                            {" "}
                            <CustomInput
                              label=""
                              type="number"
                              name="duration"
                              as={Input}
                              className={
                                errors.duration && " !border !border-red"
                              }
                              size="large"
                              placeholder=""
                              status={errors.duration && "error"}
                              error={<ErrorMessage name="duration" />}
                              defaultValue={values.duration}
                              maxInput={255}
                              style={{color: "#828282"}}
                            />
                          </div>
                          <div>
                            <Tooltip
                              title={
                                <div>
                                  Duration to be displayed on the Course
                                  duration
                                </div>
                              }
                              placement="right"
                              className="cursor-pointer"
                            >
                              <div>
                                <CircleQuestionIcon />
                              </div>
                            </Tooltip>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-row  !w-full items-center">
                        <div
                          className={`${
                            isWideScreen ? "w-[23%]" : "w-[35%]"
                          } text-[16px] font-Nunito Sans leading-[24px] text-[#333333]`}
                        >
                          Display in Library
                        </div>
                        <div className="flex flex-row gap-4 items-center w-full ">
                          <div className="w-[60%] flex justify-end items-end">
                            {" "}
                            <Checkbox
                              style={{width: "20px", height: "20px"}}
                              checked={values.isDisplayLibrary === 1}
                              onChange={(e) =>
                                setFieldValue(
                                  "isDisplayLibrary",
                                  e.target.checked ? 1 : 0
                                )
                              }
                            ></Checkbox>
                          </div>
                          <div>
                            <Tooltip
                              title={
                                <div>
                                  Display in Library to be displayed on the
                                  Course Display in Library
                                </div>
                              }
                              placement="right"
                              className="cursor-pointer"
                            >
                              <div>
                                <CircleQuestionIcon />
                              </div>
                            </Tooltip>
                          </div>
                        </div>
                      </div>

                      {values?.isDisplayLibrary ? (
                        <div className="flex flex-row  !w-full items-center">
                          <div
                            className={`${
                              isWideScreen ? "w-[23%]" : "w-[35%]"
                            } text-[16px] font-Nunito Sans leading-[24px] text-[#333333]`}
                          >
                            Category
                          </div>
                          <div className="flex flex-row gap-4 items-center w-full ">
                            <div className="w-[60%]">
                              {" "}
                              <CustomSelect
                                name={"categoryId"}
                                id={"categoryId"}
                                label=""
                                placeholder="Select"
                                defaultValue={values.categoryId}
                                className="custom-text-color"
                                size="large"
                                options={
                                  categoriesList &&
                                  categoriesList?.map((option: any) => ({
                                    value: option.myCategoryId,
                                    label: camelCase(option.categoryName),
                                  }))
                                }
                                onSelect={(value) => {
                                  setFieldValue("categoryId", value);
                                }}
                                error={<ErrorMessage name="categoryId" />}
                              />
                            </div>
                            <div>
                              <Tooltip
                                title={
                                  <div>
                                    Category to be displayed on the Course
                                    Category
                                  </div>
                                }
                                placement="right"
                                className="cursor-pointer"
                              >
                                <div>
                                  <CircleQuestionIcon />
                                </div>
                              </Tooltip>
                            </div>
                          </div>
                        </div>
                      ) : (
                        ""
                      )}

                      <div className="flex flex-row  !w-full items-center">
                        <div
                          className={`${
                            isWideScreen ? "w-[23%]" : "w-[35%]"
                          } text-[16px] font-Nunito Sans leading-[24px] text-[#333333]`}
                        >
                          Cover Image
                          <span className="text-red-500">*</span>
                        </div>
                        <div className="flex flex-row gap-4 items-center w-full ">
                          <div className="w-[60%] flex">
                            <div>
                              <div
                                onClick={handleImageModel}
                                className="flex gap-10"
                              >
                                {imageUrl ? (
                                  <div className="relative image">
                                    <Image
                                      className="rounded-[10px] object-cover"
                                      src={imageUrl || ""}
                                      alt="dummy-img"
                                      preview={false}
                                      width={234}
                                      height={234}
                                    />
                                    <button
                                      onClick={() => {
                                        setImage(null);
                                        setImageUrl(null);
                                      }}
                                      className="absolute top-0 right-0  rounded-tl-none rounded-bl-[10px] rounded-tr-[10px] bg-[#263A67] p-[6px]"
                                    >
                                      <XmarkLargeIcon />
                                    </button>
                                  </div>
                                ) : (
                                  <div data-name="image" className="flex gap-5">
                                    <div className="border border-[#4F4F4F] rounded-[4px] p-[4px] pl-[12px] flex flex-col justify-center items-start cursor-pointer">
                                      Choose File
                                    </div>
                                    <div className="text-[16px] text-normal font-[400] leading-[24px] text-[#333333] mt-1">
                                      No File Chosen
                                    </div>
                                  </div>
                                )}
                              </div>
                              {imageUploadError && (
                                <div>
                                  <Text className="error-message mt-1 text-[#ff4d4f] text-[14px]">
                                    Cover image is required
                                  </Text>
                                </div>
                              )}
                            </div>

                            <Tooltip
                              title={
                                <div>
                                  Please upload a cover image for the course
                                  with an aspect ratio of 16:9, 4:3, or 1:1.
                                </div>
                              }
                              placement="right"
                              className="cursor-pointer"
                            >
                              <div className="mt-1 pl-5">
                                <CircleQuestionIcon />
                              </div>
                            </Tooltip>
                          </div>
                        </div>
                      </div>

                      {uploadVideo && (
                        <div className="flex flex-row items-center">
                          <div
                            className={`${
                              isWideScreen ? "w-[23%]" : "w-[35%]"
                            } text-[16px] font-Nunito Sans leading-[24px] text-[#333333]`}
                          >
                            Upload Video
                          </div>
                          <div className="flex flex-row gap-4 items-center w-full">
                            <div className="w-[60%]">
                              <CustomInput
                                label=""
                                name="mediaName"
                                as={Input}
                                className={
                                  errors.mediaName && " !border !border-red"
                                }
                                size="large"
                                placeholder={
                                  uploadedVideoName
                                    ? uploadedVideoName
                                    : "Please upload video"
                                }
                                error={<ErrorMessage name="mediaName" />}
                                value={
                                  (uploadedVideoName && uploadedVideoName) || ""
                                }
                                maxInput={255}
                                style={{color: "#828282"}}
                                type=""
                              />
                            </div>
                            <div className="flex gap-5 items-center">
                              <input
                                type="file"
                                accept="video/*"
                                id="video-upload"
                                style={{display: "none"}}
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) videoUploading(file);
                                }}
                              />
                              <label
                                htmlFor="video-upload"
                                className="border border-[#4F4F4F] rounded-[4px] p-[4px] pl-[12px] flex flex-col justify-center items-start cursor-pointer"
                              >
                                <div>
                                  {uploading ? "Uploading..." : "Browse"}
                                </div>
                              </label>
                            </div>
                            <div>
                              <Tooltip
                                title={
                                  <div>
                                    Upload Video to be displayed on the Upload
                                    Video
                                  </div>
                                }
                                placement="right"
                                className="cursor-pointer"
                              >
                                <div>
                                  <CircleQuestionIcon />
                                </div>
                              </Tooltip>
                            </div>
                          </div>
                        </div>
                      )}
                      {uploadScorm && (
                        <div className="flex flex-row   items-center ">
                          <div
                            className={`${
                              isWideScreen ? "w-[23%]" : "w-[35%]"
                            } text-[16px] font-Nunito Sans leading-[24px] text-[#333333]`}
                          >
                            Attachment
                          </div>
                          <div className="flex flex-row gap-4 items-center w-full">
                            <div className="w-[60%]">
                              {/* <CustomInput
                                label=""
                                name="mediaName"
                                as={Input}
                                className={
                                  errors.mediaName && " !border !border-red"
                                }
                                size="large"
                                placeholder={
                                  uploadedZipName
                                    ? uploadedZipName
                                    : "Please upload zip file"
                                }
                                error={<ErrorMessage name="mediaName" />}
                                defaultValue={uploadedZipName || ""}
                                maxInput={255}
                                style={{color: "#828282"}}
                                type={""}
                              /> */}

                              <CustomInput
                                label=""
                                name="mediaName"
                                as={Input}
                                className={
                                  errors.mediaName && " !border !border-red"
                                }
                                size="large"
                                placeholder={
                                  uploadedZipName
                                    ? uploadedZipName
                                    : "Please upload zip file"
                                }
                                error={<ErrorMessage name="mediaName" />}
                                value={uploadedZipName || ""}
                                maxInput={255}
                                style={{color: "#828282"}}
                                type=""
                              />
                            </div>
                            <div className="flex gap-5 items-center">
                              <input
                                type="file"
                                accept=".zip"
                                id="video-upload"
                                style={{display: "none"}}
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) fileUploading(file);
                                }}
                              />

                              <label
                                htmlFor="video-upload"
                                className="border border-[#4F4F4F] rounded-[4px] p-[4px] pl-[12px] flex flex-col justify-center items-start cursor-pointer"
                              >
                                {uploading ? "Uploading..." : "Browse"}
                              </label>
                            </div>
                            <div>
                              <Tooltip
                                title={
                                  <div>
                                    Upload Zip file to be displayed on the Zip
                                    file
                                  </div>
                                }
                                placement="right"
                                className="cursor-pointer"
                              >
                                <div>
                                  <CircleQuestionIcon />
                                </div>
                              </Tooltip>
                            </div>
                          </div>
                        </div>
                      )}
                      {/* {uploadScorm && (
                        <div className="flex flex-row   items-center ">
                          <div
                            className={`${
                              isWideScreen ? "w-[23%]" : "w-[35%]"
                            } text-[16px] font-Nunito Sans leading-[24px] text-[#333333]`}
                          >
                            Attachment
                          </div>
                          <div className="flex flex-row gap-4 items-center w-full">
                            <div className="w-[60%]">
                              <CustomInput
                                label=""
                                name="mediaName"
                                as={Input}
                                className={
                                  errors.mediaName && " !border !border-red"
                                }
                                size="large"
                                placeholder={
                                  uploadedVideoName
                                    ? ""
                                    : "Please upload zip file"
                                }
                                error={<ErrorMessage name="mediaName" />}
                                defaultValue={uploadedVideoName || ""}
                                maxInput={255}
                                style={{color: "#828282"}}
                                type={""}
                              />
                              <input
                                className="w-[800px]"
                                name="mediaName"
                                defaultValue={uploadedVideoName || ""}
                              />
                            </div>
                            <div className="flex gap-5 items-center">
                              <input
                                type="file"
                                accept=".zip"
                                id="video-upload"
                                style={{display: "none"}}
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) fileUploading(file);
                                }}
                              />

                              <label
                                htmlFor="video-upload"
                                className="border border-[#4F4F4F] rounded-[4px] p-[4px] pl-[12px] flex flex-col justify-center items-start cursor-pointer"
                              >
                                <div>Browse</div>
                              </label>
                            </div>
                            <div>
                              <Tooltip
                                title={
                                  <div>
                                    Upload Zip file to be displayed on the Zip
                                    file
                                  </div>
                                }
                                placement="right"
                                className="cursor-pointer"
                              >
                                <div>
                                  <CircleQuestionIcon />
                                </div>
                              </Tooltip>
                            </div>
                          </div>
                        </div>
                      )} */}
                    </div>
                    <div className="mt-[20px] flex gap-5">
                      <Button
                        loading={isSubmitting}
                        type="primary"
                        htmlType="submit"
                        size="large"
                        className="custom-heading-btn font-Nunito Sans"
                      >
                        {id ? "Update" : "Save"}
                      </Button>

                      <div
                        onClick={() => router.push("/content/manage-courses")}
                        className="text-[#4379EE] text-[16px] font-Nunito Sans leading-[24px] pt-2 cursor-pointer"
                      >
                        Cancel
                      </div>
                    </div>
                  </Form>
                );
              }}
            </Formik>
          </div>
        </Card>
        {openImageModel && (
          <ImageUplaoder
            handleImageModel={handleImageModel}
            openImageModel={openImageModel}
            image={image}
            setImage={setImage}
            imageUrl={imageUrl}
            setImageUrl={setImageUrl}
            setImageUploadError={setImageUploadError}
          />
        )}
      </div>
    </SidebarLayout>
  );
};
export default CreateCourses;
