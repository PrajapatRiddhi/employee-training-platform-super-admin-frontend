import React from "react";
import {Button, Divider, Modal, Input} from "antd";
import {ErrorMessage, Form, Formik, FormikHelpers} from "formik";
import CustomInput from "../CustomInput";
import {CategoriesValidationSchema} from "@/src/helper/ValidationSchema";
import axiosInstance from "@/src/interceptors/Axios";
import {API_ENDPOINTS} from "@/src/interceptors/apiName";
import {useNotification} from "../Notification";
import {handleCategoryType} from "@/src/helper/Utils";

interface AddCategoriesProps {
  openCategorie: boolean;
  handleCategorie: () => void;
  fetchCategorieDetails?: () => void;
  categoryToEdit?: {categoryName: string; categoryType: string};
  mode: "add" | "edit";
  onEditSubmit?: (values: InitialValuesProps) => void;
}

const initialValues = {
  categoryName: "",
  categoryType: handleCategoryType(),
};

type InitialValuesProps = {
  categoryName: string;
  categoryType: string;
};

const AddCategories: React.FC<AddCategoriesProps> = ({
  openCategorie,
  handleCategorie,
  fetchCategorieDetails,
  categoryToEdit,
  mode,
  onEditSubmit,
}) => {
  const notificationContext = useNotification();
  const handleNotifications: any = notificationContext?.handleNotifications;

  const initialValues = {
    categoryName: categoryToEdit?.categoryName || "",
    categoryType: categoryToEdit?.categoryType || handleCategoryType(),
  };

  const handleSubmit = async (
    values: InitialValuesProps,
    {resetForm}: FormikHelpers<InitialValuesProps>
  ) => {
    try {
      if (mode === "add") {
        let submitCategories: any = await axiosInstance.post(
          `${API_ENDPOINTS.Create_Categorie}`,
          JSON.stringify({...values})
        );

        if (submitCategories?.settings?.success) {
          handleNotifications("success", " Category added successfully", "", 3);
          resetForm({values: initialValues});
          handleCategorie();
          if (fetchCategorieDetails) fetchCategorieDetails();
        } else {
          handleNotifications(
            "error",
            submitCategories?.settings?.message,
            "",
            3
          );
        }
      } else if (mode === "edit" && onEditSubmit) {
        // @ts-ignore
        const {parentCategoryId, ...editValues} = values;
        // @ts-ignore
        const editId = categoryToEdit?.myCategoryId;
        const updateCategories: any = await axiosInstance.put(
          `${API_ENDPOINTS.Update_Categorie}/${editId}`,
          JSON.stringify({...editValues})
        );

        if (updateCategories?.settings?.success) {
          handleNotifications(
            "success",
            "Category updated successfully",
            "",
            3
          );
          resetForm({values: initialValues});
          handleCategorie();
          if (fetchCategorieDetails) fetchCategorieDetails();
        } else {
          handleNotifications(
            "error",
            updateCategories?.settings?.message,
            "",
            3
          );
        }
        console.log(updateCategories?.settings?.message, "main-mes");
      }
    } catch (error: any) {
      console.log(error);
      handleNotifications("error", error?.message, "", 3);
      console.log(error?.message, "error?.message last");
    }
  };

  return (
    <Modal
      width={387}
      footer={null}
      className="model-custom-ui rounded-[26px]"
      title={
        <p className="text-[#000000] text-[20px] font-bold">
          {mode === "add" ? "Add New Category" : "Edit Category"}
        </p>
      }
      open={openCategorie}
      onCancel={handleCategorie}
    >
      <Divider />
      <div>
        <Formik
          initialValues={initialValues}
          validationSchema={CategoriesValidationSchema}
          onSubmit={handleSubmit}
        >
          {({isSubmitting, errors, values}) => (
            <Form className="w-full">
              <div className="flex items-center w-full space-x-2 mb-[20px]">
                <CustomInput
                  label="Category"
                  required
                  type="text"
                  name="categoryName"
                  as={Input}
                  className={errors.categoryName && " !border !border-red"}
                  size="large"
                  placeholder="Type here..."
                  status={errors.categoryName && "error"}
                  error={<ErrorMessage name="categoryName" />}
                  defaultValue={values.categoryName}
                  maxInput={255}
                />
              </div>

              <div>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  className="w-full bg-[#4379EE] rounded-[8px]"
                >
                  {mode === "add" ? "Add" : "Update"}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </Modal>
  );
};

export default AddCategories;
