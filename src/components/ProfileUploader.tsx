import React, {useState} from "react";
import ImgCrop from "antd-img-crop";
import {Upload, Image} from "antd";
import {useNotification} from "./Notification";
import {handleViewButton} from "../helper/Utils";

interface ImageUploadProps {
  defaultImage?: any;
  onImageChange: (base64Image: any) => void;
  height?: number;
  width?: number;
  disabled?: boolean;
  removeImage?: any;
  isUplaod?: boolean;
}

const ProfileUpload: React.FC<ImageUploadProps> = ({
  defaultImage,
  onImageChange,
  height = 100,
  width = 100,
  disabled = false,
  removeImage,
  isUplaod = true,
}) => {
  const [upload, setUpload] = useState(false);
  const notificationContext = useNotification();
  const handleNotifications: any = notificationContext?.handleNotifications;

  const handleAvatarChange = async ({file}: {file: any}) => {
    if (upload) {
      return false;
    }
    if (file.status === "done") {
      console.log(file);
      const base64Image = await getBase64Image(file.originFileObj);
      onImageChange({base64: base64Image, file: file.originFileObj});
    } else if (!file.status) {
    }
  };

  const getBase64Image = async (file: File): Promise<string | null> => {
    return new Promise<string | null>((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => resolve(null);
    });
  };

  const currentTitle = handleViewButton();
  const isViewPage = currentTitle === "View User";

  return (
    <ImgCrop
      cropShape="round"
      quality={1}
      modalTitle="Crop Image"
      rotationSlider
      modalClassName="image-modal"
      onModalCancel={() => setUpload(true)}
      onModalOk={() => setUpload(false)}
    >
      <Upload
        showUploadList={false}
        onChange={handleAvatarChange}
        accept="image/png, image/jpeg, image/jpg"
        disabled={disabled}
      >
        <div className="relative cursor-pointer">
          <Image
            preview={false}
            src={defaultImage}
            width={width || 100}
            height={height || 100}
            className="rounded-full border-2 border-black"
          />

          {!isViewPage && (
            <div className="absolute bottom-1 right-0 profile-icon">
              <div className="w-10 h-10 rounded-full bg-white flex justify-center items-center opacity-75">
                <div className="w-7 h-7 rounded-full bg-[#4379EE] flex justify-center items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <path
                      d="M8 10.666C9.10457 10.666 10 9.77058 10 8.66602C10 7.56145 9.10457 6.66602 8 6.66602C6.89543 6.66602 6 7.56145 6 8.66602C6 9.77058 6.89543 10.666 8 10.666Z"
                      stroke="white"
                      strokeWidth="1.25"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M2 11.1993V6.13268C2 5.38595 2 5.01258 2.14532 4.72736C2.27316 4.47648 2.47713 4.2725 2.72801 4.14467C3.01323 3.99935 3.3866 3.99935 4.13333 3.99935H4.83643C4.91839 3.99935 4.95937 3.99935 4.99717 3.99502C5.19444 3.97242 5.37137 3.86308 5.47979 3.69674C5.50058 3.66486 5.51891 3.6282 5.55556 3.5549C5.62886 3.40829 5.66551 3.33499 5.70708 3.27123C5.92393 2.93856 6.27779 2.71987 6.67232 2.67468C6.74793 2.66602 6.82989 2.66602 6.99381 2.66602H9.00619C9.17011 2.66602 9.25207 2.66602 9.32768 2.67468C9.72221 2.71987 10.0761 2.93856 10.2929 3.27123C10.3345 3.33498 10.3711 3.40831 10.4444 3.5549C10.4811 3.62821 10.4994 3.66486 10.5202 3.69674C10.6286 3.86308 10.8056 3.97242 11.0028 3.99502C11.0406 3.99935 11.0816 3.99935 11.1636 3.99935H11.8667C12.6134 3.99935 12.9868 3.99935 13.272 4.14467C13.5229 4.2725 13.7268 4.47648 13.8547 4.72736C14 5.01258 14 5.38595 14 6.13268V11.1993C14 11.9461 14 12.3195 13.8547 12.6047C13.7268 12.8556 13.5229 13.0595 13.272 13.1874C12.9868 13.3327 12.6134 13.3327 11.8667 13.3327H4.13333C3.3866 13.3327 3.01323 13.3327 2.72801 13.1874C2.47713 13.0595 2.27316 12.8556 2.14532 12.6047C2 12.3195 2 11.9461 2 11.1993Z"
                      stroke="white"
                      strokeWidth="1.25"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
          )}
        </div>
      </Upload>
    </ImgCrop>
  );
};

export default ProfileUpload;
