import { useEffect, useState } from "react";

export const useSiteInfo = () => {
  const [data, setData] = useState({});

  useEffect(() => {
    fetchSiteInfo();
  }, []);

  const fetchSiteInfo = async () => {
    try {
      const response = await fetch(
        "https://admin.incity-services.com/RestApi/api/siteinfo?key=incitykey!"
      );
      const result = await response.json();
      if (result.data) {
        setData(result.data);
      }
    } catch (err) {
      console.log("Fetch Site Info Error", err);
    }
  };

  return { ...data };
};
