import React, { useState } from "react";
import "./transactionStatus.css";
import TransactionLoader from "../Loader/TransactionLoader";
import { Close } from "@mui/icons-material";

const TransactionStatus = ({ transaction }) => {
  // const { id, status, amount, merchant } = transaction;
  const [openModal, setOpenModal] = useState(false);
  const [success, setSuccess] = useState(false);

  return (
    <>
      {success ? (
        <TransactionLoader />
      ) : (
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
              <div className="transaction-status">
                <div className="transaction-status-header">
                  <h2>Transaction Status</h2>
                </div>
                <div className="transaction-status-header">
                  <div className="transaction-status-body">
                    <p>
                      Payment Type: <strong>Card</strong>
                    </p>
                    <p>
                      Status:{" "}
                      <strong className="transaction-confirmation">
                        Successfull
                      </strong>
                    </p>
                    <p>
                      Amount: $<strong>208</strong>
                    </p>
                    <p>
                      Merchant:{" "}
                      <strong className="merchant-name">FastrPay</strong>
                    </p>
                  </div>
                  <p>Transaction ID: 123465NG767</p>
                </div>
                <div className="transaction-status-header">
                  <div className="transaction-status-body">
                    <p>
                      Payment Type: <strong>Card</strong>
                    </p>
                    <p>
                      Status:{" "}
                      <strong className="transaction-confirmation">
                        Successfull
                      </strong>
                    </p>
                    <p>
                      Amount: $<strong>200</strong>
                    </p>
                    <p>
                      Merchant:{" "}
                      <strong className="merchant-name">FastrPay</strong>
                    </p>
                  </div>
                  <p>Transaction ID: 3465N4G76347</p>
                </div>
                <div className="transaction-status-footer">
                  <button type="button">Back To Payment-Page</button>
                  <button type="button">Go To Home-Page</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TransactionStatus;
