import React from 'react';
import { useState} from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import './Modal.css';
import Componentcard from './Card';
import { useNavigate} from 'react-router-dom';

const JModal = ({ isOpen, closeModal }) => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState('');
  const [selectedUseOption, setSelectedUseOption] = useState('');
  const [selectedSizeOption, setSelectedSizeOption] = useState('');
  const [selectedTypeOption, setSelectedTypeOption] = useState('');
  const [showBuildResult, setShowBuildResult] = useState(false);
  const [baking, setBaking] = useState(false);
  const [validBuild, setvalidBuild] = useState(false);
  const [isLaptop, setIsLaptop] = useState(true); 
  const [laptop, setLaptop] = useState(null);
  const [cpu, setCpu] = useState(null);
  const [cased, setCased] = useState(null);
  const [gpu, setGpu] = useState(null);
  const [motherboard, setMotherboard] = useState(null);
  const [psu, setPsu] = useState(null);
  const [price, setPrice] = useState(null);
  const [storage, setStorage] = useState(null);
  const [cooler, setCooler] = useState(null);
  const [ram, setRam] = useState(null);
  const [repsonses,setResponse]=useState(null);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSize = (event) => {
    setSelectedSizeOption(event.target.value);
  };

  const handleUse = async (event) => {
    setSelectedUseOption(event.target.value);
  };
  const handleType = (selectedType) => {
    setIsLaptop(selectedType === 'Laptop');
    setSelectedTypeOption(selectedType);
  };
  
  const fetchData = async () => {
    try {
        const response = await axios.post('/finished', { selectedTypeOption, selectedUseOption, selectedSizeOption, inputValue });
        if (!response.data) {
            setShowBuildResult(true);
            setvalidBuild(false);
            setBaking(false);
            console.log("No PC available based on your specifications. That's crazy!");
        } else {
            if (selectedTypeOption == "Laptop") {
              console.log(response.data);
              setLaptop(response.data);
              setShowBuildResult(true);
              setvalidBuild(true);  
            } 
            else {
            if (response.data.Cooler) {
                setCooler(response.data.Cooler)
            }
            setCpu(response.data.CPU);
            setGpu(response.data.GPU);
            setCased(response.data.Case);
            setMotherboard(response.data.Motherboard);
            setPsu(response.data.PSU);
            setPrice(response.data.Price);
            setStorage(response.data.Storage);
            setRam(response.data.RAM);
            setCooler(response.data.CPU_Cooler)
            console.log(response.data);
            setShowBuildResult(true);
            setvalidBuild(true);
          }
        }
    } catch (error) {
            console.error('Error fetching data:', error);
    }
}
  const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            if(selectedUseOption==""||selectedTypeOption==""||inputValue==""||
            ((selectedTypeOption=="Desktop") && selectedSizeOption=="")){
                console.log("Please choose or input Valid values. That's crazy!");
            }else{
                setBaking(true);
                await new Promise((resolve) => setTimeout(resolve, 2000));
                await fetchData(); // Wait for fetchData to complete and get the data
                setBaking(false)
            }
            
        } catch (error) {
            console.error('Error handling form submission:', error);
        }
    
    };


  const handleBackToForm = () => {
    // Set state to go back to the initial form
    setShowBuildResult(false);
    setvalidBuild(false);
  };


  const handleCloseModal = () => {
    // Close the modal and reset the state
    setShowBuildResult(false);
    setvalidBuild(false);
    closeModal();
  };
  const handleCheckOut = () => {
    navigate('/checkout', { state: { responses: repsonses } });
  };
  return (
    <Modal isOpen={isOpen} onRequestClose={handleCloseModal} contentLabel="Example Modal" style={{content: {width: '80%', height: '70%', margin: 'auto'}}} >
        <button className="closeBtn" onClick={handleCloseModal}>X</button>
      <div>
      {(() => {
        if (showBuildResult) {
          if(validBuild) {
            console.log(validBuild);
            if(isLaptop) {
              let laptopimg =laptop.Name.replace(/\s/g, '');//remove spaces by replacing space with null
              return(
                <div>
                  <h2 className='modalHD'>Build Baking Results</h2>
                  <div className='buildForm'>
                      <div className='parts'>
                        <label style={{position:'absolute', top:'20%',left:'35%',width:'50%', height:'0%'}}>
                          <Componentcard component='Laptop' name={laptop.Name} img={laptopimg} price={laptop.Price}/>
                        </label>
                      </div>
                    </div>
                <button onClick={handleBackToForm}>Back</button>
                <div>
                  <label className='totalLabel'>
                    <h3>Total Price: ${price.toFixed(2)}</h3>
                  </label>
                  <button className='checkBtn' onClick={handleCheckOut}>Check Out</button>
                </div>
              </div>
              )
            }else{
            let cpuimg=cpu.Name.replace(/\s/g, '');//remove spaces by replacing space with null
            let gpuimg=gpu.Name.replace(/\s/g, '');
            let caseimg=cased.Name.replace(/\s/g, '');
            let mother=motherboard.Name.replace(/\s/g, '');
            let motherimg=mother.replace(/\|/g,'');
            let psuimg=psu.Name.replace(/\s/g, '');
            let storageimg=storage.Name.replace(/\s/g, '');
            let ramimg=ram.Name.replace(/\s/g, '');//
            let coolerimg;
            if(cooler){
              coolerimg=cooler.Name.replace(/\s/g, '');
            }
            return (
                <div>
                  <h2 className='modalHD'>Build Baking Results</h2>
                    <div className='buildForm'>
                      <div className='parts'>
                        <label style={{position:'absolute',top:'20%',left:'10%',width:'13%', height:'13%'}}>
                          <Componentcard component='CPU' name={cpu.Name} img={cpuimg} price={cpu.Price}/>
                        </label>
                        <label className='' style={{position:'absolute',top:'20%',left:'30%',width:'13%', height:'13%'}}>
                          <Componentcard component='GPU' name={gpu.Name} img={gpuimg} price={gpu.Price}/>
                        </label>
                        <label className='' style={{position:'absolute',top:'20%',left:'50%',width:'13%', height:'13%'}}>
                        <Componentcard component='Case' name={cased.Name} img={caseimg} price={cased.Price}/>
                        </label>
                        <label className='' style={{position:'absolute',top:'20%',left:'70%',width:'13%', height:'13%'}}>
                        <Componentcard component='Motherboard' name={motherboard.Name} img={motherimg} price={motherboard.Price}/>
                        </label>
                        <label className='' style={{position:'absolute',top:'60%',left:'10%',width:'13%', height:'13%'}}>
                        <Componentcard component='RAM' name={ram.Name} img={ramimg} price={ram.Price}/>
                        </label>
                        <label className='' style={{position:'absolute',top:'60%',left:'30%',width:'13%', height:'13%'}}>
                        <Componentcard component='PSU' name={psu.Name} img={psuimg} price={psu.Price}/>
                        </label>
                        <label className='' style={{position:'absolute',top:'60%',left:'50%',width:'13%', height:'13%'}}>
                        <Componentcard component='Storage' name={storage.Name} img={storageimg} price={storage.Price}/>
                        </label>
                        {cooler && (
                          <label className='' style={{position:'absolute',top:'60%',left:'70%',width:'13%', height:'13%'}}>
                            <Componentcard component='CPU_Cooler' name={cooler.Name} img={coolerimg} price={cooler.Price}/>
                          </label>                  
                        )}
                      </div>
                    </div>
                <button onClick={handleBackToForm}>Back</button>
                <div>
                  <label className='totalLabel'>
                    <h3>Total Price: ${price.toFixed(2)}</h3>
                  </label>
                  <button className='checkBtn' onClick={handleCheckOut}>Check Out</button>
                </div>
              </div>
            );
            }
          }else{
            return (
              <div>
                <h2 className='modalHD'>Build Baking Results</h2>
                <label style={{position:'absolute',top:'30%',left:'20%',width:'60%', height:'60%'}}>
                  <p style={{textAlign:'center'}}>No PC available based on your specifications. That's crazy!</p>
                  <img style={{width:'60%', height:'80%'}} src={'/Error.png'} alt="CPU Image" />
                </label>
                <button onClick={handleBackToForm}>Back</button>
              </div>
            );
          }
        } else {
          if(!baking){
            return(
              <div className='bakingWindow'>
                <img className='modalBackground' src='giphy.gif'/>
                <form onSubmit={handleSubmit}>
                    <h2 className='modalHd'>Baking Your Computer</h2>
                    <div className='modalForm'>
                      <label className='priceLabel'>
                          <h3>Enter Your Budget:</h3> 
                          <input className='textInput' type="text" placeholder="ex.1000.00" value={inputValue} onChange={handleInputChange} />
                      </label>
                      </div>
                      <div className='typeLabel'>
                       <label>
                          <h3>Choose the PC's Type:</h3>
                           <div className='radioOptions'>
                            <input
                               type='radio'
                               name='usage'
                              value='Desktop'
                              checked={selectedTypeOption === 'Desktop'}
                              onChange={() => handleType('Desktop')}
                             />
                         Desktop
                      <input
                       type='radio'
                        name='usage'
                        value='Laptop'
                          checked={selectedTypeOption === 'Laptop'}
                          onChange={() => handleType('Laptop')}
                         />
                           Laptop
                  </div>
                    </label>
                      </div>

                      <div className='useLabel' onChange={handleUse}>
                      <label>
                          <h3>Choose the PC's Purpose:</h3>
                          <div className='radioOptions'>
                          <input type='radio' name='usage1' value="Gaming"/>Gaming
                          <input type='radio' name='usage1' value="Production"/>Production
                          </div>
                      </label>
                      </div>
                      {!isLaptop && (
                <div className='storageLabel' onChange={handleSize}>
                  <label>
                    <h3>Choose Your Storage Size:</h3>
                    <div className='radioOptions'>
                      <input type='radio' name='usage2' value='500 GB' />500 GB
                      <input type='radio' name='usage2' value='1 TB' />1 TB
                      <input type='radio' name='usage2' value='2 TB' />2 TB
                    </div>
                  </label>
                </div>
              )}
                    <button className='buildBtn' type="submit">Build PC</button>
                </form>
              </div>
            );}else{
              return(
                <div className='loadImgContainer'>
                  <img className='loadImg'src='baking.gif' alt='baking gif'/>
                  <div className='load'>
                    <h1>Currently Baking...</h1>
                  </div>
                </div>
              )
            }
        }})()}
      </div>
    </Modal>
  );
};

export default JModal;


{/**
<label className='' style={{position:'absolute',top:'30%',left:'10%',width:'40%', height:'40%'}}>
                  <p>CPU: {cpu.Name}</p>
                  <p>Price: ${cpu.Price}</p>
                  <a href={'https://www.amazon.com/s?k='+cpu.Name+'&crid=22RKV946NH24M&sprefix=MSIMPGX570GAMINGPROCARBONWIFI%2Caps%2C144&ref=nb_sb_noss'} target="_blank" rel="noopener noreferrer">
                    <img style={{width:'40%', height:'40%'}} src={`/images/CPU/${cpuimg}.jpg`} alt="CPU Image" />
                  </a>
                </label>
                <label className='' style={{position:'absolute',top:'30%',left:'30%',width:'40%', height:'40%'}}>
                  <p>GPU: {gpu.Name}</p>
                  <p>Price: ${gpu.Price}</p>
                  <a href={'https://www.amazon.com/s?k='+gpu.Name+'&crid=22RKV946NH24M&sprefix=MSIMPGX570GAMINGPROCARBONWIFI%2Caps%2C144&ref=nb_sb_noss'} target="_blank" rel="noopener noreferrer">
                  <img style={{width:'40%', height:'40%' }} src={`/images/GPU/${gpuimg}.jpg`} alt="GPU Image" />
                  </a>
                </label>
                <label className='' style={{position:'absolute',top:'30%',left:'50%',width:'40%', height:'40%'}}>
                  <p>Case: {cased.Name}</p>
                  <p>Price: ${cased.Price}</p>
                  <a href={'https://www.amazon.com/s?k='+cased.Name+'&crid=22RKV946NH24M&sprefix=MSIMPGX570GAMINGPROCARBONWIFI%2Caps%2C144&ref=nb_sb_noss'} target="_blank" rel="noopener noreferrer">
                  <img style={{width:'40%', height:'40%' }} src={`/images/Case/${caseimg}.jpg`} alt="Case Image" />
                  </a>
                </label>
                <label className='' style={{position:'absolute',top:'30%',left:'70%',width:'40%', height:'40%'}}>
                  <a href={'https://www.amazon.com/s?k='+motherboard.Name+'&crid=22RKV946NH24M&sprefix=MSIMPGX570GAMINGPROCARBONWIFI%2Caps%2C144&ref=nb_sb_noss'} target="_blank" rel="noopener noreferrer">
                  <img style={{width:'40%', height:'70%' }} src={`/images/Motherboard/${motherimg}.jpg`} alt="Motherboard Image" />
                  </a>
                  <div>
                    <p>Motherboard: {motherboard.Name}</p>
                    <p>Price: ${motherboard.Price}</p>
                  </div>
                </label>
                <label className='' style={{position:'absolute',top:'70%',left:'10%',width:'40%', height:'40%'}}>
                  <p>RAM:  {ram.Name}</p>
                  <p>Price: ${ram.Price}</p>
                  <a href={'https://www.amazon.com/s?k='+ram.Name+'&crid=22RKV946NH24M&sprefix=MSIMPGX570GAMINGPROCARBONWIFI%2Caps%2C144&ref=nb_sb_noss'} target="_blank" rel="noopener noreferrer">
                    <img style={{width:'40%', height:'40%' }}  src={`/images/RAM/${ramimg}.jpg`} alt="RAM Image" />
                  </a> 
                </label>
                <label className='' style={{position:'absolute',top:'70%',left:'30%',width:'40%', height:'40%'}}>
                  <p>PSU: {psu.Name}</p>
                  <p>Price: ${psu.Price}</p>
                  <a href={'https://www.amazon.com/s?k='+psu.Name+'&crid=22RKV946NH24M&sprefix=MSIMPGX570GAMINGPROCARBONWIFI%2Caps%2C144&ref=nb_sb_noss'} target="_blank" rel="noopener noreferrer">
                  <img style={{width:'40%', height:'40%' }} src={`/images/PSU/${psuimg}.jpg`} alt="PSU Image" />
                  </a>
                </label>
                <label className='' style={{position:'absolute',top:'70%',left:'50%',width:'40%', height:'40%'}}>
                  <p>Storage: {storage.Name}</p>
                  <p>Price: ${storage.Price}</p>
                  <a href={'https://www.amazon.com/s?k='+storage.Name+'&crid=22RKV946NH24M&sprefix=MSIMPGX570GAMINGPROCARBONWIFI%2Caps%2C144&ref=nb_sb_noss'} target="_blank" rel="noopener noreferrer">
                  <img style={{width:'40%', height:'40%' }} src={`/images/Storage/${storageimg}.jpg`} alt="Storage Image" />
                  </a>
                </label>
                {cooler && (
                  <label className='' style={{position:'absolute',top:'70%',left:'70%',width:'40%', height:'40%'}}>
                    <p>Cooler: {cooler.Name}</p>
                    <p>Price: ${cooler.Price}</p>
                    <a href={'https://www.amazon.com/s?k='+cooler.Name+'&crid=22RKV946NH24M&sprefix=MSIMPGX570GAMINGPROCARBONWIFI%2Caps%2C144&ref=nb_sb_noss'} target="_blank" rel="noopener noreferrer">
                    <img style={{width:'40%', height:'40%'}} src={`/images/Cooler/${coolerimg}.jpg`} alt="Cooler Image" />
                    </a>
                  </label>                  
                )}
                <label>
                  <h3>Total Price: ${price.toFixed(2)}</h3>
                </label>
*/}