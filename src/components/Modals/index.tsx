import React from 'react';
import { Modal } from 'antd';

interface CommonModalProps {
    title?: React.ReactNode;
    isOpen?: boolean;
    onCancel?: () => void;
    onOk?: () => void;
    children?: React.ReactNode;
    footer?: React.ReactNode;
    centered?: boolean;
    closable?: boolean;
    maskClosable?: boolean;
    className?: string;
    width?: number;
}

const CommonModal: React.FC<CommonModalProps> = ({
    title,
    isOpen,
    onCancel,
    onOk,
    children,
    footer,
    centered,
    closable,
    maskClosable,
    className,
    width,
    ...props
}) => {
    return (
        <Modal
            title={title}
            open={isOpen}
            onCancel={onCancel}
            onOk={onOk}
            footer={footer}
            centered={centered}
            closable={closable}
            maskClosable={maskClosable}
            wrapClassName={`common-modal ${className}`}
            width={width}
            {...props}
        >
            {children}
        </Modal>
    );
};

export default CommonModal;
