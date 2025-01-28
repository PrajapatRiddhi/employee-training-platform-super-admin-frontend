import AddUpdateDomainComponent from "@/src/components/AddUpdateDomainComponent";
import SidebarLayout from "@/src/components/Layout/SidebarLayout";
import {useRouter} from "next/router";
import {FC} from "react";

const UpdateDomain: FC = () => {
  const router = useRouter();
  const {id} = router.query;
  return (
    <SidebarLayout>
      <AddUpdateDomainComponent domainType={"Company"} id={id} />
    </SidebarLayout>
  );
};
export default UpdateDomain;
