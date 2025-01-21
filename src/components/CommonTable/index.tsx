import {SearchOutlined} from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Col,
  ConfigProvider,
  DatePicker,
  Input,
  Popover,
  Row,
  Select,
  Slider,
  Space,
  Table,
} from "antd";
import React, {useEffect, useState} from "react";
import {AiOutlineClose, AiOutlineCloseCircle} from "react-icons/ai";
import {useSelector} from "react-redux";
import CommonPagination from "./paginnation";
import CommonButton from "../Button";
import ResetFilterIcon from "../Icons/ResetFilterIcon";
import FilterIcon from "../Icons/FilterIcon";
import DownloadCSVIcon from "../Icons/DownloadCSVIcon";
import {set} from "lodash";
import SettingIcon from "../Icons/SettingIcon";
import CustomDropdownIcon from "../Icons/CustomDropdownIcon";
import {camelCase} from "@/src/helper/Utils";

const {Option} = Select;
const {RangePicker} = DatePicker;
interface CommonTableProps {
  apiData: any;
  columns: any;
  searchInput?: any;
  setSearchInput?: any;
  onExportCSV?: (value: any) => void;
  showCSV?: boolean;
  filter?: boolean;
  rowSelection?: any;
  additionalFilters?: Array<{
    defaultValue: any;
    value: any;
    placeholder: string;
    onChange: (value: any) => void;
    options: Array<{value: any; label: string}>;
  }>;
  searchToggle?: boolean;
  pagination?: boolean;
  resetFilter?: () => void;
  child?: React.ReactNode;
  child2?: React.ReactNode;
  showSearchInput?: boolean;
  showSearchContent?: React.ReactNode;
  rowClassName?: any;
  rowKey?: (record: any) => string | number;
  csvButtonName?: string;
  title?: string;
  className?: string;
  placeholderText?: any;
  placeholderTextClass?: string;
  searchBoxStyle?: any;
  showSettingIcon?: boolean;
  parentHeader?: React.ReactNode;
  yesWeNotNullKeyword?: boolean;
}

const CommonTable: React.FC<CommonTableProps> = ({
  apiData,
  columns,
  // pageSizeOptions,
  searchInput,
  setSearchInput,
  showCSV,
  onExportCSV,
  filter = false,
  searchToggle = true,
  additionalFilters,
  resetFilter,
  child,
  child2,
  showSearchInput = true,
  showSearchContent,
  rowClassName,
  rowSelection,
  csvButtonName = "Download CSV",
  title,
  rowKey,
  className,
  placeholderText,
  placeholderTextClass,
  searchBoxStyle,
  showSettingIcon = false,
  parentHeader,
}) => {
  const [input, setInput] = useState("");
  const pageSizeOptions = [10, 20, 50, 100];
  const mobileUi = useSelector((state: any) => state.userReducer.mobileUI);
  const [subFilter, setSubFilter] = useState(true);
  const [settingToggle, setSettingToggle] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState(
    columns.reduce((acc: any, column: any) => {
      acc[column.key] = !column.hide; // Initialize visibility based on 'hide'
      return acc;
    }, {} as Record<string, boolean>)
  );
  const settingToggleHandler = () => {
    setSettingToggle(!settingToggle);
  };

  const DropdownDownArrowIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="25"
      height="24"
      viewBox="0 0 25 24"
      fill="none"
    >
      <path
        d="M16.6514 8.58496L12.0664 13.17L7.48141 8.58496L6.06641 9.99996L12.0664 16L18.0664 9.99996L16.6514 8.58496Z"
        fill="#333333"
      />
    </svg>
  );

  const handleCheckboxChange = (key: string) => {
    setVisibleColumns((prev: any) => ({...prev, [key]: !prev[key]}));
  };

  const filteredColumns = columns.filter((column: any) => {
    return visibleColumns[column.key];
  });

  const SettingsComponent = () => (
    <div>
      {columns.map(({key, title}: any) => (
        <div
          key={key}
          className="flex items-center"
          onChange={() => handleCheckboxChange(key)}
        >
          <Checkbox checked={visibleColumns[key]} className="cursor-pointer">
            {camelCase(title)}
          </Checkbox>
        </div>
      ))}
    </div>
  );

  useEffect(() => {
    if (!searchInput || !searchInput.trim()) {
      setInput("");
    }
  }, [searchInput]);

  return (
    <ConfigProvider>
      <div className="">
        <div className={`Container ${className}`}>
          {parentHeader && <div className="pb-[20px]">{parentHeader}</div>}
          <div className="mainContainer">
            {title ? (
              <div className="font-[700] text-[18px]">{title}</div>
            ) : null}
            <div className="w-full">{child}</div>
            <div className="secondaryContainer">
              {child2}
              {showCSV && (
                <div className="export-csv-container" onClick={onExportCSV}>
                  <DownloadCSVIcon />
                  <span>{csvButtonName}</span>
                </div>
              )}
              {apiData && searchToggle && showSearchInput && (
                <Input
                  className={`table-search-input ${placeholderTextClass}`}
                  style={searchBoxStyle}
                  placeholder={placeholderText || "Search"}
                  prefix={
                    <span
                      onClick={() => setSearchInput(input)}
                      className="flex items-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                      >
                        <path
                          d="M17.9417 17.0583L14.7409 13.8575C15.8109 12.5883 16.4583 10.9525 16.4583 9.16667C16.4583 5.14583 13.1875 1.875 9.16667 1.875C5.14583 1.875 1.875 5.14583 1.875 9.16667C1.875 13.1875 5.14583 16.4583 9.16667 16.4583C10.9525 16.4583 12.5884 15.8108 13.8575 14.7408L17.0583 17.9417C17.18 18.0633 17.34 18.125 17.5 18.125C17.66 18.125 17.82 18.0642 17.9417 17.9417C18.1859 17.6983 18.1859 17.3025 17.9417 17.0583ZM3.125 9.16667C3.125 5.835 5.835 3.125 9.16667 3.125C12.4983 3.125 15.2083 5.835 15.2083 9.16667C15.2083 12.4983 12.4983 15.2083 9.16667 15.2083C5.835 15.2083 3.125 12.4983 3.125 9.16667Z"
                          fill="#BDBDBD"
                        />
                      </svg>
                    </span>
                  }
                  value={input || searchInput}
                  onChange={(e) => setInput(e.target.value)}
                  onPressEnter={() => setSearchInput(input)}
                  onKeyUp={(e) => {
                    if (e.key === "Backspace") {
                      if (input === "") {
                        e.preventDefault();
                        setSearchInput("");
                        setInput("");
                      }
                    }
                  }}
                  suffix={
                    (input || searchInput) && (
                      <AiOutlineCloseCircle
                        className="hover:text-[red] cursor-pointer"
                        onClick={() => {
                          setInput("");
                          setSearchInput("");
                        }}
                      />
                    )
                  }
                />
              )}

              {showSearchContent}
            </div>
            {showSettingIcon && (
              <div className="setting-icon-extend-col ml-[20px] mr-[15px] flex justify-center items-center gap-[4px] rounded-[4px] border border-[#BDBDBD] bg-white h-[36px] max-w-[60px] w-full">
                <Popover
                  content={SettingsComponent}
                  title="Columns"
                  trigger="click"
                  open={settingToggle}
                  onOpenChange={settingToggleHandler}
                  placement="bottomRight"
                >
                  <SettingIcon /> <CustomDropdownIcon />
                </Popover>
              </div>
            )}
          </div>
          {filter && (
            <>
              <div className={`filter-table mx-[20px] ${!subFilter ? "" : ""}`}>
                <span
                  className="filter-icon"
                  // onClick={() => filter && setSubFilter(!subFilter)}
                >
                  <FilterIcon />
                </span>
                {subFilter && (
                  <>
                    {additionalFilters &&
                      additionalFilters?.map((filter, index) => {
                        return (
                          <Select
                            key={index}
                            className="data-table-select-filter"
                            showSearch
                            defaultValue={filter?.defaultValue}
                            value={filter?.value}
                            onChange={filter?.onChange}
                            placeholder={filter?.placeholder}
                            optionFilterProp="children"
                            suffixIcon={<DropdownDownArrowIcon />}
                          >
                            <Option key={`placeholder-${index}`} value={0}>
                              {filter?.placeholder}
                            </Option>
                            {filter?.options?.map(
                              (option: any, optionIndex: number) => (
                                <Option
                                  key={`option-${optionIndex}`}
                                  value={option.value}
                                  label={option.label}
                                >
                                  {option.label}
                                </Option>
                              )
                            )}
                          </Select>
                        );
                      })}
                    <div
                      className="reset-button gap-[8px] text-[14px]"
                      onClick={resetFilter}
                    >
                      <div className="flex">
                        <ResetFilterIcon />
                      </div>
                      Reset Filter
                    </div>{" "}
                  </>
                )}
              </div>
            </>
          )}
          <div className="maindiv">
            <Table
              {...(rowSelection ? {rowSelection} : {})}
              dataSource={apiData}
              columns={filteredColumns}
              pagination={false}
              showSorterTooltip={false}
              rowKey={rowKey}
              rowClassName={rowClassName}
              scroll={mobileUi && {x: "auto"}}
            />
          </div>
          {/* {apiData && pagination && (
            <CommonPagination
              className="pagination"
              currentPage={currentPage}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              onPageChange={onPageChange}
              onShowSizeChange={onShowSizeChange}
              pageSizeOptions={pageSizeOptions}
            />
          )} */}
        </div>
      </div>
    </ConfigProvider>
  );
};

export default CommonTable;
