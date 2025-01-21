import React from "react";
import {Card} from "antd";

export interface CommonCardProps {
  data: {
    title: string;
    amt: number;
    icon: JSX.Element;
    outOfField?: number;
    outOfText?: string;
  };
}

const CommonCard: React.FC<CommonCardProps> = ({data}) => {
  return (
    <Card className="custom-card no-padding-body px-[20px] pt-[20px] pb-[15px] mt-[30px]">
      <div>
        <div className="text-[16px] font-[600] text-nowrap">{data.title}</div>
        <div className="flex justify-between mt-5">
          <div className="text-[28px] font-[700]">{data.amt}</div>
          <div>{data.icon}</div>
        </div>
      </div>
    </Card>
  );
};

export default CommonCard;
