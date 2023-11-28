import React from 'react';
import { useState} from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import './Modal.css';
import { useNavigate} from 'react-router-dom';
import Build from './PCBuild';
import Componentcard from './Card';

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
  const [repsonses, setResponse]=useState(null);

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
            setResponse(response.data);
            if (selectedTypeOption == "Laptop") {
              console.log(response.data);
              setLaptop(response.data);
              setResponse(response.data);
              setShowBuildResult(true);
              setvalidBuild(true);  
            } 
            else {
            setResponse(response.data)
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
    console.log(repsonses);
    navigate('/checkout', { state: { responses: repsonses } });
  };
  return (
    <Modal isOpen={isOpen} onRequestClose={handleCloseModal} contentLabel="Example Modal" style={{content: {width: '90%', height: '93%', margin: 'auto'}}} >
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
                          <Componentcard component='Laptop' name={laptop.Name} img={laptopimg} price={laptop.Price} storage={laptop.Storage}/>
                        </label>
                      </div>
                    </div>
                <button onClick={handleBackToForm}>Back</button>
                <div>
                  <label className='totalLabel'>
                    <h3 className='totalText'>Type: {selectedTypeOption}</h3>
                    <h3 className='totalText'>Category: {selectedUseOption}</h3>
                    <h3 className='totalText'>Budget: ${inputValue}</h3>
                    <h3 className='totalText'>Total Price: ${laptop.Price.toFixed(2)}</h3>
                  </label>
                  <button className='checkBtn' onClick={handleCheckOut}>Check Out</button>
                </div>
              </div>
              )
            }else{
              console.log(cpu)
            return (
                <div>
                <Build cpu={cpu} gpu={gpu} cased={cased} motherboard={motherboard} ram={ram} psu={psu} storage={storage} cooler={cooler}/>
                <button onClick={handleBackToForm}>Back</button>
                <div>
                  <label className='totalLabel'>
                    <h3 className='totalText'>Type: {selectedTypeOption}</h3>
                    <h3 className='totalText'>Category: {selectedUseOption}</h3>
                    <h3 className='totalText'>Storage Size: {storage.Capacity}</h3>
                    <h3 className='totalText'>Budget: ${inputValue}</h3>
                    <h3 className='totalText'>Total Price: ${price.toFixed(2)}</h3>
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
                  <p style={{textAlign:'center'}}>
                    No PC available based on your specifications. That's crazy!<br/>Maybe try increasing the budget?
                  </p>
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