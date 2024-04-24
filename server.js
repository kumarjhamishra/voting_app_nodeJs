//making server with express
const express = require("express");
const app = express();
const db = require('./db');
require('dotenv').config();

//acquiring the env file
//require('dotenv').config();

const bodyParser = require('body-parser');
app.use(bodyParser.json()); //req.body
const PORT = process.env.PORT || 3000;


//import the router files
const userRoutes = require('./routes/userRoutes');
const candidateRoutes = require('./routes/candidateRoutes');

//use the routes
app.use('/user', userRoutes);
//user performing operation on candidate should be admin
app.use('/candidate' ,candidateRoutes);


app.listen(PORT, ()=> {
    console.log('listening on port 3000');
})