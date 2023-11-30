import Home from './Home.js';
import About from './About.js';
import Checkout from './Checkout.js';
import PartList from './PartList.js';
import Receipt from './Receipt.js';
import {Link,Route, Routes, useLocation} from 'react-router-dom';
import './App.css';

function App() {

   const location = useLocation();
   const renderNav = !['/checkout'].includes(location.pathname);//This makes sure checkout won't be part of public routes and as a seperate page

  return (
    <div>
    {renderNav && (
      <nav className='horizontalNav'>{/*This is a navigation bar with tabs linked to other pages */}
        <Link to='/'>
          <div>
            <img className='logo' src='/Rapid_Rigs.png'/>
          </div>
        </Link>
        <ul>
          <li><Link to='/'>Home</Link></li>
          <li><Link to='/about'>About</Link></li>
          <li><Link to='/partlist'>PC Parts</Link></li>
        </ul>
    </nav>
    )} 
    <Routes>{/*Routes component allows connection to other pages and navigate */}
      <Route path='/' element={<Home/>}/>
      <Route path='/about' element={<About/>}/>
      <Route path='/checkout' element={<Checkout/>}/>
      <Route path='/partlist' element={<PartList/>}/>
      <Route path='/receipt' element={<Receipt/>}/>
    </Routes>
    
    </div>
  );
}

export default App;
