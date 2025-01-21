import React from "react";
import type {MenuProps} from "antd";
import {Dropdown, Space} from "antd";
import DotsVerticalcon from "../Icons/DotsVerticalcon";
import ViewIcon from "../Icons/ViewIcon";
import DeleteIcon from "../Icons/DeleteIcon";

interface ContentOptionsProps {
  content: any;
  onViewContent: (content: any) => void;
  handleDeleteContent: (content: any) => void;
}

const ContentOptions: React.FC<ContentOptionsProps> = ({
  content,
  onViewContent,
  handleDeleteContent,
}) => {
  const items: MenuProps["items"] = [
    {
      label: (
        <div
          className="flex gap-2 text-[15px] text-[#333333]"
          onClick={() => onViewContent(content)}
        >
          <ViewIcon />
          View Content
        </div>
      ),
      key: "0",
    },
    {
      type: "divider",
    },
    {
      label: (
        <div
          className="flex gap-2 text-[15px] text-[#333333]"
          onClick={() => handleDeleteContent(content?.contentId)}
        >
          <DeleteIcon />
          Delete Content
        </div>
      ),
      key: "1",
    },
  ];

  return (
    <Dropdown placement="bottomRight" menu={{items}} trigger={["click"]}>
      <a onClick={(e) => e.preventDefault()}>
        <Space>
          <DotsVerticalcon />
        </Space>
      </a>
    </Dropdown>
  );
};

export default ContentOptions;
