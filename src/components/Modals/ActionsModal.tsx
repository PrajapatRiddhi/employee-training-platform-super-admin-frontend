import React from 'react';
import { Modal } from 'antd';
import { AiFillWarning, AiOutlineCheck, AiOutlineExclamationCircle } from 'react-icons/ai';
import CommonButton from '../Button';

interface ActionsModalProps {
    title: string;
    type: 'delete' | 'save' | 'warning';
    isOpen: boolean;
    onCancel: () => void;
    onOk: () => void;
    footer?: React.ReactNode;
    centered?: boolean;
    closable?: boolean;
    maskClosable?: boolean;
    className?: string;
    cancelBtnClass?: string;
    cancelBtnClick?: () => void;
    cancelButtonProps?: React.ReactNode;
    saveBtnClass?: string;
    saveBtnClick?: () => void;
    saveButtonProps?: React.ReactNode;
    savebtnType?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    icons?: React.ReactNode;
    defaultIconClass?: string;
    mainTitle?: string;
    mainTitleClass?: string;
    description?: string;
    descriptionClass?: string;
}

const ActionsModal: React.FC<ActionsModalProps> = ({
    title,
    type,
    isOpen,
    onCancel,
    onOk,
    footer,
    centered,
    closable,
    maskClosable,
    className,
    cancelBtnClass,
    cancelBtnClick,
    cancelButtonProps,
    saveBtnClass,
    saveBtnClick,
    saveButtonProps,
    savebtnType,
    leftIcon,
    rightIcon,
    icons,
    defaultIconClass,
    mainTitle,
    mainTitleClass,
    description,
    descriptionClass,
    ...props
}) => {
    let conditionalMainTitle = '';
    let conditionalDescription = '';
    let conditionalIcons;
    let buttonName = '';
    // let saveClass = "";

    if (type === 'delete') {
        conditionalMainTitle = 'Are you sure?';
        conditionalDescription = 'Do you really want to delete these record?';
        conditionalIcons = <AiFillWarning className={defaultIconClass || 'deleteIconClass'} />;
        buttonName = 'Delete';
    } else if (type === 'save') {
        conditionalMainTitle = 'Save?';
        conditionalDescription = 'Save Description';
        conditionalIcons = <AiOutlineCheck className={defaultIconClass || 'saveIconClass'} />;
        buttonName = 'Save';
    } else if (type === 'warning') {
        conditionalMainTitle = 'Warning';
        conditionalDescription = 'WarningDescription';
        conditionalIcons = <AiOutlineExclamationCircle className={defaultIconClass || 'warningIconClass'} />;
        buttonName = 'warning';
    }

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
            <>
                {/* <div className="IconsContainer flex items-center justify-center font-poppins text-center font-medium py-2">
                    {icons || conditionalIcons}
                </div> */}
                <div>
                    <p
                        className={
                            mainTitleClass ||
                            'mainTitledefaultClass items-center font-poppins text-center text-2xl font-bold py-1'
                        }
                    >
                        {mainTitle || conditionalMainTitle}
                    </p>
                    <p
                        className={
                            descriptionClass ||
                            'descriptiondefaultClass items-center font-poppins text-center font-medium text-gray-400 py-2'
                        }
                    >
                        {description || conditionalDescription}
                    </p>
                </div>
                <div className="btnContainer flex gap-2">
                    <CommonButton
                        danger
                        leftIcon={leftIcon}
                        rightIcon={rightIcon}
                        onClick={cancelBtnClick}
                        className={cancelBtnClass || 'cancelBtndefautClass w-full rounded-full my-1 max-w-[250px]'}
                    >
                        {cancelButtonProps || 'Cancle'}
                    </CommonButton>
                    <CommonButton
                        type="primary"
                        danger={savebtnType}
                        leftIcon={leftIcon}
                        rightIcon={rightIcon}
                        onClick={saveBtnClick}
                        className={
                            saveBtnClass || 'saveBtndefautClass w-full bg-red-500 rounded-full my-1 max-w-[250px] !hover:bg-black'
                        }
                    >
                        {saveButtonProps || buttonName}
                    </CommonButton>
                </div>
            </>
        </Modal>
    );
};

export default ActionsModal;
