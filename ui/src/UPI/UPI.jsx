import React, { useState } from "react";
import axios from "axios";
const baseApiUrl = 'https://fastr-prototype.vercel.app/api'
//const baseApiUrl = 'http://localhost:3000/api'

const UPI = () =>{
  const [showform, setShowform] = useState(false);
  const [upi_amount, setUpi_amount] = useState();
  const [openModal, setOpenModal] = useState(false);
  const [transactionStatusArray, setTransactionStatusArray] = useState(null);
    

  async function handleUPIPayment() {
    try {
      const { data: { key } } = await axios.get(`${baseApiUrl}/getkey`);
      const URL = `${baseApiUrl}/makeupipayment`;
      const { data: { order } } = await axios.get(URL);
      console.log(order);
  
      // Open a new popup window for the Razorpay payment
      const paymentWindow = window.open(`${baseApiUrl}/razorpayPayment?order_id=${order.id}&&key=${key}`, 'Razorpay', 'width=800,height=600');
      
      // Return a new promise that resolves when the payment status is fetched
      const UpiPromise =  new Promise(async (resolve, reject) => {
        // Poll to check if the window is closed
        const pollTimer = window.setInterval(async function() {
          if (paymentWindow.closed !== false) { // !== is required for compatibility with Opera
            window.clearInterval(pollTimer);
  
            // Verify the payment status
            try {
              const response = await fetch(`${baseApiUrl}/upipaymentstatus`);
              const paymentStatus = await response.json();
              console.log(paymentStatus);
              resolve(paymentStatus); // Resolve the outer promise with the payment status
            } catch (error) {
              reject(error); // Reject the outer promise if there's an error
            }
          }

        }, 200);
      });

      const UPiStatus = await UpiPromise;
      //console.log(response);
      //const UPiStatus = response[1];
      const UPIStatusStructured = {payment_method : "UPI"  , paymentIntentId: UPiStatus.reference, status: UPiStatus.success ? 'succeeded' : 'failed'};
      setTransactionStatusArray([UPIStatusStructured]);
      setOpenModal(true);
      setShowform(true);
    } catch (error) {
      console.error("Error:", error);
    }  
  }
    
  
  const closeModal = () => {
    setTransactionStatusArray(null);
    setOpenModal(false);
    setShowform(false);
  }

  
  return (
    <div className="upi-only-block">
    {!showform?
    <>
      <div className="upi-only-data">
        <h5>
          Name : <strong>Fastr Pay</strong>
        </h5>
        <h5>
          Email : <strong>fastrpayments@gmail.com </strong>
        </h5>
        <h5>
          Mob No. : <strong> 7411830194</strong>
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
        onClick={handleUPIPayment}
      >
        Pay Now
      </button>
      </>:<>
      {openModal && (
        <div className="fixed inset-0 z-50 overflow-auto bg-gray-900 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 max-w-md mx-auto rounded-md text-center">
            <h2 className="text-lg font-semibold mb-4">Transaction Status</h2>
            <p className="mb-4">{transactionStatusArray && 
              transactionStatusArray.map((status, index) => (
                <>
                <p key={index}>{status.payment_method} Payment with PaymentID {status.paymentIntentId} : {status.status} </p>
                </>
              ))
            }</p>
            <button onClick={closeModal} className="text-black bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 my-5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Close</button>
          </div>
        </div>
      )}
      </>}
     
    </div>
  );
};

export default UPI;
