import {useEffect, useState, FC} from "react";
import {Spin} from "antd";
import {NextRouter, useRouter} from "next/router";
import moment from "moment";
import axiosInstance from "@/src/interceptors/Axios";
import {API_ENDPOINTS} from "@/src/interceptors/apiName";
import ButtonDropDown from "@/src/components/ButtonDropdown";
import SidebarLayout from "@/src/components/Layout/SidebarLayout";
import LeftArrowIcon from "@/src/components/Icons/LeftArrowIcon";
import UserFieldMembership from "@/src/components/MembershipPolicy/UserFieldMembership";
import UserDateMembership from "@/src/components/MembershipPolicy/UserDateMembership";
import CommonTable from "@/src/components/CommonTable";
import {config} from "@/src/helper/config";
import UserPhishEventMembership from "@/src/components/MembershipPolicy/UserPhishEventMembership";
import UserTrainingMembership from "@/src/components/MembershipPolicy/UserTrainingMembership";
import CommonPagination from "@/src/components/CommonTable/paginnation";

const ManageSmartGroups: FC = () => {
  const router: NextRouter = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [formDetailsLoading, setFormDetailsLoading] = useState<boolean>(false);
  const [userDetailsLoading, setUserDetailsLoading] = useState<boolean>(false);
  const [membershipPolicyList, setMembershipPolicyList] = useState<any[]>([]);
  const [currentMembership, setCurrentMembership] = useState<any>({});
  const [membershipItems, setMembershipItems] = useState<any[]>([]);
  const [membershipFormDetails, setMembershipFormDetails] = useState<any>({});
  const [users, setUsers] = useState<any[]>([]);
  const [groupId, setGroupId] = useState<null | number>(null);
  const [searchInput, setSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [sortedColumn, setSortedColumn] = useState<string>("addedDate");
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC" | undefined>(
    "DESC"
  );

  const column = [
    {
      title: "User Name",
      dataIndex: "userName",
      sorter: true,
      onHeaderCell: () => ({
        onClick: () => handleColumnSort("userName"),
      }),
      render: (text: any, record: any) => (
        <div className="gap-[5px]">
          <span className="text-[14px] font-[600] text-[#4F4F4F] ">{text}</span>
        </div>
      ),
    },
    {
      title: "Risk",
      dataIndex: "risk",
      sorter: true,
      onHeaderCell: () => ({
        onClick: () => handleColumnSort("risk"),
      }),
      render: (text: any, record: any) => (
        <div className="gap-[5px]">
          <span className="text-[14px] font-[600] text-[#4F4F4F] ">
            {record?.risk === null ||
            record?.risk === undefined ||
            record?.risk === ""
              ? 0
              : Number(record?.risk)}
          </span>
        </div>
      ),
    },
    {
      title: "Groups",
      dataIndex: "groupName",
      sorter: true,
      onHeaderCell: () => ({
        onClick: () => handleColumnSort("groupName"),
      }),
      render: (text: any, record: any) => (
        <div className="gap-[5px]">
          <span className="text-[14px] font-[600] text-[#4F4F4F] ">{text}</span>
        </div>
      ),
    },
    {
      title: "Joined on",
      dataIndex: "joinedOn",
      sorter: true,
      onHeaderCell: () => ({
        onClick: () => handleColumnSort("joinedOn"),
      }),
      render: (text: any, record: any) => (
        <span className="text-[14px] font-[600] text-[#4F4F4F]">
          {moment.unix(record?.joinedOn / 1000).format("MM/DD/YYYY")}
        </span>
      ),
    },
    {
      title: "Last Login",
      dataIndex: "lastLogin",
      sorter: true,
      onHeaderCell: () => ({
        onClick: () => handleColumnSort("lastLogin"),
      }),
      render: (text: any, record: any) => (
        <span className="text-[14px] font-[600] text-[#4F4F4F]">
          {moment.unix(record?.lastLogin / 1000).format("MM/DD/YYYY")}
        </span>
      ),
    },
  ];

  const handleColumnSort = (column: string) => {
    if (column === sortedColumn) {
      setSortOrder(sortOrder === "ASC" ? "DESC" : "ASC");
    } else {
      setSortedColumn(column);
      setSortOrder("ASC");
    }
  };

  const getMembershipPolicyList = async () => {
    setLoading(true);
    try {
      const result: any = await axiosInstance.get(
        `${API_ENDPOINTS.MEMBERSHIP_POLICY_LIST}`
      );
      if (Object.keys(result).length && result?.settings?.success) {
        setMembershipPolicyList(result.data);
      }
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  const handleMembershipItems = () => {
    const btnItems = [];
    for (let item of membershipPolicyList) {
      btnItems.push({
        label: (
          <div className="flex items-center gap-[5px] font-[600] text-[14px] text-[#828282]">
            {item.formName}
          </div>
        ),
        key: item.formName,
        onClick: () => setCurrentMembership(item),
      });
    }
    setMembershipItems(btnItems);
  };

  const getMembershipFormDetails = async () => {
    setFormDetailsLoading(true);
    try {
      const result: any = await axiosInstance.get(
        `${API_ENDPOINTS.MEMBERSHIP_FORM}/${currentMembership.formId}`
      );
      if (Object.keys(result).length && result?.settings?.success) {
        setMembershipFormDetails(result.data);
      }
    } catch (e) {
    } finally {
      setFormDetailsLoading(false);
    }
  };

  const showLoader = () => (
    <div className="text-center">
      <Spin />
    </div>
  );

  const selectMembershipPolicyUI = () => (
    <div className="text-center text-[16px]">Select a membership policy</div>
  );

  const membershipPolicyFormUI = () => {
    if (currentMembership.formId === 1) {
      return (
        <UserFieldMembership
          membershipFormDetails={membershipFormDetails}
          setGroupId={setGroupId}
          setUsers={setUsers}
        />
      );
    }
    if (currentMembership.formId === 2) {
      return (
        <UserDateMembership
          membershipFormDetails={membershipFormDetails}
          setGroupId={setGroupId}
          setUsers={setUsers}
        />
      );
    }
    if (currentMembership.formId === 3) {
      return (
        <UserPhishEventMembership
          membershipFormDetails={membershipFormDetails}
          setGroupId={setGroupId}
          setUsers={setUsers}
        />
      );
    }
    if (currentMembership.formId === 4) {
      return (
        <UserTrainingMembership
          membershipFormDetails={membershipFormDetails}
          setGroupId={setGroupId}
          setUsers={setUsers}
        />
      );
    }
  };

  const exportCSV = async () => {
    try {
      let groupUsers: any = await axiosInstance.post(
        API_ENDPOINTS.GROUP_USERS,
        JSON.stringify({isExport: true, groupId})
      );
      if (groupUsers?.settings?.success) {
        config.downloadFile(groupUsers?.data?.fileUrl, "SmartGroupUsers.csv");
      }
    } catch (error) {}
  };

  const handlePageChange = (page: React.SetStateAction<number>) => {
    setCurrentPage(page);
  };

  const showUserList = () => (
    <div className="mt-[20px] rounded-[14px] bg-[#FFFFFF] border border-[#E8E8E8] py-[21px] px-[31px]">
      <CommonTable
        title={"Users"}
        apiData={users}
        columns={column}
        rowKey={(record) => record.userId}
        showCSV={true}
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        csvButtonName={"Generate CSV"}
        onExportCSV={exportCSV}
      />
      <CommonPagination
        className="pagination"
        currentPage={currentPage}
        totalItems={totalItems}
        itemsPerPage={pageLimit}
        onPageChange={handlePageChange}
        onShowSizeChange={undefined}
      />
    </div>
  );

  const getGroupUserList = async (groupId: number) => {
    setUserDetailsLoading(true);
    try {
      const payload = {
        page: 1 || currentPage,
        limit: pageLimit,
        keyword: searchInput,
        sort: [{prop: sortedColumn, dir: sortOrder}],
        filters: [],
        groupId,
      };
      const result: any = await axiosInstance.post(
        `${API_ENDPOINTS.GROUP_USERS}`,
        payload
      );
      if (Object.keys(result)?.length && result?.settings?.success) {
        setUsers(result?.data);
        setTotalItems(result?.settings?.count);
      }
    } catch (e) {
    } finally {
      setUserDetailsLoading(false);
    }
  };

  // useEffect(() => {
  //   users?.length && setTotalItems(users?.length);
  // }, [users]);

  useEffect(() => {
    groupId && getGroupUserList(groupId);
  }, [groupId, searchInput, sortedColumn, sortOrder, currentPage, pageLimit]);

  useEffect(() => {
    if (currentMembership.formId > 0) {
      getMembershipFormDetails();
      setUsers([]);
    }
  }, [currentMembership]);

  useEffect(() => {
    if (membershipPolicyList.length) handleMembershipItems();
  }, [membershipPolicyList]);

  useEffect(() => {
    getMembershipPolicyList();
  }, []);

  return (
    <SidebarLayout>
      <div>
        <div className="flex justify-between">
          <div className="flex items-center text-[24px] font-[700] text-[#313D4F] mb-[30px]">
            <span
              className="cursor-pointer"
              onClick={() => router.push("/users/manage-groups")}
            >
              <LeftArrowIcon />
            </span>
            <span className="pl-[15px]">Create Automated Group</span>
          </div>
          <div className="flex items-center text-[24px] font-[700] text-[#313D4F] mb-[30px]">
            <ButtonDropDown
              loading={loading}
              className="custom-heading-btn flex items-center px-[20px] py-[8px] !h-[40px] plus-icon"
              label={
                <div className="flex items-center gap-[5px] text-[16px] font-[700]">
                  {Object.keys(membershipFormDetails).length > 0
                    ? currentMembership.formName
                    : "Membership policy"}
                </div>
              }
              btnItem={membershipItems}
            />
          </div>
        </div>

        <div className="rounded-[14px] bg-[#FFFFFF] border border-[#E8E8E8] py-[21px] px-[31px]">
          {formDetailsLoading
            ? showLoader()
            : Object.keys(membershipFormDetails).length > 0
            ? membershipPolicyFormUI()
            : selectMembershipPolicyUI()}
        </div>
      </div>

      {userDetailsLoading ? (
        <div className="rounded-[14px] bg-[#FFFFFF] border border-[#E8E8E8] py-[21px] px-[31px] mt-[20px] ">
          {showLoader()}
        </div>
      ) : users && users?.length ? (
        showUserList()
      ) : null}
    </SidebarLayout>
  );
};

export default ManageSmartGroups;
