import { useEffect, useState } from "react";

export const useSubCategs = (categoryId: string) => {
  const [subCategs, setSubCategs] = useState<any[]>([]);

  useEffect(() => {
    if (categoryId) {
      fetchSubCategs();
    }
  }, [categoryId]);

  const fetchSubCategs = async () => {
    try {
      const response = await fetch(
        `https://pochieshomeservices.com/RestApi/api/subCategory/subcategoryList?key=incitykey!&cat_id=${categoryId}`
      );
      const result = await response.json();
      if (result.data && result.data.length) {
        setSubCategs(result.data);
      }
    } catch (err) {
      console.log("Fetch SubCategories Error", err);
    }
  };

  return { subCategs };
};
