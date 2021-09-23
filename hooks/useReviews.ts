import { useEffect, useState } from "react";

export const useReviews = (service_id: string) => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [averageRating, setAverageRating] = useState<number>(0);

  useEffect(() => {
    if (service_id) {
      fetchReviews();
    }
  }, [service_id]);

  const fetchReviews = async () => {
    try {
      const response = await fetch(
        `https://admin.incity-services.com/RestApi/api/ratingandreviewlist?key=incitykey!&service_id=${service_id}`
      );
      const result = await response.json();
      if (result.data) {
        setReviews(result.data);
      } else {
        setReviews([]);
      }

      if (result.average_rating) {
        setAverageRating(parseFloat(result.average_rating));
      } else {
        setAverageRating(0);
      }
    } catch (err) {
      console.log("Fetch Reviews Error", err);
    }
  };

  const addReview = async (
    user_id: string,
    service_id: string,
    rating: number,
    review: string
  ) => {
    try {
      const response = await fetch(
        "https://admin.incity-services.com/RestApi/api/postreview",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id,
            service_id,
            rate: rating,
            review,
            key: "incitykey!",
          }),
        }
      );
      const result = await response.json();
      if (result.data) {
      }
    } catch (err) {
      console.log("Add review Error", err);
    }
  };

  const reloadReviews = () => {
    fetchReviews();
  };

  return {
    reviews,
    addReview,
    averageRating,
    reloadReviews,
  };
};
