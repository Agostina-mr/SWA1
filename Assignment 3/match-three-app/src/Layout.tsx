import React from 'react';
import { Navbar } from './features/components/Navbar';

function Layout({ children }) {
  return (
    <div>
      <Navbar />
      <div  style={{display:'flex', justifyContent:'center', justifyItems:'center', alignContent:'center'}}>
      <div style={{width:'90%', justifyContent:'center', justifyItems:'center'}}>
      <div className='Title'> - Letra Crush - </div>
      {children}
      </div>
      </div>
    </div>
  );
}

export default Layout;