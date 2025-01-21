import { FC } from "react";
type MarkCompletedIconProps = {
    color?: string;
}
const MarkCompletedIcon:FC<MarkCompletedIconProps> = ({color="#BDBDBD"}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
  >
    <path
      d="M11.6668 16.0714L13.1668 17.5L16.6668 14.1667M3.3335 17.5C3.3335 14.2783 5.94517 11.6667 9.16683 11.6667C10.4062 11.6667 11.5553 12.0532 12.5002 12.7122M12.5002 5.83333C12.5002 7.67428 11.0078 9.16667 9.16683 9.16667C7.32588 9.16667 5.8335 7.67428 5.8335 5.83333C5.8335 3.99238 7.32588 2.5 9.16683 2.5C11.0078 2.5 12.5002 3.99238 12.5002 5.83333Z"
      stroke={color}
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
export default MarkCompletedIcon;
