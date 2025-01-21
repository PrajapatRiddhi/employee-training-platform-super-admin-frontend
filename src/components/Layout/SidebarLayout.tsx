import {Divider, Layout, Menu, Typography} from "antd";
import {useRouter} from "next/router";
import React, {ReactNode, useMemo, useState} from "react";
import Logo from "../Icons/Logo";
import MenuIcon from "../Icons/MenuIcon";
import RightArrowIcon from "../Icons/RightArrowIcon";
import HeaderContent from "./HeaderContent";
import {companyAdminNavBarItems} from "./SidebarMenu";
const {Header, Content, Footer, Sider} = Layout;
const Text = Typography.Text;

interface SidebarLayoutProps {
  children: ReactNode;
}
const SidebarLayout: React.FC<SidebarLayoutProps> = ({children}) => {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const sidebarWidth = collapsed ? 80 : 240;

  const isManageCoursesActive = [
    "/content/manage-courses",
    "/content/create-courses",
    "/content/view-courses",
    "/content/edit-course",
    "/content/categories`",
  ].some((route) => router.pathname.startsWith(route));

  const menuItems = companyAdminNavBarItems.map((item, i) => ({
    key: item.routePath || item?.id,
    label: (
      <>
        {item?.label === "divider" ? (
          <Divider className="custom-divider-menu" />
        ) : (
          <div className={`flex flex-row items-center justify-between`}>
            <div className="flex items-center">
              <span className="size-7 flex items-center justify-center">
                {item.icon}
              </span>
              <Text
                className={`!text-[14px] font-bold Nunito Sans text-[#333333] pl-2 ${
                  collapsed ? "hidden" : "block"
                } `}
              >
                {item.label}
              </Text>
            </div>
            {!collapsed && (
              <div className="flex">
                {item.children?.length && <RightArrowIcon />}
              </div>
            )}
          </div>
        )}
      </>
    ),
    onClick: () => item?.routePath && router.push(item?.routePath),
    children: item.children?.map((child) => ({
      key: child.routePath,
      label: (
        <div
          className={`flex flex-row gap-[15px] items-center justify-between`}
        >
          <div className="flex">
            <span>{child.icon}</span>
            <Text
              className={`!text-[14px] font-bold text-[#333333] pl-2 ${
                collapsed ? "hidden" : "block"
              } `}
            >
              {child.label}
            </Text>
          </div>
        </div>
      ),
      onClick: () => {
        child?.routePath && router.push(child.routePath);
      },
    })),
  }));

  const matchedChildren = () => {
    const matchedParent = menuItems.find((el) => el.key === router.pathname);
    if (matchedParent) {
      return [String(matchedParent.key)];
    }
    const matchedChildren = menuItems.find((el) =>
      el.children?.some((children) => children.key === router.pathname)
    );

    if (matchedChildren) {
      return [String(matchedChildren.key), router.pathname];
    }

    return [router.pathname];
  };

  const selectedKeys = useMemo(() => {
    return isManageCoursesActive
      ? ["/content/manage-courses"]
      : [...matchedChildren(), "/departments/add"];
  }, [router.pathname, isManageCoursesActive]);

  console.log("temp", selectedKeys);

  return (
    <Layout style={{minHeight: "100vh"}}>
      <Sider
        collapsed={collapsed}
        width={sidebarWidth}
        className="!bg-white !border !border-solid !border-[#E8E8E8]"
      >
        <div className="my-[23px] mx-[22px] flex items-center justify-between">
          {!collapsed && <Logo />}
          <div
            onClick={() => setCollapsed(!collapsed)}
            className="cursor-pointer"
          >
            <div
              className={`flex justify-center items-center ${
                !collapsed && "ml-2"
              } `}
            >
              <MenuIcon />
            </div>
          </div>
        </div>
        <Menu
          theme="light"
          selectedKeys={selectedKeys}
          className={`!pt-[15px] ${
            !collapsed ? "custom-menu" : "custom-menu-icon "
          } selected-menu`}
          items={menuItems}
          getPopupContainer={(node) => node.parentNode as HTMLElement}
          mode="vertical"
        />
      </Sider>
      <Layout>
        <Header
          style={{padding: 0, background: "white"}}
          className="!border !border-solid !border-[#E8E8E8]"
        >
          <HeaderContent />
        </Header>
        <Content
          style={{
            margin: "0 16px",
            padding: "30px",
            backgroundColor: "#F5F6FA",
          }}
        >
          {children}
        </Content>
        <Footer
          style={{textAlign: "center", background: "transparent"}}
          className="!border !border-solid !border-[#E8E8E8] !pt-[16px] !pb-[14px]"
        >
          <div className="!flex justify-between items-center">
            <Text className="!text-#828282 !text-[14px] !leading-[20px] !font-normal">
              © {new Date().getFullYear()}, made with ❤️ by Skillo.Ai
            </Text>
            <div className="!flex !gap-5 cursor-pointer">
              <Text className="!text-#828282 !text-[14px] !leading-[20px] !font-normal">
                Terms & Conditions
              </Text>
              <Text className="!text-#828282 !text-[14px] !leading-[20px] !font-normal">
                Support
              </Text>
              <Text className="!text-#828282 !text-[14px] !leading-[20px] !font-normal">
                Contact
              </Text>
            </div>
          </div>
        </Footer>
      </Layout>
    </Layout>
  );
};

export default SidebarLayout;
