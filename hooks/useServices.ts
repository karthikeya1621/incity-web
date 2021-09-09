import { useEffect, useState } from "react";

export const useServices = (
  subsubcatid: string,
  categid?: string,
  subSubCategoriesLoaded?: boolean
) => {
  const [services, setServices] = useState<any[]>([]);

  useEffect(() => {
    if (subsubcatid) {
      fetchServices();
    }
  }, [subsubcatid]);

  useEffect(() => {
    if (categid && subsubcatid === undefined && subSubCategoriesLoaded) {
      fetchServicesByCategory();
    }
  }, [categid, subSubCategoriesLoaded]);

  const fetchServices = async () => {
    try {
      const response = await fetch(
        `https://admin.incity-services.com/RestApi/api/services/serviceList?key=incitykey!&sub_sub_cat_id=${subsubcatid}`
      );
      const result = await response.json();

      if (result.data && result.data.length) {
        setServices(result.data);
      }
    } catch (err) {
      console.log("Fetch Services Error", err);
    }
  };

  const fetchServicesByCategory = async () => {
    try {
      const response = await fetch(
        `https://admin.incity-services.com/RestApi/api/services/serviceList?key=incitykey!&cat_id=${categid}`
      );
      const result = await response.json();

      if (result.data && result.data.length) {
        setServices(result.data);
      }
    } catch (err) {
      console.log("Fetch Services by Category Error", err);
    }
  };

  return {
    services,
  };
};
