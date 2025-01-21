import {FC, useEffect, useState} from "react";
import {useNotification} from "../Notification";
import {camelCase} from "@/src/helper/Utils";
import EditIcon from "../Icons/EditIcon";
import {useRouter} from "next/router";
import DeleteIcon from "../Icons/DeleteIcon";
import ActionsModal from "../Modals/ActionsModal";
import {Button, Dropdown, MenuProps, Space} from "antd";
import CommonPagination from "../CommonTable/paginnation";
import CommonTable from "../CommonTable";
import {useLoader} from "../Loader/LoaderProvider";
import axiosInstance from "@/src/interceptors/Axios";
import {API_ENDPOINTS} from "@/src/interceptors/apiName";
import moment from "moment";
import CustomDropdownIcon from "../Icons/CustomDropdownIcon";
import AdIcon from "../Icons/ADIcon";
import DownloadCSVIcon from "../Icons/DownloadCSVIcon";
import ArchiveIcon from "../Icons/ArchiveIcon";
import {config} from "@/src/helper/config";
import ViewIcon from "../Icons/ViewIcon";
import {PlusOutlined} from "@ant-design/icons";
import React from "react";
import CommonSelect from "../CommonSelect";
import ThreeDotsDropdown from "../ThreeDotsDropdown";
import HideReportIcon from "../Icons/HideReportIcon";

const UserListing: FC = () => {
  const notificationContext = useNotification();
  const handleNotifications: any = notificationContext?.handleNotifications;
  const [searchInput, setSearchInput] = useState("");
  const getCurrentPage = sessionStorage.getItem("currentPage")
    ? sessionStorage.getItem("currentPage")
    : 1;
  const [currentPage, setCurrentPage] = useState<any>(getCurrentPage);
  const [pageLimit, setPageLimit] = useState(10);
  const [totalItems, setTotalItems] = useState(10);
  const [sortedColumn, setSortedColumn] = useState<string>("addedDate");
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC" | undefined>(
    "DESC"
  );
  const [selectRecord, setSelectRecord] = useState<any>();
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [source, setSource] = useState<any>([]);
  const router = useRouter();
  const [selectedCheckboxIds, setSelectedCheckboxIDs] = useState<any[]>([]);
  const [status, setStatus] = useState("Active");
  const loaderContext = useLoader();
  const [dept, setDept] = useState<any>([]);
  const [group, setGroup] = useState<any>([]);
  const [selectedDept, setSelectedDept] = useState<any>("");
  const [selectedGroup, setSelectedGroup] = useState<any>("");
  const [selectedAdUser, setSelectedAdUser] = useState<any>("");
  const {showLoader, hideLoader} = loaderContext;
  const [assignGroup, setAssignGroup] = useState<any>("");
  useEffect(() => {
    fetchUsers();
  }, [
    currentPage,
    searchInput,
    sortedColumn,
    sortOrder,
    status,
    selectedDept,
    selectedGroup,
    selectedAdUser,
  ]);
  useEffect(() => {
    fetchDropdownValues();
  }, []);
  const fetchUsers = async () => {
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
      if (selectedDept) {
        config["filters"].push({
          key: "departmentId",
          value: selectedDept?.departmentId,
        });
      }
      if (selectedGroup) {
        config["filters"].push({
          key: "groupId",
          value: selectedGroup.groupId,
        });
      }
      if (selectedAdUser !== "") {
        config["filters"].push({
          key: "isCustomAdded",
          value: selectedAdUser ? 1 : 0,
        });
      }
      let userList: any = await axiosInstance.post(
        `${API_ENDPOINTS.USER_LIST}`,
        JSON.stringify(config)
      );
      if (userList?.settings?.success) {
        setSource(userList?.data);
        sessionStorage.removeItem("currentPage");
        setTotalItems(userList?.settings?.count);
      }
      hideLoader();
    } catch (error) {
      hideLoader();
    }
  };
  const fetchDropdownValues = async () => {
    try {
      const deptGroup: any = await axiosInstance.get(
        API_ENDPOINTS.DROPDOWN_LIST_DEPARTMENT
      );
      if (deptGroup?.settings?.success) {
        setDept(deptGroup?.data);
      }
      const groupList: any = await axiosInstance.get(
        `${API_ENDPOINTS.DROPDOWN_LIST_GROUP}?allGroups=true`
      );
      if (groupList?.settings?.success) {
        setGroup(groupList?.data);
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

  const [selectedEditId, SetSelectedEditId] = useState(null);

  const restoreRecord = async (userId: string | number) => {
    try {
      showLoader();
      const archiveUser: any = await axiosInstance.post(
        `${API_ENDPOINTS.USER_CHANGE_STATUS}`,
        JSON.stringify({
          ids: [userId],
          status: "Active",
        })
      );
      if (archiveUser?.settings?.success) {
        handleNotifications(
          "success",
          "User has been restored successfully.",
          "",
          3
        );
        fetchUsers();
        setSelectedCheckboxIDs([]);
      }
      hideLoader();
    } catch (error) {
      hideLoader();
    }
  };

  const handleViewUser = (record: any) => {
    SetSelectedEditId(record);
    router.push({
      pathname: `/users/view`,
      query: {id: record.userId},
    });
  };
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      //   key: "1",
      hide: true,
      sorter: source.length === 0 ? false : true,
      sortOrder: sortedColumn === "name" ? sortOrder : undefined,
      onHeaderCell: () => ({
        onClick: () =>
          source.length > 0 ? handleColumnSort("name") : undefined,
      }),
      render: (text: any, record: any) => (
        <div className="gap-[5px]">
          <div className="flex flex-col text-[14px] font-[600] text-[#4379EE] gap-[5px]">
            {record?.firstName || record?.lastName
              ? camelCase(
                  `${record?.firstName || ""} ${record?.lastName || ""}`
                )
              : record?.email}
          </div>
        </div>
      ),
    },
    {
      title: "User",
      dataIndex: "firstName",
      key: "2",
      //   sorter: source.length == 0 ? false : true,
      //   sortOrder: sortedColumn === "firstName" ? sortOrder : undefined,
      //   onHeaderCell: () => ({
      //     onClick: () =>
      //       source.length > 0 ? handleColumnSort("firstName") : null,
      //   }),
      render: (text: any, record: any) => (
        <div className="gap-[5px]">
          {/* <Checkbox
                  className="custom-checkbox"
                  checked={selectedCheckboxIds.includes(record?.surveyId)}
                  style={{ width: "24px", height: "24px" }}
                  onChange={(e) =>
                    handleCheckboxChange(record?.surveyId, e.target.checked)
                  }
                ></Checkbox> */}
          <div className="flex flex-col text-[14px] font-[600] text-[#4379EE] gap-[5px]">
            <div className="flex items-center">
              {!record?.isCustomAdded && <AdIcon />}{" "}
              {camelCase(
                `${record?.firstName ? record?.firstName : ""} ${
                  record?.lastName ? record?.lastName : ""
                }`
              )}
            </div>
            {record?.email}
          </div>
        </div>
      ),
    },

    {
      title: "PEP",
      dataIndex: "PEP",
      key: "3",
      sorter: source.length === 0 ? false : true,
      sortOrder: sortedColumn === "PEP" ? sortOrder : undefined,
      onHeaderCell: () => ({
        onClick: () =>
          source.length > 0 ? handleColumnSort("PEP") : undefined,
      }),
      render: (text: any, record: any) => (
        <span className="text-[14px] font-[600] ">{record?.PEP || "0 %"}</span>
      ),
    },
    {
      title: "Risk",
      dataIndex: "risk",
      key: "4",
      sorter: source.length === 0 ? false : true,
      sortOrder: sortedColumn === "risk" ? sortOrder : undefined,
      onHeaderCell: () => ({
        onClick: () =>
          source.length > 0 ? handleColumnSort("risk") : undefined,
      }),
      render: (text: any, record: any) => (
        <span className="text-[14px] font-[600] ">{record?.risk || "0 %"}</span>
      ),
    },
    // {
    //     title: "Phone",
    //     dataIndex: "phoneNumber",
    //     sorter: source.length === 0 ? false : true,
    //     sortOrder: sortedColumn === "phoneNumber" ? sortOrder : undefined,
    //     onHeaderCell: () => ({
    //         onClick: () =>
    //             source.length > 0
    //                 ? handleColumnSort("phoneNumber")
    //                 : undefined,
    //     }),
    //     render: (text: any, record: any) => (
    //         <span className="text-[14px] font-[600] ">
    //             {record?.phoneNumber}
    //         </span>
    //     ),
    // },
    {
      title: "Department",
      dataIndex: "departmentName",
      key: "5",
      sorter: source.length === 0 ? false : true,
      sortOrder: sortedColumn === "departmentName" ? sortOrder : undefined,
      onHeaderCell: () => ({
        onClick: () =>
          source.length > 0 ? handleColumnSort("departmentName") : undefined,
      }),
      render: (text: any, record: any) => (
        <span className="text-[14px] font-[600] ">
          {record?.departmentName || "-"}
        </span>
      ),
    },
    // {
    //   title: "Role",
    //   dataIndex: "roleName",
    //   key: "6",
    //   sorter: source.length === 0 ? false : true,
    //   sortOrder: sortedColumn === "roleName" ? sortOrder : undefined,
    //   onHeaderCell: () => ({
    //     onClick: () =>
    //       source.length > 0 ? handleColumnSort("roleName") : undefined,
    //   }),
    //   render: (text: any, record: any) => (
    //     <span className="text-[14px] font-[600] ">{record?.roleName}</span>
    //   ),
    // },

    {
      title: "Joined On",
      dataIndex: "addedDate",
      key: "7",
      sorter: source.length === 0 ? false : true,
      sortOrder: sortedColumn === "addedDate" ? sortOrder : undefined,
      onHeaderCell: () => ({
        onClick: () =>
          source.length > 0 ? handleColumnSort("addedDate") : undefined,
      }),
      render: (text: any, record: any) => {
        console.log("record?.addedDate :>> ", record?.addedDate);
        return (
          <span className="text-[14px] font-[600] ">
            {moment
              .unix(parseInt(record?.addedDate) / 1000)
              .format("MM/DD/YYYY")}
          </span>
        );
      },
    },
    {
      title: "Last Login",
      dataIndex: "lastLogin",
      key: "8",
      sorter: source.length === 0 ? false : true,
      sortOrder: sortedColumn === "lastLogin" ? sortOrder : undefined,
      onHeaderCell: () => ({
        onClick: () =>
          source.length > 0 ? handleColumnSort("lastLogin") : undefined,
      }),
      render: (text: any, record: any) => (
        <span className="text-[14px] font-[600] ">
          {record?.lastLogin
            ? moment(record?.lastLogin).format("MM/DD/YYYY")
            : "N/A"}
        </span>
      ),
    },
    // {
    //   title: "Status",
    //   dataIndex: "status",
    //   sorter: source.length == 0 ? false : true,
    //   sortOrder: sortedColumn === "status" ? sortOrder : undefined,
    //   onHeaderCell: () => ({
    //     onClick: () => handleColumnSort("status"),
    //   }),
    //   render: (text: any, record: any) => {
    //     return (
    //       <div className={`tag ${text === "Active" ? "success" : "error"}`}>
    //         {text}
    //       </div>
    //     );
    //   },
    // },

    {
      title: "Action",
      dataIndex: "action",
      key: "9",
      fixed: "right",
      render: (text: any, record: any) => (
        <div className="space-x-[10px] flex ">
          <span
            className="cursor-pointer"
            onClick={() => handleViewUser(record)}
          >
            <ViewIcon />
          </span>
          <span
            className="cursor-pointer"
            onClick={() => {
              router.push(`/users/${record?.userId}`);
              sessionStorage.setItem("currentPage", currentPage);
            }}
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

          {/* {record?.status === "Archive" && (
            <ThreeDotsDropdown
              menuItems={[
                {
                  key: "Restore",
                  label: (
                    <div className="text-[#333] text-[14px] font-[400] gap-[8px] flex">
                      <HideReportIcon />
                      {record?.status === "Active"
                        ? "In-active"
                        : "Active Record"}
                    </div>
                  ),
                  onClick: () => {
                    restoreRecord(record?.userId);
                  },
                },
              ]}
            />
          )} */}
        </div>
      ),
    },
  ];
  const deleteClick = async () => {
    try {
      const deleteUser: any = await axiosInstance.delete(
        `${API_ENDPOINTS.USER_DELETE}/${selectRecord?.userId}`
      );
      if (deleteUser?.settings?.success) {
        handleNotifications("success", deleteUser?.settings?.message, "", 3);
        setIsDeleteModalVisible(false);
        fetchUsers();
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
        setStatus("All");
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
      label: <a>Archive</a>,
      onClick: () => {
        setStatus("Archive");
      },
    },
  ];
  const AdUserItems: MenuProps["items"] = [
    {
      key: "1",
      label: <a>All</a>,
      onClick: () => {
        setSelectedAdUser("");
      },
    },
    {
      key: "2",
      label: <a>Normal User</a>,
      onClick: () => {
        setSelectedAdUser(true);
      },
    },
    {
      key: "3",
      label: <a>AD User</a>,
      onClick: () => {
        setSelectedAdUser(false);
      },
    },
  ];
  const deptItems: MenuProps["items"] = [
    {key: "all", label: <a>All</a>, onClick: () => setSelectedDept(null)},
    ...dept.map((d: any) => ({
      key: d.id, // Use a unique identifier
      label: <a>{d.departmentName}</a>,
      onClick: () => setSelectedDept(d),
    })),
  ];

  const groupItems: MenuProps["items"] = [
    {key: "all", label: <a>All</a>, onClick: () => setSelectedGroup(null)},
    ...group.map((g: any) => ({
      key: g.id, // Use a unique identifier
      label: <a>{g.groupName}</a>,
      onClick: () => setSelectedGroup(g),
    })),
  ];
  const bulkArchive = async () => {
    try {
      showLoader();
      const archiveUser: any = await axiosInstance.post(
        `${API_ENDPOINTS.USER_CHANGE_STATUS}`,
        JSON.stringify({
          ids: selectedCheckboxIds,
          status: status === "Archive" ? "Active" : "Archive",
        })
      );
      if (archiveUser?.settings?.success) {
        handleNotifications(
          "success",
          `Users ${
            status === "Archive" ? "restored" : "archived"
          } successfully.`,
          "",
          5
        );
        fetchUsers();
        setSelectedCheckboxIDs([]);
      }
      hideLoader;
    } catch (error) {
      hideLoader();
    }
  };

  const generateCSV = async () => {
    try {
      const csvData: any = await axiosInstance.post(
        `${API_ENDPOINTS.USER_LIST}`,
        JSON.stringify({isExport: true})
      );
      if (csvData?.settings?.success) {
        config.downloadFile(csvData?.data?.fileUrl, "user.csv");
      }
    } catch (error) {}
  };

  // const generateCSV = () => {
  //   const headers = [
  //     "name",
  //     "firstName",
  //     "PEP",
  //     "risk",
  //     "departmentName",
  //     "addedDate",
  //     "lastLogin",
  //   ];

  //   const rows = source?.map((user: any) => ({
  //     name: `${user?.firstName} ${user?.lastName}`,
  //     firstName: user?.firstName,
  //     PEP: user?.PEP !== null ? user?.PEP : 0,
  //     risk: user?.risk !== null ? user?.risk : 0,
  //     departmentName: user?.departmentName || "-",
  //     addedDate: moment.unix(user?.addedDate / 1000).format("MM/DD/YYYY"),
  //     lastLogin: moment.unix(user?.lastLogin / 1000).format("MM/DD/YYYY"),
  //   }));

  //   const csvContent = [
  //     headers.join(","),
  //     ...rows.map((row: any) =>
  //       headers?.map((header) => row[header]).join(",")
  //     ),
  //   ].join("\n");

  //   const blob = new Blob([csvContent], {type: "text/csv;charset=utf-8;"});
  //   const link = document.createElement("a");
  //   link.href = URL.createObjectURL(blob);
  //   link.setAttribute("download", "user.csv");
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  // };

  const addToGroup = async () => {
    try {
      console.log(assignGroup, "assignGroup");
      if (!assignGroup) {
        handleNotifications("error", "Please select group", "", 3);
        return;
      }
      let payload = {
        groupId: assignGroup,
        userId: selectedCheckboxIds,
      };
      let assignRoleUser: any = await axiosInstance.post(
        `${API_ENDPOINTS.ADD_USER_INTO_THE_GROUP}`,
        payload
      );
      if (assignRoleUser?.settings?.message) {
        handleNotifications(
          "success",
          "Users added to group successfully.",
          "",
          3
        );
        fetchUsers();
        setSelectedCheckboxIDs([]);
        setAssignGroup("");
      }
    } catch (error) {
      console.error("Error adding users to group:", error);
      handleNotifications("error", "Error adding users to group.", "", 3);
    }
  };

  return (
    <>
      <div className="w-full">
        <div className="flex justify-between items-center mb-[20px]">
          <div className="heading-title">Manage Users</div>
          <div className=" flex gap-[25px] items-center">
            <div
              className="flex export-csv-container !mr-0"
              onClick={generateCSV}
            >
              <DownloadCSVIcon />
              <span className="text-[#27AE60] text-[16px] font-[600]">
                Generate CSV
              </span>
            </div>
            {/* <ButtonDropDown
              className="custom-heading-btn flex items-center gap-[5px] !h-[40px]  plus-icon"
              label={" Add Users"}
              btnItem={[
                {
                  label: (
                    <div className="flex items-center gap-[5px] font-[600] text-[14px] text-[#828282] ">
                      Manually Add User
                    </div>
                  ),
                  key: 1,
                  onClick: () => router.push("/surveys/add"), // Handling navigation on click
                },
                {
                  label: (
                    <div className="flex items-center gap-[5px] font-[600] text-[14px] text-[#828282] ">
                      Add AD User
                    </div>
                  ),
                  key: 1,
                  onClick: () => router.push("/surveys/add-multi-page-survey"), //
                },
              ]}
            /> */}
            <Button
              type="primary"
              className="custom-heading-btn"
              onClick={() => router.push("/users/add")}
            >
              <PlusOutlined />
              Add Users
            </Button>
          </div>
        </div>

        {/* <div className="rounded-[14px] bg-[#FFFFFF] border border-[#E8E8E8] py-[21px] px-[31px]">
         */}
        <CommonTable
          showSettingIcon={true}
          columns={columns}
          apiData={source}
          placeholderTextClass="search"
          searchBoxStyle={{
            borderRadius: "4px",
            border: "1px solid  #E8E8E8",
            background: "#F5F6FA",
          }}
          child2={
            <div className="flex gap-[5px]">
              {selectedCheckboxIds && selectedCheckboxIds.length > 0 ? (
                <>
                  {/* <Select
                    // className="max-w-[288px]  "
                    placeholder="Select Option"
                  >
                    <Select.Option value="">Select Group</Select.Option>
                    {group.map((g: any) => (
                      <Select.Option value={g.groupId} key={g.groupId}>
                        {g.groupName}
                      </Select.Option>
                    ))}
                  </Select> */}
                  <div
                    className="flex items-center text-[#56CCF2] text-[16px] font-[600] text-nowrap mr-[27px] cursor-pointer"
                    onClick={bulkArchive}
                  >
                    <ArchiveIcon />{" "}
                    <span className="text-[16px]">
                      {status === "Archive" ? "Restore from" : "Bulk"} Archive
                    </span>
                  </div>
                </>
              ) : (
                ""
              )}
            </div>
          }
          searchInput={searchInput}
          rowClassName={(record: {userId: any}) =>
            selectedCheckboxIds.includes(record?.userId)
              ? "selected-item-table"
              : ""
          }
          rowSelection={rowSelection}
          rowKey={(record) => record.userId}
          setSearchInput={setSearchInput}
          parentHeader={
            <>
              {selectedCheckboxIds.length > 0 && (
                <div className="mx-[18px] px-[16px] py-[15px] rounded-[14px] border-[0.6px] border-[#D5D5D5] flex justify-end">
                  <div className="flex gap-[20px]">
                    {/* <div className=" text-[#828282] text-[16px] font-[400] flex w-[288px] h-[40px] p-[8px_10px_8px_12px] items-center gap-[8px] rounded-[4px] border border-[#E8E8E8] bg-[#FFF]">
                    <span>Selected User</span>
                    <span className="rounded-[100px] px-[10px] w-[10px] flex justify-center items-center bg-[#2D9CDB]  text-[#fff]">
                      {selectedCheckboxIds.length}
                    </span>
                  </div> */}

                    <CommonSelect
                      options={group.map((i: any) => ({
                        label: i.groupName,
                        value: i.groupId,
                      }))}
                      onChange={(select) => {
                        setAssignGroup(select);
                      }}
                      placeholder="Select Option"
                    />
                    <Button
                      className="rounded-[4px] border-[#4379EE]  text-[#4379EE] text-[16px] font-[600] "
                      onClick={addToGroup}
                    >
                      Add to Group
                    </Button>
                  </div>
                  <div></div>
                </div>
              )}
            </>
          }
          child={
            <>
              <div className="flex gap-[20px]">
                {/* <div className="text-[16px] font-bold text-[#333333] mt-2">
                  All Departments
                </div> */}
                <Dropdown menu={{items}}>
                  <a
                    onClick={(e) => e.preventDefault()}
                    className="text-[#4F4F4F] text-[16px] font-[400] "
                  >
                    <Space className="flex">
                      <span className="font-[700]">Status:</span>
                      {status == "" ? "All" : status}
                      <CustomDropdownIcon />
                    </Space>
                  </a>
                </Dropdown>

                {/* <Dropdown menu={{ items: AdUserItems }}>
                  <a
                    onClick={(e) => e.preventDefault()}
                    className="text-[#4F4F4F] text-[16px] font-[400] "
                  >
                    <Space className="flex">
                      <span className="font-[700]">Type:</span>
                      {selectedAdUser == ""
                        ? "All"
                        : selectedAdUser
                        ? "Normal User"
                        : "AD User"}
                      <CustomDropdownIcon />
                    </Space>
                  </a>
                </Dropdown> */}

                <Dropdown
                  menu={{
                    items: groupItems,
                    style: {
                      maxHeight: "300px",
                      overflowY: "auto",
                    },
                    className: "sidebar",
                  }}
                >
                  <a
                    onClick={(e) => e.preventDefault()}
                    className="text-[#4F4F4F] text-[16px] font-[400] "
                  >
                    <Space className="flex ">
                      <span className="font-[700]">Group:</span>
                      {selectedGroup ? selectedGroup?.groupName : "All"}
                      <CustomDropdownIcon />
                    </Space>
                  </a>
                </Dropdown>
                <Dropdown menu={{items: deptItems}}>
                  <a
                    onClick={(e) => e.preventDefault()}
                    className="text-[#4F4F4F] text-[16px] font-[400] "
                  >
                    <Space className="flex">
                      <span className="font-[700]">Department:</span>
                      {selectedDept ? selectedDept?.departmentName : "All"}
                      <CustomDropdownIcon />
                    </Space>
                  </a>
                </Dropdown>
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
          description={`Do you really want to delete this user?`}
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
export default UserListing;
