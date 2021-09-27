import { useEffect, useState } from "react";
import slugify from "slugify";

export const useSearch = (query: string) => {
  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (query) {
      setIsDone(false);
      doSearch();
    } else {
      setResults([]);
    }
  }, [query]);

  const doSearch = async () => {
    try {
      const params = new URLSearchParams();
      if (query) params.set("search", query);
      setIsSearching(true);
      const response = await fetch(
        "https://admin.incity-services.com/RestApi/api/servicesearch?key=incitykey!&" +
          params.toString()
      );
      const result = await response.json();
      setIsSearching(false);
      setIsDone(true);
      if (result.data) {
        setResults(Array.from(result.data));
      } else {
        setResults([]);
      }
    } catch (err) {
      console.log("Search Results Error", err);
      setResults([]);
      setIsSearching(false);
      setIsDone(true);
    }
  };

  const formattedResults = (results: any[]): any[] => {
    const fResults: any[] = [];

    results.forEach((result) => {
      const resultsWithCat = fResults.filter(
        (res) => res.category == result.cat_name
      );
      if (resultsWithCat.length < 5) {
        fResults.push({
          category: result.cat_name,
          service: result.service_name,
          link:
            "/category/" +
            [result.cat_name, result.sub_cat_name, result.sub_sub_cat_name]
              .filter(
                (cn) =>
                  (cn !== null || cn !== undefined || cn !== "") &&
                  typeof cn === "string"
              )
              .map((cn) => slugify(cn))
              .join("/") +
            `${result.id.length > 0 && "?sid=" + result.id}`,
        });
      }
    });

    return fResults;
  };

  return { results: formattedResults(results), isDone, isSearching };
};
