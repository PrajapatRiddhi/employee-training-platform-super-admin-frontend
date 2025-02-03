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
import {useRouter} from "next/router";
import {MailOutlined, UserOutlined} from "@ant-design/icons";
import ConfromationModal from "@/src/components/Modals/ConfromationModal";

const ViewCompany: FC = () => {
  const router = useRouter();

  //   const router = useRouter();
  //   const [phishingDetails, setPhishingDetails] = useState<any>({});
  //   const [currentId, setCurrentId] = useState<number | null>(null);
  //   const loaderContext = useLoader();
  //   const {showLoader, hideLoader} = loaderContext;

  //   useEffect(() => {
  //     if (router.query.id) {
  //       setCurrentId(Number(router.query.id));
  //     }
  //   }, [router.query.id]);

  //   const getPhishingListById = async (id: number) => {
  //     try {
  //       showLoader();
  //       const getPhishingById: any = await axiosInstance.get(
  //         `${API_ENDPOINTS.Delete_View_Phishing}/${id}`
  //       );
  //       if (getPhishingById?.settings?.success) {
  //         setPhishingDetails(getPhishingById?.data);
  //       }
  //       hideLoader();
  //     } catch (error) {
  //       console.error("Error fetching phishing details:", error);
  //       hideLoader();
  //     }
  //   };

  //   useEffect(() => {
  //     if (currentId) {
  //       getPhishingListById(currentId);
  //     }
  //   }, [currentId]);

  return (
    <div>
      <SidebarLayout>
        <div className="flex">
          <div
            onClick={() => router.push("/manage-courses")}
            className="pt-2 cursor-pointer"
          >
            <LeftArrowIcon />
          </div>
          <div className="text-[24px] font-[700] text-[#313D4F] mb-[30px] ml-2 pt-1">
            Company Detail
          </div>
        </div>
        <div>
          <div className="flex gap-5 mb-5  rounded-[10px] p-[30px] custom-card">
            <div className="flex flex-col w-full">
              <div className="flex justify-between w-full">
                <div className="w-full">
                  <div className="text-[#4379EE] text-[22px]  font-[600] leading-[28px]">
                    Quick Fix Solutions
                  </div>
                  <div className="flex gap-2 mt-2">
                    <MailOutlined />
                    <div className="text-[#4F4F4F] text-[16px] leading-[24px font-[400]">
                      quickfix564@test.com
                    </div>
                  </div>
                  <Divider type="vertical" />
                </div>
                <div className="w-full">
                  <div className="text-[#4379EE] text-[22px]  font-[600] leading-[28px]">
                    Users
                  </div>
                  <div className="flex gap-2 mt-2">
                    <div className="text-[#4F4F4F] text-[16px] leading-[24px font-[400]">
                      1200
                    </div>
                  </div>
                </div>
                {/* {viewCourseDetails?.isSystemCourse === "No" ? (
                  <div>
                    <div
                      className="rounded-[4px] border border-[#4379EE]  text-[#4379EE] text-[16px] flex justify-center items-center px-8  h-[40px] cursor-pointer"
                      onClick={() => handleEdit(viewCourseDetails)}
                    >
                      <EditIcon />
                      Edit
                    </div>
                  </div>
                ) : (
                  ""
                )} */}
              </div>
              <div className="flex mt-5">
                <div className="flex-grow gap-0">
                  <div className="divider-level-table w-fit flex items-center">
                    <div className="p-[20px] list-data-wrapped flex flex-col  gap-[5px]">
                      <div className="text-[18px] font-[400]  text-[#000000]  leading-[26px] mr-2">
                        Setup Type
                      </div>
                      <div className="text-[16px] !text-[#333333] font-[400] leading-[24px] mr-2">
                        Basic (Silver & Gold)
                      </div>
                    </div>
                    <Divider
                      type="vertical"
                      className="bg-[#E8E8E8] w-[1px] h-[76px]"
                    />
                    <div className="p-[20px]  list-data-wrapped flex flex-col  gap-[5px]">
                      <div className="text-[18px] font-[400]  text-[#000000]  leading-[26px]">
                        API key / URL
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="text-[16px] !text-[#333333] font-[400] leading-[24px]">
                          {" "}
                          AIzaSyDaGmWKa4JsXZ-HjGw7ISLn_3namBGewQe
                        </div>
                      </div>
                    </div>

                    <Divider
                      type="vertical"
                      className="bg-[#E8E8E8] w-[1px] h-[76px]"
                    />
                    <div className="p-[20px]  list-data-wrapped flex flex-col  gap-[5px]">
                      <div className="text-[18px] font-[400]  text-[#000000]  leading-[26px]">
                        Subscription Plan
                      </div>
                      <div className="flex  gap-1">
                        <div className="text-[14px] text-[#4F4F4F]">
                          {" "}
                          Plan: Silver $450
                        </div>
                      </div>

                      <div className="flex items-center gap-1 mr-1 mb-[11px]">
                        Start Date: Nov 7, 2022 - End Date: Nov 7, 2022
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[10px] p-[30px] custom-card">
            <div className="flex justify-between">
              <div>
                <div className="text-[18px] font-[400] leading-[26px] text-[#000000]">
                  Company Address
                </div>
                <div className="flex gap-2 mt-2">
                  <div className="text-[14px] font-[600] leading-[20px] text-[#828282]">
                    Address 1 :{" "}
                  </div>
                  <div className="text-[14px] font-[600] leading-[20px] text-[#4F4F4F]">
                    11968 Foothill Blvd
                  </div>
                </div>
                <div className="flex gap-2 mt-2">
                  <div className="text-[14px] font-[600] leading-[20px] text-[#828282]">
                    Address 2 :{" "}
                  </div>
                  <div className="text-[14px] font-[600] leading-[20px] text-[#4F4F4F]">
                    High Street Road
                  </div>
                </div>
                <div className="flex gap-2 mt-2">
                  <div className="text-[14px] font-[600] leading-[20px] text-[#828282]">
                    City:
                  </div>
                  <div className="text-[14px] font-[600] leading-[20px] text-[#4F4F4F]">
                    Lake View Terrace
                  </div>
                </div>

                <div className="flex gap-2 mt-2">
                  <div className="text-[14px] font-[600] leading-[20px] text-[#828282]">
                    State :
                  </div>
                  <div className="text-[14px] font-[600] leading-[20px] text-[#4F4F4F]">
                    California
                  </div>
                </div>

                <div className="flex gap-2 mt-2">
                  <div className="text-[14px] font-[600] leading-[20px] text-[#828282]">
                    County :
                  </div>
                  <div className="text-[14px] font-[600] leading-[20px] text-[#4F4F4F]">
                    United States
                  </div>
                </div>
                <div className="flex gap-2 mt-2">
                  <div className="text-[14px] font-[600] leading-[20px] text-[#828282]">
                    Zip Code :
                  </div>
                  <div className="text-[14px] font-[600] leading-[20px] text-[#4F4F4F]">
                    382305
                  </div>
                </div>
              </div>
              <div className="w-[2px] bg-red-500 h-full mx-6">dd</div>
              <div>
                <div className="text-[18px] font-[400] leading-[26px] text-[#000000]">
                  Admin Details
                </div>

                <div className="flex gap-2 mt-2">
                  <div className="text-[14px] font-[600] leading-[20px] text-[#828282]">
                    Name:{" "}
                  </div>
                  <div className="text-[14px] font-[600] leading-[20px] text-[#4F4F4F]">
                    John Doe
                  </div>
                </div>
                <div className="flex gap-2 mt-2">
                  <div className="text-[14px] font-[600] leading-[20px] text-[#828282]">
                    Email :
                  </div>
                  <div className="text-[14px] font-[600] leading-[20px] text-[#4F4F4F]">
                    test@gmail.com
                  </div>
                </div>
                <div className="flex gap-2 mt-2">
                  <div className="text-[14px] font-[600] leading-[20px] text-[#828282]">
                    Contact :
                  </div>
                  <div className="text-[14px] font-[600] leading-[20px] text-[#4F4F4F]">
                    +01 0000 0000
                  </div>
                </div>
              </div>
            </div>
          </div>
          <ConfromationModal
            mainTitle="Test Data"
            description={"You are Holding 1 selected User."}
          />
        </div>
      </SidebarLayout>
    </div>
  );
};

export default ViewCompany;
