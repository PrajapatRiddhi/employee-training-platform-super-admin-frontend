import { Divider } from "antd";
import { FC, useState } from "react";

type SystemCompanySwitchProp = {
  firstTab: string;
  secondTab: string;
  onChange: (selectedTab: string) => void;
  rootClassName?: string;
};

const SystemCompanySwitch: FC<SystemCompanySwitchProp> = ({
  firstTab,
  secondTab,
  onChange,rootClassName = "px-[30px]"
}) => {
  const [selectedTab, setSelectedTab] = useState<string>(firstTab);

  const handleTabClick = (tab: string) => {
    setSelectedTab(tab);
    onChange(tab);
  };

  return (
    <div className="flex">
      <div className={`tab-system-company ${rootClassName} `}>
        <div
          className={`${selectedTab === firstTab ? "selected " : ""}  `}
          onClick={() => handleTabClick(firstTab)}
        >
          {firstTab}
        </div>
          <Divider
          style={{
            backgroundColor: '#BDBDBD', // Fill color
            borderRight: '0.3px solid #979797', // Stroke and stroke-width
          }}  type="vertical" className="custom-divider !w-[1.595px] h-[40px] opacity-[0.6862] flex-shrink-0" />
        <div
          className={`'before-line' ${
            selectedTab === secondTab ? "selected" : ""
          }`}
          onClick={() => handleTabClick(secondTab)}
        >
          {secondTab}
        </div>
      </div>
    </div>
  );
};

export default SystemCompanySwitch;
