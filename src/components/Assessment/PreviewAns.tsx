import {Card, Space, Typography, Collapse} from "antd";
import {useRouter} from "next/router";
import {FC, useEffect, useState} from "react";
import BackArrowIcon from "../Icons/BackArrowIcon";
import CalendarSurveyIcon from "../Icons/CalendarSurveyIcon";
import {useLoader} from "../Loader/LoaderProvider";
import axiosInstance from "@/src/interceptors/Axios";
import {API_ENDPOINTS} from "@/src/interceptors/apiName";
import moment from "moment";
import CollapseDownUpArrow from "../Icons/CollapseDownUpArrow";

type PreviewAnsProp = {
  id: string | string[] | undefined;
};

const PreviewAns: FC<PreviewAnsProp> = ({id}) => {
  const router = useRouter();
  const {Text} = Typography;
  const [surveyDetails, setSurveyDetails] = useState<any>(null);
  const loaderContext = useLoader();
  const {showLoader, hideLoader} = loaderContext;

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
  const {Panel} = Collapse;

  const QuestionCollapse = () => {
    return (
      <Collapse
        className="custom-ans-preview-collapse"
        bordered={false}
        expandIcon={({isActive}) => {
          console.log("isActive :>> ", isActive);
          return <CollapseDownUpArrow isActive={isActive || false} />;
        }}
        expandIconPosition="end" 
      >
        {surveyDetails?.questions.map((questionItem: any, index: number) => (
          <Panel
            header={
              <span className="text-[16px] text-[#333]">
                <strong className="mr-[5px]">Question {index + 1}: </strong>{" "}
                {questionItem.question}
              </span>
            }
            key={questionItem.assessmentQuestionId}
          >
            <div className="text-[16px] text-[#333]">
              <strong className="mr-[5px] ml-[19px]">Answer: </strong>{" "}
              {`${questionItem.correctAnswer}`}
            </div>
          </Panel>
        ))}
      </Collapse>
    );
  };

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
              Assessment Detail
            </Text>
          </div>
        </Space>
        <Card className="custom-card flex-col !py-[18px] !pb-[0px] !pt-[0px] mt-[20px] !px-[0px] ">
          <div className="text-[#333] text-[22px] font-[600] break-words">
            {surveyDetails?.assessmentTitle}
          </div>
          <div className="flex space-x-[30px] mt-[10px]">
            <div className="flex gap-[10px]">
              <CalendarSurveyIcon />
              Created on :{" "}
              {`${moment
                .unix(surveyDetails?.addedDate / 1000)
                .format("MMM, DD YYYY")}, `}
            </div>
          </div>
        </Card>
        {surveyDetails && <QuestionCollapse />}
      </div>
    </>
  );
};
export default PreviewAns;
