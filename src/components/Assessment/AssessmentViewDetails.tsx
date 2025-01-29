import {API_ENDPOINTS} from "@/src/interceptors/apiName";
import axiosInstance from "@/src/interceptors/Axios";
import {FC, useEffect, useState} from "react";
import {useLoader} from "../Loader/LoaderProvider";
import {
  Button,
  Card,
  Checkbox,
  Col,
  Input,
  Radio,
  Row,
  Space,
  Typography,
} from "antd";
import {useRouter} from "next/router";
import BackArrowIcon from "../Icons/BackArrowIcon";
import EditIcon from "../Icons/EditIcon";
import CalendarSurveyIcon from "../Icons/CalendarSurveyIcon";
import moment from "moment";
import ConferenceIcon from "../Icons/ConferanceIcon";
import React from "react";
type AssessmentViewDetailsProp = {
  id: string | string[] | undefined;
};
const AssessmentViewDetails: FC<AssessmentViewDetailsProp> = ({id}) => {
  const [surveyDetails, setSurveyDetails] = useState<any>(null);
  const loaderContext = useLoader();
  const {showLoader, hideLoader} = loaderContext;
  const router = useRouter();
  const {Text} = Typography;
  useEffect(() => {
    id && fetchSurvey();
  }, [id]);
  const fetchSurvey = async () => {
    try {
      showLoader();
      const survey: any = await axiosInstance.get(
        `${API_ENDPOINTS.ASSESSMENT_GET}/${id}`
      );
      if (survey?.settings?.success) {
        setSurveyDetails(survey?.data);
      }
      hideLoader();
    } catch (error) {
      hideLoader();
    } finally {
      hideLoader();
    }
  };
  console.log("surveyDetails :>> ", surveyDetails);
  return (
    <>
      <div className="w-full">
        <Space className="flex justify-between pt-[10px]">
          <div className="flex space-x-[10px]">
            <div
              className="cursor-pointer"
              onClick={() => router.push("/assessment")}
            >
              <BackArrowIcon />
            </div>
            <Text className="text-gray-700 text-[22px] font-semibold leading-6">
              {/* {isEditing ? 'Edit Domain' : 'Add Domain'} */}
              Assessment Detail
            </Text>
          </div>
          <div className="flex gap-2">
            <Button
              className="flex space-x-2 rounded border border-solid border-[#4379EE] text-[#4379EE] bg-[#F5F6FA] items-center"
              onClick={() =>
                router.push(
                  `/assessment/answer-preview/${surveyDetails?.assessmentId}`
                )
              }
            >
              View Assessment with Answer
            </Button>
            <Button
              className="flex space-x-2 rounded border border-solid border-[#4379EE] text-[#4379EE] bg-[#F5F6FA] items-center"
              onClick={() =>
                router.push(`/assessment/${surveyDetails?.assessmentId}`)
              }
            >
              <EditIcon /> Edit Assessment
            </Button>
          </div>
        </Space>
        <Card className="custom-card flex-col !py-[18px] !pb-[0px] !pt-[0px] mt-[20px] !px-[0px] ">
          <div className="text-[#333] text-[22px] font-[600] break-words">
            {surveyDetails?.assessmentTitle}
          </div>
          <div className="flex space-x-[30px] mt-[10px]">
            <div className="flex gap-[10px] text-[16px] text-[#828282]">
              <CalendarSurveyIcon />
              Created on :{" "}
              <span className="font-[700]">{`${moment
                .unix(surveyDetails?.addedDate / 1000)
                .format("MMM, DD YYYY")}`}</span>
            </div>
          </div>
        </Card>
        {surveyDetails?.questions.map((qx: any, index: number) => {
          return (
            <Card className="custom-card flex-col !py-[18px] !pb-[0px] !pt-[0px] mt-[20px] !px-[0px] ">
              <div className="flex h-[60px]">
                <div className="px-[20px] text-[16px] font-[700] text-[#333] max-w-[146px] w-full items-center flex justify-center rounded-l-md border border-[#E8E8E8] bg-[#F2F2F2]">
                  Question {index + 1}
                </div>
                <div className="w-full !h-[60px] flex justify-start items-center px-[20px] mt-0 !border rounded-none !border-[#E8E8E8]">
                  {qx?.question}
                </div>
              </div>
              <div>
                {qx?.questionType === "Yes or No" ? (
                  <>
                    <div className="mt-[15px] flex justify-between space-x-[30px] custom-radio">
                      <Radio.Group className="w-full flex justify-between">
                        <Radio
                          checked={qx?.correctAnswer === "Yes"}
                          value="Yes"
                          className={`w-full py-[8px] px-[12px] rounded-l-md border border-[#E8E8E8] bg-[#F5F6FA] overflow-hidden text-[#333] text-ellipsis text-base font-normal text-center`}
                        >
                          Yes
                        </Radio>
                        <Radio
                          value="No"
                          checked={qx?.correctAnswer === "No"}
                          className={`w-full py-[8px] px-[12px] rounded-l-md border border-[#E8E8E8] bg-[#F5F6FA] overflow-hidden text-[#333] text-ellipsis text-base font-normal text-center`}
                        >
                          No
                        </Radio>
                      </Radio.Group>
                    </div>
                  </>
                ) : qx?.questionType === "Checkbox" ? (
                  <>
                    <Row gutter={[30, 20]} className="mt-[15px]">
                      {qx?.options.map((option: any, idx: number) => (
                        <Col span={12} key={idx}>
                          <div className="py-[8px] px-[12px] rounded-l-md border border-[#E8E8E8] bg-[#F5F6FA] overflow-hidden text-[#333] text-ellipsis text-base font-normal">
                            <Checkbox className={``}>
                              {option?.optionData}
                            </Checkbox>
                          </div>
                        </Col>
                      ))}
                    </Row>
                  </>
                ) : qx?.questionType === "Multiple Choice" ? (
                  <>
                    <Row gutter={[30, 20]} className="mt-[15px]">
                      {qx?.options.map((option: any, idx: number) => (
                        <Col span={12} key={idx}>
                          <div
                            className={`py-[8px] px-[12px] rounded-l-md border border-[#E8E8E8] bg-[#F5F6FA] overflow-hidden text-[#333] text-ellipsis text-base font-normal`}
                          >
                            {idx + 1}. {option?.optionData}
                          </div>
                        </Col>
                      ))}
                    </Row>
                  </>
                ) : (
                  <></>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </>
  );
};
export default AssessmentViewDetails;
