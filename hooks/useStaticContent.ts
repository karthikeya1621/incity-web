import { useEffect, useState } from "react";

export const useStaticContent = (url: string) => {
  const [data, setData] = useState<any>("<p></p>");

  useEffect(() => {
    if (url) {
      fetchContent();
    }
  }, [url]);

  const fetchContent = async () => {
    try {
      const response = await fetch(url);
      const result = await response.json();
      if (result.data) {
        setData(
          result.data instanceof Array
            ? result.data[0]
              ? result.data[0].terms_conditions_text
              : ""
            : result.data
        );
      }
    } catch (err) {
      console.log("Fetch Content Error", err);
    }
  };

  return { data };
};
