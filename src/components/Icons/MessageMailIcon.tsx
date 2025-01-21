import { FC } from "react";
interface SendMessageIconProps {
    isHovered: boolean;    // Required prop for hover state
    hoverColor?: string;   // Optional prop for hover color
    defaultColor?: string; // Optional prop for default color
}
const MessageMailIcon: FC<SendMessageIconProps> = ({
    isHovered = false,       // Default hover state
    hoverColor = "#4379EE",   // Default hover color
    defaultColor = "#333333",  // Default color
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="14"
      viewBox="0 0 18 14"
      fill="none"
    >
      <rect
        x="1.36328"
        y="1.54541"
        width="15.2727"
        height="10.9091"
        rx="1.5"
        stroke={isHovered ? hoverColor : defaultColor} // Dynamic stroke color
        stroke-width="1.2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M16.389 1.94531L10.4661 6.50095C9.60131 7.16622 8.39708 7.16622 7.53228 6.50095L1.60938 1.94531"
        stroke={isHovered ? hoverColor : defaultColor} // Dynamic stroke color
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
export default MessageMailIcon;
