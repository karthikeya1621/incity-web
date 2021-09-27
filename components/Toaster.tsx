import React, { useContext, useEffect, useState } from "react";
import AppContext from "../context/AppContext";
import styles from "../styles/Toaster.module.scss";

const Toaster = () => {
  const { toast, setToast } = useContext(AppContext);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (toast.message) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [toast]);

  useEffect(() => {
    if (isVisible) {
      const timeout = setTimeout(() => {
        setToast({ message: "", status: "", duration: 3000 });
        clearTimeout(timeout);
      }, toast.duration || 3000);
    }
  }, [isVisible]);

  return (
    <>
      {toast.message && (
        <div
          className={
            styles.toaster_overlay + " " + styles[isVisible ? "show" : "hide"]
          }
        >
          <div className={styles.toaster + " " + styles[toast?.status]}>
            {toast.status && (
              <span
                className={`mdi mdi-${
                  toast.status == "success"
                    ? "check"
                    : toast.status == "warning"
                    ? "alert"
                    : toast.status == "failed" && "alert-circle"
                }-outline`}
              ></span>
            )}{" "}
            <span>{toast?.message}</span>
          </div>
        </div>
      )}
    </>
  );
};

export default Toaster;
