const {Expenses} = require('../models/index');
const expenseService = require('../service/expenseService');

const addExpense=async(req,res)=>{
    try{
        const {category,amount} = req.body;
        const userID = req.user.id;
        const dateOfExpense = new Date();
        const expense = await Expenses.create({
            userID,
            amount,
            category,
            dateOfExpense,
        });
        res.status(201).json(expense);
    }catch(error){
        console.log(error);
    }
};

const getExpenses = async(req,res)=>{
    return await expenseService.getExpense(req,res);
}

const deleteExpense = async(req,res)=>{
    try{
        const {id} = req.params;
        const result = await Expenses.destroy({
            where:{expenseID:id}
        });
        if(result){
            res.status(204).send();
        }else{
            res.status(404).send('Expense not found');
        }
    }catch(error){
        console.log(error);
    }
}

module.exports = {
    addExpense,
    getExpenses,
    deleteExpense,
};