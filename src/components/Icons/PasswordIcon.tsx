import { FC } from "react";
type PasswordProps = {
  color?: string;
};
const PasswordIcon: FC<PasswordProps> = ({ color = "828282" }) => {
  return (
    <>
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10.2677 8.90432L3.33333 15.8333L4.99999 17.5M5.83333 13.3333L7.49999 15M16.6667 6.25C16.6667 8.32107 14.9877 10 12.9167 10C10.8456 10 9.16666 8.32107 9.16666 6.25C9.16666 4.17893 10.8456 2.5 12.9167 2.5C14.9877 2.5 16.6667 4.17893 16.6667 6.25Z"
          stroke={color ||"#828282"}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </>
  );
};
export default PasswordIcon;
