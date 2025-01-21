import { FC } from "react";
type CollapseDownUpArrowProp = {
  isActive: boolean;
};
const CollapseDownUpArrow: FC<CollapseDownUpArrowProp> = ({
  isActive = false,
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      style={{
        transform: isActive ? "rotate(180deg)" : "rotate(0deg)",
        transition: "transform 0.2s ease-in-out",      }}
    >
      <path
        d="M6 9L12 15L18 9"
        stroke="black"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
export default CollapseDownUpArrow;
