import { Flex, Progress } from "antd";
import { FC, ReactNode } from "react";
type ProgressLineProps = {
  value: number;
  color?: string;
  height?: number;
  width?: number;
  displayValue?: boolean;
  displayText?: ReactNode;
  percentageBoolean?:boolean;
  position?: "top" | "bottom" | "left" | "right"; 
  displayTextClass?: string;
};
const ProgressLine: FC<ProgressLineProps> = ({
  value = 0,
  color,
  height,
  width,displayValue=false,percentageBoolean=true, position = "right",displayText ,displayTextClass=''
}) => {
  return (
    <div className={`progress-container progress-${position}`}>
      {position === "top" && displayValue && (
        <div className={`progress-info ${displayTextClass}`}>{displayText}</div>
      )}

      <div className="progress-bar">
        {position === "left" && displayValue && (
          <div className={`progress-info ${displayTextClass}`}>{displayText}</div>
        )}
        <Progress
          percent={value}
          showInfo={false} // We will handle custom info display
          strokeColor={color || "#313D4F"}
          size={height && width ? [height, width] : [148, 10]}
        />
        {position === "right" && displayValue && (
          <div className={`progress-info ${displayTextClass}`}>{displayText}</div>
        )}
      </div>

      {position === "bottom" && displayValue && (
        <div className={`progress-info ${displayTextClass}`}>{displayText}</div>
      )}
    </div>
  );
};
export default ProgressLine;
