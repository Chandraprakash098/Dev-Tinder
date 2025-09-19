const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    lowercase: true,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
  },
  photourl:{
    type: String,
    default:"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
  },
  age: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    required: true,
    enum:["Male","Female","Other"]
  },
  skills:{
    type: [String],
  },
  bio:{
    type: String,
    default: "This is my Bio"
  }
  
},
{
  timestamps: true
}
);

module.exports = mongoose.model("User", userSchema);
