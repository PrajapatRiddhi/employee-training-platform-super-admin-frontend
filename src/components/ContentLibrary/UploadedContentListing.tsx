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
import ContentOptions from "./ContentOptions";

interface UploadedContentListingProps {
  selectedSystem: boolean;
  statusFilter: any;
  searchInput: any;
}

const UploadedContentListing: FC<UploadedContentListingProps> = ({
  selectedSystem,
  statusFilter,
  searchInput,
}) => {
  const loaderContext = useLoader();
  const {showLoader, hideLoader} = loaderContext;
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedEditId, SetSelectedEditId] = useState(null);
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [noData, setNoData] = useState(false);
  const notificationContext = useNotification();
  const handleNotifications: any = notificationContext?.handleNotifications;
  const router: NextRouter = useRouter();
  const [uploadContentData, setUploadContentData] = useState<any>([]);
  const [pageLimit, setPageLimit] = useState(10);

  useEffect(() => {
    fetchContentDataDetails();
  }, [currentPage, searchInput, selectedSystem, statusFilter]);

  const fetchContentDataDetails = async () => {
    try {
      showLoader();

      let body: any = {
        filters: [{key: "status", value: statusFilter}],
        keyword: searchInput,
        page: currentPage,
        limit: pageLimit,
        sort: [],
      };

      if (selectedSystem) {
        body.isSystem = selectedSystem;
      }

      let libraryAction: any = await axiosInstance.post(
        `${API_ENDPOINTS.GET_CONTENT_LIBRARY}`,
        body
      );

      if (libraryAction?.settings?.success) {
        setUploadContentData(libraryAction?.data);
        setTotalItems(libraryAction?.settings?.count);
      }

      hideLoader();
    } catch (error) {
      hideLoader();
      console.error("Failed to fetch content library details:", error);
    }
  };

  const handleViewContent = (record: any) => {
    SetSelectedEditId(record);
    router.push({
      pathname: `/content/view-content`,
      query: {id: record.contentId},
    });
  };

  const handleDeleteContent = async (id: number) => {
    setLoadingId(id);
    try {
      const response = await axiosInstance.delete(
        `${API_ENDPOINTS.Delete_View__EDIT_CONTENT}/${id}`
      );
      // @ts-ignore
      if (response?.settings?.success) {
        handleNotifications("success", "Content deleted successfully", "", 3);
        fetchContentDataDetails();
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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setItemsPerPage(size);
    setCurrentPage(1);
  };

  const MAX_LENGTH = 100;

  const truncateText = (text: any) => {
    if (text.length > MAX_LENGTH) {
      return text.slice(0, MAX_LENGTH) + "...";
    }
    return text;
  };

  return (
    <div>
      {uploadContentData && uploadContentData?.length > 0 ? (
        uploadContentData &&
        uploadContentData?.map((content: any) => (
          <div
            key={content?.id}
            className="flex gap-5 mb-5 rounded-[10px] p-[30px] custom-card"
          >
            <img
              className="rounded-[10px]"
              src={content?.imageUrl}
              alt="dummy-img"
              style={{
                width: "234px",
                height: "234px",
                objectFit: "cover",
                flex: "0 0 auto !important",
              }}
            />
            <div className="flex flex-col w-full max-w-full">
              <div className="flex justify-between w-full max-w-full">
                <div>
                  <div className="text-[#333333] text-[20px] font-normal">
                    {content?.title}
                  </div>
                  <div className="text-[#4F4F4F] text-[16px] font-normal mt-1 line-clamp-1">
                    {truncateText(content?.description || "")}
                    
                  </div>
                  <div className="flex mt-1">
                    <TagComponent
                      title={
                        <div className="!text-[16px] text-[#4F4F4F] font-normal">
                          {content?.contentType}
                        </div>
                      }
                      icon={<UserOutlined />}
                    />

                    {content?.isDisplayLibrary === 1 && (
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
                  <ContentOptions
                    content={content}
                    onViewContent={handleViewContent}
                    handleDeleteContent={handleDeleteContent}
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
                        {content?.duration + " " + "Mins"}
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
                            .unix(content?.modifiedDate / 1000)
                            .format("MMM DD, YYYY")}
                        </div>
                      </div>

                      <div className="flex items-center gap-1  mb-[11px]">
                        <ClockIcon />
                        {(() => {
                          const timeString = moment
                            .unix(content?.modifiedDate / 1000)
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
        <CommonPagination
          className="pagination"
          currentPage={currentPage}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          onShowSizeChange={handlePageSizeChange}
          pageSizeOptions={[10, 20, 50]}
        />
      )}
    </div>
  );
};

export default UploadedContentListing;
