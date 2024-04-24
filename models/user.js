const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

//Defining the person schema
const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true //mandatory
    },
    age:{
        type: Number,
        required: true
    },
    email: {
        type: String 
        //having string is not mandatory
    },
    mobile: {
        type: String,
        required: true //mandatory
    },
    address: {
        type: String,
        required: true
    },
    aadharCardNumber:{
        type: Number, 
        required: true, //mandatory
        unique: true
    },
    
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum : ['voter', 'admin'],
        default: 'voter' //making voter default
    },
    isVoted: { // to ensure that one person can only vote once
        type: Boolean,
        default: false
    }

});

userSchema.pre('save', async function(next){
    const user = this;

    //hash the password only if it has been modified (or is new)
    if(!user.isModified('password')) return next();

    try {
        //salt generation
        const salt = await bcrypt.genSalt(10);

        //hash password generation
        const hashedPasssword = await bcrypt.hash(user.password, salt);
        user.password = hashedPasssword;

        next();
    } catch (error) {
        return next(error);
    }
});

userSchema.methods.comparePassword = async function(candidatePassword){
    try {
        //use bcrypt to compare the provided password with the hashed password
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        return isMatch;
        
    } catch (error) {
        throw error;
    }
}

//create user model
const User = mongoose.model('User', userSchema);
module.exports = User;