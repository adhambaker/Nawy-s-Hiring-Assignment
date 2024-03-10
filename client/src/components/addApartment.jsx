import React,{useState} from "react";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import axios from "axios";


function AddApartment() {
    const [image, setImage] = useState([]);
    const [imageNames, setImageNames] = useState([]);
    const [fullApartment, setFullApartment] = useState({
        name:"",
        size: "",
        bedrooms: "",
        bathrooms:"",
        deliverdin:"",
        price:""
      });
    const [finished,setFinished]=useState(true);

    const handlePhotoChange = (e) => {
        if (e.target.files.length) {
          setImage([...e.target.files]);
        }
      };

      const submit = async () => {
        console.log(image.length);
        if(fullApartment.name===""||
            fullApartment.size===""||
            fullApartment.price===""||
            fullApartment.deliverdin===""||
            fullApartment.bedrooms===""||
            fullApartment.bathrooms===""){
                alert("Please fill all fields");
                return;
            }

            if(image.length !== 3){
                alert("Please select 3 images for the apartment.");
                document.getElementById("image").value="";
                return;
            }
        let name=[];
        image.forEach(async image=>{
            let formData = new FormData();
            await formData.append('image', image);
            console.log("from frontEnd");
            await axios
              .post('/upload', formData )
              .then((res) => {
                name.push(res.data[0].filename);
                return res.data;
              });
        })
        setImageNames(name);

        let apartmentData={
            fullApartment,
            finish:finished,
            images:imageNames
        }

        try {
            fetch("/addNewApartment",{
                method:'post',
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify(apartmentData)
            }).then(response=>response.json()).then(data=>{
                console.log(data);
                if(data==="true"){
                    alert("Added Successfully.");
                }else{
                    alert("Filed in Submitting, Try again.");
                }
            })
        } catch (error) {
            console.log(error);
        }
        }

      function setApartment(event) {
        const { name, value } = event.target;
        setFullApartment((prevValues) => {
          return {
            ...prevValues,
            [name]: value,
          };
        });
      }


      function handleSelected(e){
        setFinished(e.target.value);
        console.log(e.target.value);
      }

    return (
      <div >
        <div style={{backgroundColor:"#E0E0E0",height:"80px"}}>
            <img alt="nawy-logo" className="logo-pic" src="/nawy.png"/>
            <h1 className="logo">NAWY</h1>
        </div>

        <Container>
                <Row xs="2" lg="4" style={{ marginTop:"70px",marginBottom:"70px"}}>
                    <Col className="tableDeteils">Name Of Apartment</Col>
                    <Col className="tableDeteils">
                        <input type="text" name="name" required value={fullApartment.name} onChange={setApartment}/>
                    </Col>
                    <Col className="tableDeteils">Size Of Apartment</Col>
                    <Col className="tableDeteils">
                        <input type="number" name="size" required value={fullApartment.size} onChange={setApartment}/>
                    </Col>
                    <Col className="tableDeteils">Bedrooms No.</Col>
                    <Col className="tableDeteils">
                        <input value={fullApartment.bedrooms} type="number" required name="bedrooms" onChange={setApartment}/>
                    </Col>
                    <Col className="tableDeteils">Bathrooms No.</Col>
                    <Col className="tableDeteils">
                        <input value={fullApartment.bathrooms} type="number" name="bathrooms" required onChange={setApartment}/>
                    </Col>
                    <Col className="tableDeteils">Delivery In</Col>
                    <Col className="tableDeteils">
                        <input value={fullApartment.deliverdin} type="number" name="deliverdin" required onChange={setApartment}/>
                    </Col>
                    <Col className="tableDeteils">Finishing</Col>
                    <Col className="tableDeteils">
                        <Form.Select onChange={handleSelected} value={finished} className="formfinshed" required aria-label="Default select example">
                            <option value="true">Finished</option>
                            <option value="false">UnFinished</option>
                        </Form.Select>
                    </Col>
                    <Col className="tableDeteils">Price</Col>
                    <Col className="tableDeteils">
                        <input value={fullApartment.price} type="number" name="price" required onChange={setApartment}/>
                    </Col>
                </Row>
                </Container>
                <input className="uploudImageInput" id="image" type="file" multiple accept="image/*" onChange={handlePhotoChange}/>
                <p className="hintUplouad">Select 3 Images for Apartment</p>
                <Button className="submitButton" type="submit" onClick={submit} variant="secondary">
                    <div className="submitButtonText">submit </div>
                </Button>
      </div>
    );
  }
  
  export default AddApartment;