const mongoose = require("mongoose");


const connectionSchema = new mongoose.Schema({

    fromUserId: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",  // pass the reference to user model
        required: true
    },
    toUserId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true
    },
    status:{
        type:String,
        required:true,
        enum:{
            values:["ignore","interested","accepted","rejected"],
            message: "{VALUE} is not correct"
        }
    }

},
{
    timestamps:true
})

connectionSchema.pre("save",function(next){
    const connectionReq = this;

    //check if fromuserId is same as touserId
    if(connectionReq.fromUserId.equals(connectionReq.toUserId)){
        throw new Error("Cannot send request to itself")
    }

    next();
})

module.exports = mongoose.model("connectionRequest", connectionSchema)