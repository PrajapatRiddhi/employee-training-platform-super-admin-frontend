import {FC} from "react";
import SidebarLayout from "@/src/components/Layout/SidebarLayout";
import {Card} from "antd";

const Onboarding: FC = () => {
  return (
    <SidebarLayout>
      <div className="h-[90%]">
        <div className="text-[24px] font-[700] text-[#313D4F] mb-5">
          Onboarding
        </div>

        <Card className="border border-[#E8E8E8] bg-[#FFF] rounded-[14px] h-full">
          <div>Onboarding Page</div>
        </Card>
      </div>
    </SidebarLayout>
  );
};

export default Onboarding;
