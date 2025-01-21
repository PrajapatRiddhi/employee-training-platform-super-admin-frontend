import CommonTable from "@/src/components/CommonTable";
import {useLoader} from "@/src/components/Loader/LoaderProvider";
import {API_ENDPOINTS} from "@/src/interceptors/apiName";
import axiosInstance from "@/src/interceptors/Axios";
import {FC, useEffect, useState} from "react";
import DeleteIcon from "../Icons/DeleteIcon";
import {useNotification} from "../Notification";
import {Select} from "antd";
import moment from "moment";
import ActionsModal from "../Modals/ActionsModal";
import ViewIcon from "../Icons/ViewIcon";
import {NextRouter, useRouter} from "next/router";
import {CaretDownOutlined} from "@ant-design/icons";
import React from "react";
import CommonPagination from "../CommonTable/paginnation";
import WhiteArchiveIcon from "../Icons/WhiteArchiveIcon";
const {Option} = Select;

interface ManageGroupsListingProps {
  setCurrentPage: any;
  setPageLimit: any;
  setTotalItems: any;
  currentPage: any;
  pageLimit: any;
  totalItems: any;
  selectedCategories?: any;
  statusFilter?: any;
  handleStatusChange?: (value: any) => void;
  typeFilter?: any;
  handleTypeChange?: (value: any) => void;
}

const ManageGroupsListing: FC<ManageGroupsListingProps> = ({
  setCurrentPage,
  setPageLimit,
  setTotalItems,
  currentPage,
  totalItems,
  pageLimit,
  statusFilter,
  handleStatusChange,
  typeFilter,
  handleTypeChange,
}) => {
  const [groupData, setGroupDetails] = useState<any>([]);
  const [searchInput, setSearchInput] = useState("");
  const [contentTypeFilter, setContentTypeFilter] = useState<string>("");
  const [sortedColumn, setSortedColumn] = useState<string>("groupId");
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC" | undefined>(
    "DESC"
  );
  const notificationContext = useNotification();
  const handleNotifications: any = notificationContext?.handleNotifications;
  const loaderContext = useLoader();
  const {showLoader, hideLoader} = loaderContext;
  const [selectRecord, setSelectRecord] = useState<any>();
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [selectedEditId, SetSelectedEditId] = useState(null);
  const router: NextRouter = useRouter();
  const [selectedCheckboxIds, setSelectedCheckboxIDs] = useState<number[]>([]);

  const handleViewGroup = (record: any) => {
    SetSelectedEditId(record);
    router.push({
      pathname: `/users/manage-groups/view`,
      query: {id: record.groupId},
    });
  };

  const handleDeleteClick = (record: any) => {
    setSelectRecord(record);
    setIsDeleteModalVisible(true);
  };

  useEffect(() => {
    fetchGroupDetails();
  }, [
    currentPage,
    searchInput,
    contentTypeFilter,
    sortedColumn,
    sortOrder,
    statusFilter,
    typeFilter,
  ]);

  const fetchGroupDetails = async () => {
    try {
      showLoader();

      let filtersArray = [];
      if (statusFilter) {
        filtersArray.push({key: "status", value: statusFilter});
      }
      if (typeFilter) {
        filtersArray.push({key: "isNormalGroup", value: typeFilter});
      }
      let body: any = {
        filters: filtersArray,
        keyword: searchInput,
        page: currentPage,
        limit: pageLimit,
        sort: [{prop: sortedColumn, dir: sortOrder}],
      };

      let groupAction: any = await axiosInstance.post(
        `${API_ENDPOINTS.GROUP_LISTING}`,
        body
      );

      if (groupAction?.settings?.success) {
        setGroupDetails(groupAction?.data);
        setTotalItems(groupAction?.settings?.count);
      }

      hideLoader();
    } catch (error) {
      hideLoader();
      console.error("Failed to fetch content library details:", error);
    }
  };

  const handleDelete = async () => {
    try {
      if (!selectRecord) return;
      const delTemp: any = await axiosInstance.delete(
        `${API_ENDPOINTS.DELETE_USER_GROUP}/${selectRecord?.groupId}`
      );

      if (delTemp?.settings?.success) {
        handleNotifications(`success`, `${delTemp?.settings?.message}`, ``, 3);

        fetchGroupDetails();
        setIsDeleteModalVisible(false);
      }
    } catch (error) {}
  };

  const handleViewPolicie = (record: any) => {
    SetSelectedEditId(record);
    router.push({
      pathname: `/learning-program/view-policies`,
      query: {id: record.policyId},
    });
  };

  const handleEdit = (record: any) => {
    SetSelectedEditId(record);
    router.push({
      pathname: `/learning-program/edit-policies`,
      query: {id: record.policyId},
    });
  };

  const handleColumnSort = (column: string) => {
    if (column === sortedColumn) {
      setSortOrder(sortOrder === "ASC" ? "DESC" : "ASC");
    } else {
      setSortedColumn(column);
      setSortOrder("ASC");
    }
  };

  const rowSelection = {
    selectedRowKeys: selectedCheckboxIds,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedCheckboxIDs(newSelectedRowKeys as number[]);
    },
  };

  const bulkArchive = async () => {
    try {
      showLoader();
      const archiveUser: any = await axiosInstance.post(
        `${API_ENDPOINTS.CHANGE_STATUS_GROUP}`,
        JSON.stringify({
          ids: selectedCheckboxIds,
          status: statusFilter === "Inactive" ? "Active" : "Inactive",
        })
      );
      if (archiveUser?.settings?.success) {
        handleNotifications(
          "success",
          `Users ${
            statusFilter === "Inactive" ? "restored" : "archived"
          } successfully.`,
          "",
          5
        );
        fetchGroupDetails();
        setSelectedCheckboxIDs([]);
      }
      hideLoader;
    } catch (error) {
      hideLoader();
    }
  };

  const column = [
    {
      title: <div className="text-[14px]">Name</div>,
      dataIndex: "groupName",
      sorter: groupData.length === 0 ? false : true,
      sortOrder: sortedColumn === "groupName" ? sortOrder : undefined,
      onHeaderCell: () => ({
        onClick: () =>
          groupData.length === 0 ? null : handleColumnSort("groupName"),
      }),
      render: (text: any, record: any) => (
        <div className="flex ml-1">
          <div className="text-[14px] font-[600] text-[#4379EE] ml-2">
            {text}
          </div>
        </div>
      ),
    },
    {
      title: <div className="text-[14px]">Created on</div>,
      dataIndex: "addedDate",
      sorter: groupData.length === 0 ? false : true,
      sortOrder: sortedColumn === "addedDate" ? sortOrder : undefined,
      onHeaderCell: () => ({
        onClick: () =>
          groupData.length === 0 ? null : handleColumnSort("addedDate"),
      }),
      render: (text: any, record: any) => (
        <span className="text-[14px] font-[600] text-[#4F4F4F]">
          {moment.unix(record?.addedDate / 1000).format("MM/DD/YYYY")}
        </span>
      ),
    },
    {
      title: <div className="text-[14px]">Risk Booster</div>,
      dataIndex: "riskBooster",
      sorter: groupData.length === 0 ? false : true,
      sortOrder: sortedColumn === "riskBooster" ? sortOrder : undefined,
      onHeaderCell: () => ({
        onClick: () =>
          groupData.length === 0 ? null : handleColumnSort("riskBooster"),
      }),
      render: (text: any, record: any) => (
        <div>
          <div className="flex">
            <div
              className={`tag ${
                text === "Normal"
                  ? "bg-[#e0e8fd] text-center  font-nunito font-semibold text-[12px] leading-normal"
                  : "font-bold "
              }`}
            >
              <div style={{color: "#5A8CFF", fontWeight: "600"}}>{text}</div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: <div className="text-[14px]">Risk Score</div>,
      dataIndex: "documentType",
      sorter: groupData.length === 0 ? false : true,
      sortOrder: sortedColumn === "documentType" ? sortOrder : undefined,
      onHeaderCell: () => ({
        onClick: () =>
          groupData.length === 0 ? null : handleColumnSort("documentType"),
      }),
      render: (text: any, record: any) => (
        <div className="flex">
          <div className="text-[14px] font-[600] text-[#5A8CFF]">{text}</div>
        </div>
      ),
    },
    {
      title: <div className="text-[14px]">Members</div>,
      dataIndex: "userCount",
      sorter: groupData.length === 0 ? false : true,
      sortOrder: sortedColumn === "userCount" ? sortOrder : undefined,
      onHeaderCell: () => ({
        onClick: () =>
          groupData.length === 0 ? null : handleColumnSort("userCount"),
      }),
      render: (text: any, record: any) => (
        <div className="flex">
          <div className="text-[14px] font-[600] text-[#5A8CFF]">{text}</div>
        </div>
      ),
    },
    {
      title: <div className="text-[14px]">Action</div>,
      dataIndex: "contentId",
      render: (id: number, record: any) => (
        <div className="flex gap-2 cursor-pointer ">
          <>
            <div onClick={() => handleViewGroup(record)}>
              <ViewIcon />
            </div>

            <div
              onClick={() => {
                handleDeleteClick(record);
              }}
            >
              <DeleteIcon />
            </div>

            <div>
              {/* <span className="text-[14px] font-[600]">
                <SwitchToggle
                  onChange={(checked) => updateStatus(record?.policyId, record)}
                  checked={record?.status === "Archive"}
                />
              </span> */}
            </div>
          </>
        </div>
      ),
    },
  ];

  const handlePageChange = (page: React.SetStateAction<number>) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <div>
        <CommonTable
          rowSelection={rowSelection}
          columns={column}
          apiData={groupData}
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          showSearchInput={true}
          rowClassName={(record: {groupId: any}) =>
            selectedCheckboxIds.includes(record?.groupId)
              ? "selected-item-table"
              : ""
          }
          rowKey={(record) => record?.groupId}
          child={
            <div>
              <Select
                value={{
                  value: statusFilter,
                  label: (
                    <div className="flex gap-[5px]">
                      <span className="text-[16px] font-[700] leading-[24px] font-[Nunito Sans] !text-[#4F4F4F]">
                        Status:{" "}
                      </span>
                      <span className="text-[16px] font-[400] leading-[24px] font-[Nunito Sans] !text-[#4F4F4F]">
                        {statusFilter === "" ? "All" : statusFilter}
                      </span>
                    </div>
                  ),
                }}
                style={{
                  width:
                    statusFilter === ""
                      ? 108
                      : statusFilter === "Active"
                      ? 130
                      : 141,
                }}
                bordered={false}
                suffixIcon={
                  <div className="mr-[-5px]">
                    <div className="ml-[3px]">
                      <CaretDownOutlined />
                    </div>
                  </div>
                }
                onChange={handleStatusChange}
              >
                <Option value="">All</Option>
                <Option value="Active">Active</Option>
                <Option value="Inactive">Inactive</Option>
              </Select>

              <Select
                value={{
                  value: typeFilter,
                  label: (
                    <div className="flex gap-[5px]">
                      <span className="text-[16px] font-[700] leading-[24px] font-[Nunito Sans] !text-[#4F4F4F]">
                        Type:{" "}
                      </span>
                      <span className="text-[16px] font-[400] leading-[24px] font-[Nunito Sans] !text-[#4F4F4F]">
                        {typeFilter === ""
                          ? "All"
                          : typeFilter === "0"
                          ? "Automated"
                          : "Normal"}
                      </span>
                    </div>
                  ),
                }}
                style={{
                  width:
                    typeFilter === "" ? 100 : typeFilter === "0" ? 160 : 133,
                }}
                bordered={false}
                suffixIcon={<CaretDownOutlined />}
                onChange={handleTypeChange}
              >
                <Option value="">All</Option>
                <Option value="0">Automated</Option>
                <Option value="1">Normal</Option>
              </Select>
            </div>
          }
          child2={
            <div className="mr-2">
              {selectedCheckboxIds.length > 0 && (
                <div
                  onClick={bulkArchive}
                  className="bg-[#FF7492] rounded-[4px] hover:bg-[#FF7492] text-[#FFFFFF] hover:text-[#FFFFFF] focus:ring-0 focus:outline-none cursor-pointer  px-5 py-[6px]"
                >
                  <div className="flex gap-1 items-center">
                    <WhiteArchiveIcon />
                    <div className="text-[#FFFFFF] text-[16px] font-[600] leading-[24px] font-[Nunito Sans] text-nowrap">
                      {statusFilter === "Inactive" ? "Restore from" : "Bulk"}{" "}
                      Archive
                    </div>
                  </div>
                </div>
              )}
            </div>
          }
        />
      </div>

      {groupData?.length ? (
        <CommonPagination
          className="pagination"
          currentPage={currentPage}
          totalItems={totalItems}
          itemsPerPage={pageLimit}
          onPageChange={handlePageChange}
        />
      ) : null}

      <ActionsModal
        title=""
        type="delete"
        isOpen={isDeleteModalVisible}
        onCancel={() => setIsDeleteModalVisible(false)}
        onOk={handleDelete}
        footer={false}
        centered={true}
        closable={false}
        maskClosable={true}
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

export default ManageGroupsListing;
