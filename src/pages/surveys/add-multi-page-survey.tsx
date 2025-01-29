import SidebarLayout from "@/src/components/Layout/SidebarLayout";
import AddEditMultiPageSurvey from "@/src/components/Survey/AddEditMultiPageSurvey";
import {FC} from "react";

const AddMultiPageSurvey: FC = () => {
  return (
    <SidebarLayout>
      <AddEditMultiPageSurvey multiPage={true} />
    </SidebarLayout>
  );
};
export default AddMultiPageSurvey;
