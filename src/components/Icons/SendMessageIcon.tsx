import { FC, useState } from "react";

interface SendMessageIconProps {
  isHovered: boolean; // Required prop for hover state
  hoverColor?: string; // Optional prop for hover color
  defaultColor?: string; // Optional prop for default color
}

const SendMessageIcon: FC<SendMessageIconProps> = ({
  isHovered = false, // Default hover state
  hoverColor = "#4379EE", // Default hover color
  defaultColor = "#333333", // Default color
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M1.36671 6.92476C0.948123 6.80667 0.655386 6.42953 0.644826 5.99473C0.634266 5.55993 0.908349 5.16902 1.32071 5.03076L14.7014 0.666757C14.8801 0.608499 15.0764 0.655249 15.2096 0.78781C15.3429 0.920371 15.3907 1.11641 15.3334 1.29542L10.9727 14.6828C10.8351 15.0959 10.4438 15.3707 10.0085 15.3599C9.57314 15.3492 9.19586 15.0555 9.07871 14.6361L7.58138 8.41542L1.36671 6.92476Z"
        stroke={isHovered ? hoverColor : defaultColor} // Dynamic stroke color
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.2107 0.786865L7.58203 8.41553"
        stroke={isHovered ? hoverColor : defaultColor} // Dynamic stroke color
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default SendMessageIcon;
