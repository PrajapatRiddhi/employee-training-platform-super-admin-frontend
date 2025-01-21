import { FC } from "react";

type ReadAccessIconProps = {
  color?: string;
};

const ReadAccessIcon: FC<ReadAccessIconProps> = ({ color = "#4379EE" }) => {
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
          stroke={color}
          d="M12.5003 10.0001C12.5003 11.3808 11.381 12.5001 10.0003 12.5001C8.61957 12.5001 7.50029 11.3808 7.50029 10.0001C7.50029 8.61937 8.61957 7.50008 10.0003 7.50008C11.381 7.50008 12.5003 8.61937 12.5003 10.0001Z"
          stroke-width="1.25"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          stroke={color}
          d="M10.0007 4.16675C6.26929 4.16675 3.11072 6.61915 2.04883 10.0001C3.11071 13.381 6.26929 15.8334 10.0007 15.8334C13.732 15.8334 16.8906 13.381 17.9525 10.0001C16.8906 6.61918 13.732 4.16675 10.0007 4.16675Z"
          stroke-width="1.25"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </>
  );
};
export default ReadAccessIcon;
