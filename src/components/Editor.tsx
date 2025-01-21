// import dynamic from 'next/dynamic';
// import React, { useState, useRef, useMemo, useEffect } from 'react';

// const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false });

// interface EditorProps {
//     editorData?: string;
//     handleEditorChange: (content: string) => void;
// }

// const Editor: React.FC<EditorProps> = ({ editorData, handleEditorChange }) => {
//     const editor = useRef<any>(null); // Ref type should match the expected ref type of JoditEditor
//     const [content, setContent] = useState<string>('');
//     const config = useMemo(
//         () => ({
//             readonly: false, // all options from https://xdsoft.net/jodit/docs/,
//             placeholder: 'Start typings...',
//             style: {
//                 background: 'white',
//                 color: 'black',
//                 minHeight: '350px',
//             },
//             buttons: [
//                 'source','|',
//                 'bold',
//                 'italic',
//                 'underline',
//                 'strikethrough', '|',
//                 'ul',
//                 'ol', '|',
//                 'font',
//                 'fontsize',
//                 'paragraph', '|',
//                 'lineHeight',
//                 'superscript',
//                 'subscript',
//                 'classSpan',
//                 'file',
//                 'image',
//                 'video',
//                 'spellcheck',
//                 // 'speechRecognize',
//                 'cut',
//                 'copy',
//                 'paste',
//                 'selectall',
//                 'copyformat',
//                 'hr',
//                 'table',
//                 'link',
//                 'symbols',
//                 // 'ai-commands',
//                 // 'ai-assistant',
//                 'indent',
//                 'outdent',
//                 'left',
//                 'brush',
//                 'undo',
//                 'redo',
//                 'find',

//                 'fullsize',
//                 'preview',
//                 'print',
//                 'about'
//             ],
//             iframeCSSLinks: [],
//         }),
//         []
//     );

//     const handleChange = (newContent: string) => {
//         setContent(newContent);
//         handleEditorChange(newContent);
//     };
//     useEffect(() => {
//         if(editorData) setContent(editorData);
//     }, [editorData]);
//     return (<>
//         <JoditEditor
//             ref={editor}
//             value={content}
//             config={config}
//             onBlur={() => {}} // Avoid unnecessary re-renders on blur
//             onChange={handleChange}
//         /></>
//     );
// };

// export default Editor;
import React, {useEffect, useRef, useState, useMemo} from "react";
import dynamic from "next/dynamic";
import classNames from "classnames";
import QRCode from "qrcode";
import {Button, Modal, Input} from "antd";

const JoditEditor = dynamic(() => import("jodit-react"), {ssr: false});

interface EditorProps {
  editorData?: string | any;
  handleEditorChange: (content: string) => void;
  readonly?: boolean;
  isPhisingUi?: boolean;
  isNotficationUi?: boolean;
  isShowQAcode?: Boolean;
}

const Editor: React.FC<EditorProps> = ({
  editorData,
  handleEditorChange,
  readonly = false,
  isPhisingUi,
  isNotficationUi,
  isShowQAcode = true,
}) => {
  const editor = useRef<any>(null);
  const [content, setContent] = useState<string>(editorData || "");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [qrText, setQrText] = useState<string>("");
  const [editorRes, setEditorRes] = useState<any>(null);
  const [urlError, setUrlError] = useState<string>("");
  // Custom QR code generator function
  // const generateQRCode = async (editorInstance: any) => {
  //   const text = prompt("Enter the text or URL for the QR code:");
  //   if (text) {
  //     const qrCodeDataURL = await QRCode.toDataURL(text);
  //     editorInstance.selection.insertImage(qrCodeDataURL);
  //   }
  // };
  const validateURL = (text: string): boolean => {
    try {
      new URL(text); // Try creating a URL object from the text
      return true;
    } catch (e) {
      return false; // If the text is not a valid URL, an error will be thrown
    }
  };
  const generateQRCode = async () => {
    if (qrText && validateURL(qrText)) {
      console.log("qrText :>> ", qrText);
      const qrCodeDataURL = await QRCode.toDataURL(qrText);
      editorRes.selection.insertImage(qrCodeDataURL);
      setQrText(""); // Reset the input field
      setIsModalVisible(false); // Close the modal
      setUrlError("");
    } else {
      setUrlError("Please enter a valid URL.");
    }
  };

  const config = useMemo(
    () => ({
      readonly: readonly,
      disabled: readonly,
      isPhisingUi: isPhisingUi,
      placeholder: "",
      style: {
        background: "white",
        color: "#828282",
        minHeight: "750px",
      },
      buttons: readonly
        ? []
        : [
            "source",
            "|",
            "bold",
            "italic",
            "underline",
            "strikethrough",
            "|",
            "ul",
            "ol",
            "|",
            "font",
            "fontsize",
            "paragraph",
            "|",
            "lineHeight",
            "superscript",
            "subscript",
            "classSpan",
            "file",
            "image",
            "video",
            "spellcheck",
            "cut",
            "copy",
            "paste",
            "selectall",
            "copyformat",
            "hr",
            "table",
            "link",
            "symbols",
            "indent",
            "outdent",
            "left",
            "brush",
            "undo",
            "redo",
            "find",
            "fullsize",
            "preview",
            "print",
            "about",
          ],
      extraButtons: isShowQAcode
        ? [
            {
              name: "qrcode",
              iconURL: "https://img.icons8.com/ios/50/000000/qr-code.png",
              exec: (editorInstance: any) => {
                setEditorRes(editorInstance);
                setIsModalVisible(true);
              },
              tooltip: "Generate QR Code",
            },
          ]
        : [],
      iframeCSSLinks: [],
    }),
    [readonly, isShowQAcode]
  );

  useEffect(() => {
    setContent(editorData || "");
  }, [editorData]);

  const handleChange = (newContent: string) => {
    setContent(newContent);
    handleEditorChange(newContent);
  };

  return (
    <div
      // className={classNames("editor-card", {
      //   "phising-editor": isPhisingUi,
      //   "notification-editor": isNotficationUi,
      // })}
      className="editor-card"
    >
      <JoditEditor
        ref={editor}
        value={content}
        config={config}
        onBlur={() => {}}
        onChange={handleChange}
      />
      <Modal
        title="Generate QR Code"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsModalVisible(false)}>
            Cancel
          </Button>,
          <Button key="generate" type="primary" onClick={generateQRCode}>
            Generate
          </Button>,
        ]}
      >
        <Input
          placeholder="Enter text or URL for QR Code"
          value={qrText}
          onChange={(e) => {
            setQrText(e.target.value);
            setUrlError("");
          }}
        />
        {urlError && <div className="text-red-500">{urlError}</div>}
      </Modal>
    </div>
  );
};

export default Editor;
