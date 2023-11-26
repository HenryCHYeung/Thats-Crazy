import React from 'react';
import {useNavigate,useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './Receipt.css';


function Receipt() {
  const navigate= useNavigate();
  const location = useLocation();
  const responses = location.state?.response;

  let cpu=responses.responses.CPU;
  let gpu=responses.responses.GPU;
  let cased=responses.responses.Case;
  let motherboard=responses.responses.Motherboard;
  let psu=responses.responses.PSU;
  let storage=responses.responses.Storage;
  let ram=responses.responses.RAM;
  let cooler=responses.responses.CPU_Cooler;
  let fname=responses.firstName;
  let lname=responses.lastName;
  let deliveryAddress=responses.deliveryAddress;
  let suburb=responses.suburb;
  let state=responses.state;
  let postalCode=responses.postalCode;
  let ship=responses.ship;
  let prebuilt=responses.prebuilt
  let total=responses.total;
  let tax=responses.tax;
 

  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000); // Update every second

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  const formattedDate = currentDate.toLocaleDateString(undefined, options);
  const handleDone =()=>{
    navigate('/')
  }

  return (
    <div>
      <div className='receiptContent'>
        <h1>Thank You For Purchasing!</h1>
        <h3>Your Item(s) will be shipped shortly</h3>
        <h5>Receipt for {fname} {lname} from {formattedDate}</h5>
        <div>
        <hr/>
          <h5>Shipping address</h5>
          <p>{deliveryAddress}, {suburb}, {state}, {postalCode}</p>
          <h5>Items</h5>
          <p>CPU: {cpu.Name} Price: ${cpu.Price}</p>
          <p>GPU: {gpu.Name} Price: ${gpu.Price}</p>
          <p>Case: {cased.Name} Price: ${cased.Price}</p>
          <p>Motherboard: {motherboard.Name} Price: ${motherboard.Price}</p>
          <p>PSU: {psu.Name} Price: ${psu.Price}</p>
          <p>Storage: {storage.Name} Price: ${storage.Price}</p>
          <p>Ram: {ram.Name} Price: ${ram.Price}</p>
          {cooler && (
            <p>Cooler: {cooler.Name} Price: ${cooler.Price}</p>
          )}
          <p>Building fee: ${prebuilt}</p>
          <p>Tax: ${tax}</p>
          <p>Shipping fee: ${ship}</p>
          <hr/>
          <h5>Total: ${total.toFixed(2)}</h5>
        </div>
        <button onClick={handleDone}>Done</button>
      </div>
    </div>
    );
}

export default Receipt;