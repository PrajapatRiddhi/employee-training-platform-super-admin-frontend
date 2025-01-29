import AssessmentViewDetails from "@/src/components/Assessment/AssessmentViewDetails";
import SidebarLayout from "@/src/components/Layout/SidebarLayout";
import {useRouter} from "next/router";
import {FC} from "react";

const ViewAssessmentDetails: FC = () => {
  const router = useRouter();
  const {query} = router;
  return (
    <>
      <SidebarLayout>
        <AssessmentViewDetails id={query?.id} />
      </SidebarLayout>
    </>
  );
};
export default ViewAssessmentDetails;
