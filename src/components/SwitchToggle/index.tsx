import React from 'react';
import { Switch } from 'antd';

interface CommonSwitchProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    checkedChildren?: string | number;
    unCheckedChildren?: string | number;
    disabled?: boolean;
}

const SwitchToggle: React.FC<CommonSwitchProps> = ({ checked, onChange, checkedChildren, unCheckedChildren, disabled=false }) => {
    return (
        <Switch
            defaultChecked={checked}
            checked={checked}
            checkedChildren={checkedChildren}
            unCheckedChildren={unCheckedChildren}
            onChange={onChange}
            className='switch-toggle'
            size='small'
            disabled={disabled}
        />
    );
};

export default SwitchToggle;
