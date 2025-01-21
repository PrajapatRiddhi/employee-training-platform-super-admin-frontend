import {Tag} from "antd";
import React, {ReactNode} from "react";

interface TagProps {
  title: ReactNode;
  icon: ReactNode;
}

const TagComponent: React.FC<TagProps> = ({title, icon}) => {
  return (
    <Tag
      className="!rounded-[4px] p-2 border border-[#E0E0E0] flex"
      icon={icon}
    >
      {title}
    </Tag>
  );
};

export default TagComponent;
