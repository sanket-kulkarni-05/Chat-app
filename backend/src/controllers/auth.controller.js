// import { generateToken } from "../lib/utils.js";
// import User from "../models/user.model.js";
// import bcrypt from "bcryptjs";  // Instead of "bcrypt.js"

// export const signup = async (req,res) =>{
//     const { fullName, email, password } = req.body; 
//     try{
//         if(!fullName || !email || !passowrd){
//             return res.status(400).json({message:" all fields are required"});
//         }

//         if(passowrd.length <6){
//             return res.status(400).json({message:" password must have at least 6 charcter"});
//         }

//         const user = await User.findOne({email})
//         if(user) return res.status(400).json({message: "email already exists"});
        
//         const salt = await bcrypt.genSalt(10);
//         const hashPassword = await bcrypt.hash(passowrd,salt);

//         const newUser = new User({
//             fullName:fullName,
//             email:email,
//             password:hashPassword
//         })

//         if(newUser){
//             // jwt token
//             generateToken(newUser._id,res)
//             await newUser.save();

//             res.status(201).json({
//                 _id: newUser.fullName,
//                 email:newUser.email,
//                 profilePic: newUser.profilePic,
//             });
//         }else{
//             res.status(400).json({message: "invalis user data"});
//         }
        

//     }catch(error){
//         console.log("error in signup controller", error.message);
//         res.status(500).json({message: "internal server error"});
//     }
// };

// export const login = (req,res) =>{
//     res.send("login route");
// };

// export const logout = (req,res) =>{
//     res.send("logout route");
// };

import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js"; // This path assumes generateToken is in utils.js
import User from "../models/user.model.js"; // This is correct for default import
import bcrypt from "bcryptjs"; // This is correct, no change needed here

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    // 1. Validate fields (Corrected typos for 'password')
    if (!fullName || !email || !password) { // Changed 'passowrd' to 'password'
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) { // Changed 'passowrd' to 'password'
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // 2. Check for existing user
    const user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "Email already exists" });

    // 3. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt); // Fixed variable name from 'hashPassword' to 'hashedPassword' for consistency (good job already!)

    // 4. Create and save user
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    await newUser.save(); // Save the new user to the database

    generateToken(newUser._id, res); // This line is crucial for JWT.

    // Respond with user data (Corrected _id and profilePic handling)
    res.status(201).json({
      _id: newUser._id, // Send the actual MongoDB _id
      fullName: newUser.fullName,
      email: newUser.email,
      profilePic: newUser.profilePic || null, // Ensure profilePic is handled if it might be undefined/null on creation
    });

  } catch (error) {
  
    console.error("Error in signup controller:", error.message); // This will log the specific error message

    res.status(500).json({ message: "Internal server error" });
  }
};

// (Keep login/logout functions unchanged as they are not the focus of this error)
export const login = async (req, res) => {
  const {email, password} = req.body; 
  try{
    const user = await User.findOne({email})
    if(!user){
      return res.status(400).json({message:"invalid credentails"})
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if(!isPasswordCorrect){
      return res.status(400).json({message:"invalid credentails"});
    }

    generateToken(user._id,res)

    res.status(200).json({
      _id:user._id,
      fullName:user.fullName,
      email:user.email,
      profilePic:user.profilePic
    })

  }catch(error){
    console.log("error in login controller", error.message);
    res.status(500).json({message: "internal server error"});
  }
 };

export const logout = (req, res) => { 
  try{
    res.cookie("jwt","",{maxAge:0})
    res.status(200).json({message: "logged out successfully"});

  }catch(error){
    console.log("error in logout controller", error.message);
    res.status(500).json({message: "internal server error"});
  }
};

export const updateProfile = async(req,res) =>{
    try{
      const {profilePic} = req.body;
      const userId = req.user._id;
      
      if(!profilePic){
        return res.status(400).json({message:"profile pic is req"});
      }

      const uploadResponse = await cloudinary.uploader.upload(profilePic)
      const updatedUser = await User.findByIdAndUpdate(userId,{profilePic:uploadResponse.secure_url},{new:true})
      res.status(200).json(updatedUser);
    }catch(error){
      console.log("error in update profile", error);
      res.status(500).json({message:"internal server error"});
    }
};

export const checkAuth = (req,res)=>{
  try{
    res.status(200).json(req.user);
  }catch(error){
    console.log("error is chechAuth controller", error.message);
    res.status(500).json({message:"internal server error"});
  }
}