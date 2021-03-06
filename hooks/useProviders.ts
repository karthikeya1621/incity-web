import { useState, useEffect } from "react";
import slugify from "slugify";
import { URLS } from "../utils/config";

export const useProviders = ({ city }: { city?: string }) => {
  const categoriesFilter = "none";
  const [providers, setProviders] = useState<any[]>([]);
  const [allProviders, setAllProviders] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [allCategories, setAllCategories] = useState<any[]>([]);

  useEffect(() => {
    if (city) {
      fetchAllProviders();
    }
  }, [city]);

  useEffect(() => {
    if (city && allProviders) {
      const providersByCity = allProviders.filter(
        (provider: any) => provider.city == city || true
      );
      setProviders(providersByCity);
    }
  }, [allProviders]);

  useEffect(() => {
    if (providers.length || categoriesFilter == "none") {
      const categs: any[] = [];
      if (categoriesFilter != "none") {
        providers.forEach((provider, index) => {
          const newCategory = allCategories.filter(
            (c) =>
              c.id + "" === provider.category_id + "" &&
              provider.category.trim().length &&
              slugify(c.category.trim()) === slugify(provider.category.trim())
          );
          const categoryExists = categs.some(
            (c) =>
              c.id + "" === provider.category_id + "" &&
              provider.category.trim().length &&
              slugify(c.category.trim()) === slugify(provider.category.trim())
          );
          if (!categoryExists && provider.category.trim().length) {
            categs.push({
              category: provider.category.trim(),
              id: provider.category_id + "",
              link: slugify(provider.category),
              Iconurl:
                newCategory && newCategory.length ? newCategory[0].Iconurl : "",
            });
          }
        });
      } else {
        allCategories.forEach((cat, ind) => {
          const parName = cat.parent_name.trim();
          if (categs.filter((c) => c.category == parName).length == 0) {
            categs.push({
              category: parName.length
                ? slugify(parName.toLowerCase().trim()) ===
                  slugify(cat.category.toLowerCase().trim())
                  ? cat.category
                  : parName
                : cat.category,
              id: cat.id,
              link: slugify(cat.category),
              Iconurl:
                (parName.toLowerCase() != cat.category.toLowerCase()
                  ? `${URLS.icons_url}/${cat.par_img}`
                  : null) || cat.Iconurl,
              isParent: parName.toLowerCase() != cat.category.toLowerCase(),
            });
          }
        });
      }
      console.log(categs);
      setCategories(categs.filter((c) => c.Iconurl.length > 0));
    }
  }, [providers]);

  const fetchAllProviders = async () => {
    await fetchAllCategories();
    try {
      const response = await fetch(
        "https://admin.incity-services.com/RestApi/api/auth/ProvidersList?key=incitykey!&city=" +
          city
      );
      const result = await response.json();
      if (result.data && result.data.length) {
        setAllProviders(result.data);
      } else {
        setAllProviders([]);
      }
    } catch (err) {
      console.log("Fetch Providers Error", err);
      setAllProviders([]);
    }
  };

  const fetchAllCategories = async () => {
    try {
      const response = await fetch(
        "https://admin.incity-services.com/RestApi/api/category/categoryList?key=incitykey!"
      );
      const result = await response.json();
      if (result.data && result.data.length) {
        setAllCategories(result.data);
      } else {
        setAllCategories([]);
      }
    } catch (err) {
      console.log("Fetch Categories Error", err);
    }
  };

  return {
    providers,
    categories,
    allCategories,
  };
};
