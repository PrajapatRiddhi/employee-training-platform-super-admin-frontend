import { Progress, ProgressProps } from "antd";
import { FC } from "react";

// Extend the ProgressCircleProps to include more props
type ProgressCircleProps = {
    percent: number;
} & ProgressProps; // This includes all props from Ant Design's Progress component

const ProgressCircle: FC<ProgressCircleProps> = ({ percent, ...rest }) => {
    return <Progress percent={percent} type="circle" {...rest}  />;
}

export default ProgressCircle;
