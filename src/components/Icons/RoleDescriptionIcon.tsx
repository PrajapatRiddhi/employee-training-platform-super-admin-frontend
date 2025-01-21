import { FC } from "react";

type RoleDescriptionIconProps = {
  color?: string;
};

const RoleDescriptionIcon: FC<RoleDescriptionIconProps> = ({
  color = "#4379EE",
}) => {
  return (
    <>
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M16.5 9C16.5 13.1421 13.1421 16.5 9 16.5C4.85786 16.5 1.5 13.1421 1.5 9C1.5 4.85786 4.85786 1.5 9 1.5C13.1421 1.5 16.5 4.85786 16.5 9Z"
          stroke={color}
          stroke-width="1.25"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-dasharray="4 4"
        />
      </svg>
    </>
  );
};
export default RoleDescriptionIcon;
