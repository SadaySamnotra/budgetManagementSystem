const {Expenses} = require('../models/index');
const expenseService = require('../service/expenseService');


const addExpense=async(req,res)=>{
    try{
        const {category,amount} = req.body;
        const userID = req.user.id;
        const dateOfExpense = new Date();
        if(!category || !amount || !userID){
            return res.status(400).json({error:"Please enter all the fields correctly."});
        }
        const expense = await Expenses.create({
            userID,
            amount,
            category,
            dateOfExpense,
        });
        return res.status(201).json(expense);
    }catch(error){
        console.log("Error in expense adding: ",error);
        return res.status(500).json({ error: 'Failed to add expense.' });
    }
};

const getExpenses = async(req,res)=>{
    const userID = req.user.id;
    if(!userID){
        return res.status(400).redirect("/error");
    }
    const data =  await expenseService.getExpense(userID);
    return res.status(200).json(data);
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
        const { expenseID } = req.params;  
        const expense = await Expenses.findByPk(expenseID); 
        if (expense) {
            return res.status(200).json(expense);  
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