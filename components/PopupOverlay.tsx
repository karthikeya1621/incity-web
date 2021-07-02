import React, { useEffect, useState } from "react";
import styles from "../styles/PopupOverlay.module.scss";

function PopupOverlay({
  children,
  visible,
  onClose,
  enableClose = true,
}: {
  children: any;
  visible?: boolean;
  onClose?: Function;
  enableClose?: boolean;
}) {
  const closePopup = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <div
      className={
        visible
          ? `${styles.popupoverlay} ${styles.popupoverlay_visible}`
          : styles.popupoverlay
      }
    >
      <div
        className={
          visible
            ? `${styles.popupcontent} ${styles.popupcontent_visible}`
            : styles.popupcontent
        }
      >
        {enableClose && (
          <div className={styles.closebutton} onClick={closePopup}>
            <span className="mdi mdi-window-close"></span>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

export default PopupOverlay;
