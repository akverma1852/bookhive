import React, { useEffect, useRef } from 'react';
import axios from 'axios';

const Payment = () => {
  const rzpInstanceRef = useRef(null);

  useEffect(() => {
    const initializeRazorpay = () => {
      if (!window.Razorpay) {
        return;
      }

      rzpInstanceRef.current = new window.Razorpay({
        key: 'rzp_test_UJjewN0avbPauX',
        amount: 5020,
        currency: 'INR',
        name: 'RazorPay Payment Gateway',
        description: 'Purchase Description',
        prefill: {
          name: 'Aditya Verma',
          email: 'AdityaVerma@abc.com',
          contact: '9999999999',
        },
        notes: {
          shopping_order_id: '21',
        },
        handler: (response) => {
          const paymentData = {
            payment_id: response.razorpay_payment_id,
            amount: 5020,
          };

          axios
            .post('http://127.0.0.1:5500/verify-payment', paymentData)
            .then((verificationResponse) => {
              if (verificationResponse.data.success) {
                alert('Payment successful');
              } else {
                alert('Payment verification failed');
              }
            })
            .catch((error) => {
              console.error('Error verifying payment:', error);
              alert('Payment verification failed');
            });
        },
      });

      document.querySelector('#paymentButton').addEventListener('click', () => {
        rzpInstanceRef.current.open();
      });
    };

    const loadRazorpayScript = async () => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = initializeRazorpay;
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    };

    loadRazorpayScript();
  }, []);

  return (
    <div>
      <button id="paymentButton">Pay Now</button>
    </div>
  );
};

export default Payment;
