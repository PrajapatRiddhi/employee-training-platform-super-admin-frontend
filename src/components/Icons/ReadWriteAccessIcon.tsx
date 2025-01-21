import { FC } from "react";

type ReadWriteAccessIconProps = {
  color?: string;
};

const ReadWriteAccessIcon: FC<ReadWriteAccessIconProps> = ({
  color = "#4379EE",
}) => {
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
          d="M8.04717 14.1667L5.83313 14.1667L5.83313 11.6667M5.0853 12.4145L14.5089 2.99084C15.1598 2.33997 16.2151 2.33997 16.866 2.99084C17.5168 3.64172 17.5168 4.69699 16.866 5.34786L7.30333 14.9105C6.85662 15.3572 6.63326 15.5806 6.386 15.7726C6.16637 15.9432 5.93289 16.0951 5.688 16.2269C5.41229 16.3752 5.11762 16.489 4.52829 16.7166L2.5 17.4998L3.1526 15.5418C3.37532 14.8735 3.48669 14.5394 3.64158 14.2274C3.77914 13.9503 3.94212 13.6866 4.12841 13.4397C4.33818 13.1616 4.58722 12.9126 5.0853 12.4145Z"
          stroke={color}
          stroke-width="1.25"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </>
  );
};
export default ReadWriteAccessIcon;
