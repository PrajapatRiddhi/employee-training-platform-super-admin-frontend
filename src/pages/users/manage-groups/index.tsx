import {FC} from "react";
import {FunctionComponent, useState} from "react";
import {NextRouter, useRouter} from "next/router";
import SidebarLayout from "@/src/components/Layout/SidebarLayout";
import ButtonDropDown from "@/src/components/ButtonDropdown";
import PlusIconWhite from "@/src/components/Icons/PlusIconWhite";
import NormalGroupIcon from "@/src/components/Icons/NormalGroupIcon";
import AutomatedGroupIcon from "@/src/components/Icons/AutomatedGroupIcon";
import ManageGroupsListing from "@/src/components/Users/ManageGroupsListing";

type IconComponentType = FunctionComponent<React.SVGProps<SVGSVGElement>>;

interface BtnItem {
  label: JSX.Element;
  key: string;
  onClick: () => void;
}

const ManageGroups: FC = () => {
  const router: NextRouter = useRouter();
  const [pageLimit, setPageLimit] = useState(10);
  const [totalItems, setTotalItems] = useState(26);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("Active");
  const [typeFilter, setTypeFilter] = useState<string>("");

  const handleStatusChange = (value: any) => {
    setStatusFilter(value);
  };

  const handleTypeChange = (value: any) => {
    setTypeFilter(value);
  };

  const createBtnItem = (
    IconComponent: IconComponentType,
    label: string,
    route: string
  ): BtnItem => {
    const router = useRouter();
    return {
      label: (
        <div className="flex items-center gap-[10px] font-[600] text-[14px] text-[#828282]">
          <IconComponent /> {label}
        </div>
      ),
      key: label,
      onClick: () => router.push(route),
    };
  };

  const btnItems: BtnItem[] = [
    createBtnItem(
      NormalGroupIcon,
      "Normal Group",
      "/users/manage-groups/create-normal-group"
    ),
    createBtnItem(
      AutomatedGroupIcon,
      "Automated Group",
      "/users/manage-groups/create-smart-group"
    ),
  ];

  return (
    <SidebarLayout>
      <div>
        <div className="flex justify-between">
          <div className="text-[24px] font-[700] text-[#313D4F] mb-[30px]">
            Manage Groups
          </div>
          <ButtonDropDown
            ButtonDownArrowIcon={false}
            className="custom-heading-btn flex items-center gap-[5px] !h-[40px]  plus-icon"
            label={
              <div className="flex items-center gap-[5px]">
                <PlusIconWhite /> Create New Group
              </div>
            }
            btnItem={btnItems}
          />
        </div>
        <ManageGroupsListing
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          setPageLimit={setPageLimit}
          setTotalItems={setTotalItems}
          pageLimit={pageLimit}
          totalItems={totalItems}
          statusFilter={statusFilter}
          handleStatusChange={handleStatusChange}
          typeFilter={typeFilter}
          handleTypeChange={handleTypeChange}
        />
      </div>
    </SidebarLayout>
  );
};

export default ManageGroups;
