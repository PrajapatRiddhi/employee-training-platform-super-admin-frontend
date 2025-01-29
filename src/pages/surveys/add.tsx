import SidebarLayout from "@/src/components/Layout/SidebarLayout";
import AddEditSurvey from "@/src/components/Survey/AddEditSurvey";
import {FC} from "react";

const AddSurvey: FC = () => {
  return (
    <SidebarLayout>
      <AddEditSurvey />
    </SidebarLayout>
  );
};
export default AddSurvey;
