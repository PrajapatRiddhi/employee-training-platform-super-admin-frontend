import { FC } from "react";

interface DraftMessageIconProps {
    isHovered: boolean;    // Required prop for hover state
    hoverColor?: string;   // Optional prop for hover color
    defaultColor?: string; // Optional prop for defau`lt color
}

const DraftMessageIcon: FC<DraftMessageIconProps> = ({
    isHovered = false,       // Default hover state
    hoverColor = "#4379EE",   // Default hover color
    defaultColor = "#333333",  // Default color
}) => {
    return (<svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
    >
        <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M15.7933 2.20666C15.3346 1.74992 14.7124 1.49543 14.0651 1.49981C13.4178 1.50419 12.7991 1.76708 12.3467 2.22999L2.68 11.8967L1.5 16.5L6.10333 15.3193L15.77 5.65266C16.233 5.20039 16.496 4.58177 16.5004 3.93452C16.5048 3.28728 16.2502 2.66515 15.7933 2.20666Z"
            stroke={isHovered ? hoverColor : defaultColor} // Dynamic stroke color
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round" />
        <path
            d="M12.0703 2.50659L15.493 5.92926"
            stroke={isHovered ? hoverColor : defaultColor} // Dynamic stroke color
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round" />
        <path
            d="M2.68164 11.896L6.10764 15.316"
            stroke={isHovered ? hoverColor : defaultColor} // Dynamic stroke color
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round" />
    </svg>
  );
};
export default DraftMessageIcon;