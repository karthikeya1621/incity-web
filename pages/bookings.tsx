import moment from "moment";
import React, { useContext } from "react";
import AppContext from "../context/AppContext";
import { useOrders } from "../hooks";
import styles from "../styles/BookingsPage.module.scss";

const BookingsPage = () => {
  const { userData } = useContext(AppContext);
  const { orders } = useOrders({ user_id: userData?.user_id });

  console.log(orders);

  return (
    <div className={styles.bookingspage}>
      <h3 className={styles.headingone}>Bookings</h3>
      <div className={styles.bookings}>
        {orders.map((order: any, oi) => (
          <div key={order.id + "-" + oi} className={styles.booking}>
            <div className={styles.orderinfo}>
              <div className={styles.status}>{order.progress}</div>
              <div>
                <li>#{order.service_order_id}</li>
                <li>
                  <span className={styles.key}>Payment Status</span>{" "}
                  {order.payment_status == "success" && (
                    <>
                      <span className="mdi mdi-check-circle-outline text-green-600"></span>{" "}
                      PAID
                    </>
                  )}
                  {order.payment_status == "pending" && (
                    <>
                      <span className="mdi mdi-alert-circle-outline text-yellow-600"></span>{" "}
                      PENDING
                    </>
                  )}
                  {order.payment_status == "failed" && (
                    <>
                      <span className="mdi mdi-alert-circle-outline text-red-600"></span>{" "}
                      PENDING
                    </>
                  )}
                </li>
              </div>
              <div>
                <li>{moment(order.service_date).format("MMMM Do YYYY")}</li>
                <li>
                  <span className={styles.key}>Duration</span>{" "}
                  <span className="mdi mdi-clock-outline"></span>{" "}
                  {order.service_time &&
                    order.service_time > 0 &&
                    `${
                      order.service_time / 60 >= 1 &&
                      Math.floor(order.service_time / 60) + " hr"
                    } ${
                      order.service_time % 60 >= 1 &&
                      (order.service_time % 60) + " min"
                    }`}
                </li>
              </div>
              <div className="flex items-center">
                {[
                  order.address,
                  order.area,
                  order.city,
                  order.state,
                  order.pincode,
                ]
                  .filter((val: any) => val)
                  .join(", ")}
              </div>
            </div>
            {(order.service_qty as number[]).map((qty, qin) => (
              <React.Fragment key={`sq-${qin}`}>
                {qty > 0 && order.service_name[qin] && (
                  <div
                    className={styles.serviceitem}
                    key={`booking-${order.id}-${qin}`}
                  >
                    <div>
                      <h6>{order.service_name[qin]}</h6>
                      <span>
                        {order.sub_amounts[qin]} x {qty}
                      </span>
                    </div>
                    <div>
                      <span>
                        &#x20b9; {parseFloat(order.sub_amounts[qin]) * qty}
                      </span>
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))}
            {order.service_name.length % 3 > 0 && (
              <div className="ml-auto"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingsPage;
