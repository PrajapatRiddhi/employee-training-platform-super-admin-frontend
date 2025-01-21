import { camelCase } from "@/src/helper/Utils";
import moment from "moment";
import { useState } from "react";
import TrophyIcon from "../../Icons/TrophyIcon";
import ThreeDotsDropdown from "../../ThreeDotsDropdown";
import WhiteEmailIcon from "../../Icons/WhiteEmailIcon";
import ResetFilterIcon from "../../Icons/ResetFilterIcon";
import MarkCompletedIcon from "../../Icons/MarkCompletedIcon";
import RemoveUsers from "../../Icons/RemoveUsers";
import CommonTable from "../../CommonTable";
import SelectionDownArrow from "../../Icons/SelectionDownArrow";
import RefreshIcon from "../../Icons/RefreshIcon";
import SwitchToggle from "../../SwitchToggle";
import CommonPagination from "../../CommonTable/paginnation";
interface CardProps {
  id: number;
  backgroundClass: string;
  colorClass: string;
  mainText: string | number;
  secondaryText?: string;
  status: string;
  onClick: (id: number) => void;
  isSelected: boolean;
}
const dummyData = [
  {
    key: "1",
    username: "john_doe",
    email: "john.doe@example.com",
    enrollmentDate: "2024-11-05",
    timeSpent: "01:30",
    timeRemaining: "02:00",
    score: "85",
    status: "completed",
    action: "", // Action items can be handled via buttons or dropdowns
  },
  {
    key: "2",
    username: "jane_smith",
    email: "jane.smith@example.com",
    enrollmentDate: "2024-10-22",
    timeSpent: "00:45",
    timeRemaining: "03:00",
    score: "72",
    status: "past_due",
    action: "",
  },
  {
    key: "3",
    username: "michael_lee",
    email: "michael.lee@example.com",
    enrollmentDate: "2024-08-10",
    timeSpent: "02:15",
    timeRemaining: "01:30",
    score: "90",
    status: "completed",
    action: "",
  },
  {
    key: "4",
    username: "sarah_king",
    email: "sarah.king@example.com",
    enrollmentDate: "2024-07-01",
    timeSpent: "01:00",
    timeRemaining: "00:30",
    score: "65",
    status: "past_due",
    action: "",
  },
  {
    key: "5",
    username: "alex_brown",
    email: "alex.brown@example.com",
    enrollmentDate: "2024-09-15",
    timeSpent: "01:50",
    timeRemaining: "01:00",
    score: "78",
    status: "completed",
    action: "",
  },
];
const cards = [
  {
    id: 0,
    mainText: "538",
    status: "All Users",
    backgroundClass: "background-gray",
    colorClass: "color-gray",
  },
  {
    id: 1,
    mainText: "124",
    status: "Incomplete",
    backgroundClass: "background-white",
    colorClass: "color-blue",
    secondaryText: "20.4%",
  },
  {
    id: 2,
    mainText: "76",
    status: "Not Started",
    backgroundClass: "background-white",
    colorClass: "color-pink",
    secondaryText: "20.4%",
  },
  {
    id: 3,
    mainText: "204",
    status: "In Progress",
    backgroundClass: "background-white",
    colorClass: "color-pink",
    secondaryText: "20.4%",
  },
  {
    id: 4,
    mainText: "315",
    status: "Completed",
    backgroundClass: "background-white",
    colorClass: "color-green",
    secondaryText: "20.4%",
  },
  {
    id: 5,
    mainText: "90",
    status: "Past Due",
    backgroundClass: "background-white",
    colorClass: "color-pink",
    secondaryText: "20.4%",
  },
];
const UsersSection = () => {
  const [sortedColumn, setSortedColumn] = useState<string>("surveyTitle");
  const [sortOrder, setSortOrder] = useState<string>("asc");
  const [dataSource, setDataSource] = useState<any>(dummyData);
  const [selectedCard, setSelectedCard] = useState<number | null>(0);
  const [archiveUsers, setArchiveUsers] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(10);
  const [totalItems, setTotalItems] = useState(10);

  const handleCardClick = (id: number) => {
    setSelectedCard(id);
  };
  const handleColumnSort = (column: string) => {
    if (column === sortedColumn) {
      setSortOrder(sortOrder === "ASC" ? "DESC" : "ASC");
    } else {
      setSortedColumn(column);
      setSortOrder("ASC");
    }
  };

  const column = [
    {
      title: "User Name",
      dataIndex: "username",
      sorter: dataSource.length === 0 ? false : true,
      sortOrder: sortedColumn === "username" ? sortOrder : undefined,
      onHeaderCell: () => ({
        onClick: () =>
          dataSource.length === 0 ? null : handleColumnSort("username"),
      }),
      render: (text: any, record: any) => (
        <div className="gap-[5px]">
          {/* <Checkbox
                className="custom-checkbox"
                checked={selectedCheckboxIds.includes(record?.surveyId)}
                style={{ width: "24px", height: "24px" }}
                onChange={(e) =>
                  handleCheckboxChange(record?.surveyId, e.target.checked)
                }
              ></Checkbox> */}
          <span className="text-[14px] font-[600] text-[#4379EE] ">
            {camelCase(text)}
          </span>
        </div>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: dataSource.length === 0 ? false : true,
      sortOrder: sortedColumn === "email" ? sortOrder : undefined,
      onHeaderCell: () => ({
        onClick: () =>
          dataSource.length === 0 ? null : handleColumnSort("email"),
      }),
      render: (text: any, record: any) => (
        <span className="text-[14px] font-[600] text-[#4F4F4F]">{text}</span>
      ),
    },

    {
      title: "Enrollment Date",
      dataIndex: "enrollmentDate",
      sorter: dataSource.length === 0 ? false : true,
      sortOrder: sortedColumn === "enrollmentDate" ? sortOrder : undefined,
      onHeaderCell: () => ({
        onClick: () =>
          dataSource.length === 0 ? null : handleColumnSort("enrollmentDate"),
      }),
      render: (text: any, record: any) => (
        <span className="text-[14px] font-[600] text-[#4F4F4F]">
          {moment().format("MMM DD, YYYY")}
        </span>
      ),
    },
    {
      title: "Time Spent",
      dataIndex: "timeSpent",
      sorter: dataSource.length === 0 ? false : true,
      sortOrder: sortedColumn === "timeSpent" ? sortOrder : undefined,
      onHeaderCell: () => ({
        onClick: () =>
          dataSource.length === 0 ? null : handleColumnSort("timeSpent"),
      }),
      render: (text: any, record: any) => (
        <span className="text-[14px] font-[600] text-[#4F4F4F]">00:00</span>
      ),
    },

    {
      title: "Time Remaining",
      dataIndex: "timeRemaining",
      sorter: dataSource.length === 0 ? false : true,
      sortOrder: sortedColumn === "timeRemaining" ? sortOrder : undefined,
      onHeaderCell: () => ({
        onClick: () =>
          dataSource.length === 0 ? null : handleColumnSort("timeRemaining"),
      }),
      render: (text: any, record: any) => (
        <span className="text-[14px] font-[600] text-[#4F4F4F]">-</span>
      ),
    },

    {
      title: "Score",
      dataIndex: "score",
      sorter: dataSource.length === 0 ? false : true,
      sortOrder: sortedColumn === "score" ? sortOrder : undefined,
      onHeaderCell: () => ({
        onClick: () =>
          dataSource.length === 0 ? null : handleColumnSort("score"),
      }),
      render: (text: any, record: any) => (
        <span className="text-[14px] font-[600] text-[#4F4F4F]">-</span>
      ),
    },

    {
      title: "Status",
      dataIndex: "status",
      sorter: dataSource.length === 0 ? false : true,
      sortOrder: sortedColumn === "status" ? sortOrder : undefined,
      onHeaderCell: () => ({
        onClick: () =>
          dataSource.length === 0 ? null : handleColumnSort("status"),
      }),
      render: (text: any, record: any) => (
        <div className="flex items-center gap-[10px]">
          <div className="flex justify-center items-center max-w-[72px] w-full">
            {record?.status === "completed" ? (
              <span className="bg-[#5A8CFF] text-[#5A8CFF] bg-opacity-50  px-[5px] max-w-[72px] w-full  flex justify-center rounded  text-[12px] font-[600] ">
                Completed
              </span>
            ) : (
              <span className="bg-[#EB5757] text-[#EB5757] bg-opacity-50  px-[5px] max-w-[72px] w-full  flex justify-center rounded  text-[12px] font-[600]">
                Past Due
              </span>
            )}
          </div>
          <TrophyIcon />
        </div>
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text: any, record: any) => (
        <>
          <ThreeDotsDropdown
            menuItems={[
              {
                key: "sendNotification",
                label: (
                  <div className="text-[#333] text-[14px] font-[400] gap-[8px] flex">
                    <WhiteEmailIcon color="#BDBDBD" /> Send Notification
                  </div>
                ),
                onClick: () => {},
              },
              {
                key: "resetProgress",
                label: (
                  <div className="text-[#333] text-[14px] font-[400] gap-[8px] flex">
                    <ResetFilterIcon /> Reset Progress
                  </div>
                ),
                onClick: () => {},
              },
              {
                key: "markCompleted",
                label: (
                  <div className="text-[#333] text-[14px] font-[400] gap-[8px] flex">
                    <MarkCompletedIcon /> Mark as Completed
                  </div>
                ),
                onClick: () => {},
              },
              {
                key: "removeUsers",
                label: (
                  <div className="text-[#333] text-[14px] font-[400] gap-[8px] flex">
                    <RemoveUsers /> Remove Users
                  </div>
                ),
                onClick: () => {},
              },
            ]}
          />
        </>
      ),
    },
  ];

  const CustomCard: React.FC<CardProps> = ({
    id,
    backgroundClass,
    colorClass,
    mainText,
    secondaryText,
    status,
    onClick,
    isSelected,
  }) => (
    <div
      className={`learning-program-user-card ${backgroundClass} ${colorClass} ${
        isSelected ? "selected" : ""
      }`}
      onClick={() => onClick(id)}
    >
      <span className="secondary-text">
        {secondaryText ? secondaryText : `&nbsp;`}
      </span>
      <span className="main-text">{mainText}</span>
      <span className="font-[400]">{status}</span>
      {isSelected && (
        <div className="absolute bottom-[-8px] left-1/2 transform -translate-x-1/2 mt-2">
          <SelectionDownArrow />
        </div>
      )}
    </div>
  );
  const handlePageChange = (page: React.SetStateAction<number>) => {
    setCurrentPage(page);
  };
  return (
    <>
      <div className="flex gap-[10px] mb-[27px] justify-between">
        {cards.map((card) => (
          <CustomCard
            key={card.id}
            {...card}
            onClick={handleCardClick}
            isSelected={selectedCard === card.id}
          />
        ))}
      </div>
      <CommonTable
        apiData={dataSource}
        columns={column}
        child={
          <>
            <div className="flex items-center gap-[10px]">
              <SwitchToggle
                onChange={(checked) => setArchiveUsers(checked)}
                checked={archiveUsers}
              />
              Include Archived Users
            </div>
          </>
        }
        child2={
          <>
            <div
              className="flex items-center text-[#56CCF2] text-[16px] font-[600] text-nowrap mr-[27px] cursor-pointer gap-[4px]"
              onClick={() => {}}
            >
              <RefreshIcon /> <span className="text-[16px]">Bulk Update</span>
            </div>
          </>
        }
      />
      <CommonPagination
        className="pagination"
        currentPage={currentPage}
        totalItems={totalItems}
        itemsPerPage={pageLimit}
        onPageChange={handlePageChange}
        onShowSizeChange={undefined}
      />
    </>
  );
};
export default UsersSection;
