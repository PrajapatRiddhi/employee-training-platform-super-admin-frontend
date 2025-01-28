import {useEffect, useState} from "react";
import DateRangePicker from "@/src/components/DateRangePicker";
import SidebarLayout from "@/src/components/Layout/SidebarLayout";
import {Button} from "antd";
import {FC} from "react";
import {NextRouter, useRouter} from "next/router";
import SystemCompanySwitch from "@/src/components/SystemCompanySwitch";
import dayjs from "dayjs";
import CommonPagination from "@/src/components/CommonTable/paginnation";
import {useLoader} from "@/src/components/Loader/LoaderProvider";
import {DateRangeToMillisecond} from "@/src/helper/Utils";
import axiosInstance from "@/src/interceptors/Axios";
import {API_ENDPOINTS} from "@/src/interceptors/apiName";
import PhishingDestinationTable from "@/src/components/PhishingSimulation/PhishingDestinationTable";
import CategoriesList from "@/src/components/PhishingSimulation/CategoriesList";

const PhishingDestination: FC = () => {
  const router: NextRouter = useRouter();
  const getCurrentPage = sessionStorage.getItem("currentPage")
    ? sessionStorage.getItem("currentPage")
    : 1;

  const [currentPage, setCurrentPage] = useState<any>(getCurrentPage);
  const [pageLimit, setPageLimit] = useState(10);
  const [totalItems, setTotalItems] = useState(26);
  const [isSystem, setIsSystem] = useState<any>(0);
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | any>(
    []
  );
  const [sortedColumn, setSortedColumn] = useState<string>("addedDate");
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC" | undefined>(
    "DESC"
  );
  const [selectedCategories, setSelectedCategories] = useState<any>(null);
  const [phishingDestinationDetails, setPhishingDestinationDetails] =
    useState<any>([]);
  const [categoryCountsListData, setCategoryCountsListData] = useState<
    {
      categoryId: string | null;
      categoryCount: number;
    }[]
  >([]);

  const [searchInput, setSearchInput] = useState("");
  const [draftCount, setDraftCount] = useState(0);
  const loaderContext = useLoader();
  const {showLoader, hideLoader} = loaderContext;

  const handleDateChange = (
    dates: [dayjs.Dayjs, dayjs.Dayjs] | null,
    dateStrings: [string, string]
  ) => {
    !dates ? setDateRange([]) : setDateRange(dates);
  };

  const handlePageChange = (page: React.SetStateAction<number>) => {
    setCurrentPage(page);
  };

  const fetchPhishingDestinationDetails = async () => {
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
        `${API_ENDPOINTS.Phishing_Destination_API}`,
        body
      );

      if (phishingDetails?.settings?.success) {
        setPhishingDestinationDetails(phishingDetails?.data?.list || []);
        setTotalItems(phishingDetails?.settings?.count);
        setDraftCount(phishingDetails?.data?.draftCount);
        setCategoryCountsListData(phishingDetails?.data?.categoryCountsList);
      }
      console.log(phishingDetails?.data?.list, "temp");
      hideLoader();
    } catch (error) {
      hideLoader();
    }
  };

  useEffect(() => {
    setSearchInput("");
  }, [selectedCategories]);

  useEffect(() => {
    fetchPhishingDestinationDetails();
  }, [currentPage, searchInput, isSystem, dateRange, selectedCategories]);
  return (
    <SidebarLayout>
      <div>
        <div className="flex justify-between items-center">
          <div className="text-[24px] font-[700] text-[#313D4F] mb-[30px]">
            Phishing Destination Page
          </div>
          <div className="flex gap-5">
            <DateRangePicker
              defaultValue={dateRange}
              value={dateRange}
              onChange={handleDateChange}
            />
            {!isSystem && (
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                className="common-button common-button-light-blue"
                onClick={() =>
                  router.push("/phishing/phishing-destination/add")
                }
              >
                Create Phishing Destination
              </Button>
            )}
          </div>
        </div>

        <div className="rounded-[14px] bg-[#FFFFFF] border border-[#E8E8E8] py-[21px] px-[31px]">
          <div className="flex flex-row gap-[31px] mt-[32px] !w-full !h-full">
            <div className="!w-1/4 !h-full">
              <CategoriesList
                selectedSystem={isSystem}
                setSelectedCategories={setSelectedCategories}
                selectedCategories={selectedCategories}
                totalItems={totalItems}
                isModulesCounts={
                  categoryCountsListData?.find((el) => el.categoryId == null)
                    ?.categoryCount ?? 0
                }
                isNewDataCount={categoryCountsListData}
              />
            </div>
            <div className="Phishing-Destination-Table !w-3/4 !h-full">
              <PhishingDestinationTable
                selectedSystem={isSystem}
                dateRange={dateRange}
                setCurrentPage={setCurrentPage}
                setPageLimit={setPageLimit}
                setTotalItems={setTotalItems}
                currentPage={currentPage}
                pageLimit={pageLimit}
                totalItems={totalItems ? totalItems : 0}
                selectedCategories={selectedCategories}
                phishingDestinationDetails={phishingDestinationDetails}
                fetchPhishingDestinationDetails={
                  fetchPhishingDestinationDetails
                }
                setSearchInput={setSearchInput}
                searchInput={searchInput}
              />
            </div>
          </div>
        </div>
        <CommonPagination
          className="pagination phishingPagination"
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

export default PhishingDestination;
