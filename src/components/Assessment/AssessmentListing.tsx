import {API_ENDPOINTS} from "@/src/interceptors/apiName";
import axiosInstance from "@/src/interceptors/Axios";
import {FC, useEffect, useState} from "react";
import {useLoader} from "../Loader/LoaderProvider";
import {Button, Checkbox} from "antd";
import {camelCase, DateRangeToMillisecond} from "@/src/helper/Utils";
import moment from "moment";
import EditIcon from "../Icons/EditIcon";
import {useRouter} from "next/router";
import DeleteIcon from "../Icons/DeleteIcon";
import CommonTable from "../CommonTable";
import MoveCategories from "../PhishingSimulation/MoveCategories";
import ActionsModal from "../Modals/ActionsModal";
import {useNotification} from "../Notification";
import ViewIcon from "../Icons/ViewIcon";
import dayjs from "dayjs";
import CommonPagination from "../CommonTable/paginnation";
import CategoriesList from "../PhishingSimulation/CategoriesList";
import DateRangePicker from "../DateRangePicker";
import PlusIconWhite from "../Icons/PlusIconWhite";

const AssessmentListing: FC = () => {
  const [isSystem, setIsSystem] = useState(false);
  const notificationContext = useNotification();
  const handleNotifications: any = notificationContext?.handleNotifications;
  const [searchInput, setSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(10);
  const [totalItems, setTotalItems] = useState(10);
  const [sortedColumn, setSortedColumn] = useState<string>("modifiedDate");
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC" | undefined>(
    "DESC"
  );
  const [surveyData, setSurveyData] = useState([]);
  const loaderContext = useLoader();
  const {showLoader, hideLoader} = loaderContext;
  const [selectedCheckboxIds, setSelectedCheckboxIDs] = useState<number[]>([]);
  const [selectRecord, setSelectRecord] = useState<any>();
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<any>(null);
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | any>(
    []
  );
  const [draftCount, setDraftCount] = useState(0);
  const [categoryCountsListData, setCategoryCountsListData] = useState<
    {
      categoryId: string | null;
      categoryCount: number;
    }[]
  >([]);
  const router = useRouter();
  useEffect(() => {
    fetchSurveys();
  }, [
    currentPage,
    searchInput,
    sortedColumn,
    sortOrder,
    searchInput,
    isSystem,
    selectedCategories,
    dateRange,
  ]);
  const handleColumnSort = (column: string) => {
    if (column === sortedColumn) {
      setSortOrder(sortOrder === "ASC" ? "DESC" : "ASC");
    } else {
      setSortedColumn(column);
      setSortOrder("ASC");
    }
  };
  const fetchSurveys = async () => {
    try {
      showLoader();
      let config: any = {
        page: currentPage,
        limit: pageLimit,
        keyword: searchInput,
        isSystem: isSystem ? 1 : 0,
        sort: [{prop: sortedColumn, dir: sortOrder}],
        filters: [],
      };
      if (dateRange && dateRange.length === 2) {
        const {startDateMs, endDateMs} = DateRangeToMillisecond(dateRange);

        config["filters"] = [
          {key: "startDate", value: startDateMs},
          {key: "endDate", value: endDateMs},
        ];
      }
      if (selectedCategories) {
        config["filters"] = [
          {
            key: "categoryId",
            value: selectedCategories,
          },
        ];
      }
      let surveyList: any = await axiosInstance.post(
        API_ENDPOINTS.ASSESSMENT_LIST,
        JSON.stringify(config)
      );
      if (surveyList?.settings?.success) {
        setSurveyData(surveyList?.data?.list);
        setTotalItems(surveyList?.settings?.count);
        setDraftCount(surveyList?.data?.draftCount);
        setCategoryCountsListData(surveyList?.data?.categoryCountsList);
      }
      hideLoader();
    } catch (error) {}
  };

  const deleteClick = async () => {
    try {
      const Url = `${API_ENDPOINTS.ASSESSMENT_DELETE}/${selectRecord?.assessmentId}`;
      const surveyDelete: any = await axiosInstance.delete(Url);
      if (surveyDelete?.settings?.success) {
        handleNotifications(
          `success`,
          `${surveyDelete?.settings?.message}`,
          ``,
          3
        );

        fetchSurveys();
        setIsDeleteModalVisible(false);
      } else {
        handleNotifications(
          `error`,
          `${surveyDelete?.settings?.message}`,
          ``,
          3
        );
      }
    } catch (error) {
      handleNotifications("error", "Something went wrong", "", 3);
    }
  };

  const handlePageChange = (page: React.SetStateAction<number>) => {
    setCurrentPage(page);
  };
  const columnAssessment = [
    {
      title: "Assessment Name",
      sorter: surveyData.length === 0 ? false : true,
      sortOrder: sortedColumn === "assessmentTitle" ? sortOrder : undefined,
      onHeaderCell: () => ({
        onClick:
          surveyData.length > 0
            ? () => handleColumnSort("assessmentTitle")
            : undefined,
      }),
      dataIndex: "assessmentTitle",
      render: (text: any, record: any) => {
        return (
          <div className="gap-[5px]">
            <span className="text-[14px] font-[600] ">{camelCase(text)}</span>
          </div>
        );
      },
    },
    {
      title: "Created On",
      dataIndex: "addedDate",
      sorter: surveyData.length === 0 ? false : true,
      sortOrder: sortedColumn === "addedDate" ? sortOrder : undefined,
      onHeaderCell: () => ({
        onClick: () =>
          surveyData.length > 0 ? handleColumnSort("addedDate") : undefined,
      }),
      render: (text: any, record: any) => (
        <span className="text-[14px] font-[600] ">
          {moment
            .unix(record?.addedDate / 1000)
            .format("MMM D, YYYY, hh:mm:ss A")}
        </span>
      ),
    },

    {
      title: "Action",
      dataIndex: "templateName",
      render: (text: any, record: any) => (
        <div className="space-x-[10px] flex ">
          <span
            className="cursor-pointer"
            onClick={() =>
              router.push(`/assessment/view/${record?.assessmentId}`)
            }
          >
            <ViewIcon />
          </span>
          <span
            className="cursor-pointer"
            onClick={() => router.push(`/assessment/${record?.assessmentId}`)}
          >
            <EditIcon />
          </span>
          {!isSystem && (
            <span
              className="cursor-pointer"
              onClick={() => {
                setSelectRecord(record);
                setIsDeleteModalVisible(true);
              }}
            >
              <DeleteIcon />
            </span>
          )}
        </div>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys: selectedCheckboxIds,
    onChange: (newSelectedRowKeys: any) => {
      setSelectedCheckboxIDs(newSelectedRowKeys);
    },
  };
  const handleDateChange = (
    dates: [dayjs.Dayjs, dayjs.Dayjs] | null,
    dateStrings: [string, string]
  ) => {
    setDateRange(dates);
  };

  return (
    <>
      <div className="w-full">
        <div className="flex justify-between items-center mb-[20px]">
          <div className="heading-title">Assessment</div>
          <div className="flex gap-5">
            <DateRangePicker
              defaultValue={dateRange}
              value={dateRange}
              onChange={handleDateChange}
            />
            {!isSystem && (
              <Button
                type="primary"
                className="custom-heading-btn flex items-center gap-[5px] !h-[40px]"
                onClick={() => router.push("/assessment/add")}
              >
                <PlusIconWhite /> Create New Assessment
              </Button>
            )}
          </div>
        </div>

        <div className="rounded-[14px] bg-[#FFFFFF] border border-[#E8E8E8] py-[21px] px-[31px]">
          <div className="flex flex-row gap-[31px] mt-[32px] !w-full !h-full">
            <div className="!w-[233px] !h-full">
              <CategoriesList
                selectedSystem={isSystem}
                setSelectedCategories={setSelectedCategories}
                selectedCategories={selectedCategories}
                isModulesCounts={
                  categoryCountsListData?.find((el) => el.categoryId == null)
                    ?.categoryCount ?? 0
                }
                isNewDataCount={categoryCountsListData}
                totalItems={totalItems}
                isSurveysCategories={true}
              />
            </div>
            <div className="Phishing-Destination-Table !w-full !h-full">
              <CommonTable
                rowSelection={rowSelection}
                columns={columnAssessment}
                apiData={surveyData}
                searchInput={searchInput}
                rowClassName={(record: {assessmentId: any}) =>
                  selectedCheckboxIds.includes(record?.assessmentId)
                    ? "selected-item-table"
                    : ""
                }
                rowKey={(record) => record.assessmentId}
                setSearchInput={setSearchInput}
                child={
                  <>
                    <div className="flex gap-[30px] justify-between">
                      <div className="text-[16px] font-bold text-[#333333] mt-2">
                        All Assessments
                      </div>
                      {selectedCheckboxIds.length > 0 && (
                        <div className="mr-[20px]">
                          <MoveCategories
                            selectedCheckboxIds={selectedCheckboxIds}
                            fetchPhishingDestinationDetails={fetchSurveys}
                            setSelectedCheckboxIDs={setSelectedCheckboxIDs}
                          />
                        </div>
                      )}
                    </div>
                  </>
                }
              />
              <ActionsModal
                title=""
                type="delete"
                isOpen={isDeleteModalVisible}
                onCancel={() => setIsDeleteModalVisible(false)}
                onOk={deleteClick}
                footer={false}
                centered={true}
                closable={false}
                maskClosable={true}
                className="delete-modal"
                cancelBtnClass="cancleBtnAction"
                cancelBtnClick={() => setIsDeleteModalVisible(false)}
                cancelButtonProps="Cancel"
                saveBtnClass="saveBtnAction"
                saveBtnClick={deleteClick}
                saveButtonProps="Delete"
                mainTitle="Are you sure?"
                description={`Do you really want to delete this survey?`}
              />
            </div>
          </div>
        </div>
        <CommonPagination
          className="pagination"
          currentPage={currentPage}
          totalItems={totalItems}
          itemsPerPage={pageLimit}
          onPageChange={handlePageChange}
          onShowSizeChange={undefined}
        />
      </div>
      <ActionsModal
        title=""
        type="delete"
        isOpen={isDeleteModalVisible}
        onCancel={() => setIsDeleteModalVisible(false)}
        onOk={deleteClick}
        footer={false}
        centered={true}
        closable={false}
        maskClosable={true}
        className="delete-modal"
        cancelBtnClass="cancleBtnAction"
        cancelBtnClick={() => setIsDeleteModalVisible(false)}
        cancelButtonProps="Cancel"
        saveBtnClass="saveBtnAction"
        saveBtnClick={deleteClick}
        saveButtonProps="Delete"
        mainTitle="Are you sure?"
      />
    </>
  );
};
export default AssessmentListing;
