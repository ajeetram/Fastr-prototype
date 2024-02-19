import React, { useState } from 'react'
import CardForm from '../CardStructure/Components/CardForm'
import './cardupi.css'
import axios from "axios";
const baseApiUrl = 'https://fastr-prototype.vercel.app/api';
//const baseApiUrl = 'http://localhost:3000/api'


const CardUpi = () => {
  
    const [upi_amount, setUpi_amount] = useState();
    const [openModal, setOpenModal] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [transactionStatusArray, setTransactionStatusArray] = useState(null);
    
    async function makeCardAndUPIPayment() {
      try {
        const cardPaymentUrl = baseApiUrl + '/makepayment' + '?payment_method=pm_card_visa';
        // Encapsulate card payment in a functio
        async function handleCardPayment() {
          const response = await fetch(cardPaymentUrl);
          const cardPayment = await response.json();
          let newWindow = window.open(cardPayment.url, '_blank');
          // Set a timeout to close the window after 7 seconds to proceed with the 3DS authentication
          await new Promise(resolve => setTimeout(() => {
            newWindow.close();
            resolve();
          }, 7000));
          return cardPayment;
        }
    
        // Encapsulate UPI payment in a function
        async function handleUPIPayment() {
          try {
            const { data: { key } } = await axios.get(`${baseApiUrl}/getkey`);
            const URL = `${baseApiUrl}/makeupipayment`;
            const { data: { order } } = await axios.get(URL);
            console.log(order);
        
            // Open a new popup window for the Razorpay payment
            const paymentWindow = window.open(`${baseApiUrl}/razorpayPayment?order_id=${order.id}&&key=${key}`, 'Razorpay', 'width=800,height=600');
            
            // Return a new promise that resolves when the payment status is fetched
            return new Promise(async (resolve, reject) => {
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
          } catch (error) {
            console.error("Error:", error);
          }
        }
        // Execute both payment functions concurrently
        const responses = await Promise.all([handleCardPayment(), handleUPIPayment()]);
        //console.log(responses);
        // set the transaction status in the state
        const UPiStatus = responses[1];
        const UPIStatusStructured = {payment_method : "UPI"  , paymentIntentId: UPiStatus.reference, status: UPiStatus.success ? 'succeeded' : 'failed'};
        
        const cardStatus = await checkStatusandTakeAction([responses[0]]);
        console.log(cardStatus);
        setOpenModal(true);
        setShowForm(true);
        setTransactionStatusArray([cardStatus.status[0], UPIStatusStructured]);
      } catch (error) {
        console.error("Error:", error);
      }
    }

    async function checkStatusandTakeAction(responses) {
      if(responses.length === 1) {
        const status = await fetch(baseApiUrl + '/paymentstatus', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({paymentid1 : responses[0].paymentIntentId})
        });
        const statusResponse = await status.json();
    
        if(statusResponse.status[0] === 'requires_capture') {
          const capturePayment = await fetch(baseApiUrl + '/capturepayment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({paymentid1 : responses[0].paymentIntentId})
          });
          const captureResponse = await capturePayment.json();
          statusResponse.status = captureResponse.status;
        } else {
          const cancelPayment = await fetch(baseApiUrl + '/cancelpayment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({paymentid1 : responses[0].paymentIntentId})
          });
          const cancelResponse = await cancelPayment.json();
          statusResponse.status = cancelResponse.status;
        }
        return statusResponse;
      }
      //console.log(responses);
      const status = await fetch(baseApiUrl + '/paymentstatus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({paymentid1 : responses[0].paymentIntentId , paymentid2 : responses[1].paymentIntentId})
      }); 
      const statusResponse = await status.json();
      console.log(statusResponse);
      // if status of both the payments is 'requires_capture' then capture the payment , otherwise cancel both the payments 
      if(statusResponse.status[0] === 'requires_capture' && statusResponse.status[1] === 'requires_capture') {  
        // caputre the payment
        const capturePayment = await fetch(baseApiUrl + '/capturepayment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({paymentid1 : responses[0].paymentIntentId , paymentid2 : responses[1].paymentIntentId})
        });
        const captureResponse = await capturePayment.json();
        statusResponse.status = captureResponse.status;
      } else {
        // cancel the payment
        const cancelPayment = await fetch(baseApiUrl + '/cancelpayment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({paymentid1 : responses[0].paymentIntentId , paymentid2 : responses[1].paymentIntentId})
        });
        const cancelResponse = await cancelPayment.json();
        statusResponse.status = cancelResponse.status;
      }
      return statusResponse;
    }

    const closeModal = () => {
      setTransactionStatusArray(null);
      setOpenModal(false);
      setShowForm(false);
    }

  return (
    <div className='card-upi-container'>
    {
      !showForm ?
    <>
    <div className='header'>
    <h4>Type-<strong>Card</strong> </h4>
    <h4>Type-<strong>UPI</strong> </h4>
    </div>
    <div className='card-upi-block'>
    <div className='card-block'>
      <CardForm />
      </div>
      <div className='upi-block'>
      <div className='upi-data'>
      <h5>Name : <strong>Fastr Pay</strong></h5>
      <h5>Email : <strong>fastrpayments@gmail.com</strong></h5>
      <h5>Mob No. : <strong>7411830194</strong></h5>
      <input type='number' value={upi_amount} placeholder='Enter Amount' onChange={(e)=>setUpi_amount(e.target.value)}></input>
      </div>
      <button type='submit' onClick={makeCardAndUPIPayment} className='btn btn-primary'>Pay Now</button>
      </div>
      </div>
      </>:
      <>
      {openModal && (
        <div className="fixed inset-0 z-50 overflow-auto bg-gray-900 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 max-w-md mx-auto rounded-md text-center">
            <h2 className="text-lg font-semibold mb-4">Transaction Status</h2>
            <p className="mb-4">{transactionStatusArray && 
              transactionStatusArray.map((status, index) => (
                <>
                <p key={index}>{status.payment_method} Payment with PaymentID <strong>{status.paymentIntentId} : {status.status} </strong></p>
                </>
              ))
            }</p>
            <button onClick={closeModal} className="text-black bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 my-5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Close</button>
          </div>
        </div>
      )}
      </>
    }
    </div>
  )
}

export default CardUpi
