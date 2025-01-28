import AddUpdateDomainComponent from "@/src/components/AddUpdateDomainComponent";
import SidebarLayout from "@/src/components/Layout/SidebarLayout";
import {FC} from "react";

const AddUpdateDomain: FC = () => {
  return (
    <SidebarLayout>
      <AddUpdateDomainComponent domainType={"Company"} />
    </SidebarLayout>
  );
};
export default AddUpdateDomain;
