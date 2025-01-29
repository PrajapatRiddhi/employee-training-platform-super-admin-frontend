import SidebarLayout from "@/src/components/Layout/SidebarLayout";
import SurveyViewDetails from "@/src/components/Survey/SurveyViewDetails";
import {useRouter} from "next/router";
import {FC} from "react";

const ViewSurvey: FC = () => {
  const router = useRouter();
  const {query} = router;
  return (
    <>
      <SidebarLayout>
        <SurveyViewDetails id={query?.id} />
      </SidebarLayout>
    </>
  );
};
export default ViewSurvey;
