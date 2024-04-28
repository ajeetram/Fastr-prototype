import React from 'react'
import './transactionLoader.css'
import BouncingLoader from './BouncingLoader'
const TransactionLoader = () => {
  return (
    <div className="modal">
    <div className="overlay"></div>
    <div className="modal-content">
    <div className='transaction-loader'>
    Payment processing... <BouncingLoader />
    </div>
    </div>
    </div>

  )
}

export default TransactionLoader
