import { BeseAxios } from "../../../web-constants/constants";
export const Serviceuri = "inventory/section/get/active";
export const Categoryuri = "inventory/category/get-active/by/section";
export const CategoryTreeuri = "inventory/category/get/category-tree";

export const CategoryTreeById = async (sectionId: number) => {
  try {
    const response: any = await BeseAxios.get(CategoryTreeuri, {
      params: { sectionId: sectionId },
    });
    console.log("@@@HeaderCatresponse", response);
    return response.data;
  } catch (error) {
    console.error("Error fetching CategoryTree:", error);
    throw error;
  }
};

CategoryTreeById(1);
