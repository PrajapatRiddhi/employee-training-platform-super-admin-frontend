import { FC } from "react";

type InfoIconProps = {
  color?: string;
};

const InfoIcon: FC<InfoIconProps> = ({ color = "#828282" }) => {
  return (
    <>
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M7.97801 8.5C8.64467 7.83333 9.31133 7.56971 9.31133 6.83333C9.31133 6.09695 8.71437 5.5 7.97799 5.5C7.35671 5.5 6.83468 5.92492 6.68667 6.5M7.97801 10.5H7.98467M14 8C14 11.3137 11.3137 14 8 14C4.68629 14 2 11.3137 2 8C2 4.68629 4.68629 2 8 2C11.3137 2 14 4.68629 14 8Z"
          stroke={color}
          stroke-width="1.25"
          stroke-linecap="round"
        />
      </svg>
    </>
  );
};
export default InfoIcon;
