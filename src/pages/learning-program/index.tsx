import {useEffect, useState} from "react";
import DateRangePicker from "@/src/components/DateRangePicker";
import SidebarLayout from "@/src/components/Layout/SidebarLayout";
import {Button} from "antd";
import {FC} from "react";
import {NextRouter, useRouter} from "next/router";
import CategoriesList from "@/src/components/PhishingSimulation/CategoriesList";
import TemplatesNotificationTable from "@/src/components/Templates/TemplatesNotificationTable";
import SwitchToggle from "@/src/components/SwitchToggle";
import dayjs from "dayjs";
import CommonPagination from "@/src/components/CommonTable/paginnation";
import {useLoader} from "@/src/components/Loader/LoaderProvider";
import {DateRangeToMillisecond} from "@/src/helper/Utils";
import axiosInstance from "@/src/interceptors/Axios";
import {API_ENDPOINTS} from "@/src/interceptors/apiName";
import {useNotification} from "@/src/components/Notification";
import ThreeLinesIcon from "@/src/components/Icons/ThreeLines.Icon";

const TemplatesNotification: FC = () => {
  const router: NextRouter = useRouter();
  const [isSystem, setIsSystem] = useState<boolean>(false);
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | any>(
    []
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(10);
  const [totalItems, setTotalItems] = useState(26);
  const [selectedCategories, setSelectedCategories] = useState<any>(null);
  const loaderContext = useLoader();
  const {showLoader, hideLoader} = loaderContext;
  const [searchInput, setSearchInput] = useState("");
  const [notficationTemplatesDetails, setNotficationTemplatesDetails] =
    useState<any>([]);
  const [categoryCountsListData, setCategoryCountsListData] = useState<
    {
      categoryId: string | null;
      categoryCount: number;
    }[]
  >([]);
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC" | undefined>(
    "DESC"
  );
  const [sortedColumn, setSortedColumn] = useState<string>("addedDate");
  const [isHiddenData, setIsHiddenData] = useState<number>(0);
  const [draftCount, setDraftCount] = useState(0);
  const notificationContext = useNotification();
  const handleNotifications: any = notificationContext?.handleNotifications;
  const handleDateChange = (
    dates: [dayjs.Dayjs, dayjs.Dayjs] | null,
    dateStrings: [string, string]
  ) => {
    console.log("dates", dates);
    !dates ? setDateRange([]) : setDateRange(dates);
  };

  const handlePageChange = (page: React.SetStateAction<number>) => {
    setCurrentPage(page);
  };
  const handleColumnSort = (column: any) => {
    if (column === sortedColumn) {
      setSortOrder(sortOrder === "ASC" ? "DESC" : "ASC");
    } else {
      setSortedColumn(column);
      setSortOrder("ASC");
    }
  };

  const fetchTemplatesNotificationDetails = async () => {
    try {
      showLoader();
      let filters: any[] = [];
      const {startDateMs, endDateMs} = DateRangeToMillisecond(dateRange);
      if (startDateMs) {
        filters.push({key: "startDate", value: startDateMs});
      }
      if (endDateMs) {
        filters.push({key: "endDate", value: endDateMs});
      }
      if (selectedCategories) {
        filters.push({key: "categoryId", value: selectedCategories});
      }
      filters.push({key: "isHidden", value: isHiddenData});
      let body: any = {
        filters: filters,
        keyword: searchInput,
        page: currentPage,
        limit: pageLimit,
        sort: [{prop: sortedColumn, dir: sortOrder}],
      };
      if (isSystem) {
        body.isSystem = isSystem;
      }
      let phishingDetails: any = await axiosInstance.post(
        `${API_ENDPOINTS.GET_NOTFICATION_TEMPLATES}`,
        body
      );
      if (phishingDetails?.settings?.success) {
        setNotficationTemplatesDetails(phishingDetails?.data?.list);
        setTotalItems(phishingDetails?.settings?.count);
        setDraftCount(phishingDetails?.data?.draftCount);
        setCategoryCountsListData(phishingDetails?.data?.categoryCountsList);
      }
      hideLoader();
    } catch (error) {
      hideLoader();
    }
  };

  useEffect(() => {
    setSearchInput("");
  }, [selectedCategories]);

  const handleShowHiddenData = () => {
    const data = isHiddenData === 0 ? 1 : 0;
    setIsHiddenData(data);
  };
  const handleHiddeStatus = async (selectedCheckboxIds: any) => {
    setNotficationTemplatesDetails((prev: any) =>
      prev.map((el: any) => {
        const isMatched =
          el.notificationTemplateId ===
          selectedCheckboxIds?.notificationTemplateId;

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
          ids: [selectedCheckboxIds?.notificationTemplateId],
          moduleName: "NOTIFICATION_TEMPLATES",
        })
      );

      if (response?.settings?.success) {
        handleNotifications("success", "Status changed successfully", "", 3);
        fetchTemplatesNotificationDetails();
      }
    } catch (error) {
      console.log("error :>> ", error);
    }
  };

  useEffect(() => {
    fetchTemplatesNotificationDetails();
  }, [
    currentPage,
    searchInput,
    isSystem,
    dateRange,
    selectedCategories,
    sortedColumn,
    sortOrder,
    isHiddenData,
  ]);

  return (
    <SidebarLayout>
      <div>
        <div className="flex justify-between">
          <div className="text-[24px] font-[700] text-[#313D4F] mb-[30px]">
            Notification Templates
          </div>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            className="common-button common-button-light-blue"
            onClick={() => router.push("/learning-program/add")}
          >
            Create Notification Email
          </Button>
        </div>

        <div className="rounded-[14px] bg-[#FFFFFF] border border-[#E8E8E8] py-[21px] px-[31px]">
          <div className="flex justify-between">
            <div className="flex gap-5">
              <div className="flex space-x-[10px] text-nowrap items-center mx-[20px]">
                <SwitchToggle
                  checked={isHiddenData !== 0}
                  onChange={handleShowHiddenData}
                />
                <div className="text-[14px] text-[#4F4F4F] leading-[20px] font-normal">
                  Show Hidden Items
                </div>
              </div>
            </div>
            <DateRangePicker
              defaultValue={dateRange}
              value={dateRange}
              onChange={handleDateChange}
            />
          </div>

          <div className="flex flex-row gap-[31px] mt-[32px] !w-full !h-full">
            <div className="!w-1/4 !h-full">
              <CategoriesList
                selectedSystem={isSystem}
                setSelectedCategories={setSelectedCategories}
                selectedCategories={selectedCategories}
                isModulesCounts={
                  categoryCountsListData?.find((el) => el.categoryId == null)
                    ?.categoryCount ?? 0
                }
                icon={<ThreeLinesIcon />}
                totalItems={totalItems}
                isNewDataCount={categoryCountsListData}
              />
            </div>
            <div className="Phishing-Destination-Table !w-3/4 !h-full">
              <TemplatesNotificationTable
                selectedSystem={isSystem}
                dateRange={dateRange}
                setCurrentPage={setCurrentPage}
                setPageLimit={setPageLimit}
                setTotalItems={setTotalItems}
                currentPage={currentPage}
                pageLimit={pageLimit}
                totalItems={totalItems}
                handlePageChange={handlePageChange}
                selectedCategories={selectedCategories}
                notficationTemplatesDetails={notficationTemplatesDetails}
                fetchTemplatesNotificationDetails={
                  fetchTemplatesNotificationDetails
                }
                setSearchInput={setSearchInput}
                searchInput={searchInput}
                handleColumnSort={handleColumnSort}
                sortedColumn={sortedColumn}
                sortOrder={sortOrder}
                handleHiddeStatus={handleHiddeStatus}
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
    </SidebarLayout>
  );
};

export default TemplatesNotification;
