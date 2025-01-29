import AddEditAssessment from "@/src/components/Assessment/AddEditAssessment";
import SidebarLayout from "@/src/components/Layout/SidebarLayout";
import {FC} from "react";

const AssessmentCreate: FC = () => {
  return (
    <SidebarLayout>
      <AddEditAssessment />
    </SidebarLayout>
  );
};
export default AssessmentCreate;
