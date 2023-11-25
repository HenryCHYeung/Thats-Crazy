import Home from './Home.js';
import About from './About.js';
import Checkout from './Checkout.js';
import PartList from './PartList.js';
import Laptops from './PremadeDevices.js';
import Receipt from './Receipt.js';
import {Link,Route, Routes, useLocation} from 'react-router-dom';
import './App.css';

function App() {

   const location = useLocation();
   const renderNav = !['/checkout'].includes(location.pathname);

  return (
    <>
    {renderNav && (
      <nav className='horizontalNav'>
        <Link to='/'>
          <div>
            <img className='logo' src='/Rapid_Rigs.png'/>
          </div>
        </Link>
        <ul>
          <li><Link to='/'>Home</Link></li>
          <li><Link to='/about'>About</Link></li>
          <li><Link to='/premadedevices'>Laptops and Other Devices</Link></li>
          <li><Link to='/partlist'>PC Parts</Link></li>
        </ul>
    </nav>
    )} 
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/about' element={<About/>}/>
      <Route path='/checkout' element={<Checkout/>}/>
      <Route path='/premadedevices' element={<Laptops/>}/>
      <Route path='/partlist' element={<PartList/>}/>
      <Route path='/receipt' element={<Receipt/>}/>
    </Routes>
    
    </>
  );
}

export default App;
