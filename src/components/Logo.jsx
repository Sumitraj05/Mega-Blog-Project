import React from 'react'
import logo from '../assets/mblog.png';

function Logo({width = '100px'}) {
  return (
      <div>
          <img src={logo} alt="My Image" />
    </div>
  )
}

export default Logo