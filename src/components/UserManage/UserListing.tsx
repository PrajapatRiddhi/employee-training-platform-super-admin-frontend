import {FC, useState} from "react";
import DeleteIcon from "../Icons/DeleteIcon";
import ActionsModal from "../Modals/ActionsModal";
import {Button, Dropdown, MenuProps, Space} from "antd";
import CommonTable from "../CommonTable";
import CustomDropdownIcon from "../Icons/CustomDropdownIcon";
import ViewIcon from "../Icons/ViewIcon";
import {PlusOutlined} from "@ant-design/icons";
import React from "react";
import ThreeDotsDropdown from "../ThreeDotsDropdown";
import {useRouter} from "next/router";

const userListing = [
  {
    name: "Quick Fix Solutions",
    contactNumber: "+92 56595 88949",
    email: "john.doe@example.com",
    SubscriptionStart: "Nov 7, 2021",
    status: "Active",
  },
  {
    name: "Quick Fix Solutions",
    contactNumber: "+92 56595 88949",
    email: "john.doe@example.com",
    SubscriptionStart: "Nov 7, 2021",
    status: "Active",
  },
  {
    name: "Quick Fix Solutions",
    contactNumber: "+92 56595 88949",
    email: "john.doe@example.com",
    SubscriptionStart: "Nov 7, 2021",
    status: "Active",
  },
  {
    name: "Quick Fix Solutions",
    contactNumber: "+92 56595 88949",
    email: "john.doe@example.com",
    SubscriptionStart: "Nov 7, 2021",
    status: "Active",
  },
  {
    name: "Quick Fix Solutions",
    contactNumber: "+92 56595 88949",
    email: "john.doe@example.com",
    SubscriptionStart: "Nov 7, 2021",
    status: "Active",
  },
];

const UserListing: FC = () => {
  const [source, setSource] = useState(userListing);
  const [openDeleteUI, setOpenDeleteUI] = useState(false);
  const router = useRouter();

  const handleDeleteUI = () => {
    setOpenDeleteUI(!openDeleteUI);
  };

  const columns = [
    {
      title: "Company Name",
      dataIndex: "name",
    },
    {
      title: "Email Address",
      dataIndex: "email",
    },
    {
      title: "Contact Number",
      dataIndex: "contactNumber",
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "Subscription Start",
      dataIndex: "SubscriptionStart",
    },
    {
      title: "Subscription Expiry",
      dataIndex: "SubscriptionStart",
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text: any, record: any) => (
        <div className="space-x-[10px] flex ">
          <span
            onClick={() => router.push("/company/view")}
            className="cursor-pointer"
          >
            <ViewIcon />
          </span>
          <span onClick={handleDeleteUI} className="cursor-pointer">
            <DeleteIcon />
          </span>
          <ThreeDotsDropdown
            menuItems={[
              {
                key: "Hold",
                label: (
                  <div className="text-[#333] text-[14px] font-[400] gap-[8px] flex">
                    Hold
                  </div>
                ),
              },
              {
                key: "Activate",
                label: (
                  <div className="text-[#333] text-[14px] font-[400] gap-[8px] flex">
                    Activate
                  </div>
                ),
              },
              {
                key: "Deactivate",
                label: (
                  <div className="text-[#333] text-[14px] font-[400] gap-[8px] flex">
                    Deactivate
                  </div>
                ),
              },
            ]}
          />
        </div>
      ),
    },
  ];

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: <a>All</a>,
    },
    {
      key: "2",
      label: <a>Active</a>,
    },
    {
      key: "3",
      label: <a>Inactive</a>,
    },
    {
      key: "4",
      label: <a>Archive</a>,
    },
  ];
  const AdUserItems: MenuProps["items"] = [
    {
      key: "1",
      label: <a>All</a>,
    },
    {
      key: "2",
      label: <a>Normal User</a>,
    },
    {
      key: "3",
      label: <a>AD User</a>,
    },
  ];

  return (
    <>
      <div className="w-full">
        <div className="flex justify-between items-center mb-[20px]">
          <div className="heading-title">Manage B2B Users</div>
          <div className=" flex items-center">
            <Button
              type="primary"
              className="custom-heading-btn"
              onClick={() => router.push("/company/add")}
            >
              <PlusOutlined />
              Add New Company
            </Button>
          </div>
        </div>

        <CommonTable
          showSettingIcon={false}
          columns={columns}
          apiData={source}
          placeholderTextClass="search"
          searchBoxStyle={{
            borderRadius: "4px",
            border: "1px solid  #E8E8E8",
            background: "#F5F6FA",
          }}
          child={
            <>
              <div className="flex gap-[20px]">
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

                <Dropdown
                  menu={{
                    items: [],
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
                      <span className="font-[700]">Type:</span>
                      Type
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
          isOpen={openDeleteUI}
          onCancel={() => setOpenDeleteUI(false)}
          onOk={handleDeleteUI}
          footer={false}
          centered={true}
          closable={false}
          maskClosable={true}
          className="delete-modal"
          cancelBtnClass="cancleBtnAction"
          cancelBtnClick={() => setOpenDeleteUI(false)}
          cancelButtonProps="Cancel"
          saveBtnClass="saveBtnAction"
          saveBtnClick={handleDeleteUI}
          saveButtonProps="Delete"
          mainTitle="Are you sure?"
          description={`Do you really want to delete this user?`}
        />

        {/* <CommonPagination
          className="pagination"
          currentPage={currentPage}
          totalItems={totalItems}
          itemsPerPage={pageLimit}
          onPageChange={handlePageChange}
          onShowSizeChange={undefined}
        /> */}
      </div>
    </>
  );
};
export default UserListing;
