const express = require('express');
const router = express.Router();
const authJWT = require('../middleware/authJWT');


router.get('/monthly-expenses',authJWT,(req,res)=>{
    res.render('monthly-expenses',{user:req.user});
})

module.exports = router;