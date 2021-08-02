import { useEffect, useState } from "react";

export const useServices = (subsubcatid: string) => {
  const [services, setServices] = useState<any[]>([]);

  useEffect(() => {
    if (subsubcatid) {
      fetchServices();
    }
  }, [subsubcatid]);

  const fetchServices = async () => {
    try {
      const response = await fetch(
        `https://pochieshomeservices.com/RestApi/api/services/serviceList?key=incitykey!&sub_sub_cat_id=${subsubcatid}`
      );
      const result = await response.json();

      if (result.data && result.data.length) {
        setServices(result.data);
      }
    } catch (err) {
      console.log("Fetch Services Error", err);
    }
  };

  return {
    services,
  };
};
