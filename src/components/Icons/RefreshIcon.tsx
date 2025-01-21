import { FC } from "react";
type RefreshIconProps = {
    color?: string,
}
const RefreshIcon:FC<RefreshIconProps> = ({color="#56CCF2"}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
  >
    <path
      d="M3.38507 10.8335C3.35103 10.5605 3.3335 10.2824 3.3335 10.0002C3.3335 6.31826 6.31826 3.3335 10.0002 3.3335C12.084 3.3335 13.9445 4.28956 15.167 5.78696M16.6153 9.16683C16.6493 9.43982 16.6668 9.71795 16.6668 10.0002C16.6668 13.6821 13.6821 16.6668 10.0002 16.6668C8.00901 16.6668 6.22174 15.7939 5.00016 14.4099M7.50016 14.1668H5.00016V14.4099M15.167 3.3335V5.78696M15.167 5.78696V5.83344L12.667 5.8335M5.00016 16.6668V14.4099"
      stroke={color}
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
export default RefreshIcon;
