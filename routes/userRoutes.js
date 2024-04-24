const express = require("express");
const router = express.Router();

const User = require('./../models/user');
const {jwtAuthMiddleware, generateToken} = require('./../jwt');

router.post('/signup', async(req, res) => {
    try {
        const data = req.body;

        //hw-3 logic to allow only 1 admin
        //checking any admin in the databse
        const checkAdmin = await User.findOne({role: 'admin'});
        //check if this user is admin
        if (data.role === 'admin' && checkAdmin) {
            return res.status(400).json({error: 'Admin already exists'});
        }

        //validating that the aadhar card number is of 12 digits
        if(!/^\d{12}$/.test(data.aadharCardNumber)){
            return res.status(400).json({error: 'Aadhar card number must be of 12 digits'});
        }

        //checking if the user already exists by it's aadhar number
        const userAlreadyExist = await User.findOne({aadharCardNumber: data.aadharCardNumbe});
        if(userAlreadyExist){
            return res.status(400).json({error: 'User with same aadhar card number already exists'});

        }


        //createa new user with named user
        const newUser = new User(data);

        //save the new user to the database
        const response = await newUser.save();
        console.log('data saved');

        //generating token with using payload
        //payload can be anything - so using username as payload
        const payload = {
            id: response.id
        }
        
        //printing the payload
        console.log(JSON.stringify(payload));
        const token = generateToken(payload);
        console.log("Token is: ", token);

        res.status(200).json({response: response, token: token});
        
    } catch (err) {
        console.log(err);
        res.status(500).json({error: 'internal server error'});
    }
})

//Login route
router.post('/login', async(req, res) => {
    try {
        //extract aadharCardNumber and password from request body
        const {aadharCardNumber, password} = req.body;

        //checking if aadhar card number or password is missing
        if(!aadharCardNumber || !password){
            return res.status(400).json({error: 'Aadhar card number and password are required '});
        }

        //find  the user by aadharCardNumber
        const user = await User.findOne({aadharCardNumber: aadharCardNumber});

        //if user doen't exist or wrong password show wrror
        if(!user || !(await user.comparePassword(password))){
            return res.status(401).json({error: 'Invalid aadhar card number or password'})
        }

        //if everything is correct then generate the token
        const payload = {
            id: user.id,
            
        }
        const token = generateToken(payload);

        //return token as response
        res.json({token});

        
    } catch (error) {
        console.log(error);
        res.status(500).json({error: 'Internal Server Error'});
    }
});



//profile route
router.get('/profile',jwtAuthMiddleware , async(req, res) => {
    try {
        const userData = req.user;
        //console.log("User Data: ", userData);

        //id is also present in userData
        const userId = userData.id;
        const user = await User.findById(userId);

        res.status(200).json({user});
        
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'internal server error'});
    }
});



//update password
router.put('/profile/password',jwtAuthMiddleware, async(req, res) => {
    try {
        const userId = req.user.id; //extract the id from the token
        const {currentPassword, newPassword} = req.body; // extract current and new password from the request body

        //checking if any of the password is missing
        if(!currentPassword || !newPassword){
            return res.status(400).json({error: 'Both old and new password are required'});
        }

        //find  the user by userID
        const user = await User.findById(userId);

        //if user doesn't exist or wrong password show error
        if(!user || !(await user.comparePassword(currentPassword))){
            return res.status(401).json({error: 'Invalid username or password'})
        }

        //update the user's password
        user.password = newPassword;
        await user.save();

        console.log("password updated");
        res.status(500).json({message: "Password updated"});
    } 
    catch (error) {
        console.log(error);
        res.status(500).json({error: 'internal server error'});
    }
})


module.exports = router;