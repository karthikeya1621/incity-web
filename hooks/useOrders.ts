import { useEffect, useState } from "react";

export const useOrders = ({ user_id, order_id, payment_id }: any) => {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    if (user_id || order_id || payment_id) {
      fetchOrders();
    }
  }, [user_id, order_id, payment_id]);

  const fetchOrders = async () => {
    const urlParams = new URLSearchParams();
    if (user_id) urlParams.append("user_id", user_id);
    if (order_id) urlParams.append("order_id", order_id);
    if (payment_id) urlParams.append("payment_id", payment_id);
    try {
      const response = await fetch(
        `https://admin.incity-services.com/RestApi/api/user_dashboard/userdata?key=incitykey!&${urlParams.toString()}`
      );
      const result = await response.json();
      if (result.data) {
        let orders = result.data.orders as any[];
        orders = orders.map((order) => {
          return {
            ...order,
            service_name: order.service_name.split(", "),
            service_qty: order.service_qty
              .split(", ")
              .map((s: string) => parseInt(s)),
            sub_amounts: order.sub_amounts.split(", "),
          };
        });
        setOrders(orders || []);
      }
    } catch (err) {
      console.log("Fetch Orders Error", err);
    }
  };

  return {
    orders,
  };
};
