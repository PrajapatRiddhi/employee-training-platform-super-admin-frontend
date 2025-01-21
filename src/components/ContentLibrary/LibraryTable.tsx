import CommonTable from "@/src/components/CommonTable";
import {useLoader} from "@/src/components/Loader/LoaderProvider";
import {API_ENDPOINTS} from "@/src/interceptors/apiName";
import axiosInstance from "@/src/interceptors/Axios";
import {FC, useEffect, useState} from "react";
import DeleteIcon from "../Icons/DeleteIcon";
import {NextRouter, useRouter} from "next/router";
import {useNotification} from "../Notification";
import {Tag} from "antd";
import moment from "moment";
import SwitchToggle from "../SwitchToggle";
import PenSquareIcon from "../Icons/PenSquareIcon";
import LibraryFilterSection from "./LibraryFilterSection";
import EditContentTitle from "./EditContentTitle";
import ActionsModal from "../Modals/ActionsModal";
import InformationCircleIcon from "../Icons/InformationCircleIcon";

interface LibraryTableProps {
  selectedSystem: boolean;
  setCurrentPage: any;
  setPageLimit: any;
  setTotalItems: any;
  currentPage: any;
  pageLimit: any;
  totalItems: any;
  handlePageChange: (props: any) => void;
}

const LibraryTable: FC<LibraryTableProps> = ({
  selectedSystem,
  setCurrentPage,
  setPageLimit,
  setTotalItems,
  currentPage,
  pageLimit,
  totalItems,
  handlePageChange,
}) => {
  const [libraryData, setLibraryDetails] = useState<any>([]);
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setContentTypeFilter] = useState<string>("");

  const handleContentTypeChange = (value: any) => {
    setContentTypeFilter(value);
  };

  const [selectedEditId, SetSelectedEditId] = useState(null);
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [openEditMode, setOpenEditMode] = useState(false);
  const [selectedContent, setSelectedContent] = useState<{
    courseTitle: string;
    courseType: string;
    description: string;
    duration: number;
    isDisplayLibrary: number;
    image: any;
    categoryId: any;
    id: number;
  } | null>(null);
  const [sortedColumn, setSortedColumn] = useState<string>("modifiedDate");
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC" | undefined>(
    "DESC"
  );
  const notificationContext = useNotification();
  const handleNotifications: any = notificationContext?.handleNotifications;
  const loaderContext = useLoader();
  const {showLoader, hideLoader} = loaderContext;
  const router: NextRouter = useRouter();
  const [selectRecord, setSelectRecord] = useState<any>();
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isHiddenData, setIsHiddenData] = useState<number>(0);

  const handleDeleteClick = (record: any) => {
    setSelectRecord(record);
    setIsDeleteModalVisible(true);
  };

  const handleEditMode = (content: {
    courseTitle: string;
    id: number;
    courseType: string;
    description: string;
    duration: number;
    isDisplayLibrary: number;
    image: any;
    categoryId: any;
  }) => {
    setSelectedContent(content);
    setOpenEditMode(true);
  };

  const handleShowHiddenData = () => {
    const data = isHiddenData === 0 ? 1 : 0;
    setIsHiddenData(data);
  };
  // const handleHiddeStatus = async (selectedCheckboxIds: any) => {
  //   try {
  //     let newStatus = 0;
  //     if (selectedCheckboxIds.length > 0) {
  //       newStatus = 1;
  //     }
  //     let response: any = await axiosInstance.post(
  //       `${API_ENDPOINTS.HIDDEN_RECORD}`,
  //       JSON.stringify({
  //         isHidden: selectedCheckboxIds?.isHidden === 0 ? 1 : 0,
  //         ids: [selectedCheckboxIds?.courseId],
  //         moduleName: "COURSE",
  //       })
  //     );

  //     if (response?.settings?.success) {
  //       handleNotifications("success", "Status changed successfully", "", 3);
  //       fetchContentLibrayDetails();
  //     }
  //   } catch (error) {
  //     console.log("error :>> ", error);
  //   }
  // };

  const handleHiddeStatus = async (selectedCheckboxIds: any) => {
    setLibraryDetails((prev: any) =>
      prev.map((el: any) => {
        const isMatched = el.courseId === selectedCheckboxIds?.courseId;
        if (!isMatched) {
          return el;
        }
        return {
          ...el,
          isHidden: selectedCheckboxIds?.isHidden === 0 ? 1 : 0,
        };
      })
    );
    try {
      let newStatus = 0;
      if (selectedCheckboxIds.length > 0) {
        newStatus = 1;
      }
      let response: any = await axiosInstance.post(
        `${API_ENDPOINTS.HIDDEN_RECORD}`,
        JSON.stringify({
          isHidden: selectedCheckboxIds?.isHidden === 0 ? 1 : 0,
          ids: [selectedCheckboxIds?.courseId],
          moduleName: "COURSE",
        })
      );

      if (response?.settings?.success) {
        handleNotifications("success", "Status changed successfully", "", 3);
        fetchContentLibrayDetails();
      }
    } catch (error) {
      console.log("error :>> ", error);
    }
  };

  useEffect(() => {
    fetchContentLibrayDetails();
  }, [
    currentPage,
    searchInput,
    selectedSystem,
    statusFilter,
    sortedColumn,
    sortOrder,
    isHiddenData,
  ]);

  const fetchContentLibrayDetails = async () => {
    try {
      showLoader();

      let filters: {key: string; value: string | number}[] = statusFilter
        ? [{key: "courseType", value: statusFilter}]
        : [
            {
              key: "isDisplayLibrary",
              value: 1,
            },
          ];

      // if (isHiddenData) {
        filters.push({key: "isHidden", value: isHiddenData});
      // }

      let body: any = {
        filters,
        keyword: searchInput,
        page: currentPage,
        limit: pageLimit,
        sort: [{prop: sortedColumn, dir: sortOrder}],
      };

      if (selectedSystem) {
        body.isSystem = selectedSystem;
      }

      let libraryAction: any = await axiosInstance.post(
        `${API_ENDPOINTS.Course_Listing_API}`,
        body
      );

      if (libraryAction?.settings?.success) {
        setLibraryDetails(libraryAction?.data);
        setTotalItems(libraryAction?.settings?.count);
      }

      hideLoader();
    } catch (error) {
      hideLoader();
      console.error("Failed to fetch content library details:", error);
    }
  };

  const handleDelete = async () => {
    try {
      console.log('record :>> ', selectRecord);
      if (!selectRecord) return;
      const delTemp: any = await axiosInstance.delete(
        `${API_ENDPOINTS.Update_Course_API}/${selectRecord?.courseId}`
      );

      if (delTemp?.settings?.success) {
        handleNotifications(`success`, `${delTemp?.settings?.message}`, ``, 3);

        fetchContentLibrayDetails();
        setIsDeleteModalVisible(false);
      }
    } catch (error) {}
  };

  const handleColumnSort = (column: string) => {
    if (column === sortedColumn) {
      setSortOrder(sortOrder === "ASC" ? "DESC" : "ASC");
    } else {
      setSortedColumn(column);
      setSortOrder("ASC");
    }
  };

  const column = [
    {
      title: "Content Title",
      dataIndex: "courseTitle",
      sorter: libraryData.length === 0 ? false : true,
      sortOrder: sortedColumn === "courseTitle" ? sortOrder : undefined,
      onHeaderCell: () => ({
        onClick: () =>
          libraryData.length === 0 ? null : handleColumnSort("courseTitle"),
      }),
      render: (text: any, record: any) => (
        <div className="flex justify-between">
          <div className="text-[14px] font-[600]">{text}</div>
          <div
            onClick={() =>
              handleEditMode({
                courseTitle: text,
                id: record.courseId,
                courseType: record.courseType,
                description: record.description,
                duration: record.duration,
                isDisplayLibrary: record.isDisplayLibrary,
                image: record.image,
                categoryId: record.categoryId,
              })
            }
            className="cursor-pointer"
          >
            <PenSquareIcon />
          </div>
        </div>
      ),
    },
    {
      title: "Content Type",
      dataIndex: "courseType",
      sorter: libraryData.length === 0 ? false : true,
      sortOrder: sortedColumn === "courseType" ? sortOrder : undefined,
      onHeaderCell: () => ({
        onClick: () =>
          libraryData.length === 0 ? null : handleColumnSort("courseType"),
      }),
      render: (text: any, record: any) => (
        <span className="text-[14px] font-[600] ">{text}</span>
      ),
    },
    {
      title: "Status",
      dataIndex: "isHidden",
      sorter: libraryData.length === 0 ? false : true,
      sortOrder: sortedColumn === "isHidden" ? sortOrder : undefined,
      onHeaderCell: () => ({
        onClick: () =>
          libraryData.length === 0 ? null : handleColumnSort("isHidden"),
      }),
      render: (text: any, record: any) => (
        <div>
          <Tag className={`tag ${record.isHidden === 0 ? "success" : "error"}`}>
            {record.isHidden === 0 ? "Published" : "Archive"}
          </Tag>
        </div>
      ),
    },
    {
      title: "Date Added",
      dataIndex: "addedDate",
      sorter: libraryData.length === 0 ? false : true,
      sortOrder: sortedColumn === "addedDate" ? sortOrder : undefined,
      onHeaderCell: () => ({
        onClick: () =>
          libraryData.length === 0 ? null : handleColumnSort("addedDate"),
      }),
      render: (text: any, record: any) => (
        <span className="text-[14px] font-[600] ">
          {moment.unix(record?.addedDate / 1000).format("MMM DD, YYYY")}
        </span>
      ),
    },
    {
      title: "Duration",
      dataIndex: "duration",
      sorter: libraryData.length === 0 ? false : true,
      sortOrder: sortedColumn === "duration" ? sortOrder : undefined,
      onHeaderCell: () => ({
        onClick: () =>
          libraryData.length === 0 ? null : handleColumnSort("duration"),
      }),
      render: (text: any, record: any) => (
        <span className="text-[14px] font-[600] ">{`${text} Minutes `}</span>
      ),
    },
    {
      title: "Action",
      dataIndex: "contentId",
      render: (id: number, record: any) => (
        <div className="flex gap-2 cursor-pointer">
          {!selectedSystem && (
            <>
              <div title="Show information">
                <InformationCircleIcon />
              </div>
              <div
                onClick={() => {
                  handleDeleteClick(record);
                }}
              >
                <DeleteIcon />
              </div>
              <div>
                <SwitchToggle
                  checked={record?.isHidden || false}
                  onChange={() => handleHiddeStatus(record)}
                />
              </div>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <div>
        <CommonTable
          columns={column}
          apiData={libraryData}
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          // showSearchInput={false}
          showSearchContent={
            <div className="flex  gap-2">
              {" "}
              <div className="flex space-x-[10px] text-nowrap items-center mx-[20px]">
                <SwitchToggle
                  checked={isHiddenData !== 0}
                  onChange={handleShowHiddenData}
                />
                <div className="text-[14px] text-[#4F4F4F] leading-[20px] font-normal">
                  {" "}
                  Show Hidden Items
                </div>
              </div>
            </div>
          }
          child={
            <div>
              <LibraryFilterSection
                searchInput={searchInput}
                setSearchInput={setSearchInput}
                statusFilter={statusFilter}
                handleContentTypeChange={handleContentTypeChange}
              />
            </div>
          }
        />
      </div>
      {selectedContent && (
        <EditContentTitle
          openEditMode={openEditMode}
          handleEditMode={() => setOpenEditMode(false)}
          contentData={{
            courseTitle: selectedContent.courseTitle,
            courseType: selectedContent.courseType,
            description: selectedContent.description,
            duration: selectedContent.duration,
            isDisplayLibrary: selectedContent.isDisplayLibrary,
            image: selectedContent.image,
            categoryId: selectedContent.categoryId,
          }}
          courseId={selectedContent.id}
          fetchContentLibrayDetails={fetchContentLibrayDetails}
        />
      )}
      <ActionsModal
        title=""
        type="delete"
        isOpen={isDeleteModalVisible}
        onCancel={() => setIsDeleteModalVisible(false)}
        onOk={handleDelete}
        footer={false}
        centered={true}
        closable={false}
        maskClosable={false}
        className="delete-modal"
        cancelBtnClass="cancleBtnAction"
        cancelBtnClick={() => setIsDeleteModalVisible(false)}
        cancelButtonProps="Cancel"
        saveBtnClass="saveBtnAction"
        saveBtnClick={handleDelete}
        saveButtonProps="Delete"
        mainTitle="Are you sure?"
      />
    </div>
  );
};

export default LibraryTable;
