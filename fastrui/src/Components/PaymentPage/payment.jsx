import axios from "axios";
const baseApiUrl = 'https://fastr-api-prototype-server.vercel.app/api';
// const baseApiUrl = "http://localhost:3001/api"
const transactionStatusArray = [];
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


async function cardPayment(cardData) {
  let arr = [];
  if(cardData.length === 1) {
    arr = [baseApiUrl + '/makepayment' + '?payment_method=pm_card_visa' + '&amount=' + Math.round(cardData[0].amount*100) + '&cardHolderName=' + cardData[0].cardHolderName];
  } else {
  arr = [baseApiUrl + '/makepayment' + '?payment_method=pm_card_visa' + '&amount=' + Math.round(cardData[0].amount*100) + '&cardHolderName=' + cardData[0].cardHolderName , baseApiUrl + '/makepayment' + '?payment_method=pm_card_mastercard' + '&amount=' + Math.round(cardData[0].amount*100)  + '&cardHolderName=' + cardData[0].cardName ];
  } 
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
  const transactionStatus = await checkStatusandTakeAction(responses);
  transactionStatusArray.push(transactionStatus);
  console.log(transactionStatusArray);
  return transactionStatusArray;
}

// card & upi payment

async function makeCardAndUPIPayment(cardData, upiData) {
  try {
    const cardPaymentUrl = baseApiUrl + '/makepayment' + '?payment_method=pm_card_visa' + '&amount=' + Math.round(cardData[0].amount*100) + '&cardHolderName=' + cardData[0].cardHolderName;
    // Encapsulate card payment in a function
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
    const upiPaymentUrl = baseApiUrl + '/makeupipayment' + "?amount=" + upiData[0].amount;
    // Encapsulate UPI payment in a function
    async function handleUPIPayment(upiData) {
      
      try {
        const { data: { key } } = await axios.get(`${baseApiUrl}/getkey`);
        const URL = upiPaymentUrl
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
    transactionStatusArray.push(cardStatus);
    transactionStatusArray[0].status.push(UPIStatusStructured);
    console.log(transactionStatusArray);
    return transactionStatusArray;
  } catch (error) {
    console.error("Error:", error);
  }
}

async function makeUPIPayments(upiData){
  const responses = await Promise.all(
    upiData.map(async (data) => {
      try {
        // Fetching the key
        const { data: { key } } = await axios.get(`${baseApiUrl}/getkey`);
  
        // Fetching the order
        const { data: { order } } = await axios.get(`${baseApiUrl}/makeupipayment?amount=${data.amount}`);
  
        // Open a new popup window for the Razorpay payment
        const paymentWindow = window.open(`${baseApiUrl}/razorpayPayment?order_id=${order.id}&key=${key}`, '_blank' ,'Razorpay', 'width=800,height=600');
        
        // Return a new promise that resolves when the payment status is fetched
        return new Promise((resolve, reject) => {
          // Poll to check if the window is closed
          const pollTimer = window.setInterval(async function() {
            if (paymentWindow.closed) {
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
        console.error("Error processing payment:", error);
        throw error;
      }
    })
  );

  console.log(responses);
  
  const upiStatus1 = {payment_method : "UPI"  , paymentIntentId: responses[0].reference, status: responses[0].success ? 'succeeded' : 'failed'};
  const upiStatus2 = {payment_method : "UPI"  , paymentIntentId: responses[1].reference, status: responses[1].success ? 'succeeded' : 'failed'};
  transactionStatusArray.push({status : [upiStatus1, upiStatus2]});
  return transactionStatusArray;
}

async function makePayment(paymentData) {
  console.log('Payment data: ', paymentData);
    let cardData = [];
    for(let i = 0; i < paymentData.length; i++) {
        if(paymentData[i].method === 'card') {
            cardData.push(paymentData[i]);
        }
    }
    let upiData = [];
    for(let i = 0; i < paymentData.length; i++) {
        if(paymentData[i].method === 'upi') {
            upiData.push(paymentData[i]);
        }
    }
    console.log(upiData);
    if(upiData.length > 0 && cardData.length > 0) {
      await makeCardAndUPIPayment(cardData, upiData);
    }
    else{
      if(cardData.length > 0) {
        await cardPayment(cardData);
      }
      else if(upiData.length > 0) {
        await makeUPIPayments(upiData);
      }
    }
    console.log(transactionStatusArray);
    return transactionStatusArray;
}

export default makePayment;