import {Typography} from "antd";
import {Field, useField} from "formik";
import {useState} from "react";

interface CustomInputProps {
  label?: string | JSX.Element;
  type: string;
  name: string;
  as: React.ElementType;
  className?: string;
  size: string | "large";
  placeholder: string | "Enter Value";
  error?: string | JSX.Element;
  suffix?: string | JSX.Element;
  prefix?: string | JSX.Element;
  rows?: number;
  maxInput?: number;
  minInput?: number;
  disabled?: boolean;
  defaultValue?: any;
  readOnly?: boolean;
  onInputChange?: (fieldName: string, value: any) => void;
  status?: string;
  required?: boolean;
  iconRender?: (visible: boolean) => JSX.Element;
  showCount?: boolean;
  pattern?: string | any;
  autoSize?: any;
  labelClass?: string;
  style?: any;
  value?: any;
}

const CustomInput: React.FC<CustomInputProps> = ({
  label,
  type,
  name,
  as,
  className,
  size,
  placeholder,
  error,
  suffix,
  prefix,
  rows,
  maxInput = 30,
  disabled,
  value,
  readOnly = false,
  style,
  status,
  autoSize,
  showCount = false,
  onInputChange,
  required = false,
  iconRender,
  pattern,
  labelClass,
}) => {
  const {Text} = Typography;
  const [isInputFocused, setInputFocused] = useState(false);
  const [field, meta, helpers] = useField({name, type});

  const handleFocus = () => {
    setInputFocused(true);
  };

  const handleBlur = (e: React.FocusEvent<any>) => {
    if (e.target.value) {
      setInputFocused(true);
    } else {
      setInputFocused(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<any>) => {
    helpers.setValue(e.target.value);
    if (onInputChange) {
      onInputChange(name, e.target.value);
    }
  };

  return (
    <div className="relative w-full">
      {label && (
        <div
          className={` text-[#828282] text-[14px] leading-[22px] custom-input-label ${labelClass}`}
        >
          {label}
          {required && <span className="text-red-500">*</span>}
        </div>
      )}
      <Field
        type={type}
        name={name}
        {...(status === "error" ? {status: "error"} : {})}
        iconrender={iconRender}
        as={as}
        className={`custom-input mt-[5px] border border-solid bg-[#FFF] border-[#828282] rounded-[4px]  h-[40px]
        ${isInputFocused ? "border-blue-500" : "border-opacity-30"}
        ${className}`}
        size={size}
        placeholder={placeholder}
        value={value || field.value || ""}
        onFocus={handleFocus}
        onBlur={handleBlur}
        suffix={suffix}
        prefix={prefix}
        rows={rows}
        maxLength={maxInput}
        disabled={disabled}
        readOnly={readOnly}
        onChange={handleChange}
        pattern={pattern}
        autosize={autoSize}
        style={style}
        showCount={showCount}
      />
      {error && (
        <Text type="danger" className="flex text-left">
          {error}
        </Text>
      )}
    </div>
  );
};

export default CustomInput;
