import SidebarLayout from "@/src/components/Layout/SidebarLayout";
import {useRouter} from "next/router";
import axiosInstance from "@/src/interceptors/Axios";
import {API_ENDPOINTS} from "@/src/interceptors/apiName";
import {useEffect, useState} from "react";
import {Divider} from "antd";
import LeftArrowIcon from "@/src/components/Icons/LeftArrowIcon";
import moment from "moment";
import {useLoader} from "@/src/components/Loader/LoaderProvider";
import TagComponent from "@/src/components/TagComponent";
import {DownloadOutlined, UserOutlined} from "@ant-design/icons";
import CalendarAltIcon from "@/src/components/Icons/CalendarAltIcon";
import ClockIcon from "@/src/components/Icons/ClockIcon";
import EditIcon from "@/src/components/Icons/EditIcon";
import DisplayedLibraryIcon from "@/src/components/Icons/DisplayedLibraryIcon";
import {truncateMiddle} from "@/src/helper/Utils";
import UploadOption from "@/src/components/ManageCourse/UploadOption";

interface ViewCoursDropProps {
  selectedSystem: any;
}

const ViewCourses: React.FC<ViewCoursDropProps> = ({selectedSystem}) => {
  const [viewCourseDetails, setViewCourseDetails] = useState<any>([]);
  const [selectedEditId, SetSelectedEditId] = useState(null);
  const router = useRouter();
  const {id} = router.query;
  const loaderContext = useLoader();
  const {showLoader, hideLoader} = loaderContext;
  const [currentId, setCurrentId] = useState<number | null>(null);

  useEffect(() => {
    if (router.query.id) {
      setCurrentId(Number(router.query.id));
    }
  }, [router.query.id]);

  const getCourseListById = async (id: any) => {
    try {
      console.log("isSystem=${selectedSystem} :>> ", router.query);
      showLoader();
      let CourseAction: any = await axiosInstance.get(
        `${API_ENDPOINTS.Update_Course_API}/${id}?type=${router.query?.isSystem}`
      );
      if (CourseAction?.settings?.success) {
        setViewCourseDetails(CourseAction?.data);
        hideLoader();
      } else {
        console.log("something went wrong");
        hideLoader();
      }
    } catch (error) {
      console.error("Error deleting Course:", error);
      hideLoader();
    }
  };

  useEffect(() => {
    if (currentId) {
      getCourseListById(currentId);
    }
  }, [currentId]);

  const handleEdit = (record: any) => {
    SetSelectedEditId(record);
    router.push({
      pathname: `/manage-courses/edit`,
      query: {id: record.courseId},
    });
  };

  const handleVideoEdit = (record: any) => {
    SetSelectedEditId(record);
    router.push({
      pathname: `/manage-courses/upload-video-course`,
      query: {id: record.courseId},
    });
  };

  const handleScormEdit = (record: any) => {
    SetSelectedEditId(record);
    router.push({
      pathname: `/manage-courses/upload-scorm`,
      query: {id: record.courseId},
    });
  };

  const videoFormats = [".mp4", ".mov", ".avi", ".mkv"];
  const renderMediaContent = () => {
    const {mediaType, mediaUrl, mediaName} = viewCourseDetails;
    if (
      mediaName &&
      videoFormats?.some((format) => mediaName?.endsWith(format))
    ) {
      return (
        <div className="border border-[#E8E8E8] rounded-[8px] p-[24px] w-[60%] mt-5">
          <video
            width="100%"
            controls
            src={viewCourseDetails?.mediaUrl}
          ></video>
        </div>
      );
    } else if (mediaName && mediaName?.endsWith(".zip")) {
      return (
        <div
          className="flex gap-2 border border-[#E8E8E8] rounded-[8px] p-[24px] w-[60%] mt-5"
          onClick={() => {
            const link = document.createElement("a");
            link.href = viewCourseDetails.mediaUrl;
            link.setAttribute("download", "course.zip");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }}
        >
          <DownloadOutlined
            style={{
              width: "30px",
              color: "#4379EE",
              cursor: "pointer",
            }}
          />
          <div className="!text-[16px] text-[#4F4F4F] ">
            {viewCourseDetails?.mediaName
              ? truncateMiddle(viewCourseDetails?.mediaName, 35)
              : ""}
          </div>
        </div>
      );
    } else if (!mediaType || !mediaUrl) {
      return false;
    }
  };

  return (
    <div>
      <SidebarLayout>
        <div className="flex">
          <div
            onClick={() => router.push("/manage-courses")}
            className="pt-2 cursor-pointer"
          >
            <LeftArrowIcon />
          </div>
          <div className="text-[24px] font-[700] text-[#313D4F] mb-[30px] ml-2 pt-1">
            Course Detail
          </div>
        </div>
        <div>
          <div className="flex gap-5 mb-5  rounded-[10px] p-[30px] custom-card">
            <div>
              <img
                className="rounded-[10px]"
                src={viewCourseDetails?.imageUrl}
                alt="dummy-img"
                style={{
                  width: "234px",
                  height: "234px",
                  objectFit: "cover",
                  flex: "0 0 auto",
                  maxWidth: "none",
                }}
              />
            </div>
            <div className="flex flex-col w-full">
              <div className="flex justify-between w-full">
                <div className="w-full">
                  <div className="text-[#333333] text-[20px]  font-[600]">
                    {viewCourseDetails?.courseTitle}
                  </div>
                  <div className="text-[#4F4F4F] text-[16px] font-normal mt-1">
                    {viewCourseDetails?.description}
                  </div>

                  <div className="flex mt-1 h-[34px] text-center cursor-pointer">
                    <div>
                      <TagComponent
                        title={
                          <div className="!text-[16px] text-[#4F4F4F] text-list">
                            {viewCourseDetails?.courseType}
                          </div>
                        }
                        icon={<UserOutlined />}
                      />
                    </div>

                    {viewCourseDetails?.isDisplayLibrary === 1 && (
                      <TagComponent
                        title={
                          <div className="!text-[16px] text-[#4F4F4F] text-list pl-2">
                            {"Displayed in Library"}
                          </div>
                        }
                        icon={<DisplayedLibraryIcon />}
                      />
                    )}
                  </div>
                </div>
                {viewCourseDetails?.isSystemCourse === "No" ? (
                  <div>
                    <div
                      className="rounded-[4px] border border-[#4379EE]  text-[#4379EE] text-[16px] flex justify-center items-center px-8  h-[40px] cursor-pointer"
                      onClick={() => handleEdit(viewCourseDetails)}
                    >
                      <EditIcon />
                      Edit
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </div>
              <div className="flex mt-5">
                <div className="flex-grow gap-0">
                  <div className="divider-level-table w-fit flex items-center">
                    <div className="p-[20px] list-data-wrapped flex flex-col items-center justify-center gap-[5px]">
                      <div className="text-[14px] text-[#828282] font-normal mr-2">
                        Expected Duration
                      </div>
                      <div className="text-[14px] !text-[#4F4F4F] font-normal mr-2">
                        {viewCourseDetails?.duration + " " + "Mins"}
                      </div>
                    </div>
                    <Divider
                      type="vertical"
                      className="bg-[#E8E8E8] w-[1px] h-[76px]"
                    />
                    <div className="p-[20px]  list-data-wrapped flex flex-col items-center justify-center gap-[5px]">
                      <div className="text-[14px] text-[#828282] font-normal ml-2">
                        Last Update
                      </div>
                      <div className="flex items-center gap-1">
                        <CalendarAltIcon />
                        <div className="text-[14px] text-[#4F4F4F]">
                          {" "}
                          {moment
                            .unix(viewCourseDetails?.modifiedDate / 1000)
                            .format("MMM DD, YYYY")}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 mr-1 mb-[11px]">
                        <ClockIcon />
                        {(() => {
                          const timeString = moment
                            .unix(viewCourseDetails?.modifiedDate / 1000)
                            .format("hh:mm:ss A");
                          const [time, period] = timeString.split(" ");
                          return (
                            <div className="text-[14px] text-[#4F4F4F]">
                              {time}
                              <span className="ml-2 ">{period}</span>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div>{renderMediaContent()}</div>
              <div className="flex !justify-end">
                <UploadOption
                  handleVideoEdit={handleVideoEdit}
                  viewCourseDetails={viewCourseDetails}
                  handleScormEdit={handleScormEdit}
                />
              </div>
            </div>
          </div>
        </div>
      </SidebarLayout>
    </div>
  );
};
export default ViewCourses;
