import React from "react";
import {Space} from "antd";
import type {MenuProps} from "antd";
import TrainingCourseIcon from "../Icons/TrainingCourseIcon";
import BlogArticleIconFilter from "../Icons/BlogArticleIconFilter";
import VideoModuleIcon from "../Icons/VideoModuleIcon";
import CommonSelect from "../CommonSelect";

const ContentTypesData = [
  {
    id: 1,
    label: "Training/Course Content",
    icon: <TrainingCourseIcon />,
  },
  {
    id: 2,
    label: "Blog/Article",
    icon: <BlogArticleIconFilter />,
  },
  {
    id: 3,
    label: "Video Module",
    icon: <VideoModuleIcon />,
  },
];

interface LibraryFilterProps {
  searchInput?: any;
  setSearchInput: any;
  handleContentTypeChange?: (value: any) => void;
  contentTypeFilter: any;
}

const UploadedContentFilter: React.FC<LibraryFilterProps> = ({
  handleContentTypeChange,
  contentTypeFilter,
}) => {
  const items: MenuProps["items"] = [];

  // Add Content Type Items
  ContentTypesData.forEach((contentType, index) => {
    items.push({
      key: contentType.id.toString(),
      label: (
        <Space>
          {contentType.icon}
          <div className="text-[#333333] text-[14px]">{contentType.label}</div>
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
    label: "Reset Filter",
    onClick: () => handleContentTypeChange?.(""),
  });


  const ContentTypeOptions = [

    {label: "Reset Filter", value: ""}, 
    ...ContentTypesData.map((item) => ({
      label: (
        <div style={{display: "flex", alignItems: "center"}}>
          {item.icon}
          <span style={{marginLeft: 8}}>{item.label}</span>
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
          value={contentTypeFilter}
          onChange={handleContentTypeChange}
          className="!w-[300px] rounded-[4px]"
          placeholder="Please select the content type"
        />
      </div>
    </div>
  );
};

export default UploadedContentFilter;
