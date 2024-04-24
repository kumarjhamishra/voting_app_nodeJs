const mongoose = require("mongoose");
require('dotenv').config();

//define the local MongoDB connection URL
const mongoURL = process.env.MONGODB_LOCAL_URL;

//set up MongoDB connection
// mongoose.connect(mongoURL, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// });

mongoose.connect(mongoURL);

//get the default connection
//Mongoose maintains a default connection object representing the MongoDB connection
const db = mongoose.connection;

//making an event listener - connected
db.on('connected', ()=>{
    console.log('connected to MongoDB server');
});

//making an event listener - error
db.on('error', (err)=>{
    console.log('MongoDB connection error: ', err);
});

//making an event listener - disconnected
db.on('disconnected', ()=>{
    console.log('MongoDB disconnected');
});

//export the database connection
module.exports = db;