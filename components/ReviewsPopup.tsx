import React, { useContext, useState } from "react";
import Rating from "react-rating";
import { useReviews } from "../hooks";
import styles from "../styles/ReviewsPopup.module.scss";
import ReactTimeAgo from "react-time-ago";
import AuthContext from "../context/AuthContext";
import AppContext from "../context/AppContext";

const ReviewsPopup = ({ serviceId }: any) => {
  const { reviews, addReview, averageRating, reloadReviews } =
    useReviews(serviceId);
  const [isEditMode, setIsEditMode] = useState(false);
  const [reviewData, setReviewData] = useState<any>({ rating: 0, review: "" });
  const { user } = useContext(AuthContext);
  const {
    userData,
    setWaitingPopup,
    setIsReviewsPopupVisible,
    setIsLoginPopupVisible,
  } = useContext(AppContext);

  const handleAddReview = async () => {
    if (user && userData) {
      setIsEditMode(true);
    } else {
      setIsReviewsPopupVisible(false);
      setWaitingPopup("login|review");
      setIsLoginPopupVisible(true);
    }
  };

  const handleSubmitReview = async () => {
    try {
      await addReview(
        userData.user_id,
        serviceId,
        reviewData.rating,
        reviewData.review
      );
      setIsEditMode(false);
      reloadReviews();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={styles.reviewspopup}>
      <div className={styles.allreviews}>
        {reviews
          .filter((rev) => rev.status == "Enable")
          .map((review, ind) => (
            <div key={ind + "rev"} className={styles.reviewbox}>
              <div className={styles.rowone}>
                <div className="flex">
                  <h4>{review.name || "Unknown"}</h4>{" "}
                  <small className="ml-10 mt-1 italic">
                    <ReactTimeAgo date={new Date(review.updated_at)} />
                  </small>
                </div>
                <Rating
                  readonly
                  initialRating={parseFloat(review.rate) || 0}
                  start={0}
                  stop={5}
                  fullSymbol={
                    <>
                      <span className="mdi mdi-star text-yellow-400"></span>
                    </>
                  }
                  emptySymbol={
                    <>
                      <span className="mdi mdi-star-outline text-yellow-400"></span>
                    </>
                  }
                />
              </div>
              <div className={styles.rowtwo}>
                <p>{review.review}</p>
              </div>
            </div>
          ))}
        {reviews.length == 0 && (
          <div className={styles.reviewbox}>
            <h6 className="w-full text-center italic pt-2 pb-8">No Reviews.</h6>
          </div>
        )}
      </div>

      {isEditMode && (
        <div className={styles.reviewform}>
          <div>
            <span>Your rating:&nbsp;&nbsp;</span>
            <Rating
              start={0}
              stop={5}
              initialRating={reviewData.rating}
              fullSymbol={
                <>
                  <span className="mdi mdi-star text-yellow-400 text-lg"></span>
                </>
              }
              emptySymbol={
                <>
                  <span className="mdi mdi-star-outline text-yellow-400 text-lg"></span>
                </>
              }
              onChange={(rating) => {
                setReviewData({ ...reviewData, rating });
              }}
            />
          </div>
          <div className="formgroup mt-3">
            <textarea
              className="form-textarea"
              rows={4}
              placeholder={"Write your review here..."}
              onChange={({ target: { value } }) => {
                setReviewData({ ...reviewData, review: value });
              }}
            ></textarea>
          </div>
        </div>
      )}

      <div className={styles.reviewactions}>
        {averageRating > 0 && (
          <div className={styles.avgrating}>
            <Rating
              readonly
              initialRating={averageRating || 0}
              start={0}
              stop={5}
              fullSymbol={
                <>
                  <span className="mdi mdi-star text-yellow-400"></span>
                </>
              }
              emptySymbol={
                <>
                  <span className="mdi mdi-star-outline text-yellow-400"></span>
                </>
              }
            />
            <h1>
              {averageRating} <span>/ 5</span>
            </h1>
          </div>
        )}
        {averageRating == 0 && <div></div>}

        {isEditMode ? (
          <button
            className="button-one"
            onClick={() => {
              handleSubmitReview();
            }}
          >
            Submit Review
          </button>
        ) : (
          <button
            className="button-one"
            onClick={() => {
              handleAddReview();
            }}
          >
            Add Review
          </button>
        )}
      </div>
    </div>
  );
};

export default ReviewsPopup;
