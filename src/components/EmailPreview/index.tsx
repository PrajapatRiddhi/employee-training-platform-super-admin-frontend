import { FC } from "react";
import CommonModal from "../Modals";
import { Button } from "antd";
import EmailIcon from "../Icons/EmailIcon";
import { MdEmail } from "react-icons/md";
import RedFlags from "../Icons/RedFlags";
import { useNotification } from "../Notification";
import { useLoader } from "../Loader/LoaderProvider";
import axiosInstance from "@/src/interceptors/Axios";
import { API_ENDPOINTS } from "@/src/interceptors/apiName";
interface EmailPreviewProps {
  isOpen: boolean;
  onCancel: () => void;
  contain?: any;
}
const EMailIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
  >
    <path
      d="M2.5 6.6665L7.0416 9.69424C8.11079 10.407 8.64539 10.7634 9.22321 10.9019C9.73384 11.0243 10.2662 11.0243 10.7768 10.9019C11.3546 10.7634 11.8892 10.407 12.9584 9.69424L17.5 6.6665M5.16667 15.8332H14.8333C15.7668 15.8332 16.2335 15.8332 16.59 15.6515C16.9036 15.4917 17.1586 15.2368 17.3183 14.9232C17.5 14.5666 17.5 14.0999 17.5 13.1665V6.83317C17.5 5.89975 17.5 5.43304 17.3183 5.07652C17.1586 4.76292 16.9036 4.50795 16.59 4.34816C16.2335 4.1665 15.7668 4.1665 14.8333 4.1665H5.16667C4.23325 4.1665 3.76654 4.1665 3.41002 4.34816C3.09641 4.50795 2.84144 4.76292 2.68166 5.07652C2.5 5.43304 2.5 5.89975 2.5 6.83317V13.1665C2.5 14.0999 2.5 14.5666 2.68166 14.9232C2.84144 15.2368 3.09641 15.4917 3.41002 15.6515C3.76654 15.8332 4.23325 15.8332 5.16667 15.8332Z"
      stroke="white"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
const EmailPreview: FC<EmailPreviewProps> = ({ isOpen, onCancel, contain }) => {
  const notificationContext = useNotification();
  const handleNotifications: any = notificationContext?.handleNotifications;
  const loaderContext = useLoader();
  const { showLoader, hideLoader } = loaderContext;
  const sendTestEmail = async () => {
    try {
      
      showLoader();
      const testEmail: any = await axiosInstance.get(
        `${API_ENDPOINTS.TEST_EMAIL_NOTIFICATION_TEMPLATES}/${contain?.notificationTemplateId}`
      );
      if (testEmail?.settings?.success) {
        handleNotifications("success", testEmail?.settings?.message, "", 3);
        hideLoader();
      }
    } catch (error) {
      hideLoader();
    }
  };
    const addTargetBlank = (html:any) => {
      const div = document.createElement('div');
      div.innerHTML = html;
      
      const anchorTags = div.querySelectorAll('a');
      anchorTags.forEach((anchor) => {
        anchor.setAttribute('target', '_blank');
        anchor.setAttribute('rel', 'noopener noreferrer');
      });
  
      return div.innerHTML;
    };
  return (
    <CommonModal
      onCancel={onCancel}
      isOpen={isOpen}
      title={<div className="text-[#000000] font-[600] text-[20px]">{contain?.subject}</div>}
      className="email-preview"
      width={850}
      footer={null}
    >
      <div className="flex justify-between w-full bg-[#F2F2F2] h-[176px] py-[12px] px-[30px]">
        <div className="flex flex-col text-[14px] text-[#4F4F4F]">
          <div>
            <span className="text-[#828282] mr-[5px]">From:</span>
            {`<${contain?.fromEmail}>`}
          </div>
          <div>
            <span className="text-[#828282] mr-[5px]">Reply to:</span>{" "}
            {`${contain?.senderName} <${contain?.senderEmail}>`}
          </div>
          <div>
            <span className="text-[#828282] mr-[5px]">Subject:</span> {contain?.subject}
          </div>
        </div>

        <div className="max-w-[219px] w-full flex flex-col text-[14px] text-[#4F4F4F]">
          <div className="text-wrap text-right">
            <span className="text-[#828282]">Template ID: &nbsp;</span>
            {contain?.uniqueId}
          </div>
          <Button
            className="bg-[#4379EE] hover:!bg-[#355bcc] mr-[25px] hover:!text-[#fff] text-[#fff] w-fit h-[40px] flex items-center my-[17px] transition duration-300 ease-in-out text-[16px] font-[700]"
            icon={EMailIcon}
            onClick={sendTestEmail}
          >
            Send Me a Test Email
          </Button>
          <div className="flex items-center justify-end">
            <RedFlags />
            <span className="text-[12px] text[#828282]">Toggle Red Flags</span>
          </div>
        </div>
      </div>
      <div
        className="main-body-contain"
        dangerouslySetInnerHTML={{ __html: addTargetBlank(contain?.content) }}
      ></div>
      <div className="flex pb-[30px]">
        <Button
          className="email-preview-close-btn ml-auto mr-[30px]"
          onClick={onCancel}
        >
          Close
        </Button>
      </div>
    </CommonModal>
  );
};
export default EmailPreview;
