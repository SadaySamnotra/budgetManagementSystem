const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

const authJWT = (req, res, next) => {
    try{
        const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized access' });
        }
        const decoded = jwt.verify(token,JWT_SECRET);
        req.user=decoded;
        next();
    }catch(error){
        console.log(error);
    }
    
};

module.exports = authJWT;
