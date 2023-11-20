import React from 'react';
import { useState} from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import './Modal.css';

const JModal = ({ isOpen, closeModal }) => {
  const [inputValue, setInputValue] = useState('');
  const [selectedUseOption, setSelectedUseOption] = useState('');
  const [selectedSizeOption, setSelectedSizeOption] = useState('');
  const [showBuildResult, setShowBuildResult] = useState(false);
  const [validBuild, setvalidBuild] = useState(false);
  const [cpu, setCpu] = useState(null);
  const [cased, setCased] = useState(null);
  const [gpu, setGpu] = useState(null);
  const [motherboard, setMotherboard] = useState(null);
  const [psu, setPsu] = useState(null);
  const [price, setPrice] = useState(null);
  const [storage, setStorage] = useState(null);
  const [cooler, setCooler] = useState(null);
  const [ram, setRam] = useState(null);


  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSize = (event) => {
    setSelectedSizeOption(event.target.value);
  };

  const handleUse = async (event) => {
    setSelectedUseOption(event.target.value);
  };
  const fetchData = async () => {
    try {
        const response = await axios.post('/finished', { selectedUseOption, selectedSizeOption, inputValue });
        if (!response.data) {
            setShowBuildResult(true);
            setvalidBuild(false);
            console.log("No PC available based on your specifications. That's crazy!");
        } else {
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
            console.log(response.data);
            setShowBuildResult(true);
            setvalidBuild(true);
        }
    } catch (error) {
            console.error('Error fetching data:', error);
    }
}
  const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            if(selectedUseOption==""||selectedSizeOption==""||inputValue==""){
                console.log("Please choose or input Valid values. That's crazy!");
            }else{
                await fetchData(); // Wait for fetchData to complete and get the data
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
  const handleCheckOut = () => {
    //setCurrentPage('checkout');
  };

  const handleCloseModal = () => {
    // Close the modal and reset the state
    setShowBuildResult(false);
    setvalidBuild(false);
    closeModal();
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={handleCloseModal} contentLabel="Example Modal">
        <button className="closeBtn" onClick={handleCloseModal}>X</button>
      <div>
      {(() => {
        if (showBuildResult) {
          if(validBuild){
            let cpuimg=cpu.Name.replace(/\s/g, '');//remove spaces by replacing space with null
            let gpuimg=gpu.Name.replace(/\s/g, '');
            let caseimg=cased.Name.replace(/\s/g, '');
            let motherimg=motherboard.Name.replace(/\s/g, '');
            let psuimg=psu.Name.replace(/\s/g, '');
            let storageimg=storage.Name.replace(/\s/g, '');
            let ramimg=ram.Name.replace(/\s/g, '');
            let coolerimg;
            if(cooler){
              coolerimg=cooler.Name.replace(/\s/g, '');
            }
            return (
              <div>
                <h2 className='modalHd'>Build Baking Results</h2>
                <label style={{position:'absolute',top:'30%',left:'10%',width:'40%', height:'40%'}}>
                  CPU: 
                  <p>{cpu.Name}</p>
                  <img style={{width:'40%', height:'40%'}} src={`/images/CPU/${cpuimg}.jpg`} alt="CPU Image" />
                </label>
                <label style={{position:'absolute',top:'30%',left:'30%',width:'40%', height:'40%'}}>
                  GPU:
                  <p>{gpu.Name}</p>
                  <img style={{width:'40%', height:'40%' }} src={`/images/GPU/${gpuimg}.jpg`} alt="GPU Image" />
                </label>
                <label style={{position:'absolute',top:'30%',left:'50%',width:'40%', height:'40%'}}>
                  Case: 
                  <p>{cased.Name}</p>
                  <img style={{width:'40%', height:'40%' }} src={`/images/Case/${caseimg}.jpg`} alt="Case Image" />
                </label>
                <label style={{position:'absolute',top:'30%',left:'70%',width:'40%', height:'40%'}}>
                  Motherboard: 
                  <p>{motherboard.Name}</p>
                  <img style={{width:'40%', height:'40%' }} src={`/images/Motherboard/${motherimg}.jpg`} alt="Motherboard Image" />
                </label>
                <label style={{position:'absolute',top:'70%',left:'10%',width:'40%', height:'40%'}}>
                  RAM: 
                  <p>{ram.Name}</p>
                  <img style={{width:'40%', height:'40%' }} src={`/images/RAM/${ramimg}.jpg`} alt="RAM Image" />
                </label>
                <label style={{position:'absolute',top:'70%',left:'30%',width:'40%', height:'40%'}}>
                  PSU: 
                  <p>{psu.Name}</p>
                  <img style={{width:'40%', height:'40%' }} src={`/images/PSU/${psuimg}.jpg`} alt="PSU Image" />
                </label>
                <label style={{position:'absolute',top:'70%',left:'50%',width:'40%', height:'40%'}}>
                  Storage: 
                  <p>{storage.Name} </p>
                  <img style={{width:'40%', height:'40%' }} src={`/images/Storage/${storageimg}.jpg`} alt="Storage Image" />
                </label>
                {cooler && (
                  <label style={{position:'absolute',top:'70%',left:'70%',width:'40%', height:'40%'}}>
                    Cooler: 
                    <p>{cooler.Name}</p>
                    <img style={{width:'40%', height:'40%'}} src={`/images/Cooler/${coolerimg}.jpg`} alt="Cooler Image" />
                  </label>
                )}
              
                
                <h3>Price: ${price.toFixed(2)}</h3>
                <button onClick={handleBackToForm}>Back</button>
                <button onClick={handleCheckOut}>Check Out</button>
              </div>
            );
          }else{
            return (
              <div>
                <h2 className='modalHd'>Build Baking Results</h2>
                <label style={{position:'absolute',top:'30%',left:'10%',width:'60%', height:'60%'}}>
                  No PC available based on your specifications. That's crazy!
                  <img style={{width:'110%', height:'110%'}} src={'/Error.png'} alt="CPU Image" />
                </label>
                <button onClick={handleBackToForm}>Back</button>
                <button onClick={handleCheckOut}>Check Out</button>
              </div>
            );
          }
        } else {
            return(
                <form onSubmit={handleSubmit}>
                  <img className='modalBackground' src='giphy.gif'/>
                  <h2 className='modalHd'>Baking Your Computer</h2>
                    <div className='priceLabel'>
                    <label>
                        Enter Your Price:
                        <input type="text" placeholder="1000.00" value={inputValue} onChange={handleInputChange} />
                    </label>
                    </div>
                    <div className='useLabel'>
                    <label>
                        Choose Gaming or Production:
                        <select id="selectChoice" name="selectChoice" value={selectedUseOption} onChange={handleUse}>
                        <option value="">Select an option</option>
                        <option value="Gaming">Gaming</option>
                        <option value="Production">Production</option>
                        </select>
                    </label>
                    </div>
                    <div className='storageLabel'>
                    <label>
                        Choose Your Storage Size:
                        <select id="selectChoice" name="selectChoice" value={selectedSizeOption} onChange={handleSize}>
                        <option value="">Select an option</option>
                        <option value="500 GB">500 GB</option>
                        <option value="1 TB">1 TB</option>
                        <option value="2 TB">2 TB</option>
                        </select>
                    </label>
                    </div>
                    <button className='buildBtn' type="submit">Build PC</button>
                </form>
            );
        }})()}
      </div>
    </Modal>
  );
};

export default JModal;


