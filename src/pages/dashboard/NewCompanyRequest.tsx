import {FC, useState} from "react";
import CommonTable from "@/src/components/CommonTable";
import DeleteIcon from "@/src/components/Icons/DeleteIcon";
import ActionsModal from "@/src/components/Modals/ActionsModal";

const newCompanyReqData = [
  {
    name: "Quick Fix Solutions",
    contactNumber: "+92 56595 88949",
    email: "john.doe@example.com",
    addedDate: "Nov 7, 2021",
  },
  {
    name: "Quick Fix Solutions",
    contactNumber: "+92 56595 88949",
    email: "john.doe@example.com",
    addedDate: "Nov 7, 2021",
  },
  {
    name: "Quick Fix Solutions",
    contactNumber: "+92 56595 88949",
    email: "john.doe@example.com",
    addedDate: "Nov 7, 2021",
  },
  {
    name: "Quick Fix Solutions",
    contactNumber: "+92 56595 88949",
    email: "john.doe@example.com",
    addedDate: "Nov 7, 2021",
  },
  {
    name: "Quick Fix Solutions",
    contactNumber: "+92 56595 88949",
    email: "john.doe@example.com",
    addedDate: "Nov 7, 2021",
  },
];

const NewCompanyRequest: FC = () => {
  const [source, setSource] = useState(newCompanyReqData);
  const [deleteUI, setDeleteUI] = useState(false);

  const handleDeleteUI = () => {
    setDeleteUI(!deleteUI);
  };

  const columns = [
    {
      title: "Company Name",
      dataIndex: "name",
    },
    {
      title: "Email Address",
      dataIndex: "email",
    },
    {
      title: "Contact Number",
      dataIndex: "contactNumber",
    },
    {
      title: "Date",
      dataIndex: "addedDate",
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text: any, record: any) => (
        <div className="space-x-[10px] flex ">
          <span onClick={handleDeleteUI} className="cursor-pointer">
            <DeleteIcon />
          </span>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="w-full  mt-[30px]">
        <CommonTable
          showSettingIcon={false}
          columns={columns}
          apiData={source}
          placeholderTextClass="search"
          rowSelection={true}
          showSearchInput={false}
        />
        <ActionsModal
          title=""
          type="delete"
          isOpen={deleteUI}
          onCancel={() => setDeleteUI(false)}
          onOk={handleDeleteUI}
          footer={false}
          centered={true}
          closable={false}
          maskClosable={false}
          className="delete-modal"
          cancelBtnClass="cancleBtnAction"
          cancelBtnClick={() => setDeleteUI(false)}
          cancelButtonProps="Cancel"
          saveBtnClass="saveBtnAction"
          saveBtnClick={handleDeleteUI}
          mainTitle="Are you sure?"
        />
      </div>
    </>
  );
};

export default NewCompanyRequest;
