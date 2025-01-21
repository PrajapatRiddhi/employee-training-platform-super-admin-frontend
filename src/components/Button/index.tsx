import React from 'react';
import { Button, Space, ButtonProps } from 'antd';

interface CommonButtonProps extends ButtonProps {
    type?: 'default' | 'primary' | 'dashed' | 'link' | 'text';
    className?: string;
    danger?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

const CommonButton: React.FC<CommonButtonProps> = ({
    type,
    className,
    onClick,
    children,
    danger,
    leftIcon,
    rightIcon,
    disabled,
    ...props
}) => {
    return (
        <Button type={type} className={className} onClick={onClick} danger={danger} disabled={disabled} {...props}>
            <Space>
                {leftIcon && leftIcon}
                {children}
                {rightIcon && rightIcon}
            </Space>
        </Button>
    );
};

export default CommonButton;
