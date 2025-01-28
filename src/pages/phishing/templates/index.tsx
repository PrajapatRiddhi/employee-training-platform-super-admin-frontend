import CommonTable from "@/src/components/CommonTable";
import CommonPagination from "@/src/components/CommonTable/paginnation";
import DeleteIcon from "@/src/components/Icons/DeleteIcon";
import EditIcon from "@/src/components/Icons/EditIcon";
import RedFlags from "@/src/components/Icons/RedFlags";
import ViewIcon from "@/src/components/Icons/ViewIcon";
import SidebarLayout from "@/src/components/Layout/SidebarLayout";
import {useLoader} from "@/src/components/Loader/LoaderProvider";
import CommonModal from "@/src/components/Modals";
import ActionsModal from "@/src/components/Modals/ActionsModal";
import {useNotification} from "@/src/components/Notification";
import AddCategories from "@/src/components/PhishingSimulation/AddCategories";
import RateComponent from "@/src/components/RateComponent";
import SystemCompanySwitch from "@/src/components/SystemCompanySwitch";
import {camelCase} from "@/src/helper/Utils";
import {API_ENDPOINTS} from "@/src/interceptors/apiName";
import axiosInstance from "@/src/interceptors/Axios";
import {Button} from "antd";
import moment from "moment";
import {useRouter} from "next/router";
import React from "react";
import {FC, useEffect, useState} from "react";

const TemplateListing: FC = () => {
  const router = useRouter();
  const getCurrentPage = sessionStorage.getItem("currentPage")
    ? sessionStorage.getItem("currentPage")
    : 1;
  const [isSystem, setIsSystem] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState<any>(getCurrentPage);
  const [pageLimit, setPageLimit] = useState<any>(10);
  const [totalItems, setTotalItems] = useState(10);
  const [emailTemplateList, setEmailTemplateList] = useState<any>([]);
  const [sortedColumn, setSortedColumn] =
    useState<string>("phishingTemplateId");
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC" | null>("DESC");
  const [category, setCategory] = useState<any>(null);
  const [categoryList, setCategoryList] = useState<any>([]);
  const [selectRecord, setSelectRecord] = useState<any>();
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [selectDifficultyRating, setSelectDifficultyRating] =
    useState<any>(null);
  const difficultyRatingOptions = [1, 2, 3, 4, 5];
  const notificationContext = useNotification();
  const handleNotifications: any = notificationContext?.handleNotifications;
  const [openCategorie, setOpenCategorie] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<any>(null);
  const [templateDetails, setTemplateDetails] = useState<any>();
  const [selectedEditId, SetSelectedEditId] = useState(null);
  const loaderContext = useLoader();
  const {showLoader, hideLoader} = loaderContext;
  const [modalOpen, setModalOpen] = useState(false);
  const CloseModal = () => {
    setModalOpen(!modalOpen);
  };
  const handleCategorie = () => {
    setOpenCategorie(!openCategorie);
    if (categoryToEdit) {
      setCategoryToEdit(null);
    }
  };
  useEffect(() => {
    fetchTemplateList();
  }, [
    currentPage,
    searchInput,
    sortedColumn,
    sortOrder,
    searchInput,
    isSystem,
    category,
    selectDifficultyRating,
  ]);

  useEffect(() => {
    fetchListing();
  }, [isSystem]);

  const fetchListing = async () => {
    try {
      let categoryList: any = await axiosInstance.get(
        `${
          API_ENDPOINTS.DROPDOWN_LIST_CATEGORIES
        }?categoryType=PHISHING_TEMPLATES&isSystem=${isSystem ? 1 : 0}`
      );
      if (categoryList?.settings?.success) {
        setCategoryList(categoryList.data);
      }
    } catch (error) {
      console.log("error :>> ", error);
    }
  };

  const handleDeleteClick = (record: any) => {
    setSelectRecord(record);
    setIsDeleteModalVisible(true);
  };

  const handleDelete = async () => {
    try {
      if (!selectRecord) return;
      const delTemp: any = await axiosInstance.delete(
        `${API_ENDPOINTS.DELETE_PHISHING_TEMPLATE}/${selectRecord?.phishingTemplateId}`
      );

      if (delTemp?.settings?.success) {
        handleNotifications(`success`, `${delTemp?.settings?.message}`, ``, 3);

        fetchTemplateList();
        setIsDeleteModalVisible(false);
      }
    } catch (error) {}
  };
  const fetchTemplateList = async () => {
    try {
      let config: any = {
        page: currentPage,
        limit: pageLimit,
        keyword: searchInput,
        isSystem: isSystem,
        filters: [],
        sort: [{prop: sortedColumn, dir: sortOrder}],
      };
      console.log("category :>> ", category);
      if (category) {
        config["filters"] = [
          ...config["filters"],
          {
            key: "categoryId",
            value: category,
          },
        ];
      }
      if (selectDifficultyRating) {
        config["filters"] = [
          ...config["filters"],
          {
            key: "difficultyRating",
            value: selectDifficultyRating,
          },
        ];
      }
      let templateListings: any = await axiosInstance.post(
        API_ENDPOINTS.LIST__PHISHING_TEMPLATE,
        JSON.stringify(config)
      );
      if (templateListings?.settings?.success) {
        sessionStorage.removeItem("currentPage");
        setEmailTemplateList(templateListings.data);
        // setPageLimit(templateListings?.settings?.per_page);
        setTotalItems(templateListings?.settings?.count);
      }
    } catch (error) {
      console.log("error :>> ", error);
    }
  };

  const handleColumnSort = (column: string) => {
    if (column === sortedColumn) {
      setSortOrder(sortOrder === "ASC" ? "DESC" : "ASC");
    } else {
      setSortedColumn(column);
      setSortOrder("ASC");
    }
  };

  useEffect(() => {
    if (selectedEditId) fetchEmailTemplate();
  }, [selectedEditId]);

  const handleViewTempNotfication = (record: any) => {
    SetSelectedEditId(record);
    setModalOpen(true);
  };

  const fetchEmailTemplate = async () => {
    try {
      showLoader();
      let fetchPhishingTemplate: any = await axiosInstance.get(
        `${API_ENDPOINTS.GET_DETAILS_PHISHING_TEMPLATE}/${selectedEditId}`
      );
      if (fetchPhishingTemplate?.settings?.success) {
        setTemplateDetails(fetchPhishingTemplate?.data);
      }
      hideLoader();
    } catch (error) {
      console.log(error);
      hideLoader();
    }
  };

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
  const column = [
    {
      title: "Template Name",
      dataIndex: "templateName",
      sorter: emailTemplateList.length === 0 ? false : true,
      sortOrder: sortedColumn === "templateName" ? sortOrder : undefined,
      onHeaderCell: () => ({
        onClick:
          emailTemplateList.length > 0
            ? () => handleColumnSort("templateName")
            : undefined,
      }),
      render: (text: any, record: any) => (
        <div className="gap-[5px]">
          <span
            className="text-[14px] font-[600] text-wrap break-words whitespace-nowrap overflow-hidden text-ellipsis"
            title={text}
          >
            {text}
          </span>
        </div>
      ),
    },
    {
      title: "Updated On",
      dataIndex: "modifiedDate",
      sorter: emailTemplateList.length === 0 ? false : true,
      sortOrder: sortedColumn === "modifiedDate" ? sortOrder : undefined,
      onHeaderCell: () => ({
        onClick:
          emailTemplateList.length > 0
            ? () => handleColumnSort("modifiedDate")
            : undefined,
      }),
      render: (text: any, record: any) => (
        <span className="text-[14px] font-[600] ">
          {moment.unix(record?.modifiedDate / 1000).format("MM/DD/YYYY")}
        </span>
      ),
    },
    {
      title: "Difficulty",
      dataIndex: "difficultyRating",
      sorter: emailTemplateList.length === 0 ? false : true,
      sortOrder: sortedColumn === "difficultyRating" ? sortOrder : undefined,
      onHeaderCell: () => ({
        onClick:
          emailTemplateList.length > 0
            ? () => handleColumnSort("difficultyRating")
            : undefined,
      }),
      render: (text: any, record: any) => (
        <span className="text-[14px] font-[600] flex items-center whitespace-nowrap ">
          <RateComponent disabled={true} value={record?.difficultyRating} />
        </span>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      sorter: emailTemplateList.length === 0 ? false : true,
      sortOrder: sortedColumn === "category" ? sortOrder : undefined,
      onHeaderCell: () => ({
        onClick:
          emailTemplateList.length > 0
            ? () => handleColumnSort("category")
            : undefined,
      }),
      render: (text: any, record: any) => (
        <span className="text-[14px] font-[600] ">
          {camelCase(record?.category)}
        </span>
      ),
    },
    {
      title: "Action",
      dataIndex: "templateName",
      render: (text: any, record: any) => (
        <div className="space-x-[10px] flex ">
          {!isSystem && (
            <span
              className="cursor-pointer"
              onClick={() => {
                router.push(`/phishing/template/${record?.phishingTemplateId}`);
                sessionStorage.setItem("currentPage", currentPage);
              }}
            >
              <EditIcon />
            </span>
          )}
          <span
            className="cursor-pointer"
            onClick={() =>
              handleViewTempNotfication(record?.phishingTemplateId)
            }
          >
            <ViewIcon />
          </span>
          {!isSystem && (
            <span
              className="cursor-pointer"
              onClick={() => {
                handleDeleteClick(record);
              }}
            >
              <DeleteIcon />
            </span>
          )}
        </div>
      ),
    },
  ];
  const handlePageChange = (page: React.SetStateAction<number>) => {
    setCurrentPage(page);
  };

  // useEffect(() => {
  //   showLoader();
  //   fetchCategorieDetails();
  // }, []);

  const handleEditSubmit = async (values: any) => {
    try {
      let updateCategory: any = await axiosInstance.put(
        `${API_ENDPOINTS.Update_Categorie}/${categoryToEdit.id}`,
        JSON.stringify({...values})
      );

      if (updateCategory?.settings?.success) {
        handleNotifications("success", "Category updated successfully", "", 3);
      } else {
        handleNotifications("error", updateCategory?.settings?.message, "", 3);
      }
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };
  const addTargetBlank = (html: any) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    const anchorTags = div.querySelectorAll("a");
    anchorTags.forEach((anchor) => {
      anchor.setAttribute("target", "_blank");
      anchor.setAttribute("rel", "noopener noreferrer");
    });
    return div.innerHTML;
  };

  const sendTestEmail = async () => {
    try {
      showLoader();
      const testEmail: any = await axiosInstance.get(
        `${API_ENDPOINTS.TEST_EMAIL_PHISHING_TEMPLATES}/${templateDetails?.phishingTemplateId}`
      );
      if (testEmail?.settings?.success) {
        handleNotifications("success", testEmail?.settings?.message, "", 3);
        hideLoader();
      }
    } catch (error) {
      hideLoader();
    }
  };
  return (
    <SidebarLayout>
      <div className="w-full">
        <div className="flex justify-between items-center mb-[20px]">
          <div className="heading-title">Phishing Templates</div>
          {!isSystem && (
            <div className="flex gap-[10px]">
              <Button
                type="primary"
                className="custom-heading-btn secondary gap-[10px]"
                onClick={() => router.push("/phishing/template/category")}
              >
                Category
              </Button>
              <Button
                type="primary"
                className="custom-heading-btn "
                onClick={() => router.push("/phishing/template/add")}
              >
                Create Phishing Templates
              </Button>
            </div>
          )}
        </div>
        {/* <Card className="custom-card mt-[20px]"> */}

        <CommonTable
          columns={column}
          // rowSelection={rowSelection}
          rowKey={(record) => record.phishingTemplateId}
          apiData={emailTemplateList}
          placeholderTextClass="search"
          searchBoxStyle={{
            borderRadius: "4px",
            border: "1px solid  #E8E8E8",
            background: "#F5F6FA",
            color: "#828282",
          }}
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          filter={true}
          child={
            <>
              <div className="flex justify-between">
                <div>
                  <SystemCompanySwitch
                    secondTab="Pre-defined Templates"
                    firstTab="User Defined Templates"
                    onChange={(selected) =>
                      selected === "Pre-defined Templates"
                        ? setIsSystem(true)
                        : setIsSystem(false)
                    }
                  />
                </div>
              </div>
            </>
          }
          child2={
            <>
              {/* <div className="text-[16px] font-[600] text-[#F2994A] flex space-x-[5px] text-nowrap items-center mx-[20px]">
                <SettingIconTable /> 
                <span>Template Editor(0)</span>
              </div> */}
            </>
          }
          additionalFilters={[
            {
              defaultValue: "Category",
              value: category,
              placeholder: "Select Category",
              onChange: (value) => setCategory(value),
              options: categoryList.map((option: any) => ({
                value: option.myCategoryId,
                label: camelCase(option.categoryName),
              })),
            },
            {
              defaultValue: "Difficulty",
              value: selectDifficultyRating,
              placeholder: "Select Difficulty",
              onChange: (value) => setSelectDifficultyRating(value),
              options: difficultyRatingOptions.map((option: any) => ({
                value: option,
                label: option,
              })),
            },
          ]}
          resetFilter={() => {
            setCategory(null);
            setSelectDifficultyRating(null);
          }}
        />
      </div>
      <CommonPagination
        className="pagination"
        currentPage={currentPage}
        totalItems={totalItems}
        itemsPerPage={pageLimit}
        onPageChange={handlePageChange}
        onShowSizeChange={undefined}
      />
      <ActionsModal
        title=""
        type="delete"
        isOpen={isDeleteModalVisible}
        onCancel={() => setIsDeleteModalVisible(false)}
        onOk={handleDelete}
        footer={false}
        centered={true}
        closable={false}
        maskClosable={true}
        className="delete-modal"
        cancelBtnClass="cancleBtnAction"
        cancelBtnClick={() => setIsDeleteModalVisible(false)}
        cancelButtonProps="Cancel"
        saveBtnClass="saveBtnAction"
        saveBtnClick={handleDelete}
        saveButtonProps="Delete"
        mainTitle="Are you sure?"
      />
      {openCategorie && (
        <div>
          <AddCategories
            handleCategorie={handleCategorie}
            openCategorie={openCategorie}
            categoryToEdit={categoryToEdit}
            mode={categoryToEdit ? "edit" : "add"}
            onEditSubmit={handleEditSubmit}
          />
        </div>
      )}

      {modalOpen && templateDetails && (
        <CommonModal
          onCancel={CloseModal}
          isOpen={modalOpen}
          title={
            <div className="text-[#000000] font-[600] text-[20px]">
              {templateDetails?.subject}
            </div>
          }
          className="email-preview"
          width={850}
          footer={null}
        >
          <div className="flex justify-between w-full bg-[#F2F2F2] h-[176px] py-[12px] px-[30px]">
            <div className="flex flex-col text-[14px] text-[#4F4F4F]">
              <div>
                <span className="text-[#828282] mr-[5px]">From:</span>
                {`<${templateDetails?.fromEmail}>`}
              </div>
              <div>
                <span className="text-[#828282] mr-[5px]">Reply to:</span>{" "}
                {`${templateDetails?.senderName} <${templateDetails?.senderEmail}>`}
              </div>
              <div>
                <span className="text-[#828282] mr-[5px]">Subject:</span>{" "}
                {templateDetails?.subject}
              </div>
            </div>

            <div className="max-w-[219px] w-full flex flex-col text-[14px] text-[#4F4F4F]">
              <div className="text-wrap text-right">
                <span className="text-[#828282]">Template ID: &nbsp;</span>
                {templateDetails?.phishingTemplateId}
              </div>
              <Button
                className="bg-[#4379EE] !leading-none hover:!bg-[#355bcc] mr-[25px] hover:!text-[#fff] text-[#fff] w-fit h-[40px] flex items-center my-[17px] transition duration-300 ease-in-out text-[16px] font-[700]"
                icon={EMailIcon}
                onClick={sendTestEmail}
              >
                Send Me a Test Email
              </Button>
              <div className="flex items-center justify-end">
                <RedFlags />
                <span className="text-[12px] text[#828282]">
                  Toggle Red Flags
                </span>
              </div>
            </div>
          </div>
          <div
            className="main-body-contain"
            dangerouslySetInnerHTML={{
              __html: addTargetBlank(templateDetails?.fileContent),
            }}
          ></div>
          <div className="flex pb-[30px]">
            <Button
              className="email-preview-close-btn ml-auto mr-[30px]"
              onClick={CloseModal}
            >
              Close
            </Button>
          </div>
        </CommonModal>
      )}
    </SidebarLayout>
  );
};
export default TemplateListing;
