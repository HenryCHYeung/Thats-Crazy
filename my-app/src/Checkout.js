import React from 'react';


function Checkout(response) {
  console.log(response)
  return (//Making stuff invisible + the conditional rendering between home, StorageChoice and typeChoice, home is just made invisible for simplicity.
  <div>
    <div>
      <h3>Review Your Order</h3>
      <div>

      </div>
    </div>
    <div>
      <h3>Shipping</h3>
    </div>
    <div>
      <h3>Payment</h3>
    </div>
    <img src='./cards.jpg'/>
  </div>
  );
}

export default Checkout;