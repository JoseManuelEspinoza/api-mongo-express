const express=require("express");
const route=express.Router();
const {config}=require("dotenv");
const mongoose=require("mongoose");
const bookRouters=require('./routes/book.route');
const bodyParse=require("body-parser");
const { findById } = require("./model/book.model");

config();


//Usamos express par los middleware
const app=express();
app.use(bodyParse.json())
const port=process.env.PORT||3000;

//Conectar a la base de datos
mongoose.connect(process.env.MONGO_URL,{dbName:process.env.MONGO_NAME}).then(
    ()=>{console.log("Conectado a la base de datos")}
).catch(
    (error)=>{console.log("Error al conectar a laa base de datos",error)}
);
const db=mongoose.connection;
app.use('/books',bookRouters);
app.listen(
    port,()=>{
        console.log(`Server is running on port ${port}`);
    }
)






