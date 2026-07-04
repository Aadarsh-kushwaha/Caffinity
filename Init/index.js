const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, "../.env")
});

const mongoose = require('mongoose');
const Product = require('../models/product.js'); // correct relative path
const initData = require("./init.js");

// ====== MongoDB Connection ======
//  const dburl = "mongodb://127.0.0.1:27017/coffee-shop";


// const mongoURL = "mongodb+srv://Aadarsh_kushwaha:AadarshAadarsh@cluster0.3nfifrj.mongodb.net/?appName=Cluster0"; 

const mongoURL = process.env.ATLASDB_URL ;

// Connect to MongoDB


  async function main() {
    
  await mongoose.connect(mongoURL);
  console.log("Connected to DB");

  await initDB();

  mongoose.connection.close();
}

main().catch((err) => console.log(err));


  
  
  

const initDB = async () =>{
   // await Listing.deleteMany({});
 //  initData.data =  initData.data.map((obj)=>({...obj,owner:"68b2021bb2aa118316733e68"}));
 await Product.deleteMany({});
await Product.insertMany(initData.data);
   // await Product.insertMany(initData.data);
    console.log("Data was initialized");  
};
