import React from 'react';
import './Checkout.css';
import { useState} from 'react';
import {useNavigate,useLocation } from 'react-router-dom';
import Ordercard from './orderCard';


function Checkout()  {
  const navigate=useNavigate();
  const location = useLocation();
  const responses = location.state?.responses;
  console.log(responses);
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

  let tax=(responses.Price*.1).toFixed(2);
  let ship=50;
  let total=responses.Price+ship+prebuilt;
  let cpuimg, gpuimg, caseimg, mother, motherimg, psuimg, storageimg, ramimg, coolerimg, laptopimg;
  let cpu, gpu, cased, motherboard, psu, storage, ram, cooler, laptop;
  if (responses.Name) {
     laptopimg =responses.Name.replace(/\s/g, '');//remove spaces by replacing space with null
     laptop = responses;
  }
  else {
   cpu=responses?.CPU;//remove spaces by replacing space with null
   gpu=responses?.GPU;
   cased=responses?.Case;
   motherboard=responses?.Motherboard;
   psu=responses?.PSU;
   storage=responses?.Storage;
   ram=responses?.RAM;
   cooler=responses?.CPU_Cooler;

  cpuimg=cpu.Name.replace(/\s/g, '');//remove spaces by replacing space with null
  gpuimg=gpu.Name.replace(/\s/g, '');
  caseimg=cased.Name.replace(/\s/g, '');
  mother=motherboard.Name.replace(/\s/g, '');
  motherimg=mother.replace(/\|/g,'');
  psuimg=psu.Name.replace(/\s/g, '');
  storageimg=storage.Name.replace(/\s/g, '');
  ramimg=ram.Name.replace(/\s/g, '');//
  if(responses.CPU_Cooler){
     coolerimg=cooler.Name.replace(/\s/g, '');
  }
}
  const handlebuilt=(event)=>{
    if(event.target.value=='yes'){
      setPrebuilt(500);
    }else{
      setPrebuilt(0);
    }
    
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
    navigate('/receipt', { state: { response: {responses,email,firstName,lastName,phoneNumber,deliveryAddress,suburb,state,postalCode,country,ship,prebuilt,tax,total} } })
  };

  return (
  <div className='checkout'>
      <div className='content'>
          <img className='checkLogo' src='Rapid_Rigs.png'/>
          <img className='checkChibi'src='/checkout.png'/>
          <h1>Review Your Order</h1>
          {laptop && (
              <Ordercard component='Laptop' name={laptop.Name} img={laptopimg} price={laptop.Price}/>
          )}
          {!laptop && ( 
            <div>
          <Ordercard component='CPU' name={cpu.Name} img={cpuimg} price={cpu.Price}/>
          <Ordercard component='GPU' name={gpu.Name} img={gpuimg} price={gpu.Price}/>
          <Ordercard component='Case' name={cased.Name} img={caseimg} price={cased.Price}/>
          <Ordercard component='Motherboard' name={motherboard.Name} img={motherimg} price={motherboard.Price}/>
          <Ordercard component='RAM' name={ram.Name} img={ramimg} price={ram.Price}/>
          <Ordercard component='PSU' name={psu.Name} img={psuimg} price={psu.Price}/>
          <Ordercard component='Storage' name={storage.Name} img={storageimg} price={storage.Price}/>
          </div>
          )}
          {cooler && (
              <Ordercard component='CPU_Cooler' name={cooler.Name} img={coolerimg} price={cooler.Price}/>              
          )}
          <p>Taxes: ${tax}</p>
          {!laptop && ( 
          <label onChange={handlebuilt}>
              Would you like it to be prebuilt for a $500 fee?
              <input type='radio' name='usage1' value="yes"/>Yes
              <input type='radio' name='usage1' value="no"/>No
          </label>
          )}
          <p>Total: ${(total).toFixed(2)}</p>
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