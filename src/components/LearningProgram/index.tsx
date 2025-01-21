import {FC, useEffect, useState} from "react";
import {useNotification} from "../Notification";
import {camelCase} from "@/src/helper/Utils";
import EditIcon from "../Icons/EditIcon";
import {useRouter} from "next/router";
import DeleteIcon from "../Icons/DeleteIcon";
import ActionsModal from "../Modals/ActionsModal";
import {Button, MenuProps, Space} from "antd";
import PlusIconWhite from "../Icons/PlusIconWhite";
import CommonPagination from "../CommonTable/paginnation";
import CommonTable from "../CommonTable";
import {useLoader} from "../Loader/LoaderProvider";
import axiosInstance from "@/src/interceptors/Axios";
import {API_ENDPOINTS} from "@/src/interceptors/apiName";
import moment from "moment";
import ProgressLine from "../ProgressLine";
import ViewIcon from "../Icons/ViewIcon";
import React from "react";

const LearningProgram: FC = () => {
  const notificationContext = useNotification();
  const getCurrentPage = sessionStorage.getItem("currentPage")
    ? sessionStorage.getItem("currentPage")
    : 1;

  console.log(getCurrentPage, "getCurrentPage");
  const handleNotifications: any = notificationContext?.handleNotifications;
  const [searchInput, setSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState<any>(getCurrentPage);
  const [pageLimit, setPageLimit] = useState(10);
  const [totalItems, setTotalItems] = useState(10);
  const [sortedColumn, setSortedColumn] = useState<string>("modifiedDate");
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC" | undefined>(
    "DESC"
  );
  const [selectRecord, setSelectRecord] = useState<any>();
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [Source, setSource] = useState<any>([]);
  const router = useRouter();
  const [selectedCheckboxIds, setSelectedCheckboxIDs] = useState<any[]>([]);
  const [status, setStatus] = useState("");
  const loaderContext = useLoader();
  const {showLoader, hideLoader} = loaderContext;
  useEffect(() => {
    fetchSource();
  }, [currentPage, searchInput, sortedColumn, sortOrder, searchInput, status]);
  const fetchSource = async () => {
    try {
      showLoader();
      let config: any = {
        page: currentPage,
        limit: pageLimit,
        keyword: searchInput,
        sort: [{prop: sortedColumn, dir: sortOrder}],
        filters: [],
      };
      if (status) {
        config["filters"] = [
          {
            key: "status",
            value: status,
          },
        ];
      }
      let deptList: any = await axiosInstance.post(
        `${API_ENDPOINTS.CAMPAIGN_LIST}`,
        JSON.stringify(config)
      );
      if (deptList?.settings?.success) {
        setSource(deptList?.data);
        setTotalItems(deptList?.settings?.count);
      } else {
        setSource([]);
      }
      hideLoader();
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
  const columns = [
    {
      title: "Name",
      dataIndex: "programName",
      sorter: Source.length == 0 ? false : true,
      sortOrder: sortedColumn === "programName" ? sortOrder : undefined,
      onHeaderCell: () => ({
        onClick: () =>
          Source.length > 0 ? handleColumnSort("programName") : null,
      }),
      render: (text: any, record: any) => (
        <div className="flex-col">
          <div
            className={`tag ${
              record?.status === "Enrolling" ? "success" : "warn"
            } !rounded-[5px] mb-[10px]`}
          >
            {record?.status}
          </div>
          <div className="text-[14px] font-[600]  ">{camelCase(text)}</div>
          <div className="text-[#4F4F4F] text-[12px] font-[400]">
            {moment(parseInt(record?.startDate)).format("MM/DD/YYYY")}
            {record?.endDate &&
              `- ${moment(parseInt(record?.endDate)).format("MM/DD/YYYY")}`}
          </div>
        </div>
      ),
    },
    {
      title: "Total Duration",
      dataIndex: "totalDuration",
      sorter: Source.length === 0 ? false : true,
      sortOrder: sortedColumn === "totalDuration" ? sortOrder : undefined,
      onHeaderCell: () => ({
        onClick: () =>
          Source.length > 0 ? handleColumnSort("totalDuration") : undefined,
      }),
      render: (text: any, record: any) => (
        <span className="text-[14px] font-[600] ">
          {record?.totalDuration || 0} Minutes
        </span>
      ),
    },
    {
      title: "Complete %",
      dataIndex: "completion",

      render: (text: any, record: any) => {
        return (
          <div className="flex flex-col text-[14px] text-[#4F4F4F] font-[600] space-y-2">
            <div>{record?.completion}% Completed</div>

            <ProgressLine
              position="bottom"
              value={parseFloat(record?.completion) || 0}
            />
          </div>
        );
      },
    },

    {
      title: "Action",
      dataIndex: "templateName",
      render: (text: any, record: any) => (
        <Space className=" flex ">
          <span
            className="cursor-pointer"
            onClick={() => {
              {
                router.push(
                  `/learning-program/view-details/${record?.campaignId}`
                );
                sessionStorage.setItem("currentPage", currentPage);
              }
            }}
          >
            <ViewIcon />
          </span>

          <span
            className="cursor-pointer"
            onClick={() =>
              router.push(`/learning-program/${record?.campaignId}`)
            }
          >
            <EditIcon />
          </span>

          <span
            className="cursor-pointer"
            onClick={() => {
              setSelectRecord(record);
              setIsDeleteModalVisible(true);
            }}
          >
            <DeleteIcon />
          </span>
        </Space>
      ),
    },
  ];
  const deleteClick = async () => {
    try {
      const deleteRec: any = await axiosInstance.delete(
        `${API_ENDPOINTS.CAMPAIGN_DELETE}/${selectRecord?.campaignId}`
      );
      if (deleteRec?.settings?.success) {
        handleNotifications(
          "success",
          "Learning program deleted successfully",
          "",
          3
        );
        setIsDeleteModalVisible(false);
        fetchSource();
      }
    } catch (error) {}
  };
  const handlePageChange = (page: React.SetStateAction<number>) => {
    setCurrentPage(page);
  };
  const rowSelection = {
    selectedRowKeys: selectedCheckboxIds,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      console.log("newSelectedRowKeys :>> ", newSelectedRowKeys);
      setSelectedCheckboxIDs(newSelectedRowKeys);
    },
  };

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: <a>All</a>,
      onClick: () => {
        setStatus("");
      },
    },
    {
      key: "2",
      label: <a>Active</a>,
      onClick: () => {
        setStatus("Active");
      },
    },
    {
      key: "3",
      label: <a>Inactive</a>,
      onClick: () => {
        setStatus("Inactive");
      },
    },
    {
      key: "4",
      label: <a>Inprogress</a>,
      onClick: () => {
        setStatus("Inprogress");
      },
    },
  ];
  return (
    <>
      <div className="w-full">
        <div className="flex justify-between items-center mb-[20px]">
          <div className="heading-title">Learning Programs</div>
          <div>
            <Button
              type="primary"
              className="custom-heading-btn flex items-center gap-[5px] !h-[40px]"
              onClick={() => router.push("/learning-program/add")}
            >
              <PlusIconWhite /> Create Training Program
            </Button>
          </div>
        </div>

        {/* <div className="rounded-[14px] bg-[#FFFFFF] border border-[#E8E8E8] py-[21px] px-[31px]">
         */}
        <CommonTable
          // rowSelection={rowSelection}
          columns={columns}
          apiData={Source}
          placeholderTextClass="search"
          searchBoxStyle={{
            borderRadius: "4px",
            border: "1px solid  #E8E8E8",
            background: "#F5F6FA",
          }}
          searchInput={searchInput}
          rowClassName={(record: {departmentId: any}) =>
            selectedCheckboxIds.includes(record?.departmentId)
              ? "selected-item-table"
              : ""
          }
          rowKey={(record) => record.departmentId}
          setSearchInput={setSearchInput}
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
          description={`Do you really want to delete this learning program?`}
        />
        {/* </div> */}

        <CommonPagination
          className="pagination"
          currentPage={currentPage}
          totalItems={totalItems}
          itemsPerPage={pageLimit}
          onPageChange={handlePageChange}
          onShowSizeChange={undefined}
        />
      </div>
    </>
  );
};
export default LearningProgram;
