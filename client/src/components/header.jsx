import React from "react";

function Header() {
    return (
      <div className="header">
        <img alt="nawy-logo" className="logo-pic" src="/nawy.png"/>
        <h1 className="logo">NAWY</h1>
        <div className="d-grid" style={{marginLeft:"500px",marginTop:"50px"}}>
          <div className="intro">Find your perfect Home.</div>
          <div className="subIntro">From Nawy Real Estate</div>
        </div>
      </div>
    );
  }
  
  export default Header;