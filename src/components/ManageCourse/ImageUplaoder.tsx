import React, {useState} from "react";
import {Button, Divider, Image, Modal, Upload} from "antd";
import {useNotification} from "../Notification";
import ImagePlus from "../Icons/ImagePlus";
import uploadFile from "@/src/helper/UploadFIle";
import XmarLargeModel from "../Icons/XmarLargeModel";

const {Dragger} = Upload;

interface ImageUploaderProps {
  openImageModel: boolean;
  handleImageModel: () => void;
  image: any;
  setImage: any;
  setImageUrl: any;
  imageUrl: any;
  setImageUploadError: any;
  allowedRatios?: Array<number>;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  openImageModel,
  handleImageModel,
  image,
  setImage,
  setImageUrl,
  imageUrl,
  setImageUploadError,
  allowedRatios = [16 / 9, 4 / 3, 1 / 1],
}) => {
  const notificationContext = useNotification();
  const handleNotifications: any = notificationContext?.handleNotifications;
  const [uploading, setUploading] = useState(false);
  const [uploadedImageName, setUploadedImageName] = useState<string | null>(
    null
  );

  const validateImageRatio = (file: File) => {
    return new Promise<boolean>((resolve) => {
      const img = new window.Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        const width = img.width;
        const height = img.height;
        const ratio = width / height;
        console.log("Uploaded image ratio: ", ratio);

        // Check if the image's ratio matches any allowed ratios
        const isValidRatio = allowedRatios.some(
          (allowedRatio) => Math.abs(ratio - allowedRatio) <= 0.01
        );

        if (!isValidRatio) {
          handleNotifications("error", `Invalid aspect ratio. `);
          resolve(false);
        } else {
          resolve(true);
        }
      };
    });
  };
  const MAX_FILE_SIZE_MB = 10;
  const MAX_FILE_SIZE = MAX_FILE_SIZE_MB * 1024 * 1024; // 10 MB
  const VALID_FILE_TYPES = ["image/jpeg", "image/png", "image/jpg"];

  const fileUploading = async (file: File) => {
    try {
      setUploading(true);
      const isValidRatio = await validateImageRatio(file);
      console.log("isValidRatio :>> ", isValidRatio);
      if (!isValidRatio) {
        setUploading(false);
        handleNotifications("error", "File upload failed.");

        return false;
      }
      let uploadRes = await uploadFile(file);
      if (uploadRes?.settings?.success) {
        setUploading(false);
        setImage(uploadRes?.data?.name);
        setImageUrl(uploadRes?.data?.url);
        setImageUploadError(false);
        setUploadedImageName(uploadRes?.data?.name);
        handleNotifications("success", "File uploaded successfully!");
        // handleImageModel();
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.log("error :>> ", error);
      setUploading(false);
      console.error("Error during file upload:", error);
      handleNotifications("error", "File upload failed.");
    }
  };

  const handleUploadChange = async (info: any) => {
    const {file} = info;
    if (file.status !== "uploading") {
      if (!VALID_FILE_TYPES.includes(file.type)) {
        handleNotifications(
          "error",
          "Invalid file type. Please upload a valid image file (JPEG/PNG)."
        );
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        handleNotifications(
          "error",
          `File size should be less than or equal to ${MAX_FILE_SIZE_MB}MB.`
        );
        return;
      }

      fileUploading(file.originFileObj);
    }
  };

  return (
    <Modal
      className="custome-image-model"
      width={387}
      footer={null}
      title={
        <div className="flex justify-between ">
          <p className="text-[#000000] text-[20px] font-[600] px-[20px]">
            Add Cover Picture
          </p>
          <div onClick={handleImageModel} className="mr-5 cursor-pointer">
            <XmarLargeModel />
          </div>
        </div>
      }
      open={openImageModel}
      onCancel={handleImageModel}
      closable={false}
    >
      <Divider className="!w-full" />
      <div className="">
        <Dragger
          className="custom-image-drag"
          accept="image/*"
          showUploadList={false}
          beforeUpload={(file) => {
            if (!VALID_FILE_TYPES.includes(file.type)) {
              handleNotifications(
                "error",
                "Invalid file type. Please upload a valid image file (JPEG/PNG)."
              );
              return false;
            }
            if (file.size > MAX_FILE_SIZE) {
              handleNotifications(
                "error",
                `File size should be less than or equal to ${MAX_FILE_SIZE_MB}MB.`
              );
              return false;
            }
            fileUploading(file);
            return false;
          }}
        >
          <div className="w-[170px] h-[170px] rounded-[10px] bg-[#F2F2F2] flex justify-center items-center ml-[25%]">
            <div className="flex justify-center p-[30%]">
              {uploadedImageName ? (
                <div className="mt-4 text-center text-[16px] font-Nunito Sans font-[600] leading-[24px] text-[#4F4F4F]">
                  <Image
                    className="rounded-[10px] object-cover"
                    src={imageUrl}
                    alt="uploadedImageName"
                    preview={false}
                    width={170}
                    height={170}
                  />
                </div>
              ) : (
                <ImagePlus />
              )}
            </div>
          </div>
        </Dragger>
        <div className="w-full flex justify-center items-center">
          <Upload
            onChange={handleUploadChange}
            showUploadList={false}
            accept="image/*"
          >
            <Button
              type="primary"
              size="large"
              className="bg-[#4379EE] rounded-[8px] text-[#FFFFFF] common-button min-w-[347px] mt-2"
              loading={uploading}
            >
              Upload From Computer
            </Button>
          </Upload>
        </div>
      </div>
    </Modal>
  );
};

export default ImageUploader;
