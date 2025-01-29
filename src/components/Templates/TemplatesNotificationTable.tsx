import CommonTable from "@/src/components/CommonTable";
import {API_ENDPOINTS} from "@/src/interceptors/apiName";
import axiosInstance from "@/src/interceptors/Axios";
import {FC, useState} from "react";
import ViewIcon from "../Icons/ViewIcon";
import {NextRouter, useRouter} from "next/router";
import {useNotification} from "../Notification";
import moment from "moment";
import ActionsModal from "../Modals/ActionsModal";
import SwitchToggle from "../SwitchToggle";
import EditIcon from "../Icons/EditIcon";
import DeleteIcon from "../Icons/DeleteIcon";
import EmailPreview from "../EmailPreview";
import CopyIcon from "../Icons/CopyIcon";
import React from "react";

interface TemplatesNotificationProps {
  selectedSystem: boolean;
  dateRange: any;
  setCurrentPage: any;
  setPageLimit: any;
  setTotalItems: any;
  currentPage: any;
  pageLimit: any;
  totalItems: any;
  handlePageChange: (props: any) => void;
  selectedCategories?: any;
  notficationTemplatesDetails?: any;
  fetchTemplatesNotificationDetails?: any;
  setSearchInput?: any;
  searchInput?: any;
  handleColumnSort?: any;
  sortedColumn?: any;
  sortOrder?: any;
  handleHiddeStatus?: any;
}

const TemplatesNotificationTable: FC<TemplatesNotificationProps> = ({
  selectedSystem,
  notficationTemplatesDetails,
  fetchTemplatesNotificationDetails,
  setSearchInput,
  searchInput,
  handleColumnSort,
  sortedColumn,
  sortOrder,
  handleHiddeStatus,
  selectedCategories,
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
      pathname: `/learning-program/edit`,
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

        fetchTemplatesNotificationDetails();
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

  const handleClone = async (record: any) => {
    try {
      if (!record) return;
      const clonedTemplate: any = await axiosInstance.get(
        `${API_ENDPOINTS.NOTIFICATION_CLONE}/${record.notificationTemplateId}`
      );
      console.log(clonedTemplate, "clonedTemplate");
      if (clonedTemplate?.settings?.success) {
        handleNotifications(
          `success`,
          `Notification template cloned successfully`,
          ``,
          3
        );
        fetchTemplatesNotificationDetails();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const column = [
    {
      title: "Template Name",
      dataIndex: "templateName",
      sorter: notficationTemplatesDetails?.length === 0 ? false : true,
      sortOrder: sortedColumn === "templateName" ? sortOrder : undefined,
      onHeaderCell: () => ({
        onClick: () =>
          notficationTemplatesDetails?.length === 0
            ? null
            : handleColumnSort("templateName"),
      }),
      render: (text: any) => (
        <span className="text-[14px] font-[600] text-[#4379EE]">{text}</span>
      ),
    },
    {
      title: "Added",
      dataIndex: "addedDate",
      sorter: notficationTemplatesDetails?.length === 0 ? false : true,
      sortOrder: sortedColumn === "addedDate" ? sortOrder : undefined,
      onHeaderCell: () => ({
        onClick: () =>
          notficationTemplatesDetails?.length === 0
            ? null
            : handleColumnSort("addedDate"),
      }),
      render: (text: any, record: any) => (
        <span className="text-[14px] font-[600] ">
          {moment.unix(record?.addedDate / 1000).format("MM/DD/YYYY")}
        </span>
      ),
    },
    {
      title: "Updated",
      dataIndex: "modifiedDate",
      sorter: notficationTemplatesDetails?.length === 0 ? false : true,
      sortOrder: sortedColumn === "modifiedDate" ? sortOrder : undefined,
      onHeaderCell: () => ({
        onClick: () =>
          notficationTemplatesDetails?.length === 0
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
      title: "Category",
      dataIndex: "categoryName",
      sorter: notficationTemplatesDetails?.length === 0 ? false : true,
      sortOrder: sortedColumn === "categoryName" ? sortOrder : undefined,
      onHeaderCell: () => ({
        onClick: () =>
          notficationTemplatesDetails?.length === 0
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
      title: "Action",
      dataIndex: "landingPageId",
      render: (id: number, record: any) => (
        <div className="flex gap-2 cursor-pointer">
          {!selectedSystem && (
            <div onClick={() => handleClone(record)} title="Clone">
              <CopyIcon />
            </div>
          )}
          <div
            className="flex justify-center "
            title="View"
            onClick={() => handleViewTempNotfication(record)}
          >
            <ViewIcon />
          </div>

          {!selectedSystem && (
            <>
              <div title="Hide/Unhide">
                <SwitchToggle
                  checked={record?.isHidden || false}
                  onChange={() => handleHiddeStatus(record)}
                />
              </div>
              <div onClick={() => handleEdit(record)} title="Edit">
                <EditIcon />
              </div>
              <div
                onClick={() => {
                  handleDeleteClick(record);
                }}
                title="Delete"
              >
                <DeleteIcon />
              </div>
            </>
          )}
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
        apiData={notficationTemplatesDetails}
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        rowClassName={(record: {notificationTemplateId: any}) =>
          selectedCheckboxIds.includes(record?.notificationTemplateId)
            ? "selected-item-table"
            : ""
        }
        rowKey={(record) => record.notificationTemplateId}
        child={
          <div className="flex w-full">
            <span className="text-[16px] font-bold text-[#333333] mt-2 w-full">
              All Templates
            </span>
            {selectedCheckboxIds.length > 0 && (
              <div className="w-full mr-3">
                {/* <MoveCategories
                  selectedCheckboxIds={selectedCheckboxIds}
                  fetchPhishingDestinationDetails={
                    fetchTemplatesNotificationDetails
                  }
                  selectedSystem={selectedSystem}
                  setSelectedCheckboxIDs={setSelectedCheckboxIDs}
                /> */}
              </div>
            )}
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

export default TemplatesNotificationTable;
