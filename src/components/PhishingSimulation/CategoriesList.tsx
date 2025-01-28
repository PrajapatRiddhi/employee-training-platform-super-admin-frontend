import {Button, Divider} from "antd";
import {FC, ReactNode, useEffect, useMemo, useState} from "react";
import CategoriesDeleteIcon from "../Icons/CategoriesDeleteIcon";
import CategoriesEditIcon from "../Icons/CategoriesEditIcon";
import {useLoader} from "../Loader/LoaderProvider";
import axiosInstance from "@/src/interceptors/Axios";
import {API_ENDPOINTS} from "@/src/interceptors/apiName";
import {useNotification} from "../Notification";
import {handleCategoryType} from "@/src/helper/Utils";
import ActionsModal from "../Modals/ActionsModal";
import DraftsIcon from "../Icons/DraftsIcon";
import CustomIcon from "../Icons/CustomIcon";
import PlusIconWhite from "../Icons/PlusIconWhite";
import AddCategories from "./AddCategories";

interface CategoriesListProps {
  selectedSystem?: boolean;
  setSelectedCategories?: any;
  selectedCategories?: any;
  isSurveysCategories?: boolean;
  isModulesCounts?: any;
  icon?: ReactNode;
  totalItems?: number;
  isNewDataCount?: {
    categoryId: string | null;
    categoryCount: number;
  }[];
}

const CategoriesList: FC<CategoriesListProps> = ({
  selectedSystem,
  setSelectedCategories,
  selectedCategories,
  isSurveysCategories,
  isModulesCounts,
  icon,
  totalItems,
  isNewDataCount,
}) => {
  const loaderContext = useLoader();
  const {showLoader, hideLoader} = loaderContext;
  const [categoriesDetails, setCategoriesDetails] = useState<any>([]);
  const [openCategorie, setOpenCategorie] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<any>(null);
  const notificationContext = useNotification();
  const handleNotifications: any = notificationContext?.handleNotifications;
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [selectRecord, setSelectRecord] = useState<any>();
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const updateCategoryCount = sessionStorage.getItem("isMoveCategories");
  const handleDeleteClick = (record: any) => {
    setSelectRecord(record);
    setIsDeleteModalVisible(true);
  };

  const mappedCategories = useMemo(() => {
    return categoriesDetails.map((category: any) => {
      const matcheValue = isNewDataCount?.find(
        (el) => el.categoryId === category.uniqueId
      )?.categoryCount;
      return {
        ...category,
        categoryCount:
          matcheValue != undefined
            ? Number(matcheValue)
            : isNewDataCount === undefined
            ? category.categoryCount
            : 0,
      };
    });
  }, [categoriesDetails, isNewDataCount]);

  console.log("temp", mappedCategories, isNewDataCount, categoriesDetails);

  const handleCategorie = () => {
    setOpenCategorie(!openCategorie);
    if (categoryToEdit) {
      setCategoryToEdit(null);
    }
  };

  useEffect(() => {
    showLoader();
    fetchCategorieDetails();
  }, [selectedSystem, currentPage, updateCategoryCount]);

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
        keyword: "",
        limit: pageLimit,
        page: currentPage,
        isSystem: selectedSystem,
        sort: [
          {
            prop: "status",
            dir: "ASC",
          },
        ],
      });
      let categoriesList: any = await axiosInstance.post(
        `${API_ENDPOINTS.Get_Categorie}`,
        data
      );
      sessionStorage.removeItem("isMoveCategories");
      if (categoriesList?.settings?.success) {
        setCategoriesDetails(categoriesList?.data);
        setTotalPages(Math.ceil(categoriesList?.settings?.count / pageLimit));
      }
      hideLoader();
    } catch (error) {
      sessionStorage.removeItem("isMoveCategories");
      console.log(error, "Something Went Wrong.");
      hideLoader();
    }
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
        fetchCategorieDetails();
      } else {
        handleNotifications("error", updateCategory?.settings?.message, "", 3);
      }
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handleBack = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
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

  const handleFilterCategories = (item: any) => {
    setSelectedCategories(item);
  };

  const totalCategoryCount = mappedCategories?.reduce(
    (sum: any, e: any) => sum + e?.categoryCount,
    0
  );

  return (
    <div>
      <div className="rounded-[14px] bg-[#FFFFFF] border border-[#E8E8E8] !w-full !h-full">
        <div className="p-5">
          <div className="flex justify-between !h-full items-center">
            <div className="!text-[16px] font-bold text-[#333333] text-nowrap flex mr-5">
              My Categories
            </div>
            {!selectedSystem && (
              <div
                className="rounded-[4px] border border-[#4379EE] text-[#4379EE] text-[16px] flex justify-center items-center p-[8px] cursor-pointer h-[40px]"
                onClick={handleCategorie}
              >
                <PlusIconWhite color="#4379EE" />
                Add
              </div>
            )}
          </div>
        </div>
        <div className="w-full sidebar overflow-auto">
          {mappedCategories?.length > 0 && (
            <>
              <div
                onClick={() => handleFilterCategories(null)}
                className={`flex justify-between items-center p-5 cursor-pointer transition-colors duration-300 group ${
                  selectedCategories == null
                    ? "bg-[#e7eefe] text-blue-500"
                    : "hover:bg-[#4880FF21]"
                }`}
              >
                <div>
                  <div className="flex gap-2">
                    <DraftsIcon
                      color={selectedCategories == null ? "#4379EE" : "#828282"}
                    />
                    <div
                      className={`text-[14px] font-[600] mt-1 ${
                        selectedCategories == null
                          ? "text-blue-500"
                          : "text-[#828282] group-hover:text-[#4379EE]"
                      }`}
                    >
                      Drafts
                    </div>
                  </div>
                </div>
                <div>{isModulesCounts}</div>
              </div>

              <div className="flex justify-between items-center p-5 cursor-pointer transition-colors duration-300 group hover:bg-[#4880FF21]">
                <div className="text-[14px] font-[600] text-[#828282] group-hover:text-[#4379EE]">
                  <div className="flex gap-2">
                    <CustomIcon color="#4379EE" />
                    <div
                      className={`text-[14px] font-[600] mt-1 ${
                        selectedCategories == null
                          ? "text-blue-500"
                          : "text-[#828282] group-hover:text-[#4379EE]"
                      }`}
                    >
                      Custom
                    </div>
                  </div>
                </div>
                <div className="text-[14px] font-[600] text-[#828282] group-hover:text-[#4379EE]">
                  {totalCategoryCount}
                </div>
              </div>

              <Divider className="m-0 h-[1px]" />
              {mappedCategories.map((category: any, index: number) => (
                <div
                  key={category?.categoryName + category?.categoryCount}
                  className="relative group"
                >
                  <div
                    onClick={() => handleFilterCategories(category?.uniqueId)}
                    className={`flex justify-between items-center p-5 cursor-pointer transition-colors duration-300 ${
                      selectedCategories === category?.uniqueId
                        ? "bg-[#e7eefe] text-blue-500"
                        : "hover:bg-[#4880FF21]"
                    }`}
                  >
                    <div className="flex-1">
                      <div
                        className={`flex flex-wrap items-center gap-[5px] text-[14px] font-[600] ${
                          selectedCategories === category?.uniqueId
                            ? "text-blue-500"
                            : "text-[#828282] group-hover:text-[#4379EE]"
                        }`}
                      >
                        {/* {
                          icon && icon
                        } */}
                        <span
                          className={`${
                            isSurveysCategories
                              ? "block break-words max-w-[150px]"
                              : "block break-words max-w-[200px]"
                          }`}
                        >
                          {category?.categoryName}
                        </span>
                      </div>
                    </div>

                    <div
                      className={`text-[14px] font-[700] ${
                        selectedCategories === category?.uniqueId
                          ? "text-blue-500"
                          : "text-[#828282] group-hover:text-[#4379EE]"
                      }`}
                    >
                      {category?.categoryCount || 0}
                    </div>

                    <div className="absolute right-5 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <CategoriesEditIcon
                        onClick={() => editCategoriesList(category)}
                      />
                      {!selectedSystem ? (
                        <CategoriesDeleteIcon
                          onClick={() => {
                            handleDeleteClick(category);
                          }}
                        />
                      ) : null}
                    </div>
                  </div>
                  {index < mappedCategories.length - 1 && (
                    <Divider className="m-0 h-[1px]" />
                  )}
                </div>
              ))}
            </>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mb-2">
            <Button.Group>
              <Button
                disabled={currentPage <= 1}
                onClick={handleBack}
                className="text-[14px] font-bold"
                value="small"
              >
                Back
              </Button>
              <Button
                disabled={currentPage >= totalPages}
                onClick={handleNext}
                className="text-[14px] font-bold"
                value="small"
              >
                Next
              </Button>
            </Button.Group>
          </div>
        )}
      </div>

      {openCategorie && (
        <div>
          <AddCategories
            handleCategorie={handleCategorie}
            openCategorie={openCategorie}
            fetchCategorieDetails={fetchCategorieDetails}
            categoryToEdit={categoryToEdit}
            mode={categoryToEdit ? "edit" : "add"}
            onEditSubmit={handleEditSubmit}
          />
        </div>
      )}
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
    </div>
  );
};

export default CategoriesList;
