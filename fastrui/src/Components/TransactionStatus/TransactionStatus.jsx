import React, { useState } from "react";
import "./transactionStatus.css";
import TransactionLoader from "../Loader/TransactionLoader";
import { Close } from "@mui/icons-material";

const TransactionStatus = (transaction) => {
  const [openModal, setOpenModal] = useState(true);
  console.log(transaction);
  let transactionStatusArray = [];
  transactionStatusArray = transaction.transaction;
  console.log(transactionStatusArray);

  return (
    openModal&&
        <div className="modal">
          <div className="overlay"></div>
          <div className="modal-content">
            <div className="card-input-box">
              <div className="modal-close-icon">
                <Close
                  onClick={()=>setOpenModal(false)}
                  style={{ color: "#14667e", cursor: "pointer" }}
                />
              </div>
              <div className="transaction-status">
                <div className="transaction-status-header">
                  <h2>Transaction Status</h2>
                </div>
                <div className="transaction-status-header">
                <div className="transaction-status-body">
                  {transactionStatusArray.map((item, i) => (
                    <div key={i} className="transaction-details">
                      <p>
                        Payment Type: <strong>{item.payment_method}</strong>
                      </p>
                      <p>
                        Status:{" "}
                        <strong className="transaction-confirmation">
                          {item.status}
                        </strong>
                      </p>
                      <p>
                        TransactionID: <strong>{item.paymentIntentId}</strong>
                      </p>
                    </div>
                  ))}
                </div>
                </div>
                <div className="transaction-status-footer">
                  <button type="button" onClick={()=>setOpenModal(false)}>Back To Payment-Page</button>
                  <button type="button" onClick={()=>setOpenModal(false)}>Go To Home-Page</button>
                </div>
              </div>
            </div>
          </div>
        </div>
  );
};

export default TransactionStatus;