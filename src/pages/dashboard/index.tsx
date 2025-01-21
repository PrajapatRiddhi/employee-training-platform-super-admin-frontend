import AreaChart from "@/src/components/Chart/AreaChart";
import CommonCard, {
  CommonCardProps,
} from "../../components/Dashboard/CommonCard";
import CompanyRiskScore from "@/src/components/Icons/CompanyRiskScore";
import Departments from "@/src/components/Icons/Departments";
import OnGoingTraining from "@/src/components/Icons/OnGoingTraining";
import SidebarLayout from "@/src/components/Layout/SidebarLayout";
import withCompanyAuth from "@/src/lib/WithCompany";
import {Card, Col, Row} from "antd";
import {FC, useState} from "react";
import CommonSelect from "@/src/components/CommonSelect";
import CalendarDaysIcons from "@/src/components/Icons/CalendarDaysIcons";
import RegisteredCompanies from "@/src/components/Icons/RegisteredCompanies";
import NewCompanyRequest from "./NewCompanyRequest";

const Dashboard: FC = () => {
  const cardLists = [
    {
      title: "Registered Companies",
      amt: 845,
      icon: <RegisteredCompanies />,
    },
    {
      title: "High Risk Companies",
      amt: 340,
      icon: <OnGoingTraining />,
    },
    {
      title: "Good Awareness Companies",
      amt: 670,
      icon: <CompanyRiskScore />,
    },
    {
      title: "Companies' Licenses Expiring",
      amt: 240,
      icon: <Departments />,
    },
  ];

  const optionsCategory = [
    {value: "Business Analyst", label: "Business Analyst"},
    {value: "HR", label: "HR"},
    {value: "Sales", label: "Sales"},
  ];

  const [categoryFilter, setCategoryFilter] = useState<string>(
    optionsCategory[0].value
  );

  const handleCategoryChange = (value: any) => {
    setCategoryFilter(value);
  };

  return (
    <SidebarLayout>
      <div className="text-[24px] font-[700] text-[#313D4F] mb-[-15px]">
        Dashboard
      </div>
      <Row gutter={30}>
        {(cardLists as CommonCardProps["data"][])?.map((val, idx) => {
          return (
            <Col sm={12} lg={6}>
              <CommonCard data={val} key={idx} />
            </Col>
          );
        })}
      </Row>
      <Card className="custom-card no-padding-body px-[20px] pt-[16px] pb-[20px] mt-[30px]">
        <div className="flex justify-between">
          <div>
            <div className="text-[18px] font-[700]">Platform Usage</div>
          </div>
          <div className="flex gap-[16px]">
            <div>
              <CommonSelect
                className="w-[163px] !rounded-[6px]"
                size="small"
                placeholder="October 2024"
                rootClassName="chart-select"
                options={[
                  {value: "October 2024", label: "October 2024"},
                  {value: "November 2024", label: "November 2024"},
                  {value: "December 2024", label: "December 2024"},
                ]}
                prefixIcon={<CalendarDaysIcons />}
              />
            </div>
          </div>
        </div>
        <AreaChart />
      </Card>
      <NewCompanyRequest />
    </SidebarLayout>
  );
};

export default withCompanyAuth(Dashboard);
