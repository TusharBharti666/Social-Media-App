import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";


// USER REGISTRATION // req is the data that we get from the frontend and response is the data that the backend will send back to the frontend

export const register = async (req, res) => {
    
    // here we are destructing or grabbing everything from the request body
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            picturePath,
            friends,
            location,
            occupation,
        } = req.body;
        
        // here we are using bcrypt to create a something called salt and then we hash or mix that random  salt value with our password  to encrypt the password of the users
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        // firstly we encrypt the password and the create a new user
        const newUser = new User( {
            firstName,
            lastName,
            email,
            password: passwordHash,
            picturePath,
            friends,
            location,
            occupation,
            viewedProfile: Math.floor(Math.random() * 1000),
            impressions: Math.floor(Math.random() * 1000),
        });

        const savedUser = await newUser.save(); // new user getting saved  
        res.status(201).json(savedUser); // convert the savedUser into json and send back to frontend
    }
    catch (err) {
        res.status(500).json({ error: err.message });  
    }
  
};


// LOGGING IN //
// when the user will try to login , we grab their email and password from the input or req.body
// and then findOne will look for that email in the database and bring back their info
export const login = async (req, res) => {
    try {
        const { email, password} = req.body;
        const user = await User.findOne( { email: email});
        if(!user) return res.status(400).json({ msg: "User does not exists "});

        const isMatch = await bcrypt.compare(password, user.password); // BCRYPT will compare if the password provided by the  user and the one present inside the database are same or not
        if(!isMatch) return res.status(400).json({ msg: "Invalid Credentials"});

        const token = jwt.sign({ id: user._id}, process.env.JWT_SECRET); // if the email and password gets matched we return a unique token to the user for the verification purposes
        delete user.password; // delete the pwd so that it does not get resend to the frontend
        res.status(200).json({ token, user});
    }
    catch(err) {
        res.status(500).json({ error: err.message });
    }
}

