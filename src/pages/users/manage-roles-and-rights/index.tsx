import {FC, useEffect, useState} from "react";
import {NextRouter, useRouter} from "next/router";
import SidebarLayout from "@/src/components/Layout/SidebarLayout";
import PlusIconWhite from "@/src/components/Icons/PlusIconWhite";
import CommonButton from "@/src/components/Button";
import CommonTable from "@/src/components/CommonTable";
import axiosInstance from "@/src/interceptors/Axios";
import {API_ENDPOINTS} from "@/src/interceptors/apiName";
import CommonPagination from "@/src/components/CommonTable/paginnation";
import EditIcon from "@/src/components/Icons/EditIcon";
import DeleteIcon from "@/src/components/Icons/DeleteIcon";
import FilterCopyButton from "@/src/components/Icons/FilterCopyButton";
import {Drawer} from "antd";
import {useLoader} from "@/src/components/Loader/LoaderProvider";
import {useNotification} from "@/src/components/Notification";
import ActionsModal from "@/src/components/Modals/ActionsModal";

const RoleBasedAccessControls: FC = () => {
  const router: NextRouter = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [roleList, setRoleList] = useState<any[]>([]);
  const getCurrentPage = sessionStorage.getItem("currentPage")
    ? sessionStorage.getItem("currentPage")
    : 1;
  const [selectRecord, setSelectRecord] = useState<any>();
  const [searchInput, setSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState<any>(getCurrentPage);
  const [pageLimit, setPageLimit] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [sortedColumn, setSortedColumn] = useState<string>("roleId");
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC" | undefined>(
    "DESC"
  );
  const loaderContext = useLoader();
  const notificationContext = useNotification();
  const handleNotifications: any = notificationContext?.handleNotifications;
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [groupContent, setGroupContent] = useState<string[]>([]);
  const open = !!groupContent.length;
  const SPLIT_BY = ",";

  const mergeGroupData = (data: string[]): string[] => {
    if (!data.length) {
      return [];
    }
    return data
      .join(SPLIT_BY)
      .split(SPLIT_BY)
      .map((el) => el.trim())
      .filter(Boolean);
  };

  const groupsWithLimit = (data: string[], limit: number = 2) => {
    if (!data.length) {
      return "";
    }
    return mergeGroupData(data)?.slice(0, limit)?.join(", ");
  };

  const handleViewAssignedGroups = (content: string[]) => {
    const mergedContent = mergeGroupData(content);
    if (mergedContent?.length <= 2) {
      return;
    }
    setGroupContent(mergedContent);
  };

  const handleDeleteClick = (record: any) => {
    setSelectRecord(record);
    setIsDeleteModalVisible(true);
  };

  const {showLoader, hideLoader} = loaderContext;
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
      title: "Role Based Policy Name",
      dataIndex: "roleName",
      sorter: roleList?.length === 0 ? false : true,
      sortOrder: sortedColumn === "roleName" ? sortOrder : undefined,
      onHeaderCell: () => ({
        onClick: () =>
          roleList?.length === 0 ? null : handleColumnSort("roleName"),
      }),
      render: (text: any, record: any) => (
        <div className="gap-[5px]">
          <span className="text-[14px] font-[600] text-[#4F4F4F] ">{text}</span>
        </div>
      ),
    },
    {
      title: "Assigned Groups",
      dataIndex: "groups",
      render: (text: string[]) => {
        return (
          <div
            onClick={() => handleViewAssignedGroups(text)}
            className={`gap-[5px] ${
              mergeGroupData(text)?.length > 2
                ? "cursor-pointer"
                : "cursor-default"
            }`}
          >
            <span className="text-[14px] font-[600] text-[#4F4F4F]">
              {groupsWithLimit(text)}
              {mergeGroupData(text)?.length > 2 && (
                <span> and {mergeGroupData(text)?.length - 2} more</span>
              )}
            </span>
          </div>
        );
      },
    },

    {
      title: "Member Count",
      dataIndex: "userCount",
      // sorter: roleList?.length === 0 ? false : true,
      // sortOrder: sortedColumn === "userCount" ? sortOrder : undefined,
      // onHeaderCell: () => ({
      //   onClick: () =>
      //     roleList?.length === 0 ? null : handleColumnSort("userCount"),
      // }),
      render: (text: any, record: any) => (
        <div className="gap-[5px]">
          <span className="text-[14px] font-[600] text-[#4F4F4F] ">{text}</span>
        </div>
      ),
    },
    {
      title: "Action",
      dataIndex: "roleId",
      render: (id: number, record: any) => (
        <div className="flex gap-2 cursor-pointer">
          <div onClick={() => handleClone(record)}>
            <FilterCopyButton />
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

  const handlePageChange = (page: React.SetStateAction<number>) => {
    setCurrentPage(page);
  };

  const getRoleList = async () => {
    showLoader();
    setLoading(true);
    let payload: any = {
      page: currentPage,
      limit: pageLimit,
      keyword: searchInput,
      sort: [{prop: sortedColumn, dir: sortOrder}],
      filters: [],
    };

    try {
      const result: any = await axiosInstance.post(
        `${API_ENDPOINTS.ROLE_FULL_LIST}`,
        payload
      );
      if (Object.keys(result).length && result?.settings?.success) {
        setRoleList(result.data);
        setTotalItems(result.settings.count);
        sessionStorage.removeItem("currentPage");
      }
    } catch (e) {
    } finally {
      setLoading(false);
      hideLoader();
    }
  };

  const handleDelete = async () => {
    try {
      if (!selectRecord) return;
      const delTemp: any = await axiosInstance.delete(
        `${API_ENDPOINTS.DELETE_ROLE}/${selectRecord?.roleId}`
      );

      if (delTemp?.settings?.success) {
        handleNotifications(`success`, `${delTemp?.settings?.message}`, ``, 3);
        getRoleList();
        setIsDeleteModalVisible(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleClone = async (record: any) => {
    try {
      if (!record) return;

      let body: any = {
        roleId: record.roleId,
      };

      let clonedRole: any = await axiosInstance.post(
        `${API_ENDPOINTS.ROLE_CLONE}`,
        body
      );

      if (clonedRole?.settings?.success) {
        handleNotifications(
          `success`,
          `${clonedRole?.settings?.message}`,
          ``,
          3
        );
        getRoleList();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = async (record: any) => {
    console.log("record", record);
    sessionStorage.setItem("currentPage", currentPage);
    router.push({
      pathname: `/users/manage-roles-and-rights/edit-role/${record.roleId}`,
      // query: {id: record.notificationTemplateId},
    });
  };

  // useEffect(() => {
  //   roleList.length && setTotalItems(roleList.length);
  // }, [roleList]);

  useEffect(() => {
    getRoleList();
  }, [searchInput, sortedColumn, sortOrder, currentPage]);

  return (
    <SidebarLayout>
      <div>
        <div className="flex justify-between">
          <div className="text-[24px] font-[700] text-[#313D4F] mb-[30px]">
            Role Based Access Controls
          </div>
          <CommonButton
            className="custom-heading-btn flex items-center gap-[5px] !h-[40px]  plus-icon"
            onClick={() =>
              router.push("/users/manage-roles-and-rights/create-role")
            }
          >
            <div className="flex items-center gap-[5px]">
              <PlusIconWhite /> Add New Role
            </div>
          </CommonButton>
        </div>
        <div className="rounded-[14px] bg-[#FFFFFF] border border-[#E8E8E8]">
          <CommonTable
            apiData={roleList}
            columns={column}
            rowKey={(record) => record.roleId}
            searchInput={searchInput}
            setSearchInput={setSearchInput}
            placeholderText="Search"
            searchBoxStyle={{width: "350px"}}
            showSearchInput={true}
            // child2={
            //   <div>
            //     <Input
            //       className="polices-table-search-input police-text"
            //       placeholder="Search by security role name or group"
            //       prefix={
            //         <svg
            //           xmlns="http://www.w3.org/2000/svg"
            //           width="18"
            //           height="18"
            //           viewBox="0 0 20 20"
            //           fill="none"
            //         >
            //           <path
            //             d="M17.9417 17.0583L14.7409 13.8575C15.8109 12.5883 16.4583 10.9525 16.4583 9.16667C16.4583 5.14583 13.1875 1.875 9.16667 1.875C5.14583 1.875 1.875 5.14583 1.875 9.16667C1.875 13.1875 5.14583 16.4583 9.16667 16.4583C10.9525 16.4583 12.5884 15.8108 13.8575 14.7408L17.0583 17.9417C17.18 18.0633 17.34 18.125 17.5 18.125C17.66 18.125 17.82 18.0642 17.9417 17.9417C18.1859 17.6983 18.1859 17.3025 17.9417 17.0583ZM3.125 9.16667C3.125 5.835 5.835 3.125 9.16667 3.125C12.4983 3.125 15.2083 5.835 15.2083 9.16667C15.2083 12.4983 12.4983 15.2083 9.16667 15.2083C5.835 15.2083 3.125 12.4983 3.125 9.16667Z"
            //             fill="#BDBDBD"
            //           />
            //         </svg>
            //       }
            //       value={searchInput}
            //       onChange={(e: any) => setSearchInput(e.target.value)}
            //       suffix={
            //         searchInput && (
            //           <AiOutlineCloseCircle
            //             className="hover:text-gray-500 cursor-pointer !text-[#BDBDBD] pt-1"
            //             onClick={() => setSearchInput("")}
            //           />
            //         )
            //       }
            //     />
            //   </div>
            // }
          />
        </div>
        {roleList?.length && (
          <CommonPagination
            className="pagination"
            currentPage={currentPage}
            totalItems={totalItems}
            itemsPerPage={pageLimit}
            onPageChange={handlePageChange}
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
        <Drawer
          title={
            <span className="text-[18px] font-[700] text-[#313D4F]">
              Assigned Groups
            </span>
          }
          onClose={() => setGroupContent([])}
          open={open}
        >
          <div>
            {groupContent?.map((content, index) => (
              <p
                className="text-[14px] font-[600] text-[#4F4F4F] mt-1"
                key={index}
              >
                {content}
              </p>
            ))}
          </div>
        </Drawer>
      </div>
    </SidebarLayout>
  );
};

export default RoleBasedAccessControls;
