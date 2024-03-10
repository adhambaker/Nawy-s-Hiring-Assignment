import express from "express";
import pg from "pg";
import bodyParser from "body-parser";
import multer from "multer";
import path from "path";

const port =5000;
const app=express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/upload', express.static('upload'));

let apartments=[];
let imgs=[];
let apartmentDeteils={};
let apartmentImages=[];

const db = new pg.Client({
    user:"postgres",
    host:"localhost",
    database:"nawy",
    password:"adhambaker",
    port: 5432
  });

  db.connect();

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'upload');
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  });

  const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
      if (
        file.mimetype == 'image/png' ||
        file.mimetype == 'image/jpg' ||
        file.mimetype == 'image/jpeg'
      ) {
        cb(null, true);
      } else {
        cb(null, false);
        return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
      }
    },
  });

  const uploadImages = upload.array('image');

  //upload images in upload folder
  app.post('/upload',async (req, res) => {
    
    uploadImages(req, res, function (err) {
      if (err) {
        return res.status(400).send({ message: err.message });
      }
      // Everything went fine.
      const files = req.files;
      res.json(files);
    });
  });
  

  

// fetch all apartments deteils from database to send them to cards page
async function fetchApartments(){
    apartments=[];
    const result=await db.query("select * from apartment");
    result.rows.forEach(async(apartment)=>{
        const ap={
            id:apartment.id,
            name:apartment.name,
            numOfBedrooms:apartment.numberofbedrooms,
            numOfBathrooms:apartment.numberofbaths,
            deliveredIn:apartment.deliveredin,
            finished:apartment.finished,
            size:apartment.apartmentsize,
            price:new Intl.NumberFormat().format(apartment.price)
        }
        apartments.push(ap);
    })
}

// fetch all apartments images from database to send them to cards page
async function fetchImages(){
    imgs=[];
    const images=await db.query("select * from apartmentsimages");
    images.rows.forEach((img)=>{
         imgs.push({imageName:img.image,apartmentId:img.apartmentid});
    });
}

// fetch apartment images from database to send them to apartment-deteils page
async function fetchApartmentImages(id){
    apartmentImages=[];
    const images=await db.query("select * from apartmentsimages where apartmentid=$1",[id]);
    images.rows.forEach((img)=>{
        apartmentImages.push({imageName:img.image,apartmentId:img.apartmentid});
    });
}

// fetch apartment deteils from database to send them to apartment-deteils page
async function fetchApartmentDeteils(id){
    apartmentDeteils={};
    const result=await db.query("select * from apartment where id=$1",[id]);
    apartmentDeteils=result.rows[0];
    apartmentDeteils.price=new Intl.NumberFormat().format(apartmentDeteils.price);
}

// insert new apartment deteils
async function insertApartment(apart,finished){
    const result = await db.query(
        "INSERT INTO apartment (name, numberofbedrooms, numberofbaths,deliveredin, finished, apartmentsize, price) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;",
        [apart.name, apart.bedrooms,apart.bathrooms,apart.deliverdin,finished,apart.size,apart.price]
      );
    const id= result.rows[0].id;
    return id;
}

// insert new apartment images
async function insertImages(id,images){
    images.forEach(async(image)=>{
        await db.query("INSERT INTO apartmentsimages (image, apartmentid) VALUES ($1,$2) RETURNING *;",
    [image,id]
    );
    });
}

//endpoint called from cards page to display all apartments
app.get("/fetchApartment",async (req,res)=>{
    await fetchApartments();
    await fetchImages();
    res.json({apartments,imgs});
})

//endpoint called from card page to prepare the data of specific apartment
app.get("/viewApartment/:id",async(req,res)=>{
    const id=req.params.id;
    await fetchApartmentDeteils(id);
    await fetchApartmentImages(id);
})

//endpoint called from apartment-deteils page to display specific apartment
app.get("/apartmentPage",(req,res)=>{
    res.json({apartmentDeteils,apartmentImages});
});


//endpoint called from addApartment page to insert new apartment
app.post("/addNewApartment",async(req,res)=>{
    const apart=req.body;
    if(apart.images.length<1){
        res.json("false");
    }else{
        const id= await insertApartment(apart.fullApartment,apart.finish);
        await insertImages(id,apart.images);
        res.json("true");
    }
    
})


app.listen(port,()=>{
    console.log("server listening on port 5000");
})