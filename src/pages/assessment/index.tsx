import AssessmentListing from "@/src/components/Assessment/AssessmentListing";
import SidebarLayout from "@/src/components/Layout/SidebarLayout";
import {FC} from "react";

const AssessmentList: FC = () => {
  return (
    <SidebarLayout>
      <AssessmentListing />
    </SidebarLayout>
  );
};
export default AssessmentList;
