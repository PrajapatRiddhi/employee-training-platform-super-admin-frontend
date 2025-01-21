import {FC, useEffect, useState} from "react";
import {useLoader} from "../../Loader/LoaderProvider";
import {useNotification} from "../../Notification";
import {useRouter} from "next/router";
import axiosInstance from "@/src/interceptors/Axios";
import {API_ENDPOINTS} from "@/src/interceptors/apiName";
import {Button, Card, Radio, Space} from "antd";
import BackArrowIcon from "../../Icons/BackArrowIcon";
import OverViewSection from "./OverviewSection";
import UsersSection from "./UsersSection";
import EmailIcon from "../../Icons/EmailIcon";
import WhiteEmailIcon from "../../Icons/WhiteEmailIcon";

type ViewLearningProgramProps = {
  id?: string | string[] | undefined;
};
const ViewLearningProgram: FC<ViewLearningProgramProps> = ({id}) => {
  const router = useRouter();
  const loaderContext = useLoader();
  const {showLoader, hideLoader} = loaderContext;
  const notificationContext = useNotification();
  const handleNotifications: any = notificationContext?.handleNotifications;
  const [learningProgram, setLearningProgram] = useState<any>({});
  const [activeTab, setActiveTab] = useState<string>("Overview");
  useEffect(() => {
    if (id) fetchDetails();
  }, [id]);
  const fetchDetails = async () => {
    showLoader();
    try {
      const fetchData: any = await axiosInstance.get(
        `${API_ENDPOINTS.CAMPAIGN_GET}/${id}`
      );
      if (fetchData?.settings?.success) {
        setLearningProgram(fetchData?.data);
      }
    } catch (error) {
    } finally {
      hideLoader();
    }
  };

  return (
    <>
      <div>
        <Space className="pt-[10px] pb-[30px]">
          <div
            className="cursor-pointer"
            onClick={() => router.push("/learning-program/")}
          >
            <BackArrowIcon />
          </div>
          <div className="text[#313D4F] text-[24px] font-[700] ">
            View Program Page
          </div>
        </Space>
        <Card className="custom-card no-padding-body py-[26px] px-[31px]">
          <div className="text-[28px] font-[400] text-[#4379EE]">
            {learningProgram?.programName || ""}
          </div>
          <span className="text-[#828282] text-[16px]">
            {" "}
            Type : {learningProgram?.selectType} ({learningProgram?.sendTo}){" "}
          </span>
        </Card>
        <div className="flex  mt-[30px] justify-between">
          <Radio.Group
            className="w-[322px]  custom-tab-frequency h-[40px]"
            value={activeTab}
            onChange={(e) => {
              setActiveTab(e.target.value);
            }}
          >
            <Radio.Button className="w-[50%]  text-center " value="Overview">
              Overview
            </Radio.Button>
            <Radio.Button className="w-[50%] text-center " value="Users">
              Users
            </Radio.Button>
          </Radio.Group>
        </div>
        <div className="mt-[21px]">
          {activeTab === "Overview" && <OverViewSection />}
          {activeTab === "Users" && <UsersSection />}
        </div>
      </div>
    </>
  );
};
export default ViewLearningProgram;
