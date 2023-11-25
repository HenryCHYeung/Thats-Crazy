import React from 'react';
import './Checkout.css';
import { useState} from 'react';
import {useNavigate,useLocation } from 'react-router-dom';
import Ordercard from './orderCard';

function Checkout() {
  const navigate=useNavigate();
  const location = useLocation();
  const responses = location.state?.responses;
  const [holder, setHolder] = useState('');
  const [expire, setExpire] = useState('');
  const [cardnum, setCardnum] = useState('');
  const [cvv, setCVV] = useState('');

  const [email, setEmail] = useState('');
  const [firstName, setFirstname] = useState('');
  const [lastName, setLastname] = useState('');
  const [phoneNumber, setPhone] = useState('');
  const [deliveryAddress, setAddress] = useState('');
  const [suburb, setSuburb] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalcode] = useState('');
  const [country, setCountry] = useState('');

  let cpu=responses.CPU;//remove spaces by replacing space with null
  let gpu=responses.GPU;
  let cased=responses.Case;
  let motherboard=responses.Motherboard;
  let psu=responses.PSU;
  let storage=responses.Storage;
  let ram=responses.RAM;
  let cooler=responses.CPU_Cooler;


  let cpuimg=cpu.Name.replace(/\s/g, '');//remove spaces by replacing space with null
  let gpuimg=gpu.Name.replace(/\s/g, '');
  let caseimg=cased.Name.replace(/\s/g, '');
  let mother=motherboard.Name.replace(/\s/g, '');
  let motherimg=mother.replace(/\|/g,'');
  let psuimg=psu.Name.replace(/\s/g, '');
  let storageimg=storage.Name.replace(/\s/g, '');
  let ramimg=ram.Name.replace(/\s/g, '');//
  let coolerimg;
  if(responses.CPU_Cooler){
     coolerimg=cooler.Name.replace(/\s/g, '');
  }

  const handleShipping= (e, field) => {
    const value = e.target.value;
    switch (field) {
      case 'email':
        setEmail(value);
        break;
      case 'firstName':
        setFirstname(value);
        break;
      case 'lastName':
        setLastname(value);
        break;
      case 'phoneNumber':
        setPhone(value);
        break;
      case 'deliveryAddress':
        setAddress(value);
        break;
      case 'suburb':
        setSuburb(value);
        break;
      case 'state':
        setState(value);
        break;
      case 'postalCode':
        setPostalcode(value);
        break;
      case 'country':
        setCountry(value);
        break;
      default:
        break;
    }
  }

  const handlePayment= (e, field) => {
    const value = e.target.value;
    switch (field) {
      case 'holder':
        setHolder(value);
        break;
      case 'cardnum':
        setCardnum(value);
        break;
      case 'expire':
        setExpire(value);
        break;
      case 'cvv':
        setCVV(value);
        break;
      default:
        break;
    }
  }
  const handleCancel = () => {
    navigate('/')
  };
  const handlePurchase =()=>{
    navigate('/receipt', { state: { response: {responses,email,firstName,lastName,phoneNumber,deliveryAddress,suburb,state,postalCode,country} } })
  };

  return (
  <div className='checkout'>
      <img className='checkLogo' src='Rapid_Rigs.png'/>
      <div className='content'>
      
          <h3>Review Your Order</h3>
          <Ordercard component='CPU' name={cpu.Name} img={cpuimg} price={cpu.Price}/>
          <Ordercard component='GPU' name={gpu.Name} img={gpuimg} price={gpu.Price}/>
          <Ordercard component='Case' name={cased.Name} img={caseimg} price={cased.Price}/>
          <Ordercard component='Motherboard' name={motherboard.Name} img={motherimg} price={motherboard.Price}/>
          <Ordercard component='RAM' name={ram.Name} img={ramimg} price={ram.Price}/>
          <Ordercard component='PSU' name={psu.Name} img={psuimg} price={psu.Price}/>
          <Ordercard component='Storage' name={storage.Name} img={storageimg} price={storage.Price}/>
          {cooler && (
              <Ordercard component='CPU_Cooler' name={cooler.Name} img={coolerimg} price={cooler.Price}/>              
          )}
 
          <p>Total: ${responses.Price.toFixed(2)}</p>
      </div>
      
      <div className='content'>
        <span>
        <h3>Shipping Info</h3>
        <input
            className='textInput'
            type="text"
            placeholder="Email address"
            value={email}
            onChange={(e) => handleShipping(e, 'email')}
          />
          <input
            className='textInput'
            type="text"
            placeholder="First name"
            value={firstName}
            onChange={(e) => handleShipping(e, 'firstName')}
          />
          <input
            className='textInput'
            type="text"
            placeholder="Last name"
            value={lastName}
            onChange={(e) => handleShipping(e, 'lastName')}
          />
          <input
            className='textInput'
            type="text"
            placeholder="Phone number"
            value={phoneNumber}
            onChange={(e) => handleShipping(e, 'phoneNumber')}
          />
          <input
            className='textInput'
            type="text"
            placeholder="Delivery address"
            value={deliveryAddress}
            onChange={(e) => handleShipping(e, 'deliveryAddress')}
          />
          <input
            className='textInput'
            type="text"
            placeholder="Suburb/town"
            value={suburb}
            onChange={(e) => handleShipping(e, 'suburb')}
          />
          <input
            className='textInput'
            type="text"
            placeholder="State/territory"
            value={state}
            onChange={(e) => handleShipping(e, 'state')}
          />
          <input
            className='textInput'
            type="text"
            placeholder="Postalcode/ZIP Code"
            value={postalCode}
            onChange={(e) => handleShipping(e, 'postalCode')}
          />
          <input
            className='textInput'
            type="text"
            placeholder="Country"
            value={country}
            onChange={(e) => handleShipping(e, 'country')}
          />
          </span>
      </div>
      
      <div className='content'>
        <h3>Payment Method</h3>
        <input
          className='textInput'
          type="text"
          placeholder="Cardholder name"
          value={holder}
          onChange={(e) => handlePayment(e, 'holder')}
        />
        <input
          className='textInput'
          type="text"
          placeholder="Credit/Debit Card number"
          value={cardnum}
          onChange={(e) => handlePayment(e, 'cardnum')}
        />
        <input
          className='textInput'
          type="text"
          placeholder="Expiration date (MM/YY)"
          value={expire}
          onChange={(e) => handlePayment(e, 'expire')}
        />
        <input
          className='textInput'
          type="text"
          placeholder="Security code"
          value={cvv}
          onChange={(e) => handlePayment(e, 'cvv')}
        />
        <img className='creditImg'src='./cards.jpg'/> 
       
        <button  onClick={handlePurchase}>Purchase now</button>
        <button  onClick={handleCancel}>Cancel</button>
   
      </div>
  </div>
  );
}

export default Checkout;