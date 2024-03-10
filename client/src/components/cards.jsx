import React,{useEffect,useState} from "react";
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import axios from 'axios';
 import { Link } from 'react-router-dom';
 import Button from 'react-bootstrap/Button';


function Cards(){

  const [backendData,setBackendData]=useState([{}]);
  const [images,setImages]=useState([{}]);
  let img=[];

  useEffect( ()=>{
    fetch("/fetchApartment").then(
     response => response.json()
   ).then(
     data => {
       setBackendData(data.apartments);
       setImages(data.imgs);
     }
   )
    },[]);

    if(typeof backendData !== 'undefined' && typeof images !== 'undefined'){
      backendData.forEach((apart,index)=>{
        const item= images.find((i)=>i.apartmentId===apart.id);
        img.push(item.imageName);
      })
    }

    const SelectApartment=async(event)=>{
      event.preventDefault();
      await axios.get("/viewApartment/"+event.currentTarget.id).then((response)=>{
        console.log(response);
      });
    }

    return(
      <Row xs={1} md={3} className="g-5 m-5">
      {(typeof backendData === 'undefined' && typeof images === 'undefined') ? (
        <p>Loading...</p>
        ):(
          backendData.map((ap,i)=>(
            
            <Link style={{color:"white"}} onMouseOver={SelectApartment} id={ap.id} to={"http://localhost:3000/apartment-deteils"}>
            <Col>
              <Card key={ap.id}>
                <Card.Img variant="top" src={'/upload/'+img[i]} />
                <Card.Body>
                  <Card.Title style={{fontSize:"22px"}}>{ap.name}</Card.Title>
                  <Card.Text>
                    <p style={{fontSize:"18px"}}>{ap.size} ㎡ </p>
                    <p style={{fontSize:"25px",fontWeight:"bold"}}>{ap.price} EGP</p>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            </Link>
            
            
          ))
          
        )}
        <Col>
          <Card style={{height:"426px"}}>
            <Card.Body>
              <Link style={{color:"white"}} to={"http://localhost:3000/addapartment"}>
                <Button variant="secondary" className="buttonAdd" >
                  <div className="textButtonAdd">Add New Apartment</div>
                </Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
    </Row>
    );
}

export default Cards;