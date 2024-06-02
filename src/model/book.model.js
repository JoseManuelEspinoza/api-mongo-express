const mongoose=require("mongoose");
const bookSchema=new mongoose.Schema(
    {
        title:String,
        author:String,
        price:Number,
        edition:String
    }
);
module.exports=mongoose.model("book",bookSchema);
