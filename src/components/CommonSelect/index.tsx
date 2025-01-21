// import React from "react";
// import { Select } from "antd";
// import type { ConfigProviderProps, SelectProps } from "antd";
// import { CaretDownOutlined } from "@ant-design/icons";

// interface CustomSelectProps {
//   options?: SelectProps["options"];
//   defaultValue?: any;
//   onChange?: (value: number) => void;
//   size?: SizeType;
//   className?: string;
//   placeholder?: string;
//   value?: any;
//   rootClassName?: string;
// }

// type SizeType = ConfigProviderProps["componentSize"];

// const CommonSelect: React.FC<CustomSelectProps> = ({
//   options,
//   defaultValue,
//   onChange = (value) => console.log(`Selected: ${value}`),
//   size = "middle",
//   className,
//   placeholder,
//   value,
//   rootClassName,
// }) => {
//   return (
//     <Select
//       size={size}
//       defaultValue={defaultValue || undefined}
//       onChange={onChange}
//       style={{ width: 200 }}
//       options={options}
//       suffixIcon={<CaretDownOutlined />}
//       rootClassName={`custom-select-dropdown ${rootClassName}`}
//       className={className}
//       placeholder={placeholder}
//       value={value || undefined}

//     />
//   );
// };

// export default CommonSelect;

import React from "react";
import { Select } from "antd";
import type { ConfigProviderProps, SelectProps } from "antd";
import { CaretDownOutlined } from "@ant-design/icons";
import type { ReactNode } from "react";

interface CustomSelectProps {
  options?: SelectProps["options"];
  defaultValue?: any;
  onChange?: (value: number) => void;
  size?: SizeType;
  className?: string;
  placeholder?: string;
  value?: any;
  rootClassName?: string;
  prefixIcon?: ReactNode; // New prop for prefix icon
}

type SizeType = ConfigProviderProps["componentSize"];

const CommonSelect: React.FC<CustomSelectProps> = ({
  options,
  defaultValue,
  onChange = (value) => console.log(`Selected: ${value}`),
  size = "middle",
  className,
  placeholder,
  value,
  rootClassName,
  prefixIcon, // Added to props
}) => {
  return (
    <div
      className={`custom-select-container ${
        prefixIcon ? "has-prefix-icon" : ""
      }`}
    >
      {prefixIcon && <span className="prefix-icon">{prefixIcon}</span>}
      <Select
        size={size}
        defaultValue={defaultValue || undefined}
        onChange={onChange}
        style={{ width: 200 }}
        options={options}
        suffixIcon={<CaretDownOutlined />}
        rootClassName={`custom-select-dropdown ${rootClassName}`}
        className={className}
        placeholder={placeholder}
        value={value || undefined}
      />
    </div>
  );
};

export default CommonSelect;
