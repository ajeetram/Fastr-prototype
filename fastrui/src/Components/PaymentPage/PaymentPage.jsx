import React, { useEffect, useState } from "react";
import "./paymentPage.css";
import UpdatedCard from "../Card-Payment/CardPayment";
import NetBanking from "../NetBanking/NetBanking";
import ECurrency from "../E-Currency/ECurrency";
import UPI from "../UPI/UPI";
import laptop from "../Images/laptop.png";
import disc from "../Images/disc.png";
import { FaEdit } from "react-icons/fa";
import { ArrowRightAlt, Close, Delete } from "@mui/icons-material";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
import ModeEditOutlinedIcon from "@mui/icons-material/ModeEditOutlined";
import Switch from "@mui/material/Switch";
import BouncingLoader from "../Loader/BouncingLoader";
import axios from "axios";
import toast from "react-hot-toast";
import CreditLine from "../CreditLine/CreditLine";
import { motion } from "framer-motion";
import UPIData from "../UPI/UPIData";
import makePayment from "./payment";
import TransactionStatus from "../TransactionStatus/TransactionStatus";
import TransactionLoader from "../Loader/TransactionLoader";

const PaymentPage = () => {
  const [selectedItem, setSelectedItem] = useState("card");
  const [showModal, setShowModal] = useState(false);
  const [showModalUpi, setShowModalUpi] = useState(false);
  const [cards, setCards] = useState([]);
  const [copiedCard, setCopiedCard] = useState([]);
  const [copiedUpiHandle, setCopiedUpiHandle] = useState(new Array(5).fill(0));
  const [checkedState, setCheckedState] = useState(new Array(5).fill(false));
  const [checkedStateUpi, setCheckedStateUpi] = useState(
    new Array(5).fill(false)
  );
  const [updatedCardName, setUpdatedCardName] = useState("");
  const [updatedCardNumber, setUpdatedCardNumber] = useState("");
  const [updatedExpiryDate, setUpdatedExpiryDate] = useState("");
  const [updatedcvv, setUpdatedCVV] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [selectId, setSelectedID] = useState();
  const [splitAmount, setSplitAmount] = useState();
  const [enterAmnt, setEnterAmnt] = useState(new Array(5).fill(0));
  const [idx, setIdx] = useState(0);
  const [idxUpi, setIdxUpi] = useState(0);
  const [sumOfSplitMoney, setSumOfSplitMonay] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [countCard, setCountCard] = useState(0);
  const [countUpiId, setCountUpiId] = useState(0);
  const [copiedDataLength, setCopiedDataLength] = useState(0);
  const [cardLength, setCardLength] = useState(0);
  const [upiArray, setUPIArray] = useState([]);
  const [paymentData, setPaymentData] = useState([]);
  const [transactionStatusArray, setTransactionStatusArray] = useState([]);
  const [transactionModal, setTransactionModal] = useState(false);
  const [success, setSuccess] = useState(false);
  let total = 408;

  // get all stored card
  const getAllCard = async () => {
    try {
      const { data } = await axios.get(
        "https://fastr-prototype.vercel.app/api/v1/card/allCardData"
      );
      setCards(data?.data);
      // console.log(cards);
      if (data.success) {
        setCountCard(data.data.length);
        setIsLoading(false);
      }
    } catch (error) {
      toast.error("error while fetching all card data");
    }
  };

  //get all upi handle

  const getAllUPIData = async () => {
    try {
      const { data } = await axios.get(
        "https://fastr-prototype.vercel.app/api/v1/upi/AllUpiHandle"
      );
      if (data.success) {
        setCountUpiId(data.data.length);
        setUPIArray(data.data);
        setIsLoading(false);
      }
    } catch (error) {
      toast.error(error);
    }
  };

  // update card data handler
  const handleUpdateCard = async (id) => {
    try {
      const { data } = await axios.put(
        `https://fastr-prototype.vercel.app/api/v1/card/updateCard/${id}`,
        {
          cardName: updatedCardName,
          cardNumber: updatedCardNumber,
          expiryDate: updatedExpiryDate,
          cvv: updatedcvv,
        }
      );

      if (data?.success) {
        toast.success(data.message);
        getAllCard();
      }
    } catch (error) {
      toast.error("something went wrong while updating");
    }
  };

  // delete card by its id

  const deleteCard = async (cId, index) => {
    try {
      const toastId = toast.loading("please wait...");
      const { data } = await axios.delete(
        `https://fastr-prototype.vercel.app/api/v1/card/deleteCard/${cId}`
      );

      if (data.success) {
        toast.dismiss(toastId);
        toast.success(data.message);
        setCheckedState(new Array(5).fill(false));
        setCheckedStateUpi(new Array(5).fill(false));
        setCopiedCard(new Array(5).fill(0));
        setCopiedUpiHandle(new Array(5).fill(0));
        setEnterAmnt(new Array(10).fill(0));
        setCopiedDataLength(0);
        getAllCard();
      }
    } catch (error) {}
  };

  // checkbox handler

  const handleOnChange = (position, data) => {
    const updatedCheckedState = checkedState.map((item, index) =>
      index === position ? !item : item
    );

    setCheckedState(updatedCheckedState);

    if (updatedCheckedState[position]) {
      const newArray = [...copiedCard];
      newArray[position] = data;
      setCopiedCard(newArray);
      let length = copiedDataLength + 1;
      setCopiedDataLength(length);
      let l = cardLength + 1;
      setCardLength(l);
    } else {
      // If checkbox is unchecked, return the rest checked data
      const newArray = [...copiedCard];
      newArray[position] = 0;
      setCopiedCard(newArray);
      let length = copiedDataLength - 1;
      setCopiedDataLength(length);
      let l = cardLength - 1;
      setCardLength(l);
    }
  };
  // handle amount

  const handlerAmount = (index, value) => {
    const newArray = [...enterAmnt];
    console.log("i and", index, value, newArray);
    newArray[index] = value;
    setEnterAmnt(newArray);
    const sum = newArray.reduce(
      (accumulator, currentValue) => accumulator + Number(currentValue),
      0
    );
    setSumOfSplitMonay(sum);
    console.log("i and val", index, value, newArray, sum);
  };

  // handle remove card from checkout

  const removeCard = (index) => {
    const copiedarray = [...copiedCard];
    copiedarray[index] = 0;
    setCopiedCard(copiedarray);
    let length = copiedDataLength - 1;
    setCopiedDataLength(length);
    let l = cardLength - 1;
    setCardLength(l);
    const array = [...checkedState];
    array[index] = false;
    setCheckedState(array);
  };
  const removeUpihandle = (index) => {
    const copiedarray = [...copiedUpiHandle];
    copiedarray[index] = 0;
    setCopiedUpiHandle(copiedarray);
    let length = copiedDataLength - 1;
    setCopiedDataLength(length);
    const array = [...checkedStateUpi];
    array[index] = false;
    setCheckedStateUpi(array);
  };

  // Payment handller

  const handlePayment = async (paymentData) => {
    if (sumOfSplitMoney !== total) {
      return toast.error(
        `Sum of split cards money should be equal to ${total}`
      );
    }
    try {
      setSuccess(true);
      let response = await makePayment(paymentData);
      console.log(response);
      setTransactionStatusArray(response[0].status);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    let paymentMethods = [];
    let paymentMethodItem = {};
    getAllCard();
    // console.log(copiedCard);
    if (copiedDataLength === 0) setIsLoading(true);

    if (copiedDataLength !== 0) {
      let eachPrice = (total / copiedDataLength).toFixed(2);
      console.log("DataLength", copiedDataLength);
      setSplitAmount(eachPrice);
      let sum = copiedDataLength * eachPrice;
      for (let i = 0; i < 7; i++) {
        if (i < copiedDataLength) {
          enterAmnt[i] = eachPrice;
        } else {
          enterAmnt[i] = 0;
        }
      }
      setSumOfSplitMonay(sum);
    }
    for (let i = 0; i < copiedCard.length; i++) {
      paymentMethodItem = {
        method: "card",
        cardHolderName: copiedCard[i].cardName,
        cardNumber: copiedCard[i].cardNumber,
        amount: enterAmnt[i],
        cardcvv: copiedCard[i].cvv,
        cardexpiryDate: copiedCard[i].expiryDate,
      };
      // console.log(paymentMethodItem);
      paymentMethods.push(paymentMethodItem);
    }
    for (let i = 0; i < copiedUpiHandle.length; i++) {
      if (copiedUpiHandle[i] !== 0) {
        paymentMethodItem = {
          method: "upi",
          upiId: copiedUpiHandle[i].upiId,
          amount: enterAmnt[i + cardLength],
        };
        paymentMethods.push(paymentMethodItem);
      }
    }
    console.log(paymentMethods);
    setPaymentData(paymentMethods);
  }, [checkedState, copiedDataLength, checkedStateUpi]);

  useEffect(() => {
    if (transactionStatusArray.length > 0) {
      setTransactionModal(true);
      setSuccess(false);
    }
  }, [transactionStatusArray]);

  return (
    <>
      <div className="card-payment-container">
        <div className="payment-box">
          <h3>Billing Information</h3>
          <div className="ship-address">
            <input type="checkbox" style={{ accentColor: "green" }} />
            <p>ship into different address</p>
          </div>
          <div className="billing">
            <h3>Payment Option</h3>
            <p style={{ color: "green" }}>
              saved Cards :{" "}
              <strong style={{ color: "#14667e" }}> {countCard}</strong> UPI-ID
              : <strong style={{ color: "#14667e" }}> {countUpiId}</strong>
            </p>
            {isLoading ? (
              <BouncingLoader />
            ) : (
              cards?.map((data, i) => {
                return (
                  <div key={i + 1} className="cardDataBar">
                    <div className="edit-del-btn">
                      <input
                        type="checkbox"
                        checked={checkedState[i]}
                        onChange={() => handleOnChange(i, data)}
                        style={{ accentColor: "rgb(0, 51, 255)" }}
                      />
                      <p>{data.cardName}</p>
                      <p>{String(data.cardNumber).slice(0, 4)}...</p>
                    </div>
                    <div className="edit-del-btn">
                      <FaEdit
                        style={{ color: "#14667e", cursor: "pointer" }}
                        onClick={() => {
                          setOpenModal(true);
                          setUpdatedCardName(data.cardName);
                          setUpdatedCardNumber(data.cardNumber);
                          setUpdatedExpiryDate(data.expiryDate);
                          setUpdatedCVV(data.cvv);
                          setSelectedID(data._id);
                        }}
                      />
                      <Delete
                        style={{ color: "#dc3545", cursor: "pointer" }}
                        onClick={() => {
                          deleteCard(data._id);
                        }}
                      />
                    </div>
                  </div>
                );
              })
            )}
            {
              <UPIData
                setCopiedUpiHandle={setCopiedUpiHandle}
                copiedUpiHandle={copiedUpiHandle}
                checkedStateUpi={checkedStateUpi}
                setCheckedStateUpi={setCheckedStateUpi}
                copiedDataLength={copiedDataLength}
                setCopiedDataLength={setCopiedDataLength}
                setCountUpiId={setCountUpiId}
                setCopiedCard={setCopiedCard}
                setEnterAmnt={setEnterAmnt}
                setCheckedState={setCheckedState}
                setIsLoading={setIsLoading}
                isLoading={isLoading}
                upiArray={upiArray}
                getAllUPIData={getAllUPIData}
              />
            }
            <div></div>
            <div className="payment-option">
              <div className="payment-element">
                <input
                  type="radio"
                  id="card"
                  value="card"
                  checked={selectedItem === "card"}
                  onChange={(e) => setSelectedItem(e.target.value)}
                />
                <label htmlFor="card">Debit/Credit</label>
              </div>
              <div className="payment-element">
                <input
                  type="radio"
                  id="netbanking"
                  value="netbanking"
                  checked={selectedItem === "netbanking"}
                  onChange={(e) => setSelectedItem(e.target.value)}
                />
                <label>NetBanking</label>
              </div>
              <div className="payment-element">
                <input
                  type="radio"
                  id="e-wallet"
                  value="e-wallet"
                  checked={selectedItem === "e-wallet"}
                  onChange={(e) => setSelectedItem(e.target.value)}
                />
                <label>E-Wallet</label>
              </div>
              <div className="payment-element">
                <input
                  type="radio"
                  id="upi"
                  value="upi"
                  checked={selectedItem === "upi"}
                  onChange={(e) => setSelectedItem(e.target.value)}
                />
                <label>UPI</label>
              </div>
              <div className="payment-element_">
                <label>Credit line with Fastr</label>
                <Switch
                  onChange={() => setSelectedItem("toggle")}
                  color="primary"
                />
              </div>
            </div>
            {selectedItem === "card" && <UpdatedCard getAllCard={getAllCard} />}
            {selectedItem === "netbanking" && <NetBanking />}
            {selectedItem === "e-wallet" && <ECurrency />}
            {selectedItem === "upi" && (
              <UPI setIsLoading={setIsLoading} getAllUPIData={getAllUPIData} />
            )}
            {selectedItem === "toggle" && <CreditLine />}
          </div>
        </div>
        <div className="order-box">
          <h3>Order Summary</h3>
          <div className="item-box">
            <img src={laptop} alt="item img"></img>
            <div className="items">
              <p>
                HP AMD Ryzen 3 Quad Core 5300U - (8 GB/512 GB SSD/Windows 11
                Home)
              </p>
              <h5>$160</h5>
            </div>
          </div>
          <div className="item-box">
            <img src={disc} alt="item img"></img>
            <div className="items">
              <p>
                SAMSUNG Crystal Vision 4K iSmart with Voice Assistant 138 cm (55
                inch) Ultra HD (4K) LED Smart Tizen TV
              </p>
              <h5>$250</h5>
            </div>
          </div>
          <div className="item-details">
            <div className="item-details-list">
              <p>Sub-Total</p>
              <p>Shipping</p>
              <p>Discount</p>
              <p>Tax</p>
            </div>
            <div className="item-details-list">
              <p>$410</p>
              <p>Free</p>
              <p>$10</p>
              <p>$8</p>
            </div>
          </div>
          <div className="total-value">
            <h5>Total</h5>
            <h5>${total}</h5>
          </div>
          <div className="split-checkout-box">
            {copiedDataLength !== 0 ? (
              <div className="split-bar">
                <p>
                  <strong>After Split</strong>(Amount is editable){" "}
                </p>
              </div>
            ) : (
              ""
            )}
            {copiedCard.map((item, i) => {
              if (item !== 0) {
                return (
                  <>
                    <motion.div
                      key={i + 1}
                      className="cardData-box"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <div className="card-value">
                        <div className="edit-del">
                          <ModeEditOutlinedIcon
                            style={{ color: "#007bff" }}
                            onClick={() => {
                              setShowModal(true);
                              setIdx(i);
                            }}
                          />
                          <HighlightOffOutlinedIcon
                            style={{ color: "#dc3545" }}
                            onClick={() => {
                              removeCard(i);
                            }}
                          />
                        </div>
                        <p>{String(item.cardNumber).slice(0, 4)}...</p>
                      </div>
                      <div className="card-value">
                        <span>
                          ${enterAmnt[i] === 0 ? splitAmount : enterAmnt[i]}
                        </span>
                      </div>
                    </motion.div>
                    {showModal && idx === i ? (
                      <div className="input-modal">
                        <p>Amount should be between 0 and {total}</p>
                        <input
                          type="text"
                          value={splitAmount}
                          min={0}
                          max={total}
                          onChange={(e) => {
                            setSplitAmount(e.target.value);
                          }}
                        ></input>
                        <div className="modal-close-icon">
                          <button
                            onClick={() => {
                              setShowModal(false);
                              handlerAmount(i, splitAmount);
                            }}
                          >Done</button>
                        </div>
                      </div>
                    ) : (
                      ""
                    )}
                  </>
                );
              } else {
                return null;
              }
            })}
            {copiedUpiHandle.map((item, i) => {
              if (item !== 0) {
                return (
                  <>
                    <motion.div
                      key={i + 1}
                      className="cardData-box"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <div className="card-value">
                        <div className="edit-del">
                          <ModeEditOutlinedIcon
                            style={{ color: "#007bff" }}
                            onClick={() => {
                              setShowModalUpi(true);
                              setIdxUpi(i);
                            }}
                          />
                          <HighlightOffOutlinedIcon
                            style={{ color: "#dc3545" }}
                            onClick={() => {
                              removeUpihandle(i);
                            }}
                          />
                        </div>
                        <p>{String(item.upiId).slice(0, 4)}...</p>
                      </div>
                      <div className="card-value">
                        <span>
                          $
                          {enterAmnt[i + cardLength] === 0
                            ? splitAmount
                            : enterAmnt[i + cardLength]}
                        </span>
                      </div>
                    </motion.div>
                    {showModalUpi && idxUpi === i ? (
                      <div className="input-modal">
                        <p>Amount should be between 0 and {total}</p>
                        <input
                          type="text"
                          value={splitAmount}
                          min={0}
                          max={total}
                          onChange={(e) => {
                            setSplitAmount(e.target.value);
                          }}
                        ></input>
                        <div className="modal-close-icon">
                          <button
                            onClick={() => {
                              setShowModalUpi(false);
                              handlerAmount(i + cardLength, splitAmount);
                            }}
                          >Done</button>
                        </div>
                      </div>
                    ) : (
                      ""
                    )}
                  </>
                );
              } else {
                return null;
              }
            })}
          </div>

          {copiedDataLength !== 0 ? (
            <div className="total-value">
              <h5>Total</h5>
              <h5
                className={
                  sumOfSplitMoney === total ? "validTotal" : "invalidTotal"
                }
              >
                ${sumOfSplitMoney}
              </h5>
            </div>
          ) : (
            ""
          )}
          <button
            disabled={copiedDataLength !== 0 ? false : true}
            onClick={() => handlePayment(paymentData)}
          >
            Place Order <ArrowRightAlt />
          </button>
        </div>
      </div>
      {openModal ? (
        <div className="modal">
          <div className="overlay"></div>
          <div className="modal-content">
            <div className="card-input-box">
              <div className="modal-close-icon">
                <Close
                  onClick={() => setOpenModal(false)}
                  style={{ color: "#14667e", cursor: "pointer" }}
                />
              </div>
              <div className="input-box">
                <label>Name on Card</label>
                <input
                  type="text"
                  value={updatedCardName}
                  onChange={(e) => setUpdatedCardName(e.target.value)}
                />
              </div>
              <div className="input-box">
                <label>Card Number</label>
                <input
                  type="text"
                  value={updatedCardNumber}
                  onChange={(e) => setUpdatedCardNumber(e.target.value)}
                />
              </div>
              <div className="ex-cvv">
                <div className="input-box">
                  <label>Expiry Date</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={updatedExpiryDate}
                    onChange={(e) => setUpdatedExpiryDate(e.target.value)}
                  />
                </div>
                <div className="input-box">
                  <label>CVV</label>
                  <input
                    type="password"
                    value={updatedcvv}
                    onChange={(e) => setUpdatedCVV(e.target.value)}
                  />
                </div>
              </div>
              <button
                type="submit"
                onClick={() => {
                  handleUpdateCard(selectId);
                  setOpenModal(false);
                }}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
      {transactionModal ? (
        <TransactionStatus transaction={transactionStatusArray} />
      ) : (
        success && <TransactionLoader />
      )}
    </>
  );
};

export default PaymentPage;
