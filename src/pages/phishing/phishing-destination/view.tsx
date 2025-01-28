import {useRouter} from "next/router";
import {FC, useEffect, useState} from "react";
import SidebarLayout from "@/src/components/Layout/SidebarLayout";
import {Card, Divider} from "antd";
import LeftArrowIcon from "@/src/components/Icons/LeftArrowIcon";
import {API_ENDPOINTS} from "@/src/interceptors/apiName";
import axiosInstance from "@/src/interceptors/Axios";
import DetalisDateIcon from "@/src/components/Icons/DetalisDateIcon";
import DetalisUserIcon from "@/src/components/Icons/DetalisUserIcon";
import UrlIcon from "@/src/components/Icons/UrlIcon";
import moment from "moment";
import {useLoader} from "@/src/components/Loader/LoaderProvider";

const ViewPhishing: FC = () => {
  const router = useRouter();
  const [phishingDetails, setPhishingDetails] = useState<any>({});
  const [currentId, setCurrentId] = useState<number | null>(null);
  const loaderContext = useLoader();
  const {showLoader, hideLoader} = loaderContext;

  useEffect(() => {
    if (router.query.id) {
      setCurrentId(Number(router.query.id));
    }
  }, [router.query.id]);

  const getPhishingListById = async (id: number) => {
    try {
      showLoader();
      const getPhishingById: any = await axiosInstance.get(
        `${API_ENDPOINTS.Delete_View_Phishing}/${id}`
      );
      if (getPhishingById?.settings?.success) {
        setPhishingDetails(getPhishingById?.data);
      }
      hideLoader();
    } catch (error) {
      console.error("Error fetching phishing details:", error);
      hideLoader();
    }
  };

  useEffect(() => {
    if (currentId) {
      getPhishingListById(currentId);
    }
  }, [currentId]);

  return (
    <div>
      <SidebarLayout>
        <div className="flex">
          <div
            onClick={() => router.push("/phishing/phishing-destination")}
            className="pt-1 cursor-pointer"
          >
            <LeftArrowIcon />
          </div>
          <div className="text-[24px] font-[700] text-[#313D4F] mb-[30px] ml-2">
            View Phishing Destination Page
          </div>
        </div>
        <div>
          <Card className="!rounded-[14px] !border !border-[#E8E8E8] !bg-[#FFFFFF]">
            <div>
              <div className="!text-[22px] !font-[600] leading-[28px] font-[Nunito Sans] text-[#263A67]">
                {phishingDetails?.title}
              </div>
              <Divider className="bg-[#E8E8E8]" />
            </div>
            <div className="flex gap-20">
              <div className="flex gap-2">
                <DetalisDateIcon />
                <div className="flex gap-2 mt-1">
                  <div className="text-[14px] font-[600] leading-[20px] text-[#828282]">
                    Date:
                  </div>
                  <div className="text-[14px] font-[600] leading-[20px] text-[#333]">
                    {moment
                      .unix(phishingDetails?.modifiedDate / 1000)
                      .format("MM/DD/YYYY")}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <DetalisUserIcon />
                <div className="flex gap-2 mt-1">
                  <div className="text-[14px] font-[600] leading-[20px] text-[#828282]">
                    By:
                  </div>
                  <div className="text-[14px] font-[600] leading-[20px] text-[#333]">
                    {phishingDetails?.addedBy || "Not Available"}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <UrlIcon />
                <div className="flex gap-2 mt-1">
                  <div className="text-[14px] font-[600] leading-[20px] text-[#828282]">
                    URL:
                  </div>
                  <div className="text-[14px] font-[600] leading-[20px] text-[#333]">
                    {phishingDetails?.url}
                  </div>
                </div>
              </div>
            </div>
          </Card>
          {!!phishingDetails?.content?.trim()?.length && (
            <Card className="!rounded-[14px] !border !border-[#E8E8E8] !bg-[#FFFFFF] mt-5">
              <div className="text-[14px] font-[600] leading-[20px] text-[#828282]">
                <div
                  dangerouslySetInnerHTML={{__html: phishingDetails?.content}}
                ></div>
              </div>
            </Card>
          )}
        </div>
      </SidebarLayout>
    </div>
  );
};

export default ViewPhishing;
