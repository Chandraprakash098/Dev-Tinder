const jwt = require("jsonwebtoken")

const authMiddleware =  async(req,res,next)=>{
  try {
    const token = req.cookies.token;
    if(!token){
      res.status(401).json({message:"Token Not found"})
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded
    
    next()
    
  } catch (error) {
    console.log(error)
    res.status(500).json({message:"Not able to verify token, Internal server error"})
  }

}
module.exports= authMiddleware;