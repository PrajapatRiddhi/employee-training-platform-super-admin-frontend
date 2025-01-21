import CommonTable from "@/src/components/CommonTable";
import {API_ENDPOINTS} from "@/src/interceptors/apiName";
import axiosInstance from "@/src/interceptors/Axios";
import {FC, useState} from "react";
import ViewIcon from "../Icons/ViewIcon";
import {NextRouter, useRouter} from "next/router";
import {useNotification} from "../Notification";
import moment from "moment";
import ActionsModal from "../Modals/ActionsModal";
import EditIcon from "../Icons/EditIcon";
import DeleteIcon from "../Icons/DeleteIcon";
import EmailPreview from "../EmailPreview";
import {Select, Input} from "antd";
import { CaretDownOutlined } from "@ant-design/icons";
import { AiOutlineCloseCircle } from "react-icons/ai";
const {Option} = Select;

interface BlogArticlesTableProps {
  setCurrentPage: any;
  setPageLimit: any;
  setTotalItems: any;
  currentPage: any;
  pageLimit: any;
  totalItems: any;
  handlePageChange: (props: any) => void;
  selectedCategories?: any;
  blogDetails?: any;
  fetchBlogArticalesDetails?: any;
  setSearchInput?: any;
  searchInput?: any;
  handleColumnSort?: any;
  sortedColumn?: any;
  sortOrder?: any;
}

const BlogArticlesTable: FC<BlogArticlesTableProps> = ({
  blogDetails,
  fetchBlogArticalesDetails,
  setSearchInput,
  searchInput,
  handleColumnSort,
  sortedColumn,
  sortOrder,
}) => {
  const [selectedEditId, SetSelectedEditId] = useState(null);
  const [selectedCheckboxIds, setSelectedCheckboxIDs] = useState<number[]>([]);
  const notificationContext = useNotification();
  const handleNotifications: any = notificationContext?.handleNotifications;
  const router: NextRouter = useRouter();
  const [selectRecord, setSelectRecord] = useState<any>();
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const handleEdit = (record: any) => {
    SetSelectedEditId(record);
    router.push({
      pathname: `/learning-program/edit-notification`,
      query: {id: record.notificationTemplateId},
    });
  };

  const handleDeleteClick = (record: any) => {
    setSelectRecord(record);
    setIsDeleteModalVisible(true);
  };

  const handleDelete = async () => {
    try {
      if (!selectRecord) return;
      const delTemp: any = await axiosInstance.delete(
        `${API_ENDPOINTS.VIEW_DELETE_EDIT_Notification_Template}/${selectRecord?.notificationTemplateId}`
      );

      if (delTemp?.settings?.success) {
        handleNotifications(`success`, `${delTemp?.settings?.message}`, ``, 3);

        fetchBlogArticalesDetails();
        setIsDeleteModalVisible(false);
      }
    } catch (error) {}
  };

  const handleViewTempNotfication = (record: any) => {
    SetSelectedEditId(record);
    setModalOpen(true);
  };

  const rowSelection = {
    selectedRowKeys: selectedCheckboxIds,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedCheckboxIDs(newSelectedRowKeys as any[]);
    },
  };

  const [statusFilter, setStatusFilter] = useState<string>("Published");

  const handleStatusChange = (value: any) => {
    setStatusFilter(value);
  };

  const column = [
    {
      title: "Title",
      dataIndex: "title",
      sorter: blogDetails.length === 0 ? false : true,
      sortOrder: sortedColumn === "title" ? sortOrder : undefined,
      onHeaderCell: () => ({
        onClick: () =>
          blogDetails.length === 0
            ? null
            : handleColumnSort("title"),
      }),
      render: (text: any) => (
        <span className="text-[14px] font-[600] text-[#4379EE]">{text}</span>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      sorter: blogDetails.length === 0 ? false : true,
      sortOrder: sortedColumn === "categoryName" ? sortOrder : undefined,
      onHeaderCell: () => ({
        onClick: () =>
          blogDetails.length === 0
            ? null
            : handleColumnSort("categoryName"),
      }),
      render: (text: any) => (
        <span className="text-[14px] font-[600] ">
          {text ? text : "Not Assigned"}
        </span>
      ),
    },

    {
      title: "Created on",
      dataIndex: "modifiedDate",
      sorter: blogDetails.length === 0 ? false : true,
      sortOrder: sortedColumn === "modifiedDate" ? sortOrder : undefined,
      onHeaderCell: () => ({
        onClick: () =>
          blogDetails.length === 0
            ? null
            : handleColumnSort("modifiedDate"),
      }),
      render: (text: any, record: any) => (
        <span className="text-[14px] font-[600] ">
          {moment.unix(record?.modifiedDate / 1000).format("MM/DD/YYYY")}
        </span>
      ),
    },
    {
      title: "Estimated Reading Time",
      dataIndex: "estimatedReadingTime",
      sorter: blogDetails.length === 0 ? false : true,
      sortOrder:
        sortedColumn === "estimatedReadingTime" ? sortOrder : undefined,
      onHeaderCell: () => ({
        onClick: () =>
          blogDetails.length === 0
            ? null
            : handleColumnSort("estimatedReadingTime"),
      }),
      render: (text: any) => (
        <span className="text-[14px] font-[600] text-[#4379EE]">{text}</span>
      ),
    },
    {
      title: "Action",
      dataIndex: "landingPageId",
      render: (id: number, record: any) => (
        <div className="flex gap-2 cursor-pointer">
          <div onClick={() => handleViewTempNotfication(record)}>
            <ViewIcon />
          </div>
          <div onClick={() => handleEdit(record)}>
            <EditIcon />
          </div>
          <div
            onClick={() => {
              handleDeleteClick(record);
            }}
          >
            <DeleteIcon />
          </div>
        </div>
      ),
    },
  ];
  const CloseModal = () => {
    setModalOpen(false);
  };
  return (
    <div>
      <CommonTable
        rowSelection={rowSelection}
        columns={column}
        apiData={blogDetails}
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        rowClassName={(record: {notificationTemplateId: any}) =>
          selectedCheckboxIds.includes(record?.notificationTemplateId)
            ? "selected-item-table"
            : ""
        }
        showSearchInput={false}
        rowKey={(record) => record.notificationTemplateId}
        child={
          <div className="flex w-full">
            <div className="flex gap-2">
              <Select
                value={{
                  value: statusFilter,
                  label: (
                    <div className="flex gap-[5px]">
                      <span className="text-[16px] font-[700] leading-[24px] font-[Nunito Sans] !text-[#4F4F4F]">
                        Status:{" "}
                      </span>
                      <span className="text-[16px] font-[400] leading-[24px] font-Nunito Sans !text-[#4F4F4F]">
                        {statusFilter === "" ? "All" : statusFilter}
                      </span>
                    </div>
                  ),
                }}
                style={{width: 150}}
                bordered={false}
                defaultValue={statusFilter}
                onChange={handleStatusChange}
                suffixIcon={
                  <div
                    className={`${
                      statusFilter === "Published" ? "mr-[-20px]" : ""
                    }`}
                  >
                    <CaretDownOutlined />
                  </div>
                }
              >
                <Option value="Archive">Archive</Option>
                <Option value="Published">Published</Option>
                <Option value="">All</Option>
              </Select>
            </div>
          </div>
        }
        child2={
          <div className="flex gap-5 cursor-pointer">
            <div>
              <Input
                className="polices-table-search-input police-text"
                placeholder="Search by blog title name"
                prefix={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <path
                      d="M17.9417 17.0583L14.7409 13.8575C15.8109 12.5883 16.4583 10.9525 16.4583 9.16667C16.4583 5.14583 13.1875 1.875 9.16667 1.875C5.14583 1.875 1.875 5.14583 1.875 9.16667C1.875 13.1875 5.14583 16.4583 9.16667 16.4583C10.9525 16.4583 12.5884 15.8108 13.8575 14.7408L17.0583 17.9417C17.18 18.0633 17.34 18.125 17.5 18.125C17.66 18.125 17.82 18.0642 17.9417 17.9417C18.1859 17.6983 18.1859 17.3025 17.9417 17.0583ZM3.125 9.16667C3.125 5.835 5.835 3.125 9.16667 3.125C12.4983 3.125 15.2083 5.835 15.2083 9.16667C15.2083 12.4983 12.4983 15.2083 9.16667 15.2083C5.835 15.2083 3.125 12.4983 3.125 9.16667Z"
                      fill="#BDBDBD"
                    />
                  </svg>
                }
                value={searchInput}
                onChange={(e: any) => setSearchInput(e.target.value)}
                suffix={
                  searchInput && (
                    <AiOutlineCloseCircle
                      className="hover:text-gray-500 cursor-pointer !text-[#BDBDBD] pt-1"
                      onClick={() => setSearchInput("")}
                    />
                  )
                }
              />
            </div>
          </div>
        }
      />
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
      <EmailPreview
        contain={selectedEditId}
        onCancel={CloseModal}
        isOpen={modalOpen}
      />
    </div>
  );
};

export default BlogArticlesTable;
