import { FC } from "react";
type PlusIconWhiteProps = {
  color?: string;
}
const PlusIconWhite: FC<PlusIconWhiteProps> = ({color}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
    >
      <path
        d="M3.33301 9.99967H16.6663M9.99967 3.33301V16.6663"
        stroke={color||"white"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
export default PlusIconWhite;
