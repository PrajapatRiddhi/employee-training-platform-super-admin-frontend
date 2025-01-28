import CommonTable from "@/src/components/CommonTable";
import {useLoader} from "@/src/components/Loader/LoaderProvider";
import {API_ENDPOINTS} from "@/src/interceptors/apiName";
import axiosInstance from "@/src/interceptors/Axios";
import {FC, useEffect, useState} from "react";
import {useNotification} from "../Notification";
import moment from "moment";
import ActionsModal from "../Modals/ActionsModal";
import {handleCategoryType} from "@/src/helper/Utils";
import SystemCompanySwitch from "../SystemCompanySwitch";
import DeleteIcon from "../Icons/DeleteIcon";
import EditIcon from "../Icons/EditIcon";
import {Button, Input, Space} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import AddCategories from "./AddCategories";
import {useRouter} from "next/router";
import {AiOutlineCloseCircle} from "react-icons/ai";
import CommonPagination from "../CommonTable/paginnation";

interface CategorieListingTableProps {
  isRenderURL?: any;
}

const CategorieListingTable: FC<CategorieListingTableProps> = ({
  isRenderURL,
}) => {
  const [categoriesDetails, setCategoriesDetails] = useState<any>([]);
  const [searchInput, setSearchInput] = useState("");
  const notificationContext = useNotification();
  const handleNotifications: any = notificationContext?.handleNotifications;
  const loaderContext = useLoader();
  const {showLoader, hideLoader} = loaderContext;
  const [selectRecord, setSelectRecord] = useState<any>();
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isSystem, setIsSystem] = useState<boolean>(false);
  const [openCategorie, setOpenCategorie] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<any>(null);
  const [sortedColumn, setSortedColumn] = useState<string>("addedDate");
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC" | undefined>(
    "DESC"
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(10);
  const [totalItems, setTotalItems] = useState(26);

  useEffect(() => {
    fetchCategorieDetails();
  }, [currentPage, searchInput, isSystem, sortedColumn, sortOrder]);

  const fetchCategorieDetails = async () => {
    try {
      showLoader();
      const categoryType = await handleCategoryType();
      let data = JSON.stringify({
        filters: [
          {
            key: "categoryType",
            value: categoryType,
          },
        ],
        keyword: searchInput,
        limit: pageLimit,
        page: currentPage,
        isSystem: isSystem,
        sort: [{prop: sortedColumn, dir: sortOrder}],
      });
      let categoriesList: any = await axiosInstance.post(
        `${API_ENDPOINTS.Get_Categorie}`,
        data
      );
      sessionStorage.removeItem("isMoveCategories");
      if (categoriesList?.settings?.success) {
        setCategoriesDetails(categoriesList?.data);
        setTotalItems(categoriesList?.settings?.count);
      }
      hideLoader();
    } catch (error) {
      sessionStorage.removeItem("isMoveCategories");
      console.log(error, "Something Went Wrong.");
      hideLoader();
    }
  };

  const handleDeleteClick = (record: any) => {
    setSelectRecord(record);
    setIsDeleteModalVisible(true);
  };
  const handlePageChange = (page: React.SetStateAction<number>) => {
    setCurrentPage(page);
  };
  const handleCategorie = () => {
    setOpenCategorie(!openCategorie);
    if (categoryToEdit) {
      setCategoryToEdit(null);
    }
  };

  const handleDelete = async () => {
    try {
      if (!selectRecord) return;
      const delTemp: any = await axiosInstance.delete(
        `${API_ENDPOINTS.Delete_Categorie}/${selectRecord?.myCategoryId}`
      );

      if (delTemp?.settings?.success) {
        handleNotifications(`success`, `${delTemp?.settings?.message}`, ``, 3);

        fetchCategorieDetails();
        setIsDeleteModalVisible(false);
      }
    } catch (error) {}
  };

  const editCategoriesList = (category: any) => {
    setCategoryToEdit(category);
    setOpenCategorie(true);
  };
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

  const handleColumnSort = (column: string) => {
    if (column === sortedColumn) {
      setSortOrder(sortOrder === "ASC" ? "DESC" : "ASC");
    } else {
      setSortedColumn(column);
      setSortOrder("ASC");
    }
  };
  const column = [
    {
      title: "Category Name",
      dataIndex: "categoryName",
      sorter: categoriesDetails.length === 0 ? false : true,
      sortOrder: sortedColumn === "categoryName" ? sortOrder : undefined,
      onHeaderCell: () => ({
        onClick: () =>
          categoriesDetails.length === 0
            ? null
            : handleColumnSort("categoryName"),
      }),
      render: (text: any) => (
        <span className="text-[14px] font-[600]">{text}</span>
      ),
    },
    {
      title: "Created on",
      dataIndex: "addedDate",
      sorter: categoriesDetails.length === 0 ? false : true,
      sortOrder: sortedColumn === "addedDate" ? sortOrder : undefined,
      onHeaderCell: () => ({
        onClick: () =>
          categoriesDetails.length === 0 ? null : handleColumnSort("addedDate"),
      }),
      render: (text: any, record: any) => (
        <span className="text-[14px] font-[600] text-[#4F4F4F]">
          {moment
            .unix(record?.addedDate / 1000)
            .format("MMM D, YYYY, h:mm:ss A")}
        </span>
      ),
    },
    ...(!isSystem
      ? [
          {
            title: "Action",
            dataIndex: "contentId",
            render: (id: number, record: any) => (
              <div className="flex gap-2 cursor-pointer">
                <div onClick={() => editCategoriesList(record)}>
                  <EditIcon />
                </div>
                <div
                  onClick={() => {
                    handleDeleteClick(record);
                  }}
                >
                  <DeleteIcon />
                </div>
              </div>
            ),
          },
        ]
      : []),
  ];

  return (
    <div>
      <div className="flex justify-between items-center">
        <Space className="pt-[10px] pb-[30px]">
          {isRenderURL}
          <div className="text-gray-700 text-[22px] font-semibold leading-6">
            Categories
          </div>
        </Space>
        {!isSystem ? (
          <Button
            type="primary"
            htmlType="submit"
            className="common-button Nunito Sans common-button-light-blue h-[40px]"
            icon={<PlusOutlined />}
            onClick={handleCategorie}
          >
            Add New Category
          </Button>
        ) : (
          ""
        )}
      </div>
      <div>
        <CommonTable
          columns={column}
          apiData={categoriesDetails}
          showSearchInput={false}
          child2={
            <div>
              {" "}
              <Input
                className="categories-search-input h-full custom-manage-courses-input"
                placeholder="Search"
                prefix={
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                    >
                      <path
                        d="M17.9417 17.0583L14.7409 13.8575C15.8109 12.5883 16.4583 10.9525 16.4583 9.16667C16.4583 5.14583 13.1875 1.875 9.16667 1.875C5.14583 1.875 1.875 5.14583 1.875 9.16667C1.875 13.1875 5.14583 16.4583 9.16667 16.4583C10.9525 16.4583 12.5884 15.8108 13.8575 14.7408L17.0583 17.9417C17.18 18.0633 17.34 18.125 17.5 18.125C17.66 18.125 17.82 18.0642 17.9417 17.9417C18.1859 17.6983 18.1859 17.3025 17.9417 17.0583ZM3.125 9.16667C3.125 5.835 5.835 3.125 9.16667 3.125C12.4983 3.125 15.2083 5.835 15.2083 9.16667C15.2083 12.4983 12.4983 15.2083 9.16667 15.2083C5.835 15.2083 3.125 12.4983 3.125 9.16667Z"
                        fill="#BDBDBD"
                      />
                    </svg>
                  </span>
                }
                value={searchInput}
                onChange={(e: any) => setSearchInput(e.target.value)}
                suffix={
                  searchInput && (
                    <AiOutlineCloseCircle
                      className="hover:text-gray-500 cursor-pointer !text-[#BDBDBD]"
                      onClick={() => setSearchInput("")}
                    />
                  )
                }
              />
            </div>
          }
        />
        <CommonPagination
          className="pagination"
          currentPage={currentPage}
          totalItems={totalItems}
          itemsPerPage={pageLimit}
          onPageChange={handlePageChange}
          onShowSizeChange={undefined}
        />
      </div>

      <ActionsModal
        title=""
        type="delete"
        isOpen={isDeleteModalVisible}
        onCancel={() => setIsDeleteModalVisible(false)}
        onOk={handleDelete}
        footer={false}
        centered={true}
        closable={false}
        maskClosable={false}
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
            fetchCategorieDetails={fetchCategorieDetails}
          />
        </div>
      )}
    </div>
  );
};

export default CategorieListingTable;
