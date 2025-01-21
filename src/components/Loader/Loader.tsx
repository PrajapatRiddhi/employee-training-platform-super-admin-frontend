import React from 'react';
import { Loading3QuartersOutlined } from '@ant-design/icons';
import { Spin, Modal } from 'antd';

const antIcon = <Loading3QuartersOutlined style={{ fontSize: 46, color: '#FF8F77' }} spin />;

const Loader = () => {
    return (
        <Modal zIndex={99999999} open={true} closable={false} footer={false} centered={true} wrapClassName="loader">
            <Spin  size="large" />
        </Modal>
    );
};

export default Loader;
