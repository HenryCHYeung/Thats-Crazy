import React from 'react';
import './About.css';

function About() {
  
  return (//Making stuff invisible + the conditional rendering between home, StorageChoice and typeChoice, home is just made invisible for simplicity.
  <div className='aboutContainer'>
    <h1 className='aboutTitle'>Here to make your life easier!</h1>
    <p>If you're currently in the market for a new computer and you're finding yourself swamped by the vast array of choices, don't worry. Whether you're a dedicated gamer, a content creator, a business professional, or just in need of a dependable everyday PC, we've got your back. At Rapid Rigs, we firmly believe that the process of finding your ideal computer should be a breeze. That's precisely why we've put together a user-friendly platform that guides you through every step of the way, from pinpointing your unique requirements to piecing together your dream PC, we're here to make your computer buying experience a piece of cake.</p>
    <p>Our inspiration for this project comes from a very relatable experience. We've all been in that situation where shopping for a new computer feels like navigating a maze of endless options. This project was born out of our own frustrations and the shared desire to simplify this process, not just for ourselves but for everyone else facing the same challenge. Our aim is to create a user-friendly platform that takes the complexity out of customizing a PC, so whether you're a tech enthusiast or someone who's just dipping their toes into the world of computers, you can easily configure a PC that perfectly fits your needs. Our ultimate goal is to make computer shopping a stress-free and enjoyable experience, particularly for college students and anyone else looking for a hassle-free way to find their dream PC.</p>
    <p>In conclusion, this project is all about simplifying computer customization. It's not about saving the world, but rather making the process of finding the right PC a breeze for everyone. Whether you're a college student or a tech hobbyist, our platform aims to take the headache out of computer shopping, so you can confidently build a PC that suits your needs. So, let's keep it simple and enjoyable – this project is about making life easier for those looking to find their ideal computer without the usual headaches.</p>
    <div className='credit'>
    <h3>Team That's Crazy is...</h3>
    <p>Christian Pascal - Server Hosting/Concept/Original Algorithm</p>
    <p>Henry Yeung - Algorithm Development/Database Development</p>
    <p>Guang Wei Too - Frontend Development/Database Development</p>
    <p>Ahmadullah Sharifi - Frontend Development</p>
    <p>Brahian Almonte - Server Hosting</p>
    </div>
  </div>
  );
}

export default About;