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
    const userID = req.user.id;
    const data =  await expenseService.getExpense(userID);
    return res.json(data);
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

const editExpense = async(req,res)=>{
    try{
        const {id} = req.params;
        const {amount,category}= req.body;
        const expense = await Expenses.findByPk(id);
        if(!expense){
            return res.status(404).send('Expense not found');
        }
        expense.category = category;
        expense.amount = amount;
        await expense.save();
        res.status(200).json(expense);
    }catch(error){
        console.error(error);
        res.status(500).send("Internal server error");
    }
};

const getExpenseByExpenseID = async (req, res) => {
    try {
        const { id } = req.params;  
        const expense = await Expenses.findByPk(id); 
        if (expense) {
            return res.json(expense);  
        } else {
            return res.status(404).send("Expense not found");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
};


module.exports = {
    addExpense,
    getExpenses,
    deleteExpense,
    editExpense,
    getExpenseByExpenseID,
};