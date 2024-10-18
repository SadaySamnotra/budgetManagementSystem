const express = require('express');
const router = express.Router();
const authJWT = require('../middleware/authJWT');
const budgetController = require('../controllers/budgetController');

router.get('/monthly-expenses',authJWT,(req,res)=>{
    res.render('monthly-expenses',{user:req.user});
})

router.get('/getBudget',authJWT,budgetController.getBudget);
router.post('/set-budget',authJWT,budgetController.setBudget);

module.exports = router;