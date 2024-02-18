import React,{useState} from 'react'
import CardForm from '../CardStructure/Components/CardForm'
const baseApiUrl = 'http://localhost:3000/api';

const MultiCard = () => {
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
        // setOpenModal(true);
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

  return (
    <div className='multi-card-block'>
    <div className='multi-card'>
      <CardForm />
      <CardForm />
    </div>
    <button className='btn btn-primary' onClick={makeSamePayment}> Pay Now</button>
  </div>
  )
}

export default MultiCard
