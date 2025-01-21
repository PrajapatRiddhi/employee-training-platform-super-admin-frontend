import type {RangePickerProps} from "antd/es/date-picker";
import {DatePicker} from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import React from "react";

dayjs.extend(customParseFormat);

const {RangePicker} = DatePicker;

interface DateRangePickerProps {
  defaultValue?: [dayjs.Dayjs, dayjs.Dayjs];
  value?: any;
  onChange?: (
    dates: [dayjs.Dayjs, dayjs.Dayjs] | null,
    dateStrings: [string, string]
  ) => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  defaultValue,
  value,
  onChange,
}) => {
  const dateFormat = "YYYY/MM/DD";

  const handleChange: any = (dates: any, dateStrings: any) => {
    if (onChange) {
      console.log(
        "dates as [dayjs.Dayjs, dayjs.Dayjs] | null, dateStrings :>> ",
        dates as [dayjs.Dayjs, dayjs.Dayjs] | null,
        dateStrings
      );
      onChange(dates as [dayjs.Dayjs, dayjs.Dayjs] | null, dateStrings);
    }
  };
  const disabledDate = (current: dayjs.Dayjs) => {
    // Disable all dates after today
    return current && current > dayjs().endOf("day");
  };
  return (
    <div>
      <RangePicker
        className="custom--date-placeholder"
        suffixIcon={<div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              d="M2.5 7.5H17.5M5.83333 2.5V4.16667M14.1667 2.5V4.16667M5 10H6.66667M9.16667 10H10.8333M13.3333 10H15M5 12.5H6.66667M9.16667 12.5H10.8333M13.3333 12.5H15M5 15H6.66667M9.16667 15H10.8333M13.3333 15H15M5.16667 17.5H14.8333C15.7668 17.5 16.2335 17.5 16.59 17.3183C16.9036 17.1586 17.1586 16.9036 17.3183 16.59C17.5 16.2335 17.5 15.7668 17.5 14.8333V6.83333C17.5 5.89991 17.5 5.4332 17.3183 5.07668C17.1586 4.76308 16.9036 4.50811 16.59 4.34832C16.2335 4.16667 15.7668 4.16667 14.8333 4.16667H5.16667C4.23325 4.16667 3.76654 4.16667 3.41002 4.34832C3.09641 4.50811 2.84144 4.76308 2.68166 5.07668C2.5 5.4332 2.5 5.89991 2.5 6.83333V14.8333C2.5 15.7668 2.5 16.2335 2.68166 16.59C2.84144 16.9036 3.09641 17.1586 3.41002 17.3183C3.76654 17.5 4.23325 17.5 5.16667 17.5Z"
              stroke="#828282"
              stroke-linecap="round"
            />
          </svg>
          </div>
        }
        defaultValue={defaultValue}
        value={value}
        format={dateFormat}
        placeholder={["Start Date", "End Date"]}
        onChange={handleChange}
        disabledDate={disabledDate}
      />
    </div>
  );
};

export default DateRangePicker;
