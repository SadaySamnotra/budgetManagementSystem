const {User} = require('../models/index');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userService = require('../service/userService');
const JWT_SECRET = process.env.JWT_SECRET;

//creates the user
//upon successful creation, the user is redirected to the user dashboard
//different users have different dashboards with personalized content.
//if the user cannot register, he/she will see the error on the screen.
//in case some other error occours, the user will be shown the default error page(500 Internal server error).
const registerUser = async(req,res)=>{
    const userData = req.body;
    try{
        const result = await User.create(userData);
        if(result){
            const token = jwt.sign({
                id: result.id,
                firstName: result.firstName,
                lastName: result.lastName,
                email: result.email,
            }, JWT_SECRET, { expiresIn: '1h' });

            res.cookie('token', token, {
                httpOnly: true,
                maxAge: 60 * 60 * 1000,
            });
            res.status(201).redirect('/user/userDashboard');
        }else{
            res.redirect('/error');
        }
    }catch(error){
        console.error(error);
        res.status(500).json({error:"Internal server error"});
    }
};

const loginUser = async(req,res)=>{
    const {password}= req.body;
    try{
        const result = await userService.findByEmail(req);
        if(result){
            console.log(result);
            const isPasswordValid = await bcrypt.compare(password,result.password);
            if(!isPasswordValid){
                return res.status(400).json({error:"Please enter correct credentials"});
            }
             const token = jwt.sign({
                id: result.id,
                firstName: result.firstName,
                lastName: result.lastName,
                email: result.email,
            }, JWT_SECRET, { expiresIn: '1h' });

            res.cookie('token', token, {
                httpOnly: true,
                maxAge: 60 * 60 * 1000,
            });
            return res.status(200).redirect('/user/userDashboard');
        }else{
            return res.status(404).json({error:"No record found with that email id"});
        }
    }catch(error){
        console.log(error);
        res.status(500).redirect('/error');
    }
};

const logoutUser = (req,res)=>{
    res.clearCookie('token');
    res.redirect('/auth/logout-success');
}

module.exports={
    registerUser,
    loginUser,
    logoutUser,
};
