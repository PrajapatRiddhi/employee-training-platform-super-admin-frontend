import React, {HtmlHTMLAttributes, ReactNode, useState} from "react";
import {Typography, Select, Image} from "antd";
import {Field} from "formik";
import CustomDropdownIcon from "../Icons/CustomDropdownIcon";

interface CustomSelectProps {
  label?: ReactNode | JSX.Element;
  labelDiv?: ReactNode;
  id?: string;
  name: string;
  placeholder?: string;
  selectLabel?: boolean;
  mode?: string;
  error?: string | JSX.Element;
  options?: Array<{value: string | boolean | any; label: string | JSX.Element}>;
  onSelect?: (value: string, valueOb?: any) => void;
  defaultValue?: any;
  className?: string;
  filterOption?: (
    input: string,
    option: {
      children: any;
      label: string;
    }
  ) => boolean;
  onClick?: any;
  onDeselect?: any;
  required?: boolean;
  onInputKeyDown?: any;
  size?: "large" | "middle" | "small";
  disabled?: boolean;
  labelClass?: string;
}
const CustomSelect: React.FC<CustomSelectProps> = ({
  label,
  labelDiv,
  name,
  error,
  options,
  onSelect,
  id,
  placeholder,
  defaultValue = "",
  className,
  mode,
  selectLabel = true,
  onClick,
  onDeselect,
  required = false,
  onInputKeyDown,
  size = "large",
  disabled = false,
  labelClass,
}) => {
  const {Text} = Typography;
  const [isInputFocused, setInputFocused] = useState(false);

  const handleFocus = () => {
    setInputFocused(true);
  };

  const handleBlur = (e: React.FocusEvent<any>) => {
    // If the input has a value or default value, keep the label visible
    if (e.target.value) {
      setInputFocused(true);
    }
  };
  const isGrouped = options?.some((option: any) => option.options);
  const filterOption = (
    input: string,
    option: {
      children: any;
      label: string;
    }
  ) => {
    let searchTarget = "";

    if (Array.isArray(option.children)) {
      // Filter out any null or undefined children and join them into a string
      searchTarget = option.children.filter(Boolean).join(" ").toLowerCase();
    } else if (typeof option.children === "string") {
      searchTarget = option.children.toLowerCase();
    }

    return searchTarget.includes(input.toLowerCase());
  };

  const groupedFilterOption = (input: string, option: any) => {
    if (option?.children) {
      return option?.children?.some((child: any) => {
        const label = child?.props?.children || option?.label; // Get the label of the option
        return label?.toLowerCase().includes(input?.toLowerCase());
      });
    }
    return filterOption(input, option);
  };
  return (
    <div className="relative w-full">
      {/* {label&& ((isInputFocused || defaultValue || defaultValue != 0) && ( */}
      <div
        className={`${labelClass} ${
          (isInputFocused || defaultValue || defaultValue != 0) &&
          "custom-input"
        } text-[#000] text-[14px] leading-[22px]`}
      >
        {label ? label : labelDiv}
        {required && <span className="text-red-500">*</span>}
      </div>
      {/* ))} */}
      <Field name={name}>
        {({field, form}: {field: any; form: any}) => (
          <Select
            mode={mode}
            {...field}
            rootClassName="custom-select-dropdown selected-data"
            showSearch
            id={id}
            size={size}
            className={`  ${className} ${label && "mt-[5px]"} !min-h-[40px] `}
            optionFilterProp="children"
            filterOption={isGrouped ? groupedFilterOption : filterOption}
            placeholder={placeholder}
            onFocus={handleFocus}
            onBlur={handleBlur}
            // options={options}
            // onChange={(value: any, option: any) => {
            //   console.log("options", value, options);
            //   let findObj: any = {};
            //   if (isGrouped) {
            //     options?.map((group: any, groupIndex: number) => {
            //       group.options?.map((option: any, index: number) => {
            //         if (option.value === value) {
            //           findObj = option;
            //         }
            //       });
            //     });
            //   } else {
            //     findObj = options?.find((opt) => opt.value === value);
            //   }
            //   console.log("findObj :>> ", findObj);
            //   form.setFieldValue(name, value);
            //   if (onSelect) {
            //     onSelect(value, findObj); // Call the onSelect callback
            //   }
            // }}
            onChange={(value: any, option: any) => {
              let findObj: any = []; // Array to hold found options

              if (isGrouped) {
                // Handle grouped options
                options?.forEach((group: any) => {
                  // console.log('group.options :>> ', group.options);
                  group.options?.forEach((opt: any) => {
                    if (Array.isArray(value)) {
                      // For multiple selection mode, push matching options to the array
                      if (value.includes(opt.value)) {
                        findObj.push({...opt});
                      }
                    } else {
                      // For single selection mode, directly assign the matching option
                      if (value === opt.value) {
                        findObj = [opt];
                      }
                    }
                  });
                });
              } else {
                // Handle non-grouped options
                if (Array.isArray(value)) {
                  findObj = options?.filter((opt) => value.includes(opt.value)); // Filter the matching options in multiple mode
                } else {
                  const singleOption = options?.find(
                    (opt) => opt.value === value
                  );
                  findObj = singleOption ? [singleOption] : [];
                }
              }

              form.setFieldValue(name, value);

              // Pass a single object if not in multiple mode, otherwise pass the array
              if (onSelect) {
                if (mode === "multiple") {
                  // console.log("findObj (multiple mode) :>> ", findObj);
                  onSelect(value, findObj); // Pass array of options in multiple mode
                } else {
                  const singleObj = findObj[0] || null; // Get the first matching object or null
                  // console.log("findObj (single mode) :>> ", singleObj);
                  onSelect(value, singleObj); // Pass single object in single select mode
                }
              }
            }}
            defaultValue={defaultValue || undefined}
            value={defaultValue || undefined}
            onClick={onClick}
            onDeselect={onDeselect}
            onInputKeyDown={onInputKeyDown}
            suffixIcon={<CustomDropdownIcon />}
            disabled={disabled}
          >
            {/* {selectLabel && (
              <Select.Option value={""}>
                {" "}
                {`Please ${placeholder ?? label}`}
              </Select.Option>
            )} */}
            {isGrouped
              ? options?.map((group: any, groupIndex: number) => (
                  <Select.OptGroup key={groupIndex} label={group.label}>
                    {group.options?.map((option: any, index: number) => {
                      const optionKey = `group-${groupIndex}-option-${option.value}`;
                      return (
                        <Select.Option
                          className="space-x-3 flex items-center"
                          key={`option-${optionKey}-${index}`}
                          value={option.value}
                        >
                          {option.image && (
                            <Image
                              src={option.image}
                              alt={option.label as string}
                              height={20}
                            />
                          )}
                          {option.label}
                        </Select.Option>
                      );
                    })}
                  </Select.OptGroup>
                ))
              : options?.map((i: any, index: number) => (
                  <Select.Option
                    className="space-x-3 flex items-center"
                    key={`option-${index}`}
                    value={i.value}
                  >
                    {i.image && (
                      <Image src={i.image} alt={i.label} height={20} />
                    )}{" "}
                    {i.label}
                  </Select.Option>
                ))}
          </Select>
        )}
      </Field>

      <Text type="danger" className="flex text-left">
        {error}
      </Text>
    </div>
  );
};

export default CustomSelect;
