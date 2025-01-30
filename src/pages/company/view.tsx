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
import TagComponent from "@/src/components/TagComponent";
import {MailOutlined, UserOutlined} from "@ant-design/icons";
import DisplayedLibraryIcon from "@/src/components/Icons/DisplayedLibraryIcon";
import CalendarAltIcon from "@/src/components/Icons/CalendarAltIcon";
import ClockIcon from "@/src/components/Icons/ClockIcon";

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
            Course Detail
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
                  <div className="flex gap-2">
                    <MailOutlined />
                    <div className="text-[#4F4F4F] text-[16px] leading-[24px font-[400]">quickfix564@test.com</div>
                  </div>

                  <div className="flex mt-1 h-[34px] text-center cursor-pointer">
                    <div>
                      <TagComponent
                        title={
                          <div className="!text-[16px] text-[#4F4F4F] text-list">
                            More
                          </div>
                        }
                        icon={<UserOutlined />}
                      />
                    </div>

                    <TagComponent
                      title={
                        <div className="!text-[16px] text-[#4F4F4F] text-list pl-2">
                          {"Displayed in Library"}
                        </div>
                      }
                      icon={<DisplayedLibraryIcon />}
                    />
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
                    <div className="p-[20px] list-data-wrapped flex flex-col items-center justify-center gap-[5px]">
                      <div className="text-[14px] text-[#828282] font-normal mr-2">
                        Expected Duration
                      </div>
                      <div className="text-[14px] !text-[#4F4F4F] font-normal mr-2">
                        sdasdasd
                      </div>
                    </div>
                    <Divider
                      type="vertical"
                      className="bg-[#E8E8E8] w-[1px] h-[76px]"
                    />
                    <div className="p-[20px]  list-data-wrapped flex flex-col items-center justify-center gap-[5px]">
                      <div className="text-[14px] text-[#828282] font-normal ml-2">
                        Last Update
                      </div>
                      <div className="flex items-center gap-1">
                        <CalendarAltIcon />
                        <div className="text-[14px] text-[#4F4F4F]">
                          {" "}
                          sdsdfsfsf
                        </div>
                      </div>

                      <div className="flex items-center gap-1 mr-1 mb-[11px]">
                        <ClockIcon />
                        asdsadadasd
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarLayout>
    </div>
  );
};

export default ViewCompany;
