import React from "react";
import Home from "./components/Home";
import AddApartment from "./components/addApartment";
import ApartmentDeteils from "./components/apartment-deteils";
import {BrowserRouter as Router, Route,Routes} from "react-router-dom";

function App(){

  return(

    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/apartment-deteils" element={<ApartmentDeteils/>}/>
          <Route path="/addapartment" element={<AddApartment/>}/>
        </Routes>
      </Router>
    </div>
  )
}

export default App;