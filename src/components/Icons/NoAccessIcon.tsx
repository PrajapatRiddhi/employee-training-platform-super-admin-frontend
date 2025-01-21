import { FC } from "react";

type NoAccessIconProps = {
  color?: string;
};

const NoAccessIcon: FC<NoAccessIconProps> = ({ color = "#4379EE" }) => {
  return (
    <>
      <svg
        width="21"
        height="20"
        viewBox="0 0 21 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M15.8033 15.3033C17.1605 13.9461 18 12.0711 18 10C18 5.85786 14.6421 2.5 10.5 2.5C8.42893 2.5 6.55393 3.33947 5.1967 4.6967M15.8033 15.3033C14.4461 16.6605 12.5711 17.5 10.5 17.5C6.35786 17.5 3 14.1421 3 10C3 7.92893 3.83947 6.05393 5.1967 4.6967M15.8033 15.3033L5.1967 4.6967"
          stroke={color}
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </>
  );
};
export default NoAccessIcon;
