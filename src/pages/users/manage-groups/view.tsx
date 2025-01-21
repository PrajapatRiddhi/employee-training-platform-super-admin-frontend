import {useRouter} from "next/router";
import {FC, useEffect, useState} from "react";
import SidebarLayout from "@/src/components/Layout/SidebarLayout";
import {Card, Divider} from "antd";
import LeftArrowIcon from "@/src/components/Icons/LeftArrowIcon";
import {API_ENDPOINTS} from "@/src/interceptors/apiName";
import axiosInstance from "@/src/interceptors/Axios";
import {useLoader} from "@/src/components/Loader/LoaderProvider";

const ViewGroup: FC = () => {
  const router = useRouter();
  const [groupDetails, setGroupDetails] = useState<any>({});
  const [currentId, setCurrentId] = useState<number | null>(null);
  const loaderContext = useLoader();
  const {showLoader, hideLoader} = loaderContext;

  useEffect(() => {
    if (router.query.id) {
      setCurrentId(Number(router.query.id));
    }
  }, [router.query.id]);

  const getGroupListById = async (id: number) => {
    try {
      showLoader();
      const getGroupById: any = await axiosInstance.get(
        `${API_ENDPOINTS.DELETE_USER_GROUP}/${id}`
      );
      if (getGroupById?.settings?.success) {
        setGroupDetails(getGroupById?.data);
      }
      hideLoader();
    } catch (error) {
      console.error("Error fetching group details:", error);
      hideLoader();
    }
  };

  useEffect(() => {
    if (currentId) {
      getGroupListById(currentId);
    }
  }, [currentId]);

  return (
    <div>
      <SidebarLayout>
        <div className="flex">
          <div
            onClick={() => router.push("/users/manage-groups")}
            className="pt-1 cursor-pointer"
          >
            <LeftArrowIcon />
          </div>
          <div className="text-[24px] font-[700] text-[#313D4F] mb-[30px] ml-2">
            View Group
          </div>
        </div>
        <div>
          <Card className="!rounded-[14px] !border !border-[#E8E8E8] !bg-[#FFFFFF]">
            <div>
              <div className="justify-left text-left !text-[18px] !font-[600] leading-[28px] font-[Nunito Sans] text-[#263A67]">
                Group Name
              </div>
              <div className="!text-[22px] !font-[600] leading-[28px] font-[Nunito Sans] text-[#263A67]">
                {groupDetails?.groupName}
              </div>
              <Divider className="bg-[#E8E8E8]" />
            </div>

            <div>
              <div className="justify-left text-left !text-[18px] !font-[600] leading-[28px] font-[Nunito Sans] text-[#263A67]">
                Roles Name
              </div>
              <div className="mt-3 flex gap-5">
                {groupDetails?.roles?.length > 0 ? (
                  groupDetails?.roles?.map((role: any) => (
                    <div className="text-[14px] font-[600] leading-[20px] text-[#333] ">
                      {role?.roleName}
                    </div>
                  ))
                ) : (
                  <div className="text-[14px] font-[600] leading-[20px] text-[#333] mt-5  ">
                    No role found for this group, {groupDetails?.groupName}
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      </SidebarLayout>
    </div>
  );
};

export default ViewGroup;
