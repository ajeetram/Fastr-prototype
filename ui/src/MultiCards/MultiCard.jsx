import React,{useState} from 'react'
import CardForm from '../CardStructure/Components/CardForm'
// const baseApiUrl = 'https://fastr-api-prototype-server.vercel.app/api';
const baseApiUrl = 'http://localhost:3000/api'

const MultiCard = () => {
  const [openModal, setOpenModal] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [transactionStatusArray, setTransactionStatusArray] = useState(null);
    async function makeSamePayment() {
        // parrallel 2 api calls for single payment
        const arr = [baseApiUrl + '/makepayment' + '?payment_method=pm_card_visa', baseApiUrl + '/makepayment'+ '?payment_method=pm_card_mastercard'];
        
        const responses = await Promise.all(
          arr.map(async url => {
            const payment = await fetch(url);
            const response = await payment.json();
            var newWindow = window.open(response.url, '_blank');
            // Set a timeout to close the window after 7 seconds to proceed with the 3DS authentication
            await new Promise(resolve => {
              setTimeout(function() {
                newWindow.close();
                resolve(); // Resolve the Promise after closing the window
              }, 7000);
            });
            return response;
          })
          
        );
        console.log(responses);
        // set the transaction status in the state
        setOpenModal(true);
        setShowForm(true);
         const transactionStatus = await checkStatusandTakeAction(responses);
        setTransactionStatusArray(transactionStatus.status);
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
    <div className='multi-card-block'>
    {!showForm ?
    <>
    <div className='multi-card'>
      <CardForm />
      <CardForm />
    </div>
    <button className='btn btn-primary' onClick={makeSamePayment}> Pay Now</button>
    </>:
    <>
    {openModal && (
        <div className="fixed inset-0 z-50 overflow-auto bg-gray-900 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 max-w-md mx-auto rounded-md text-center">
            <h2 className="text-lg font-semibold mb-4">Transaction Status</h2>
            <p className="mb-4">{transactionStatusArray && 
              transactionStatusArray.map((status, index) => (
                <>
                <p key={index}>{status.payment_method} Payment with PaymentID : <strong>{status.paymentIntentId} : {status.status} </strong></p>
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

export default MultiCard
