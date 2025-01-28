import {UserOutlined} from "@ant-design/icons";
import {FC, useEffect, useState} from "react";
import TagComponent from "../TagComponent";
import {Divider, Empty} from "antd";
import {useLoader} from "../Loader/LoaderProvider";
import {API_ENDPOINTS} from "@/src/interceptors/apiName";
import axiosInstance from "@/src/interceptors/Axios";
import CalendarAltIcon from "../Icons/CalendarAltIcon";
import moment from "moment";
import ClockIcon from "../Icons/ClockIcon";
import {NextRouter, useRouter} from "next/router";
import {useNotification} from "../Notification";
import DisplayedLibraryIcon from "../Icons/DisplayedLibraryIcon";
import CommonPagination from "../CommonTable/paginnation";
import CoursesOptions from "./CoursesOptions";
import VideoViewer from "./VideoViewer";

interface CourseListingProps {
  selectedSystem: boolean;
  searchInput: any;
  statusFilter: any;
}

const CourseListing: FC<CourseListingProps> = ({
  selectedSystem,
  searchInput,
  statusFilter,
}) => {
  const loaderContext = useLoader();
  const {showLoader, hideLoader} = loaderContext;
  const getCurrentPage = sessionStorage.getItem("currentPage")
    ? sessionStorage.getItem("currentPage")
    : 1;

  const [currentPage, setCurrentPage] = useState<any>(getCurrentPage);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [courseListData, setCourseListData] = useState<any>([]);
  const [selectedEditId, SetSelectedEditId] = useState(null);
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [noData, setNoData] = useState(false);
  const [openVideoView, setOpenVideoView] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string | null>(null);

  const hanldeVideoViewer = (course: any) => {
    if (course?.videoUrl) {
      setCurrentVideoUrl(course.videoUrl);
      setOpenVideoView(true);
    } else {
      setOpenVideoView(false);
    }
  };
  const notificationContext = useNotification();
  const handleNotifications: any = notificationContext?.handleNotifications;
  const router: NextRouter = useRouter();

  useEffect(() => {
    fetchCourseListing();
  }, [currentPage, itemsPerPage, searchInput, selectedSystem, statusFilter]);

  const fetchCourseListing = async () => {
    try {
      showLoader();
      const body = {
        filters: [{key: "status", value: statusFilter}],
        keyword: searchInput,
        page: currentPage,
        limit: itemsPerPage,
        sort: [
          {
            prop: "addedDate",
            dir: "DESC",
          },
        ],
      };
      if (selectedSystem) {
        // @ts-ignore
        body.isSystem = selectedSystem;
      }
      const response = await axiosInstance.post(
        `${API_ENDPOINTS.Course_Listing_API}`,
        body
      );
      // @ts-ignore
      if (response?.settings?.success) {
        if (response?.data.length === 0) {
          setNoData(true);
        } else {
          setNoData(false);
        }
        setCourseListData(response?.data);
        // @ts-ignore
        setTotalItems(response?.settings?.count || 0);
      } else {
        setNoData(true);
      }
    } catch (error) {
      console.error("Error fetching course listing:", error);
      setNoData(true);
    } finally {
      hideLoader();
    }
  };

  const handleViewCourses = (record: any) => {
    sessionStorage.setItem("currentPage", currentPage);
    SetSelectedEditId(record);
    console.log("record :>> ", record);
    router.push({
      pathname: `/manage-courses/view`,
      query: {id: record.courseId, isSystem: selectedSystem ? "Yes" : "No"},
    });
  };

  const handleDeleteCourse = async (id: number) => {
    setLoadingId(id);
    try {
      const response = await axiosInstance.delete(
        `${API_ENDPOINTS.Update_Course_API}/${id}`
      );
      // @ts-ignore
      if (response?.settings?.success) {
        handleNotifications("success", "Course deleted successfully", "", 3);
        fetchCourseListing();
      } else {
        // @ts-ignore
        handleNotifications("error", response?.settings?.message, "", 3);
      }
    } catch (error) {
      console.error("Error deleting Course destination:", error);
      hideLoader();
    } finally {
      setLoadingId(null);
    }
  };
  const updateCourseStatus = async (
    courseIds: (number | string)[],
    currentStatus: string
  ) => {
    try {
      if (!courseIds || courseIds.length === 0) {
        handleNotifications("error", "No course IDs provided", "", 3);
        return;
      }
      showLoader();
      const newStatus = currentStatus === "Active" ? "Inactive" : "Active";
      const requestBody = {
        status: newStatus,
        ids: [courseIds],
      };

      const response: any = await axiosInstance.post(
        `${API_ENDPOINTS.CHANGE_COURSE_STATUS}`,
        requestBody
      );

      if (response?.settings?.success) {
        handleNotifications(
          "success",
          response?.settings?.message ||
            `Status changed to ${newStatus} successfully`,
          "",
          3
        );
        fetchCourseListing();
      }

      hideLoader();
    } catch (error) {
      hideLoader();
      handleNotifications("error", "Failed to update course status", "", 3);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setItemsPerPage(size);
    setCurrentPage(1);
  };

  const getVideoUrl = () => {
    return (
      courseListData &&
      courseListData.map((e: any) => e?.videoUrl).filter(Boolean)
    );
  };

  const isVideoData =
    courseListData && courseListData?.some((e: any) => e?.videoUrl);
  return (
    <div>
      {courseListData && courseListData?.length > 0 ? (
        courseListData &&
        courseListData?.map((course: any) => (
          <div
            key={course?.id}
            className={`flex gap-5 mb-5 rounded-[10px] p-[30px]  ${
              course?.status === "Active" ? "custom-card" : "disabled-card"
            }`}
          >
            <img
              className="rounded-[10px]"
              src={course?.imageUrl}
              alt={course?.courseTitle}
              style={{
                width: "234px",
                height: "234px",
                objectFit: "cover",
                flex: "0 0 auto !important",
              }}
            />
            <div className="flex flex-col w-full max-w-full">
              <div className="flex justify-between max-w-full">
                <div>
                  <div className="text-[#333333] text-[20px] font-normal">
                    {course?.courseTitle}
                  </div>

                  <div className="text-[#4F4F4F] line-clamp-1 text-[16px] font-normal mt-1 ">
                    {course?.description}
                  </div>
                  <div
                    className={`flex mt-1${
                      course?.videoUrl ? "cursor-pointer" : ""
                    }`}
                  >
                    <div onClick={() => hanldeVideoViewer(course)}>
                      <TagComponent
                        title={
                          <div className="!text-[16px] text-[#4F4F4F] font-normal">
                            {course?.courseType}
                          </div>
                        }
                        icon={<UserOutlined />}
                      />
                    </div>

                    {course?.isDisplayLibrary === 1 && (
                      <TagComponent
                        title={
                          <div className="!text-[16px] text-[#4F4F4F] font-normal pl-2">
                            {"Displayed in Library"}
                          </div>
                        }
                        icon={<DisplayedLibraryIcon />}
                      />
                    )}
                  </div>
                </div>
                <div className="">
                  <CoursesOptions
                    course={course}
                    onViewCourse={handleViewCourses}
                    handleDeleteCourse={handleDeleteCourse}
                    // @ts-ignore
                    updateCourseStatus={updateCourseStatus}
                    selectedSystem={selectedSystem}
                  />
                </div>
              </div>

              <div className="flex mt-5">
                <div className="flex-grow gap-0">
                  <div className="divider-level-table w-fit flex items-center">
                    <div className="p-[20px] list-data-wrapped flex flex-col items-center justify-center gap-[5px]">
                      <div className="text-[14px] text-[#828282] font-normal mr-2">
                        Expected Duration
                      </div>
                      <div className="text-[14px] !text-[#4F4F4F] font-normal mr-2">
                        {course?.duration + " " + "Mins"}
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
                            .unix(course?.modifiedDate / 1000)
                            .format("MMM DD, YYYY")}
                        </div>
                      </div>

                      <div className="flex items-center gap-1  mb-[11px]">
                        <ClockIcon />
                        {(() => {
                          const timeString = moment
                            .unix(course?.modifiedDate / 1000)
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
            </div>
          </div>
        ))
      ) : (
        <div className="custom-card py-40">
          <Empty
            description={
              <div className="text-[15px] text-gray-400 font-bold">
                No data available for the Courses.
              </div>
            }
          />
        </div>
      )}

      {!noData && (
        // <CommonPagination
        //   className="pagination"
        //   currentPage={currentPage}
        //   totalItems={totalItems}
        //   itemsPerPage={itemsPerPage}
        //   onPageChange={handlePageChange}
        //   onShowSizeChange={handlePageSizeChange}
        //   pageSizeOptions={[10, 20, 50]}
        // />
        <CommonPagination
          className="pagination phishingPagination"
          currentPage={currentPage}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          onShowSizeChange={undefined}
        />
      )}
      {openVideoView && currentVideoUrl && (
        <VideoViewer
          openVideoView={openVideoView}
          hanldeVideoViewer={hanldeVideoViewer}
          isVideoURL={getVideoUrl()}
        />
      )}
    </div>
  );
};

export default CourseListing;
