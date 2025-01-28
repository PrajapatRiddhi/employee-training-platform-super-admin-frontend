import React from "react";
import {Button, Divider, Modal, Input} from "antd";
import {Form, Formik} from "formik";
import CustomInput from "../CustomInput";
import {useNotification} from "../Notification";
import axiosInstance from "@/src/interceptors/Axios";
import {API_ENDPOINTS} from "@/src/interceptors/apiName";

interface VideoViewerProps {
  openVideoView: boolean;
  hanldeVideoViewer: (course: any) => void;
  isVideoURL: any;
}

const VideoViewer: React.FC<VideoViewerProps> = ({
  openVideoView,
  hanldeVideoViewer,
  isVideoURL,
}) => {
  return (
    <Modal
      width={387}
      footer={null}
      className="model-custom-ui"
      title={
        <p className="text-[#000000] text-[20px] font-bold">Video Viewer</p>
      }
      open={openVideoView}
      onCancel={hanldeVideoViewer}
    >
      <Divider />
      <video width="100%" controls>
        <source src={isVideoURL} type="video/mp4" />
      </video>
    </Modal>
  );
};

export default VideoViewer;
