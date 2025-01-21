import React, { FC } from "react";

interface CategoriesDeleteIconProps {
  onClick?: () => void;
}

const CategoriesDeleteIcon: FC<CategoriesDeleteIconProps> = ({ onClick }) => {
  return (
    <div onClick={onClick} className="cursor-pointer">
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="10" cy="10" r="10" fill="#EB5757" />
        <path
          d="M5.33301 6.5H14.6663M12.333 6.5L12.1751 6.02637C12.0221 5.5674 11.9456 5.33791 11.8038 5.16824C11.6785 5.01841 11.5176 4.90244 11.3358 4.83095C11.13 4.75 10.8881 4.75 10.4043 4.75H9.59509C9.11129 4.75 8.86938 4.75 8.66355 4.83095C8.48179 4.90244 8.32089 5.01841 8.19559 5.16824C8.05371 5.33791 7.97721 5.5674 7.82422 6.02637L7.66634 6.5M13.4997 6.5V12.45C13.4997 13.4301 13.4997 13.9201 13.3089 14.2945C13.1412 14.6238 12.8734 14.8915 12.5442 15.0593C12.1698 15.25 11.6798 15.25 10.6997 15.25H9.29968C8.31958 15.25 7.82954 15.25 7.45519 15.0593C7.12591 14.8915 6.85819 14.6238 6.69041 14.2945C6.49967 13.9201 6.49967 13.4301 6.49967 12.45V6.5M11.1663 8.83333V12.9167M8.83301 8.83333V12.9167"
          stroke="white"
          strokeWidth="1.25"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>
  );
};

export default CategoriesDeleteIcon;
