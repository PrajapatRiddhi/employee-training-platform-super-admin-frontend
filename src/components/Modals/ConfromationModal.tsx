import React, {useState} from "react";
import {Button, Divider, Flex, Modal} from "antd";

interface ConfromationModalProps {
  mainTitle?: string;
  description?: string;
}

const ConfromationModal: React.FC<ConfromationModalProps> = ({
  mainTitle,
  description,
}) => {
  const [open, setOpen] = useState(false);
  return (
    <Flex vertical gap="middle" align="flex-start">
      <Button type="primary" onClick={() => setOpen(true)}>
        Open Modal of 1000px width
      </Button>
      <Modal
        title={mainTitle}
        open={open}
        onOk={() => setOpen(false)}
        onCancel={() => setOpen(false)}
        width={814}
        footer={null}
      >
        <Divider />
        <div>{description}</div>
      </Modal>
    </Flex>
  );
};

export default ConfromationModal;
