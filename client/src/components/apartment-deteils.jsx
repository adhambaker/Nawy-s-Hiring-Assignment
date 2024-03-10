import React,{useEffect,useState} from "react";
import AtomicSpinner from 'atomic-spinner';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { MDBCarousel, MDBCarouselItem, MDBCarouselCaption } from 'mdb-react-ui-kit';

function ApartmentDeteils() {
    const [backendData,setBackendData]=useState([{}]);
    const [images,setImages]=useState([{}]);

    useEffect( ()=>{
        fetch("/apartmentPage").then(
         response => response.json()
       ).then(
         data => {
           setBackendData(data.apartmentDeteils);
           setImages(data.apartmentImages);
         }
       )
        },[]);
    if(typeof backendData.name === 'undefined'){
        return (
            <div style={{marginTop:"250px",marginLeft:"650px"}}>
                <AtomicSpinner/>
            </div>)
    }

    return (
      <div >
        {(typeof backendData === 'undefined' && typeof images === 'undefined') ? (
        <AtomicSpinner/>
        ):(
            <div>
                <div style={{backgroundColor:"#E0E0E0",height:"80px"}}>
                    <img alt="nawy-logo" className="logo-pic" src="/nawy.png"/>
                    <h1 className="logo">NAWY</h1>
                </div>
                <MDBCarousel showIndicators showControls fade style={{width:"40%",marginLeft:"30%",marginTop:"40px"}}>
                    {images.map((image,i)=>(
                        <MDBCarouselItem itemId={i+1}>
                        <img src={'/upload/'+image.imageName} style={{borderRadius:"50px"}} className='d-block w-100' alt='...' />
                        <MDBCarouselCaption>
                        <h5>{backendData.name}</h5>
                        </MDBCarouselCaption>
                        </MDBCarouselItem>
                    ))}
                </MDBCarousel>
                <Container>
                <Row xs="2" lg="2" style={{width:"40%",marginTop:"70px",marginBottom:"70px"}}>
                    <Col className="headerDeteils">Apartment</Col>
                    <Col className="headerDeteils">{backendData.apartmentsize} ㎡</Col>
                    <Col className="tableDeteils">Reference No.</Col>
                    <Col className="tableDeteils">{backendData.id}</Col>
                    <Col className="tableDeteils">Bedrooms</Col>
                    <Col className="tableDeteils">{backendData.numberofbedrooms}</Col>
                    <Col className="tableDeteils">Bathrooms</Col>
                    <Col className="tableDeteils">{backendData.numberofbaths}</Col>
                    <Col className="tableDeteils">Delivery In</Col>
                    <Col className="tableDeteils">{backendData.deliveredin}</Col>
                    <Col className="tableDeteils">Finishing</Col>
                    <Col className="tableDeteils">{(backendData.finished)?(<div>Finished</div>):(<div>Unfinished</div>)}</Col>
                    <Col className="tableDeteils">Price</Col>
                    <Col className="tableDeteils">{backendData.price} EGP</Col>
                </Row>
                </Container>
            </div>
        )}
      </div>
    );
  }
  
  export default ApartmentDeteils;