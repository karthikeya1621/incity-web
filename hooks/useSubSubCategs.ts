import { useEffect, useState } from "react";

export const useSubSubCategs = (
  subCategoryId?: string,
  categoryId?: string
) => {
  const [subSubCategs, setSubSubCategs] = useState<any[]>([]);

  useEffect(() => {
    if (subCategoryId || categoryId) {
      fetchSubSubCategs();
    }
  }, [subCategoryId, categoryId]);

  const fetchSubSubCategs = async () => {
    const urlParams = new URLSearchParams();
    if (categoryId) urlParams.append("cat_id", categoryId);
    if (subCategoryId) urlParams.append("cat_sub_id", subCategoryId);
    try {
      const response = await fetch(
        `https://admin.incity-services.com/RestApi/api/SubmCategory/SubmcategoryList?key=incitykey!&${urlParams.toString()}`
      );
      const result = await response.json();
      if (result.data && result.data.length) {
        setSubSubCategs(result.data);
      } else {
        setSubSubCategs([]);
      }
    } catch (err) {
      console.log("Fetch SubSubCategories Error", err);
    }
  };

  return { subSubCategs };
};
