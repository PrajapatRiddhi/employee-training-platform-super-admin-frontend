import AddEditAssessment from "@/src/components/Assessment/AddEditAssessment";
import SidebarLayout from "@/src/components/Layout/SidebarLayout";
import {useRouter} from "next/router";
import {FC} from "react";

const AssessmentUpdate: FC = () => {
  const router = useRouter();
  const {query} = router;
  return (
    <SidebarLayout>
      <AddEditAssessment id={query?.id} />
    </SidebarLayout>
  );
};
export default AssessmentUpdate;
