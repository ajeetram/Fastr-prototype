import React from "react";
import "./transactionStatus.css";

const TransactionStatus = ({ transaction }) => {
 // const { id, status, amount, merchant } = transaction;

  return (
    <div className="transaction-status">
      <div className="transaction-status-header">
        <h2>Transaction Status</h2>
        
      </div>
      <div className="transaction-status-header">
      <div className="transaction-status-body">
        <p>Payment Type: <strong>Card</strong></p>
        <p>Status: <strong className="transaction-confirmation">Successfull</strong></p>
        <p>Amount: $<strong>208</strong></p>
        <p>Merchant: <strong className="merchant-name">FastrPay</strong></p>
        </div>
        <p>Transaction ID: {1}</p>
      </div>
      <div className="transaction-status-header">
      <div className="transaction-status-body">
        <p>Payment Type: <strong>Card</strong></p>
        <p>Status: <strong className="transaction-confirmation">Successfull</strong></p>
        <p>Amount: $<strong>200</strong></p>
        <p>Merchant: <strong className="merchant-name">FastrPay</strong></p>
        </div>
        <p>Transaction ID: {2}</p>
      </div>
      <div className="transaction-status-footer">
        <button type="button">Back To Payment-Page</button>
        <button type="button">Go To Home-Page</button>
      </div>
    </div>
  );
};

export default TransactionStatus;