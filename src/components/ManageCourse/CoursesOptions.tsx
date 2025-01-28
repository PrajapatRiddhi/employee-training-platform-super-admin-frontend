import React, {useState} from "react";
import type {MenuProps} from "antd";
import {Dropdown, Space} from "antd";
import DotsVerticalcon from "../Icons/DotsVerticalcon";
import ViewIcon from "../Icons/ViewIcon";
import DeleteIcon from "../Icons/DeleteIcon";
import {LoginOutlined, LogoutOutlined} from "@ant-design/icons";
import ActionsModal from "../Modals/ActionsModal";

interface CoursDropProps {
  course: any;
  onViewCourse: (course: any) => void;
  handleDeleteCourse: (course: any) => void;
  updateCourseStatus: any;
  selectedSystem: any;
}

const CoursesOptions: React.FC<CoursDropProps> = ({
  course,
  onViewCourse,
  handleDeleteCourse,
  selectedSystem,
  updateCourseStatus,
}) => {
  const [deleteUI, setDeleteUI] = useState(false);

  const handleDelete = () => {
    setDeleteUI(!deleteUI);
  };

  const items: MenuProps["items"] = [
    {
      label: (
        <div
          className="flex gap-2 text-[15px] text-[#333333]"
          onClick={() => onViewCourse(course)}
        >
          <ViewIcon />
          View Course
        </div>
      ),
      key: "0",
    },
    ...(!selectedSystem
      ? [
          {
            type: "divider" as const,
          },
          {
            label: (
              <div
                className="flex gap-2 text-[15px] text-[#333333]"
                onClick={handleDelete}
              >
                <DeleteIcon />
                Delete Course
              </div>
            ),
            key: "1",
          },
          {
            type: "divider" as const,
          },
          {
            label: (
              <div
                className="flex gap-2 text-[15px] text-[#333333]"
                onClick={() => {
                  updateCourseStatus(course?.courseId, course?.status);
                }}
              >
                {course?.status === "Active" ? (
                  <LoginOutlined />
                ) : (
                  <LogoutOutlined />
                )}{" "}
                {course?.status === "Active" ? "Deactivate " : "Activate"}{" "}
                Course
              </div>
            ),
            key: "3",
          },
        ]
      : []),
  ];

  return (
    <div>
      <Dropdown placement="bottomRight" menu={{items}} trigger={["click"]}>
        <a onClick={(e) => e.preventDefault()}>
          <Space>
            <DotsVerticalcon />
          </Space>
        </a>
      </Dropdown>
      <ActionsModal
        title=""
        type="delete"
        isOpen={deleteUI}
        onCancel={() => setDeleteUI(false)}
        onOk={() => {
          handleDeleteCourse(course?.courseId);
          setDeleteUI(false);
        }}
        footer={false}
        centered={true}
        closable={false}
        maskClosable={false}
        className="delete-modal"
        cancelBtnClass="cancleBtnAction"
        cancelBtnClick={() => setDeleteUI(false)}
        cancelButtonProps="Cancel"
        saveBtnClass="saveBtnAction"
        saveBtnClick={() => {
          handleDeleteCourse(course.courseId);
          setDeleteUI(false);
        }}
        mainTitle="Are you sure?"
      />
    </div>
  );
};

export default CoursesOptions;
