import {FC, useEffect, useState} from "react";
import {Button} from "antd";
import {API_ENDPOINTS} from "@/src/interceptors/apiName";
import axiosInstance from "@/src/interceptors/Axios";
import {
  handleCategorySuccessMessage,
  handleCategoryType,
} from "@/src/helper/Utils";
import CommonSelect from "../CommonSelect";
import {useNotification} from "../Notification";

interface MoveCategoriesProps {
  selectedCheckboxIds: number[];
  fetchPhishingDestinationDetails: () => void;
  selectedSystem?: boolean;
  setSelectedCheckboxIDs?: any;
}

const MoveCategories: FC<MoveCategoriesProps> = ({
  selectedCheckboxIds,
  fetchPhishingDestinationDetails,
  selectedSystem,
  setSelectedCheckboxIDs,
}) => {
  const [categoriesList, setCategoriesList] = useState<any[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const notificationContext = useNotification();
  const handleNotifications: any = notificationContext?.handleNotifications;

  const fetchCategoriesList = async () => {
    try {
      const categoryType = handleCategoryType();
      let response: any = await axiosInstance.get(
        `${API_ENDPOINTS.DROPDOWN_LIST_CATEGORIES}?categoryType=${categoryType}`
      );
      if (response?.settings?.success) {
        setCategoriesList(response?.data);
      }
    } catch (error) {
      console.log(error, "Something Went Wrong.");
    }
  };

  const handleMoveCategories = async () => {
    if (!selectedCategoryId) {
      handleNotifications("warning", "Please select a category", "", 3);
      return;
    }

    try {
      const response = await axiosInstance.post(
        `${API_ENDPOINTS.Move_Categorie}`,
        {
          ids: selectedCheckboxIds,
          categoryId: selectedCategoryId,
          categoryType: handleCategoryType(),
        }
      );

      const moveCategories = response;
      // @ts-ignore
      if (moveCategories.settings?.success) {
        const successMessage = handleCategorySuccessMessage();
        handleNotifications("success", successMessage, "", 3);
        sessionStorage.setItem("isMoveCategories", "success");
        await fetchCategoriesList();
        fetchPhishingDestinationDetails();
        setSelectedCheckboxIDs([]);
      } else {
        handleNotifications(
          "error",
          // @ts-ignore
          moveCategories.settings?.message || "Something Went Wrong.",
          "",
          3
        );
      }
    } catch (error) {
      console.log(error, "Something Went Wrong.");
      handleNotifications("error", "Something Went Wrong.", "", 3);
    }
  };

  useEffect(() => {
    fetchCategoriesList();
  }, []);

  const categoryOptions =
    categoriesList &&
    categoriesList?.map((category) => ({
      label: category?.categoryName,
      value: category?.myCategoryId,
    }));

  return (
    <div className=" w-full flex gap-[8px]">
      <CommonSelect
        onChange={(value) => setSelectedCategoryId(value)}
        options={categoryOptions}
        defaultValue="Select Category"
        className="!w-[160px]"
      />
      {!selectedSystem && (
        <Button
          onClick={handleMoveCategories}
          className="w-fit rounded-[8px] h-[40px]  border border-[#4379EE] px-[32px] py-[8px] flex justify-center items-center text-[#4379EE] text-[16px] font-bold"
        >
          Move
        </Button>
      )}
    </div>
  );
};

export default MoveCategories;
