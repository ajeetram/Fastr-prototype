import React from 'react'
import './transactionLoader.css'
const TransactionLoader = () => {
  return (
<div className="payment-loader-container">
  <div className="payment-loader">
    <div className="payment-circle">
      <div className="payment-inner-circle">
      </div>
      <p>
   payment
      </p>
      <p>
   proccessing...
      </p>
    </div>
  </div>
</div>
  )
}

export default TransactionLoader
