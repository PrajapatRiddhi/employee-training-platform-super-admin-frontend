import React from "react";
import {Button, Pagination} from "antd";
import {LeftOutlined, RightOutlined} from "@ant-design/icons";

interface CommonPaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onShowSizeChange?: any;
  pageSizeOptions?: any;
  className: string;
  showSizeChanger?: boolean;
}

const CommonPagination: React.FC<CommonPaginationProps> = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  onShowSizeChange,
  pageSizeOptions,
  showSizeChanger = false,
  className,
}) => {
  const itemRender = (
    page: number,
    type: string,
    originalElement: React.ReactNode
  ) => {
    if (totalItems <= itemsPerPage) return null;

    if (type === "prev") {
      return (
        <Button
          style={{
            borderRadius: "10px 0 0 10px",
            borderColor: "#d5d5d5",
            background: "#fafbfd",
            width: "43px",
          }}
          className="!mr-4 !h-[30px]"
          icon={<LeftOutlined style={{color: "#36393a", width: "12px"}} />}
        />
      );
    }

    if (type === "next") {
      return (
        <Button
          style={{
            borderRadius: "0 10px 10px 0",
            borderColor: "#d5d5d5",
            background: "#fafbfd",
            width: "43px",
          }}
          className="!h-[30px]"
          icon={<RightOutlined style={{color: "#36393a", width: "12px"}} />}
        />
      );
    }

    if (type === "page") {
      return (
        <a
          style={{
            padding: "0 10px",
            color: currentPage === page ? "#1890ff" : "#36393a",
            fontWeight: currentPage === page ? "bold" : "normal",
          }}
          onClick={() => onPageChange(page)}
        >
          {page}
        </a>
      );
    }

    return originalElement;
  };

  return (
    <Pagination
      className={`${className} custom-pagination`}
      current={currentPage}
      total={totalItems}
      showTotal={(total, range) =>
        `Showing ${range[0]}-${range[1]} of ${total}`
      }
      pageSize={itemsPerPage}
      onChange={onPageChange}
      showSizeChanger={showSizeChanger}
      itemRender={itemRender}
      showQuickJumper
    />
  );
};

export default CommonPagination;
