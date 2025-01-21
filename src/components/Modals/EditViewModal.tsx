import React from 'react';
import { Input, Modal } from 'antd';
import CommonButton from '../Button';

interface EditViewModalProps {
    title: string;
    isOpen: boolean;
    onCancel: () => void;
    onOk: () => void;
    footer?: React.ReactNode;
    centered?: boolean;
    closable?: boolean;
    maskClosable?: boolean;
    className?: string;
    currentDataFields: any;
    cancelBtnClass?: string;
    cancelBtnClick?: () => void;
    cancelButtonProps?: React.ReactNode;
    saveBtnClass?: string;
    saveBtnClick?: () => void;
    saveButtonProps?: React.ReactNode;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    modalMode: string;
    handleInputChange: (key: string, value: string) => void;
    validationErrors: Record<string, string>;
}

const EditViewModal: React.FC<EditViewModalProps> = ({
    title,
    isOpen,
    onCancel,
    onOk,
    footer,
    centered,
    closable,
    maskClosable,
    className,
    currentDataFields,
    cancelBtnClass,
    cancelBtnClick,
    cancelButtonProps,
    saveBtnClass,
    saveBtnClick,
    saveButtonProps,
    leftIcon,
    rightIcon,
    modalMode,
    handleInputChange,
    validationErrors,
    ...props
}) => {
    const generateFields = (currentData: Record<string, any>) => {
        const fields = [];
        if (currentData && typeof currentData === 'object') {
            for (const key in currentData) {
                if (Object.hasOwnProperty.call(currentData, key) && key !== 'id') {
                    // Check if the value is a string, and exclude non-string values like objects
                    fields.push(
                        <div className="dataField flex justify-between items-center mb-3" key={key}>
                            <label className="FiedlLabel whitespace-nowrap text-[14px] text-[#000000] flex items-center font-poppins  font-normal leading-10 tracking-normal text-left">
                                {key.charAt(0).toUpperCase() + key.slice(1)}
                            </label>
                            <div className="InputDiv w-[75%] items-center gap-5 justify-end">
                                <Input
                                    type="text"
                                    className="inputFiedl block border border-[#D7D8E4] w-full py-2 px-4 rounded-full"
                                    name={key}
                                    disabled={modalMode === 'view'}
                                    required
                                    value={currentData[key]}
                                    onChange={(e) => handleInputChange(key, e.target.value)}
                                    placeholder={`Enter ${key.charAt(0).toUpperCase() + key.slice(1)}`}
                                />
                                {validationErrors[key] && (
                                    <p className="error text-red-500 pl-3">{validationErrors[key]}</p>
                                )}
                            </div>
                        </div>,
                    );
                }
            }
        }
        return fields;
    };

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
            className={className}
            {...props}
        >
            <div className="fiedlDiv mt-5">
                {generateFields(currentDataFields)}
                <div className={`fiedlBtn ${modalMode === 'view' && 'viewField'}`}>
                    <CommonButton
                        danger
                        leftIcon={leftIcon}
                        rightIcon={rightIcon}
                        onClick={cancelBtnClick}
                        className={cancelBtnClass}
                    >
                        {cancelButtonProps}
                    </CommonButton>
                    {modalMode === 'edit' && (
                        <CommonButton
                            type="primary"
                            leftIcon={leftIcon}
                            rightIcon={rightIcon}
                            onClick={saveBtnClick}
                            className={saveBtnClass}
                        >
                            {saveButtonProps}
                        </CommonButton>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default EditViewModal;
