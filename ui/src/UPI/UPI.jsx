import React, { useState } from "react";
import axios from "axios";
const baseApiUrl = "http://localhost:3000/api";

const UPI = () => {
  const [upi_amount, setUpi_amount] = useState();

  async function makeUPIpayment() {
    try {
      const {
        data: { key },
      } = await axios.get("http://www.localhost:3000/api/getkey");
      const URL = baseApiUrl + "/makeupipayment";
      const {
        data: { order },
      } = await axios.get(URL);
      console.log(order);
      const options = {
        key,
        amount: order.amount,
        currency: "INR",
        name: "Ajeet",
        description: "Payment",
        image: "",
        config: {
          display: {
            hide: [
              {
                method: "card",
              },
              {
                method: "wallet",
              },
              {
                method: "netbanking",
              },
              {
                method: "paylater",
              },
            ],

            sequence: ["block.code"], // The sequence in which blocks and methods should be shown

            preferences: {
              show_default_blocks: true, // Should Checkout show its default blocks?
            },
          },
        },
        callback_url: baseApiUrl + "/verifyupipayment",
        order_id: order.id,
        prefill: {
          name: "Ajeet Verma",
          email: "ajeet@gmail.com",
          contact: "1234567890",
        },
        notes: {
          address: "IIIT Naya Raipur",
        },
        theme: {
          color: "#121212",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Error:", error);
    }
  }

  return (
    <div className="upi-only-block">
      <div className="upi-only-data">
        <h5>
          Name : <strong>Fastr</strong>
        </h5>
        <h5>
          Email : <strong>fastr@gmail.com</strong>
        </h5>
        <h5>
          Mob No. : <strong>9555436576</strong>
        </h5>
        <div className="input-group mb-3">
          <div className="input-group-prepend">
            <span className="input-group-text">$</span>
          </div>
          <input
            type="text"
            className="form-control"
            aria-label="Amount (to the nearest dollar)"
            value={upi_amount}
            onChange={(e) => setUpi_amount(e.target.value)}
            placeholder="Enter amount"
          ></input>
          <div className="input-group-append">
            <span className="input-group-text">.00</span>
          </div>
        </div>
      </div>
      <button
        type="submit"
        className="btn btn-primary"
        onClick={makeUPIpayment}
      >
        Pay Now
      </button>
    </div>
  );
};

export default UPI;
