import React from 'react';
import './PCBuild.css';
import Componentcard from './Card';

function Build({cpu,gpu,cased,motherboard,ram,psu,storage,cooler}){
    let cpuimg=cpu.Name.replace(/\s/g, '');//remove spaces by replacing space with null
    let gpuimg=gpu.Name.replace(/\s/g, '');
    let caseimg=cased.Name.replace(/\s/g, '');
    let mother=motherboard.Name.replace(/\|/g,'');
    let motherimg=mother.replace(/\s/g, '');
    let psuimg=psu.Name.replace(/\s/g, '');
    let storageimg=storage.Name.replace(/\s/g, '');
    let ramimg=ram.Name.replace(/\s/g, '');//
    let coolerimg;
    if(cooler){
        coolerimg=cooler.Name.replace(/\s/g,'');
    }
    return(
        <div>
            <h2 className='modalHD'>Build Baking Results</h2>
                    <div className='buildForm'>
                      <div className='parts'>
                        <label style={{position:'absolute',top:'20%',left:'10%',width:'13%', height:'13%'}}>
                          <Componentcard component='CPU' name={cpu.Name} img={cpuimg} price={cpu.Price}/>
                        </label>
                        <label style={{position:'absolute',top:'20%',left:'30%',width:'13%', height:'13%'}}>
                          <Componentcard component='GPU' name={gpu.Name} img={gpuimg} price={gpu.Price}/>
                        </label>
                        <label style={{position:'absolute',top:'20%',left:'50%',width:'13%', height:'13%'}}>
                        <Componentcard component='Cases' name={cased.Name} img={caseimg} price={cased.Price}/>
                        </label>
                        <label style={{position:'absolute',top:'20%',left:'70%',width:'13%', height:'13%'}}>
                        <Componentcard component='Motherboard' name={mother} img={motherimg} price={motherboard.Price}/>
                        </label>
                        <label style={{position:'absolute',top:'60%',left:'10%',width:'13%', height:'13%'}}>
                        <Componentcard component='RAM' name={ram.Name} img={ramimg} price={ram.Price}/>
                        </label>
                        <label style={{position:'absolute',top:'60%',left:'30%',width:'13%', height:'13%'}}>
                        <Componentcard component='PSU' name={psu.Name} img={psuimg} price={psu.Price}/>
                        </label>
                        <label  style={{position:'absolute',top:'60%',left:'50%',width:'13%', height:'13%'}}>
                        <Componentcard component='Storage' name={storage.Name} img={storageimg} price={storage.Price} />
                        </label>
                        {cooler && (
                          <label style={{position:'absolute',top:'60%',left:'70%',width:'13%', height:'13%'}}>
                            <Componentcard component='CPUCooler' name={cooler.Name} img={coolerimg} price={cooler.Price}/>
                          </label>                  
                        )}
                      </div>
                    </div>
        </div>
    );
}

export default Build;