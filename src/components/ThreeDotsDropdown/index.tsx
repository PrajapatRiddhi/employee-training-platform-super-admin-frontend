import React, { FC } from "react";
import { Menu, Dropdown } from "antd";
import ThreeDotsIcon from "../Icons/ThreeDotsIcon";
import { on } from "events";

interface MenuItem {
  key: string;
  label: React.ReactNode;
  onClick?: () => void;
}

interface ThreeDotsDropdownProps {
  menuItems: MenuItem[];
}

const ThreeDotsDropdown: FC<ThreeDotsDropdownProps> = ({ menuItems }) => {
  return (
    <Dropdown
      className="cursor-pointer three-dots-dropdown"
      rootClassName="three-dots-dropdown"
      menu={{ items: menuItems }}
      trigger={["click", "hover"]}
    >
      <a>
        <ThreeDotsIcon />
      </a>
    </Dropdown>
  );
};

export default ThreeDotsDropdown;
