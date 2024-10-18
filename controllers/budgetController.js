const {Budget} = require('../models/index');
const budgetService = require('../service/budgetService');
const expenseService = require('../service/expenseService');

const setBudget = async(req,res)=>{
    try{
        const userID = req.user.id;
        const {month,category,budgetAmount}=req.body;
        const result = await Budget.create({
            userID,
            month,
            category,
            budgetAmount,
        });
        if(result){
            return res.status(201).json(result);
        }else{
            return res.status(400).json({});
        }
    }catch(error){
        console.error(error);
        res.status(500).send("Internal server error");
    }
};

const getBudget = async(req,res)=>{
    try{
        const userID = req.user.id;
        const budgets = await budgetService.getBudget(userID);
        const expenses = await expenseService.getExpense(userID);

        res.json({budgets,expenses});

    }catch(error){
        console.error(error);
        res.status(500).send("Internal server error");
    }
};

module.exports = {
    setBudget,
    getBudget,
}