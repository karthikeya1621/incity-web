import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import AppContext from "../context/AppContext";
import AuthContext from "../context/AuthContext";
import styles from "../styles/CheckoutPage.module.scss";
import Image from "next/image";
import { URLS } from "../utils/config";
import { v4 as uuid4 } from "uuid";

const CheckoutPage = () => {
  const maxHour = 20;
  const minHour = 10;
  const [mounted, setMounted] = useState(false);
  const [paymentType, setPaymentType] = useState("cod");
  const [placeOrderResult, setPlaceOrderResult] = useState<any>(null);
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [taxes, setTaxes] = useState(0);
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [slots, setSlots] = useState<string[]>([]);
  const [dateSlots, setDateSlots] = useState<string[]>([
    "Today",
    "Tomorrow",
    new Date(
      new Date().getTime() + 2 * 24 * 60 * 60 * 1000
    ).toLocaleDateString(),
  ]);
  const [activeSlot, setActiveSlot] = useState(0);
  const [activeDateSlot, setActiveDateSlot] = useState(0);
  const { user } = useContext(AuthContext);
  const {
    cartData,
    userData,
    getCart,
    setIsAddressPopupVisible,
    selectedAddress,
    breakpoints,
  } = useContext(AppContext);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    calculateSlots();
    setInterval(() => {}, 1000 * 60 * 10);
  }, []);

  useEffect(() => {
    if (mounted && !user) {
      setTimeout(() => {
        // router.replace("/");
      }, 1000);
    }
  }, [user]);

  useEffect(() => {
    if (placeOrderResult) {
      displayRazorpay(placeOrderResult);
    }
  }, [placeOrderResult]);

  useEffect(() => {
    if (cartData.length) {
      let total = 0;
      let gst = 0;
      (cartData as any[]).forEach((cd) => {
        total += parseFloat(cd.fPrice) * parseInt(cd.iQuantity);
        gst += parseFloat(cd.fGst);
      });
      setTotalPrice(total);
      setTaxes(gst);
    } else {
      // router.replace("/");
    }
  }, [cartData]);

  useEffect(() => {
    calculateSlots();
  }, [activeDateSlot]);

  const calculateSlots = () => {
    let newSlot = minHour;
    const currentHour = new Date().getHours();
    if (activeDateSlot == 0) {
      newSlot = currentHour < minHour ? minHour : currentHour + 1;
    }
    const allSlots = [];
    while (newSlot < maxHour) {
      allSlots.push(`${newSlot % 12 || 12}:00 ${newSlot >= 12 ? "PM" : "AM"}`);
      allSlots.push(`${newSlot % 12 || 12}:30 ${newSlot >= 12 ? "PM" : "AM"}`);
      newSlot++;
    }
    setSlots(allSlots);
  };

  const handleUpdateQuantity = async (cartitem: any, modifier: number) => {
    const quantity = parseInt(cartitem.iQuantity) || 0;
    try {
      const response = await fetch(
        `https://admin.incity-services.com/RestApi/api/cart/cartInsert`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            service_price: parseFloat(cartitem.fPrice),
            service_id: cartitem.iServiceId,
            service_imgpath: cartitem.vImage,
            service_name: cartitem.vServiceName,
            scategory_id: cartitem.iCategoryId,
            quantity: quantity + modifier,
            sub_total: parseFloat(cartitem.fPrice),
            total_amount: parseFloat(cartitem.fPrice),
            gst: 2,
            user_id: userData.user_id,
            key: "incitykey!",
          }),
        }
      );
      const result = await response.json();
      console.log(result);
      await getCart();
    } catch (err) {
      console.log("Update Cart Error", err);
    }
  };

  const handleContinueCheckout = async () => {
    try {
      console.log(totalPrice + taxes);
      const response = await fetch(
        `https://admin.incity-services.com/RestApi/api/payment/order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: (totalPrice + taxes) * 100,
            currency: "INR",
            reciept_id: `receipt#${uuid4()}`,
            user_id: userData.user_id,
            key: "incitykey!",
            payment_mode: paymentType.toUpperCase(),
          }),
        }
      );
      const result = await response.json();
      setPlaceOrderResult(Object.entries(result.data)[0][1]);
    } catch (err) {
      console.log("Place Order Error", err);
      setPlaceOrderResult(null);
    }
  };

  const loadScript = (src: string): Promise<any> => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const displayRazorpay = async (placeOrderResult: any) => {
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    const options = {
      // key: "rzp_test_8v5BjQduGZotWJ",
      key: "rzp_test_bHbhVsNpAKgMvI",
      amount: placeOrderResult.amount.toString(),
      currency: placeOrderResult.currency,
      name: "Incity Pvt Ltd.",
      description: "Test Transaction",
      image: URLS.base_url + "images/logo-small.png",
      // order_id: placeOrderResult.id,
      handler: async function (response: any) {
        let nowDate = new Date();

        if (activeDateSlot == 1)
          nowDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
        else if (activeDateSlot == 2)
          nowDate = new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000);
        const data = {
          orderCreationId: placeOrderResult.id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpayOrderId: response.razorpay_order_id,
          razorpaySignature: response.razorpay_signature,
          key: "incitykey!",
          user_id: userData.user_id,
          merchant_orderid: response.razorpay_order_id || placeOrderResult.id,
          servicedate:
            nowDate.getFullYear() +
            "/" +
            (nowDate.getMonth() + 1) +
            "/" +
            nowDate.getDate(),
          servicetime: activeSlot,
          address: "Some Test Address",
          area: "Some Test Area",
          pincode: "500090",
          currency: placeOrderResult.currency,
          payment_status: "success",
          payment_mode: "ONLINE",
          coupon_amount: 0,
          amt: placeOrderResult.amount,
        };
        console.log(response);
        setIsPaymentSuccess(true);

        const result = await fetch(
          `https://admin.incity-services.com/RestApi/api/payment/order_success`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }
        );
        const resultdata = await result.json();
        console.log(resultdata);
        router.replace("/bookings");
      },
      prefill: {
        name: user.displayName || userData.name,
        email: userData.email,
        contact: userData.phone,
      },
      notes: {
        address: "Incity Pvt Ltd, Hyd",
      },
      theme: {
        color: "#f59e0b",
      },
    };

    const paymentObject = new (window as any).Razorpay(options);
    paymentObject.on("payment.failed", (response: any) => {
      setIsPaymentSuccess(false);
    });
    paymentObject.open();
  };

  return (
    <div className={styles.checkoutpage}>
      <div className="w-full mx-auto max-w-screen-lg">
        <div className="grid grid-cols-12 gap-4 md:p-0 px-3 py-6">
          <div
            className="col-span-12 md:col-span-5"
            style={{ order: breakpoints.xs || breakpoints.sm ? 1 : "unset" }}
          >
            <div className={styles.slotpicker}>
              <h3 className={styles.headingone}>Pick a time</h3>
              <div className="flex flex-wrap justify-start">
                <div className="w-full flex">
                  {dateSlots.map((dslot, dsi) => (
                    <span
                      onClick={() => setActiveDateSlot(dsi)}
                      className={
                        dsi == activeDateSlot
                          ? `${styles.dateslot} ${styles.dateslot_active}`
                          : `${styles.dateslot}`
                      }
                      key={`slot-${dslot}`}
                    >
                      {dslot}
                    </span>
                  ))}
                </div>
                {slots.map((slot, si) => (
                  <span
                    onClick={() => setActiveSlot(si)}
                    className={
                      si == activeSlot
                        ? `${styles.timeslot} ${styles.timeslot_active}`
                        : `${styles.timeslot}`
                    }
                    key={`slot-${slot}`}
                  >
                    {slot}
                  </span>
                ))}
                {!slots.length && (
                  <b className="inline-block relative w-full text-center text-gray-400 my-20">
                    No available slots
                  </b>
                )}
              </div>
            </div>

            <div className={styles.serviceaddress}>
              <h3 className={styles.headingone}>Address</h3>

              <div>
                {userData && userData.address ? (
                  <>
                    <div className={styles.addresscard}>
                      <p>
                        {[
                          userData.address,
                          userData.city,
                          userData.state,
                          userData.country,
                          userData.pincode,
                        ]
                          .filter((s: any) => s)
                          .join(",")}
                      </p>
                    </div>
                    <span style={{ marginRight: "12px" }}>or</span>
                  </>
                ) : (
                  <></>
                )}
                <div>
                  <p>{selectedAddress && selectedAddress.full_address}</p>
                  <div
                    className={styles.picklocation}
                    onClick={() => {
                      setIsAddressPopupVisible(true);
                    }}
                  >
                    Pick a location
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.paymentmethods}>
              <h3 className={styles.headingone}>Payment Methods</h3>
              <form>
                <fieldset id="radiog">
                  <div className="form-group py-2">
                    <input
                      name="radiog"
                      value="cod"
                      type="radio"
                      checked={paymentType == "cod"}
                      className="form-radio mr-2"
                      onChange={(e) => {
                        if (paymentType != "cod") {
                          setPaymentType("cod");
                        }
                      }}
                    />
                    <label>Cash on Delivery</label>
                  </div>
                  <div className="form-group py-2">
                    <input
                      name="radiog"
                      value="online"
                      type="radio"
                      checked={paymentType == "online"}
                      className="form-radio mr-2"
                      onChange={(e) => {
                        if (paymentType != "online") {
                          setPaymentType("online");
                        }
                      }}
                    />
                    <label>Pay Online</label>
                  </div>
                </fieldset>
              </form>
              <button
                className="button-one bigger mt-20"
                onClick={handleContinueCheckout}
              >
                Continue Checkout
              </button>
            </div>
          </div>
          {!(breakpoints.xs || breakpoints.sm) && (
            <div className="col-span-2"></div>
          )}
          <div className="col-span-12 md:col-span-5">
            <div className={styles.cartitems}>
              <h3 className={styles.headingone}>Your Cart</h3>
              <div className="pt-3">
                {cartData &&
                  (cartData as any[]).map((cartitem: any, ci) => (
                    <div className={styles.cartitem} key={`cartitem-${ci}`}>
                      <div className={styles.itemimage}>
                        <Image
                          src={cartitem.vImage}
                          layout="fill"
                          objectFit="cover"
                        />
                      </div>
                      <div className={styles.iteminfo}>
                        <div>
                          <h3>{cartitem.vServiceName}</h3>
                          <span className={styles.itemprice}>
                            &#x20b9; {cartitem.fPrice}
                          </span>
                        </div>
                        <div className={styles.counter}>
                          <button
                            onClick={() => {
                              handleUpdateQuantity(cartitem, -1);
                            }}
                          >
                            -
                          </button>
                          <span>{cartitem.iQuantity}</span>
                          <button
                            onClick={() => {
                              handleUpdateQuantity(cartitem, 1);
                            }}
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div className="flex justify-center items-center text-lg text-secondary-light font-bold">
                        <span>
                          &#x20b9;{" "}
                          {parseFloat(cartitem.fPrice) *
                            parseInt(cartitem.iQuantity)}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
            <div className={styles.couponbox}>
              <div className="form-group flex justify-between items-center">
                <input
                  placeholder="Enter Coupon"
                  className="form-input rounded-md mr-3 w-full uppercase"
                  type="text"
                  onChange={(e) => {
                    setCoupon(e.target.value);
                  }}
                />
                <button className="button-two wider">Apply</button>
              </div>
            </div>
            <div className={styles.pricedetails}>
              <div>
                <span>Service Cost</span>
                <b>&#x20b9; {totalPrice.toFixed(2)}</b>
              </div>
              <div>
                <span>Taxes &amp; Charges</span>
                <b>&#x20b9; {taxes.toFixed(2)}</b>
              </div>
              <div className={styles.totalprice}>
                <span>
                  <strong>Total Cost</strong>
                </span>
                <b>&#x20b9; {(totalPrice + taxes).toFixed(2)}</b>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
