const { Budget } = require('../models/index');
const budgetService = require('../service/budgetService');
const expenseService = require('../service/expenseService');
const {sequelize} = require('../models/index');


const setBudget = async (req, res) => {
    try {
        const userID = req.user?.id; 
        if (!userID) {
            return res.status(400).json({ error: "User ID is required" });
        }

        const { month, category, budgetAmount } = req.body;
        if (!month || !category || budgetAmount === undefined) {
            return res.status(400).json({ error: "Month, category, and budget amount are required." });
        }
        if (typeof budgetAmount !== 'number' || budgetAmount <= 0) {
            return res.status(400).json({ error: "Budget amount must be a positive number." });
        }
        const result = await Budget.create({
            userID,
            month,
            category,
            budgetAmount,
        });
        if (!result) {
            return res.status(400).json({ error: "Failed to create budget." });
        }

        return res.status(201).json(result);
        
    } catch (error) {
        console.error("Error setting budget:", error); 
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ error: "Validation error occurred. Please check your input." });
        }
        if (error.message === "User ID is required") {
            return res.status(400).json({ error: error.message });
        }
        return res.status(500).send("Internal server error. Please try again later.");
    }
};


const getBudget = async (req, res) => {
    try {
        const userID = req.user?.id; 
        if (!userID) throw new Error("User ID is required"); 

        const budgets = await budgetService.getBudget(userID);
        const expenses = await expenseService.getExpense(userID);

        res.json({ budgets, expenses });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
};

module.exports = {
    setBudget,
    getBudget,
};
