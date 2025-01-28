import CommonTable from "@/src/components/CommonTable";
import {API_ENDPOINTS} from "@/src/interceptors/apiName";
import axiosInstance from "@/src/interceptors/Axios";
import {FC, useState} from "react";
import DeleteIcon from "../Icons/DeleteIcon";
import EditIcon from "../Icons/EditIcon";
import ViewIcon from "../Icons/ViewIcon";
import {NextRouter, useRouter} from "next/router";
import {useNotification} from "../Notification";
import moment from "moment";
import ActionsModal from "../Modals/ActionsModal";
import MoveCategories from "./MoveCategories";

interface PhishingDestinationTableProps {
  selectedSystem: any;
  dateRange: any;
  setCurrentPage: any;
  setPageLimit: any;
  setTotalItems: any;
  currentPage: any;
  pageLimit: any;
  totalItems: any;
  selectedCategories?: any;
  fetchPhishingDestinationDetails?: any;
  phishingDestinationDetails?: any;
  setSearchInput?: any;
  searchInput?: any;
}

const PhishingDestinationTable: FC<PhishingDestinationTableProps> = ({
  selectedSystem,
  fetchPhishingDestinationDetails,
  phishingDestinationDetails,
  setSearchInput,
  searchInput,
  selectedCategories,
}) => {
  const [selectedEditId, SetSelectedEditId] = useState(null);
  const [selectedCheckboxIds, setSelectedCheckboxIDs] = useState<number[]>([]);
  const notificationContext = useNotification();
  const handleNotifications: any = notificationContext?.handleNotifications;
  const router: NextRouter = useRouter();
  const [selectRecord, setSelectRecord] = useState<any>();
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  const handleEdit = (record: any) => {
    SetSelectedEditId(record);
    router.push({
      pathname: `/phishing/phishing-destination/edit`,
      query: {id: record.landingPageId},
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
        `${API_ENDPOINTS.Delete_View_Phishing}/${selectRecord?.landingPageId}`
      );

      if (delTemp?.settings?.success) {
        handleNotifications(`success`, `${delTemp?.settings?.message}`, ``, 3);

        fetchPhishingDestinationDetails();
        setIsDeleteModalVisible(false);
      }
    } catch (error) {}
  };

  const handleViewPhishing = (record: any) => {
    SetSelectedEditId(record);
    router.push({
      pathname: `/phishing/phishing-destination/view`,
      query: {id: record.landingPageId},
    });
  };

  const rowSelection = {
    selectedRowKeys: selectedCheckboxIds,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedCheckboxIDs(newSelectedRowKeys as any[]);
    },
  };

  const column = [
    {
      title: "Title",
      dataIndex: "title",
      render: (text: any) => (
        <span className="text-[14px] font-[600] text-[#4379EE]">{text}</span>
      ),
    },
    {
      title: "Updated",
      dataIndex: "modifiedDate",
      render: (text: any, record: any) => (
        <span className="text-[14px] font-[600] text-[#4F4F4F]">
          {moment.unix(record?.modifiedDate / 1000).format("MM/DD/YYYY")}
        </span>
      ),
    },
    {
      title: "URL",
      dataIndex: "url",
      render: (text: any) => (
        <div className="border w-80 border-[#E8E8E8] rounded-[4px] bg-[#FFFFFF] p-2 text-[#828282] text-[16px] leading-[24px] font-[400] cursor-pointer ">
          {text}
        </div>
      ),
    },

    {
      title: "Action",
      dataIndex: "landingPageId",
      render: (id: number, record: any) => (
        <div className="flex gap-2 cursor-pointer">
          <div onClick={() => handleEdit(record)}>
            <EditIcon />
          </div>
          <div onClick={() => handleViewPhishing(record)}>
            <ViewIcon />
          </div>

          {!selectedSystem && (
            <>
              <div
                onClick={() => {
                  handleDeleteClick(record);
                }}
              >
                <DeleteIcon />
              </div>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <CommonTable
        rowSelection={!selectedSystem ? rowSelection : ""}
        columns={column}
        apiData={phishingDestinationDetails}
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        rowClassName={(record: {landingPageId: any}) =>
          selectedCheckboxIds.includes(record?.landingPageId)
            ? "selected-item-table"
            : ""
        }
        rowKey={(record) => record.landingPageId}
        child={
          <div className="flex w-full gap-2">
            <span className="text-[16px] font-bold text-[#333333] mt-2 w-full text-nowrap">
              All Phishing Destination Page
            </span>
            {selectedCheckboxIds.length > 0 && (
              <div className="w-full mr-2">
                <MoveCategories
                  selectedCheckboxIds={selectedCheckboxIds}
                  fetchPhishingDestinationDetails={
                    fetchPhishingDestinationDetails
                  }
                  selectedSystem={selectedSystem}
                  setSelectedCheckboxIDs={setSelectedCheckboxIDs}
                />
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

export default PhishingDestinationTable;
