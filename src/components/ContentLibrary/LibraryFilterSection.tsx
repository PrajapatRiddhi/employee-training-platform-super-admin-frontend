import React from "react";
import {Space} from "antd";
import type {MenuProps} from "antd";
import TrainingCourseIcon from "../Icons/TrainingCourseIcon";
import BlogArticleIconFilter from "../Icons/BlogArticleIconFilter";
import VideoModuleIcon from "../Icons/VideoModuleIcon";
import CommonSelect from "../CommonSelect";
import PresentationIcon from "../Icons/PresentationIcon";
import VideoLibraryIcon from "../Icons/VideoLibraryIcon";

const ContentTypesData = [
  {
    id: 1,
    label: "Training/Course Content",
    icon: <PresentationIcon />,
  },
  {
    id: 2,
    label: "Blog/Article",
    icon: <BlogArticleIconFilter />,
  },
  {
    id: 3,
    label: "Video Module",
    icon: <VideoLibraryIcon />,
  },
];

interface LibraryFilterProps {
  searchInput?: any;
  setSearchInput: any;
  handleContentTypeChange?: (value: any) => void;
  statusFilter: any;
}

const LibraryFilterSection: React.FC<LibraryFilterProps> = ({
  handleContentTypeChange,
  statusFilter,
}) => {
  const items: MenuProps["items"] = [];

  ContentTypesData.forEach((contentType, index) => {
    items.push({
      key: contentType.id.toString(),
      label: (
        <Space>
          {contentType.icon}
          <div className="text-[#333333] text-[14px] hover:!text-red-500">{contentType.label}</div>
        </Space>
      ),
    });

    if (index < ContentTypesData.length - 1) {
      items.push({
        type: "divider",
      });
    }
  });

  items.push({
    key: "reset",
    label: "Course Type",
    onClick: () => handleContentTypeChange?.(""),
  });


  const ContentTypeOptions = [
    {label: "Course Type", value: ""},
    ...ContentTypesData.map((item) => ({
      label: (
        <div style={{display: "flex", alignItems: "center", cursor: "pointer",
          transition: "color 0.3s ease",}} className="">
          {item.icon}
          <span  style={{marginLeft: 8, color:"#333333", fontSize:'14px', fontWeight:400}}>{item.label}</span>
        </div>
      ),
      value: item.label,
    })),
  ];

  return (
    <div className="flex gap-2">
      <div>
        <CommonSelect
          options={ContentTypeOptions}
          value={statusFilter}
          onChange={handleContentTypeChange}
          className="!w-[300px] rounded-[4px] "
          placeholder="Please select the content type"
          rootClassName="content-type-select"
        />
      </div>
    </div>
  );
};

export default LibraryFilterSection;
