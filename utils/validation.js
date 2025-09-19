const express = require('express');


//validation Middleware for signup
const validateSignupData = (req)=>{
    const{firstName, lastName, email, password, age, gender, } = req.body;

    if(!firstName || !lastName){
        throw new Error("First Name and Last Name are required")
    }

    if(!email){
        throw new Error("Email is required")
    } else{
        const emailRegex= /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)){
            throw new Error("Please enter a valid email")
        }
    }

    if(!password){
        throw new Error("Password is required")
    }else{
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            throw new Error("Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.")
        }
    }
    
    if(!age){
        throw new Error("Age is required")
    }

    if(!gender){
        throw new Error("Gender is required")
    }
        
}


const validateProfileEditData = (req)=>{
    
   const AllowedEdit = ["age", "gender","bio","skills","photourl"]

   const isEditAllowed = Object.keys(req.body).every((field)=>
    AllowedEdit.includes(field)
);
if (!isEditAllowed) {
    throw new Error("Invalid fields in update request");
  }
 return isEditAllowed;
}

module.exports= {validateSignupData, validateProfileEditData};