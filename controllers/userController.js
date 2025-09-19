const User = require("../models/user");
const {
  validateProfileEditData,
} = require("../utils/validation");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userController = {
  profile: async (req, res) => {
    try {
      const user = await User.findById(req.user.userId).select(
        "-password -createdAt -updatedAt"
      );
      res.status(200).json({ message: "Prfoile fetched Succsfully", user });
    } catch (error) {
      res
        .status(500)
        .json({ message: "unable to fetch profile, Internal Server Error" });
    }
  },

  editProfile: async (req, res) => {
    try {
      const { age, skills, bio, photourl } = req.body;
      validateProfileEditData(req);
      const user = await User.findByIdAndUpdate(req.user.userId, req.body, {
        new: true,
        runValidators: true,
      }).select("-password");

      res.status(200).json({ message: "Profile Updated Successfully", user });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ message: "unable to Edit Profile, Internal Server Error" });
    }
  },
   updatePassword: async(req,res)=>{
     try {
      const {password} = req.body;
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

     const user = await User.findByIdAndUpdate(req.user.userId,{password:hashedPassword}).select("-password");
     res.status(200).json({message:"Password updated succesfully", user})
      
     } catch (error) {
      console.log(error)
      res.status(500).json("Password updated failed! Internal Server Error")
      
     } 
   }
};

module.exports = userController;
