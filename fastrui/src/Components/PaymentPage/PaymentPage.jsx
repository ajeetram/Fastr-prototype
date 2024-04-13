import React, { useEffect, useState } from "react";
import "./paymentPage.css";
import UpdatedCard from "../Card-Payment/CardPayment";
import NetBanking from "../NetBanking/NetBanking";
import ECurrency from "../E-Currency/ECurrency";
import UPI from "../UPI/UPI";
import laptop from "../Images/laptop.png";
import disc from "../Images/disc.png";
import { FaEdit } from "react-icons/fa";
import { ArrowRightAlt, Close,Delete } from "@mui/icons-material";
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import ModeEditOutlinedIcon from '@mui/icons-material/ModeEditOutlined';
import Switch from '@mui/material/Switch';
import axios from 'axios'
import toast from "react-hot-toast";
import CreditLine from "../CreditLine/CreditLine";


const PaymentPage = () => {
 
  const [selectedItem,setSelectedItem] = useState("card");
  const [showModal, setShowModal] = useState(false);
  const [cards, setCards] = useState([]);
  const [copiedCard, setCopiedCard] = useState([]);
  const [checkedState, setCheckedState] = useState(new Array(5).fill(false));
  const [updatedCardName, setUpdatedCardName] = useState("");
  const [updatedCardNumber, setUpdatedCardNumber] = useState("");
  const [updatedExpiryDate, setUpdatedExpiryDate] = useState("");
  const [updatedcvv, setUpdatedCVV] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [selectId, setSelectedID] = useState();
  const [splitAmount, setSplitAmount] = useState();
  const [enterAmnt, setEnterAmnt] = useState(new Array(5).fill(0));
  const [idx,setIdx] = useState(0);
  const [sumOfSplitMoney,setSumOfSplitMonay] = useState(0);


  let total = 408;
  
  // get all stored card
  const getAllCard = async()=>{
    try {
      const {data} = await axios.get('https://server-khaki-rho-94.vercel.app/api/v1/card/allCardData');
      setCards(data?.data);  
    } catch (error) {
      toast.error('error while fetching all card data')
    }
  }

  // update card data handler

  const handleUpdateCard = async (id) => {
    try {
      const { data } = await axios.put(
        `http://localhost:3032/api/v1/card/updateCard/${id}`,
        {
          cardName:updatedCardName,
          cardNumber:updatedCardNumber,
          expiryDate:updatedExpiryDate,
          cvv:updatedcvv
        }
      );

      if(data?.success)
      {
        toast.success(data.message);
        getAllCard();
      }
    } catch (error) {
      toast.error("something went wrong while updating");
    }
  };

  // delete card by its id

  const deleteCard = async(cId)=>{
    try {
      const {data} = await axios.delete(`http://localhost:3032/api/v1/card/deleteCard/${cId}`)

      if(data.success)
      {
        toast.success(data.message);
        getAllCard();
      }
      
      
    } catch (error) {
      
    }
  }


  // checkbox handler

  const handleOnChange = (position, data) => {
    const updatedCheckedState = checkedState.map((item, index) =>
      index === position ? !item : item
    );
    
    setCheckedState(updatedCheckedState);
    
  
    if (updatedCheckedState[position]) {
      setCopiedCard([...copiedCard, data]); 
      console.log(updatedCheckedState);
      
    } 
    else {
      // If checkbox is unchecked, return the rest checked data
      const filteredData = cards.filter((item, index) => updatedCheckedState[index]);
      setCopiedCard(filteredData);
    }
  };

  // handle amount

  const handlerAmount = (index,value)=>{
    const newArray = [...enterAmnt];
    newArray[index] = value;
    setEnterAmnt(newArray);
    const sum = newArray.reduce((accumulator, currentValue) => accumulator + Number(currentValue), 0);
    setSumOfSplitMonay(sum);
    console.log('i and val',index,value,newArray);
  }
  
// handle remove card from checkout

const removeCard = (index)=>{
  const filteredData = copiedCard.filter((data,i)=>i!==index);
  setCopiedCard(filteredData);
}



  useEffect(() => {
    getAllCard();
    let length = copiedCard.length;
    let eachPrice = (total/length).toFixed(2);
    setSplitAmount(eachPrice);
    let sum = length*eachPrice;
    for(let i=0;i<length;i++)
    {
      enterAmnt[i] = eachPrice;
    }
    setSumOfSplitMonay(sum);
  }, [copiedCard.length,total]);

  return (
    <>
    <div className="card-payment-container">
      <div className="payment-box">
        <h3>Billing Information</h3>
        <div className="ship-address">
          <input type="checkbox" style={{accentColor:"green"}} />
          <p>ship into different address</p>
        </div>
        <div className="billing">
          <h3>Payment Option</h3>
          {
            cards?.map((data,i)=>{
              return(
                <div key={i+1} className="cardDataBar">
                <div className="edit-del-btn">
              <input type="checkbox" 
              checked={checkedState[i]}
              onChange={()=>handleOnChange(i,data)}
              style={{accentColor:"rgb(0, 51, 255)"}}
              />
              <p>{data.cardName}</p>
              <p>{String(data.cardNumber).slice(0, 4)}...</p>
              </div>
              <div className="edit-del-btn">
              <FaEdit 
              style={{color:"#14667e", cursor:"pointer"}}
              onClick={()=>{setOpenModal(true);
              setUpdatedCardName(data.cardName);
              setUpdatedCardNumber(data.cardNumber);
              setUpdatedExpiryDate(data.expiryDate);
              setUpdatedCVV(data.cvv);
              setSelectedID(data._id)
              }}
               />
              <Delete
                    style={{color:"#dc3545",cursor:"pointer"}}
                      onClick={() => {deleteCard(data._id)}}
                    />
              </div>
            </div>
              )
            })
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
              <label htmlFor="card">
                Debit/Credit
              </label>
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
              onChange={()=>setSelectedItem("toggle")}
              color="primary"/>
            </div>
            
          </div>
          {selectedItem === "card" && (
            <UpdatedCard getAllCard = {getAllCard}/>
          )}
          {selectedItem === "netbanking" && <NetBanking />}
          {selectedItem === "e-wallet" && <ECurrency />}
          {selectedItem === "upi" && <UPI />}
          {selectedItem === "toggle" && <CreditLine />}
        </div>
      </div>
      <div className="order-box">
        <h3>Order Summary</h3>
        <div className="item-box">
          <img src={laptop} alt="item img"></img>
          <div className="items">
            <p>
              HP AMD Ryzen 3 Quad Core 5300U - (8 GB/512 GB SSD/Windows 11 Home)
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
            {copiedCard.length !==0?<div className="split-bar">
              <p>
                <strong>After Split</strong>(Amount is editable){" "}
              </p>
            </div>:""}
            {
          copiedCard.map((item,i)=>{
            return(
            <>
                <div key={i+1} className="cardData-box">
                
                  <div className="card-value">
                  <div className="edit-del">
                    <ModeEditOutlinedIcon
                    style={{color:"#007bff"}}
                    onClick={() => {setShowModal(true);setIdx(i+1)}} />
                    <HighlightOffOutlinedIcon
                    style={{color:"#dc3545"}}
                      onClick={() => {handlerAmount(i,0);removeCard(i)
                      }}
                    />
                  </div>
                    <p>{String(item.cardNumber).slice(0,4)}...</p>
                  </div>
                  <div className="card-value">
                    <span>${enterAmnt[i]===0?splitAmount:enterAmnt[i]}</span>
                  </div>
                </div>
                {showModal && idx===i+1 ? (
                  <div className="input-modal">
                    <div className="modal-close-icon">
                      <Close onClick={()=>{setShowModal(false); handlerAmount(i,splitAmount)}} />
                    </div>
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
                  </div>):""}
            </>
            )})
            }

            </div>

        {copiedCard.length !==0 ? (
          <div className="total-value">
            <h5>Total</h5>
            <h5 className={sumOfSplitMoney===total?"validTotal":"invalidTotal"}>${sumOfSplitMoney}</h5>
          </div>
        ) : (
          ""
        )}
        <button
          disabled={copiedCard.length !==0 ? false : true}
          className={
            copiedCard.length !==0
              ? "enable-place-order-button"
              : "disable-place-order-button"
          }
          onClick={()=>sumOfSplitMoney!==total?toast.error(`Sum of split cards money should be equal to ${total}`):""}
        >
          Place Order <ArrowRightAlt  />
        </button>
      </div>
    </div>
    {
      openModal?
      <div className="modal">
      <div className="overlay"></div>
      <div className="modal-content">
        <div className="card-input-box">
        <div className="modal-close-icon">
            <Close onClick={()=>setOpenModal(false)} style={{color:"#14667e", cursor:"pointer"}}/>
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
          <button type="submit" onClick={()=>{handleUpdateCard(selectId); setOpenModal(false)}}>
            Update
          </button>
          </div>
        </div>
      </div>
      :""
     }

    </>
  );
};

export default PaymentPage;
