const express = require('express');
const router = express.Router();
const authJWT = require('../middleware/authJWT');

router.get('/userDashboard',authJWT,(req,res)=>{
    res.render('userDashboard',{user:req.user});
});

module.exports = router;