import { set } from 'lodash';
import React, { useEffect, useState } from 'react';

interface FileUploadProps {
  labelText?: string;
  buttonText?: string;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  accept?: string;
  name?: string;
  file: File | null;
}

const FileUpload: React.FC<FileUploadProps> = ({
  labelText = "Please select a file",
  buttonText = "Browse",
  onFileChange,
  accept = "*",
  name = "document",
  file,
}) => {
const [fileName, setName] = useState<string>("");
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files ? event.target.files[0].name : null;
    console.log('selectedFile :>> ', selectedFile);
    setName(selectedFile ? selectedFile : "");
    if (selectedFile) {
      onFileChange(event);  //access file e.g. event.target.files[0]
    }
  }
  useEffect(()=>{
    if(!file){
      setName("")
    }
  },[file])
  return (
    <label className="flex border rounded-[5px] cursor-pointer !h-[40px]">
      <div className="w-full pl-[12px] flex justify-start items-center">
        {fileName ? fileName : labelText}
      </div>
      <div className="flex justify-center items-center px-[16px] py-[8px] bg-[#f2f2f2]">
        {buttonText}
      </div>
      <input
        id={name}
        name={name}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
    </label>
  );
};

export default FileUpload;
