import React, { useEffect, useRef, useState } from "react";
import cardscanner from "../Images/card-scanner.png";
import "./CardPayment.css";
import axios from "axios";
import toast from "react-hot-toast";
import amex from "../Images/amex.png";
import mastercard from "../Images/mastercard.png";
import visa from "../Images/visa-.png";
import { CiCreditCard1 } from "react-icons/ci";

const UpdatedCard = ({ getAllCard }) => {
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCVV] = useState("");
  const [cardBrand, setCardBrand] = useState("");
  const [inputBorder, setInputBorder] = useState(false);
  const [isInputValid, setIsInputValid] = useState(true);
  

  const createCard = async () => {
    try {
      if(cardName.length===0 || cardNumber.length===0 || expiryDate.length===0|| cvv.length===0 )
      {
        toast.error('Please provide all input details')
        setIsInputValid(false);
      }
      else{
      const { data } = await axios.post(
        "http://localhost:3032/api/v1/card/create-card",
        {
          cardName,
          cardNumber,
          expiryDate,
          cvv,
        }
      );

      if (data.success) {
        toast.success(data.message);
        getAllCard();
        setCardName("");
        setCardNumber("");
        setExpiryDate("");
        setCVV("");
      }
    }
    } catch (error) {
      toast.error("error:", error);
    }
  };


  const checkCardLength = ()=>{
    if(cardNumber.length!==16)
    {
      toast.error('carNumber Should be ')
    }
  }


  useEffect(()=>{
  const startingFirstDigits = Number(cardNumber?.slice(0, 1));
  
  if(startingFirstDigits === 4 )
  {
    setCardBrand("visa");
  }
  else if(startingFirstDigits === 2 || startingFirstDigits === 5)
  {
    setCardBrand("mastercard");
  }
  else if(startingFirstDigits === 3)
  {
    setCardBrand("amex");
  }
  else
  {
    setCardBrand("cardImg")
  }

},[cardNumber])

  

  return (
    <>
      <form className="card-payment-box">
        <div className="card-input-box">
          <div className={isInputValid?"input-box":"invalid-input-box"}>
            <label>Name on Card</label>
            <input
              type="text"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              onFocus={()=>setInputBorder(false)}
              required
            />
          </div>
          <div className="input-box">
            <label>Card Number</label>
            <div className={inputBorder?"cardNumber-input-box-focus":(isInputValid?"cardNumber-input-box":"invalid-cardNumber-input-box")} onFocus={()=>{setInputBorder(true)}}>
            {cardNumber.length!==0 ?
              <>
             {cardBrand === 'visa' ? <img src={visa} alt='visa-logo' style={{width:"30px", height:"30px"}}></img>:""}
             {cardBrand === 'mastercard' ? <img src={mastercard} alt='mastercard-logo' style={{width:"30px", height:"30px"}}></img>:""}
             {cardBrand === 'amex' ? <img src={amex} alt='amex-logo' style={{width:"30px", height:"30px"}}></img>:""}
             {cardBrand === 'cardImg' ? <CiCreditCard1 style={{width:"30px", height:"30px"}}/>:""}
             </>:<CiCreditCard1 style={{width:"30px", height:"30px"}}/>
            }
            <input
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              onFocus={()=>setInputBorder(false)}
              required
              maxLength={16}
            />
            </div>
          </div>
          <div className="ex-cvv">
          <div className={isInputValid?"input-box":"invalid-input-box"}>
              <label>Expiry Date</label>
              <input
                type="text"
                placeholder="MM/YY"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                required
                onFocus={()=>setInputBorder(false)}
              />
            </div>
            <div className={isInputValid?"input-box":"invalid-input-box"}>
              <label>CVV</label>
              <input
                type="password"
                value={cvv}
                onChange={(e) => setCVV(e.target.value)}
                required
                onFocus={()=>setInputBorder(false)}
              />
            </div>
          </div>
          <button type="submit" onClick={createCard}>
            Save
          </button>
        </div>
        <p>or</p>
        <div className="card-scanner-box">
          <img src={cardscanner} alt="scanner-img" />
          <p>Scan the Card</p>
        </div>
      </form>
      
    </>
  );
};

export default UpdatedCard;
