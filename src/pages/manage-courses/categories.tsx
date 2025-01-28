import BackArrowIcon from "@/src/components/Icons/BackArrowIcon";
import SidebarLayout from "@/src/components/Layout/SidebarLayout";
import CategorieListingTable from "@/src/components/PhishingSimulation/CategorieListingTable";
import {useRouter} from "next/router";

const CategorieSection = () => {
  const router = useRouter();
  return (
    <SidebarLayout>
      <CategorieListingTable
        isRenderURL={
          <div>
            <div
              className="cursor-pointer"
              onClick={() => router.push("/manage-courses")}
            >
              <BackArrowIcon />
            </div>
          </div>
        }
      />
    </SidebarLayout>
  );
};
export default CategorieSection;
