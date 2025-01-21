import {FC, useState} from "react";
import NotificationIcon from "../Icons/NotificationIcon";
import {Avatar, Space, Dropdown, Image} from "antd";
import {UserOutlined} from "@ant-design/icons";
import {useRouter} from "next/router";
import {useDispatch} from "react-redux";
import {userLoggedOut} from "@/src/store/user";
import MenuDownIcon from "../Icons/MenuDownIcon";
import {useSelector} from "react-redux";
import type {MenuProps} from "antd";
import ManageAccountIcon from "../Icons/ManageAccountIcon";
import ChangePasswordIcon from "../Icons/ChangePasswordIcon";
import LogoutIcon from "../Icons/LogoutIcon";
import ActionsModal from "../Modals/ActionsModal";

const HeaderContent: FC = () => {
  const router = useRouter();
  const currentUser = useSelector((state: any) => state.userReducer.user);
  const [logoutUI, setLogout] = useState(false);
  const dispatch = useDispatch();

  const handleLogout = () => {
    setLogout(!logoutUI);
  };

  const logout = () => {
    if (logoutUI === true) {
      dispatch(userLoggedOut());
      router.push("/login");
    }
  };

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <div
          onClick={() => router.push("/manage-account")}
          className="flex gap-2"
        >
          <ManageAccountIcon />
          <div className="!text-[14px] !font-[600] !leading-[20px] font-[Nunito Sans] text-[#404040] !cursor-pointer ">
            Manage Account
          </div>
        </div>
      ),
    },
    {
      type: "divider",
    },
    {
      key: "2",
      label: (
        <div
          onClick={() => router.push("/change-password")}
          className="flex gap-2"
        >
          <ChangePasswordIcon />
          <div className="!text-[14px] !font-[600] !leading-[20px] font-[Nunito Sans] text-[#404040] !cursor-pointer ">
            Change Password
          </div>
        </div>
      ),
    },
    {
      type: "divider",
    },
    {
      key: "3",
      label: (
        <div onClick={handleLogout} className="flex gap-2">
          <LogoutIcon />
          <div className="!text-[14px] !font-[600] !leading-[20px] font-[Nunito Sans] text-[#404040] !cursor-pointer ">
            Logout
          </div>
        </div>
      ),
    },
  ];
  return (
    <div className="flex float-end mr-8 gap-5 items-center">
      <div className="">
        <NotificationIcon />
      </div>
      <Space direction="vertical">
        <Space wrap className="flex items-center">
          <Dropdown menu={{items}} placement="topRight">
            <div className="flex items-center gap-2 cursor-pointer">
              <Avatar
                size={30}
                icon={
                  currentUser?.image ? (
                    <Image
                      preview={false}
                      sizes="40"
                      src={currentUser?.image}
                    />
                  ) : (
                    <UserOutlined />
                  )
                }
              />

              <div className="!text-#828282 !text-[14px] !font-bold">
                {currentUser?.userName}
              </div>
              <MenuDownIcon />
            </div>
          </Dropdown>
        </Space>
      </Space>
      <ActionsModal
        title=""
        type="delete"
        description="Do you really want to log out?"
        isOpen={logoutUI}
        onCancel={() => setLogout(false)}
        onOk={logout}
        footer={false}
        centered={true}
        closable={false}
        maskClosable={false}
        className="delete-modal"
        cancelBtnClass="cancleBtnAction"
        cancelBtnClick={() => setLogout(false)}
        cancelButtonProps="Cancel"
        saveBtnClass="saveBtnAction"
        saveBtnClick={logout}
        saveButtonProps="Logout"
        mainTitle="Are you sure?"
      />
    </div>
  );
};
export default HeaderContent;
