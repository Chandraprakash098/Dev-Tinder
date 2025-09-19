const express = require("express");
const jwt = require("jsonwebtoken");
const {validateSignupData} = require("../utils/validation");
const bcrypt = require("bcryptjs");
const User = require("../models/user");

const authController = {
  signup: async (req, res) => {
    try {
      const {
        firstName,
        lastName,
        email,
        password,
        age,
        gender,
        skills,
        bio,
        photo,
        photourl,
      } = req.body;

      validateSignupData(req);

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        age,
        gender,
        skills,
        bio,
        photourl,
      });

      await user.save();
      res.status(200).json({ message: "User register succssfully", user });
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  login: async(req,res)=>{
    try {
        const {email, password} = req.body;
        
        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({message:"user not found"})
        }

        const isPassMatch= bcrypt.compare(password, user.password)
        if(!isPassMatch){
          res.status("Login Failed, Password Mismatch")
        }
        
        const token = jwt.sign({userId:user._id, email:user.email}, process.env.JWT_SECRET,{expiresIn:"1d"})

        res.cookie("token",token,{
          httpOnly:true,
          secure:process.env.NODE_ENV === "production",
          sameSite:"strict",
          maxAge:24 * 60 * 60 * 1000, // 1 day
        })
        
        res.status(200).json({
      message: "Login Successful",
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
        
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Login Failed, Internal Server Error"})
    }
  },

  logout: async(req,res)=>{
    res.clearCookie("token"),
    res.status(200).json({message:"Logout Successful"})
  }
  
};

module.exports = authController;
