import {useState} from "react";
import SidebarLayout from "@/src/components/Layout/SidebarLayout";
import {Button, Input, Select} from "antd";
import {FC} from "react";
import {NextRouter, useRouter} from "next/router";
import {PlusOutlined, CaretDownOutlined} from "@ant-design/icons";
import {AiOutlineCloseCircle} from "react-icons/ai";
import CourseListing from "@/src/components/ManageCourse/CourseListing";
import NewCategoryIcon from "@/src/components/Icons/NewCategoryIcon";
const {Option} = Select;

const ManageCourses: FC = () => {
  const router: NextRouter = useRouter();
  const [isSystem, setIsSystem] = useState<any>(0);
  const [searchInput, setSearchInput] = useState<string>("");
  const [searchValue, setSearchValue] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("Active");

  const handleStatusChange = (value: any) => {
    setStatusFilter(value);
  };

  return (
    <SidebarLayout>
      <div>
        <div className="flex justify-between h-fit mb-[30px]">
          <div className="text-[24px] font-[700] font-[Nunito Sans] text-[#313D4F]  h-fit text-start">
            Courses
          </div>
          <div className="flex gap-5 h-fit">
            <div></div>
            <div className="flex gap-5">
              <Button
                htmlType="submit"
                className="common-button Nunito Sans common-button-light-blue h-[40px] text-[#4379EE] border border-[#4379EE]"
                onClick={() => router.push("/manage-courses/categories")}
              >
                <div className="flex gap-2">
                  <NewCategoryIcon /> Add New Category
                </div>
              </Button>
              {isSystem === 0 ? (
                <Button
                  type="primary"
                  htmlType="submit"
                  className="common-button Nunito Sans common-button-light-blue h-[40px]"
                  icon={<PlusOutlined />}
                  onClick={() => router.push("/manage-courses/add")}
                >
                  Create New Course
                </Button>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>

        <div>
          <div className="flex justify-between">
            <div>
              <Select
                value={{
                  value: statusFilter,
                  label: (
                    <div className="flex gap-[5px]">
                      <span className="text-[16px] font-[700] leading-[24px] font-[Nunito Sans] !text-[#4F4F4F]">
                        Status:{" "}
                      </span>
                      <span className="text-[16px] font-[400] leading-[24px] font-Nunito Sans !text-[#4F4F4F]">
                        {statusFilter}
                      </span>
                    </div>
                  ),
                }}
                style={{width: 150}}
                defaultValue={statusFilter}
                onChange={handleStatusChange}
                suffixIcon={<CaretDownOutlined />}
              >
                <Option value="Active">Active</Option>
                <Option value="Inactive">Inactive</Option>
              </Select>
            </div>

            <div>
              <Input
                className="list-search-input h-full custom-manage-courses-input"
                placeholder="Search"
                prefix={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <path
                      d="M17.9417 17.0583L14.7409 13.8575C15.8109 12.5883 16.4583 10.9525 16.4583 9.16667C16.4583 5.14583 13.1875 1.875 9.16667 1.875C5.14583 1.875 1.875 5.14583 1.875 9.16667C1.875 13.1875 5.14583 16.4583 9.16667 16.4583C10.9525 16.4583 12.5884 15.8108 13.8575 14.7408L17.0583 17.9417C17.18 18.0633 17.34 18.125 17.5 18.125C17.66 18.125 17.82 18.0642 17.9417 17.9417C18.1859 17.6983 18.1859 17.3025 17.9417 17.0583ZM3.125 9.16667C3.125 5.835 5.835 3.125 9.16667 3.125C12.4983 3.125 15.2083 5.835 15.2083 9.16667C15.2083 12.4983 12.4983 15.2083 9.16667 15.2083C5.835 15.2083 3.125 12.4983 3.125 9.16667Z"
                      fill="#BDBDBD"
                    />
                  </svg>
                }
                value={searchInput}
                onChange={(e) =>
                  setSearchInput((e.target as HTMLInputElement).value)
                }
                onKeyDown={(e) => {
                  e.key === "Enter" &&
                    setSearchValue((e.target as HTMLInputElement).value);
                }}
                suffix={
                  searchInput && (
                    <AiOutlineCloseCircle
                      className="hover:text-gray-500 cursor-pointer !text-[#BDBDBD]"
                      onClick={() => {
                        setSearchInput("");
                        setSearchValue("");
                      }}
                    />
                  )
                }
              />
            </div>
          </div>
          <div className="mt-[32px]">
            <CourseListing
              selectedSystem={isSystem}
              searchInput={searchValue}
              statusFilter={statusFilter}
            />
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
};

export default ManageCourses;
