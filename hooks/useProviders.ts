import { useState, useEffect } from "react";
import slugify from "slugify";

export const useProviders = ({ city }: { city?: string }) => {
  const [providers, setProviders] = useState<any[]>([]);
  const [allProviders, setAllProviders] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [allCategories, setAllCategories] = useState<any[]>([]);

  useEffect(() => {
    fetchAllProviders();
  }, []);

  useEffect(() => {
    if (city && allProviders) {
      const providersByCity = allProviders.filter(
        (provider: any) => provider.city == city
      );
      setProviders(providersByCity);
    }
  }, [city, allProviders]);

  useEffect(() => {
    if (providers.length) {
      console.log(allCategories);
      const categs: any[] = [];
      providers.forEach((provider, index) => {
        const newCategory = allCategories.filter(
          (c) => c.id === provider.category_id
        );
        const categoryExists = categs.some(
          (c) => c.id === provider.category_id
        );
        if (!categoryExists) {
          categs.push({
            category: provider.category.trim(),
            id: provider.category_id,
            link: slugify(provider.category),
          });
        }
      });
      setCategories(categs);
    }
  }, [providers]);

  const fetchAllProviders = async () => {
    await fetchAllCategories();
    try {
      const response = await fetch(
        "https://pochieshomeservices.com/RestApi/api/auth/ProvidersList"
      );
      const result = await response.json();
      if (result.data && result.data.length) {
        setAllProviders(result.data);
      } else {
        setAllProviders([]);
      }
    } catch (err) {
      console.log("Fetch Providers Error", err);
    }
  };

  const fetchAllCategories = async () => {
    try {
      const response = await fetch(
        "https://pochieshomeservices.com/RestApi/api/category/categoryList?key=incitykey!"
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
  };
};
