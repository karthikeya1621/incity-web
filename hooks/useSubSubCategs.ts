import { useEffect, useState } from "react";

export const useSubSubCategs = (subCategoryId: string) => {
  const [subSubCategs, setSubSubCategs] = useState<any[]>([]);

  useEffect(() => {
    if (subCategoryId) {
      fetchSubSubCategs();
    }
  }, [subCategoryId]);

  const fetchSubSubCategs = async () => {
    try {
      const response = await fetch(
        `https://pochieshomeservices.com/RestApi/api/SubmCategory/SubmcategoryList?key=incitykey!&cat_id_sub=${subCategoryId}`
      );
      const result = await response.json();
      if (result.data && result.data.length) {
        setSubSubCategs(result.data);
      }
    } catch (err) {
      console.log("Fetch SubSubCategories Error", err);
    }
  };

  return { subSubCategs };
};
