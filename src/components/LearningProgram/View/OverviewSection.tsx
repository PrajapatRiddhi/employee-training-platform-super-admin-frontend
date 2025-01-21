import { Button, Card, Col, Divider, Row } from "antd";
import StockSvg from "../../Icons/StockIcon";
import SurveyListMenuIcon from "../../Icons/SurveyListMenuIcon";
import ProgressLine from "../../ProgressLine";
import PieChart from "../../Chart/PieChart";
import ProgressCircle from "../../ProgressCircle";
import ProjectSummaryIcon from "../../Icons/ProjectSummaryIcon";
import RelativeDurationIcon from "../../Icons/RelativeDurationIcon";
import GroupsIcon from "../../Icons/GroupsIcon";
import CalendarIcon from "../../Icons/CalendarIcon";
import moment from "moment";
import WhiteEmailIcon from "../../Icons/WhiteEmailIcon";

const OverViewSection = () => {
    const chartData = {
        labels: [
            "Clicks",
            "Macro Enabled",
            "Callback",
            "Phish-prone %",
            "Replies",
            "Data Entered",
            "Callback Data Entered",
            "Industry Average",
        ],
        datasets: [
            {
                data: [34, 10, 3, 3, 8, 26, 3, 12], // Dynamic data values
                backgroundColor: [
                    "#e74c3c", // Red for Clicks
                    "#3498db", // Blue for Macro Enabled
                    "#9b59b6", // Purple for Callback
                    "#34495e", // Dark gray for Phish-prone %
                    "#1abc9c", // Teal for Replies
                    "#2ecc71", // Green for Data Entered
                    "#95a5a6", // Gray for Callback Data Entered
                    "#f1c40f", // Yellow for Industry Average
                ],
                borderColor: "#fff",
                borderWidth: 2,
            },
        ],
    };

    return (
        <>

            <div className="flex w-full justify-between">

                <Card
                    className="custom-card no-padding-body  title w-[80%] mr-[30px]"
                    title="Program Content"
                >
                    <div className="flex justify-end absolute top-[-62px] right-0">

                        <Button className="h-[40px] max-w-[166px] w-full flex justify-center items-center gap-[10px] text-[#fff] hover:!text-[#fff] bg-[#27AE60] hover:!bg-[#27AE60]">
                            <WhiteEmailIcon /> Notify Users
                        </Button>
                    </div>
                    <div className="p-[20px]">
                        <div className="flex flex-col">
                            <div className="text-[#4F4F4F] text-[18px] ">
                                2020 Security culture - seed 30 Min
                            </div>
                            <div className="flex justify-between mt-[11px]">
                                <div className="flex w-full  gap-[14px]">
                                    <Button className="w-full max-w-[178px] bg-[#E0E0E0] hover:!bg-[#E0E0E0] text-[#333333] hover:!text-[#333333] items-center gap-[10px] flex font-[700]">
                                        <StockSvg /> User Progress
                                    </Button>

                                    <Button className="w-full max-w-[223px] bg-[#313D4F] hover:!bg-[#313D4F] text-[#fff] hover:!text-[#fff] items-center gap-[10px] flex  font-[700]">
                                        <SurveyListMenuIcon
                                            color="#FFFFFF"
                                            width={20}
                                            height={20}
                                        />{" "}
                                        Assessment Results
                                    </Button>
                                </div>
                                <div className="flex ">
                                    <ProgressLine
                                        value={62}
                                        displayText={`${62}% Completed`}
                                        position="top"
                                        displayValue={true}
                                        displayTextClass="font-[600]"
                                    />
                                </div>
                            </div>
                            <Divider className="custom-divider-menu" />
                        </div>
                        <div className="flex flex-col justify-center items-center">
                            <PieChart
                                thickness="85%"
                                width={550}
                                height={550}
                                labelsPosition="right"
                                data={chartData}
                                doughnutView={true}
                                className="chart-container"
                            />
                            <div className="text-[#333333] text-[18px] font-[700] mb-[10px]">
                                User Completion Activity
                            </div>
                            <div className="text-[#828282] text-[16px] font-[700] ">
                                Number of users who have not completed their assignments
                            </div>
                        </div>
                    </div>
                </Card>
                <Card
                    className="custom-card no-padding-body  title min-w-[20%] h-fit"
                    title="Program Summary"
                >
                    <div className="flex flex-col items-center justify-center pt-[30px] mb-[4px]">
                        <ProgressCircle
                            percent={55}
                            strokeColor="#4379EE"
                            strokeWidth={20}
                            size={[182, 182]}
                            strokeLinecap="square"
                            format={() => (
                                <div className="">
                                    <div className="text-[#4379EE] text-[24px] font-[800] leading-[24px]">{`${55}%`}</div>
                                    <div className="text-[#828282] text-[16px] leading-[24px]">
                                        Completed <br />
                                        All Content
                                    </div>
                                </div>
                            )}
                        />
                        <div className="w-full flex flex-col text-[14px] px-[20px] mt-[10px] ">
                            <Row className="flex justify-between py-[12px]">
                                <Col>
                                    <div className="flex gap-[10px] items-center">
                                        <ProjectSummaryIcon />
                                        Status
                                    </div>
                                </Col>
                                <Col className="text-[#27AE60] text-[16px]">In Progress</Col>
                            </Row>
                            <Divider className="custom-divider-menu no-margin  " />

                            <Row className="flex justify-between py-[12px]">
                                <Col>
                                    <div className="flex gap-[10px] items-center">
                                        <RelativeDurationIcon />
                                        Relative <br /> Duration
                                    </div>
                                </Col>
                                <Col className="text-[#4379EE] text-[16px]">1 Week</Col>
                            </Row>
                            <Divider className="custom-divider-menu no-margin  " />

                            <Row className="flex justify-between py-[12px]">
                                <Col>
                                    <div className="flex gap-[10px] items-center">
                                        <GroupsIcon />
                                        Users
                                    </div>
                                </Col>
                                <Col className="text-[#4379EE] text-[16px]">538</Col>
                            </Row>
                            <Divider className="custom-divider-menu no-margin " />

                            <Row className="flex justify-between items-center py-[12px]">
                                <Col>
                                    <div className="flex gap-[10px] items-center">
                                        <CalendarIcon />
                                        Start Date
                                    </div>
                                </Col>
                                <Col className="text-[#4379EE] text-[16px]">
                                    {moment().format("MM/DD/YY ")}
                                    <br />
                                    {moment().format("hh:mm A")}
                                </Col>
                            </Row>
                        </div>
                    </div>
                </Card>
            </div>
        </>
    );
};
export default OverViewSection;
