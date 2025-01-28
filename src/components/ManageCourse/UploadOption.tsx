import React from "react";
import type {MenuProps} from "antd";
import {Button, Dropdown} from "antd";
import UploadIcon from "../Icons/UploadIcon";
import UplaodVideoIcon from "../Icons/UplaodVideoIcon";
import UploadScormIcon from "../Icons/UploadScormIcon";

interface UplaodProps {
  handleVideoEdit?: (record: any) => void;
  viewCourseDetails?: any;
  handleScormEdit?: (record: any) => void | undefined;
}

const UploadOption: React.FC<UplaodProps> = ({
  handleVideoEdit,
  viewCourseDetails,
  handleScormEdit,
}) => {
  const items: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <div
          onClick={() => {
            if (handleScormEdit) {
              handleScormEdit(viewCourseDetails);
            }
          }}
          className="!text-[14px] ml-2 !font-[600] !leading-[20px] font-[Nunito Sans] text-[#828282] !cursor-pointer"
        >
          Upload SCORM
        </div>
      ),
      icon: <UploadScormIcon />,
    },
    {
      type: "divider",
    },
    {
      key: "2",
      label: (
        <div
          onClick={() => {
            if (handleVideoEdit) {
              handleVideoEdit(viewCourseDetails);
            }
          }}
          className="!text-[14px]  ml-2 !font-[600] !leading-[20px] font-[Nunito Sans] text-[#828282] !cursor-pointer"
        >
          Upload Video
        </div>
      ),
      icon: <UplaodVideoIcon />,
    },
  ];

  return (
    <Dropdown menu={{items}} placement="bottomRight">
      <a onClick={(e) => e.preventDefault()}>
        <Button className="!bg-[#4379EE] !text-[16px] font-[700] font-[Nunito Sans] text-[#FFFFFF] h-[50px] hover:text-[#FFFFFF]">
          <div className="flex gap-2">
            <UploadIcon />
            <span className="hover:text-[#FFFFFF]">Upload</span>
          </div>
        </Button>
      </a>
    </Dropdown>
  );
};

export default UploadOption;
