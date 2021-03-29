const {verifyToken} = require('../../services/token.services');

const checkAuthTokenMiddleware = async(req,res,next)=>{
    try{
        const token =  req.get('Authorization');
        if(!token){
            return res.json({
                status:  "Unauthorized",
                code: 401,
                message:"No token provided"
            })
        }
     
        const data = await verifyToken(token);
        reqUserId = data.id;
        next();
    }catch(e){
        return res.json({
            status:  "Unauthorized",
            code: 401,
            message:"Invalid token"
        })
    }
   
    
}

module.exports = {
    checkAuthTokenMiddleware
}