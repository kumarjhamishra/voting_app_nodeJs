const mongoose = require("mongoose");
//const bcrypt = require('bcrypt');

//Defining the candidate schema
const candidateSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true //mandatory
    },
    party: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    //array of votes which stores the id of voter and the date they voted
    votes: [
        //an object
        {
            //things stored in object
            user:{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            votedAt: {
                type: Date,
                default: Date.now()
            }
        }
    ],
    voteCount: {
        type: Number, 
        default: 0
    }

});

//create user model
const Candidate = mongoose.model('Candidate', candidateSchema);
module.exports = Candidate;