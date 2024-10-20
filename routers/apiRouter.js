const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');
const authJWT = require('../middleware/authJWT');

router.post('/expenses',authJWT,expenseController.addExpense);
router.get('/expenses',authJWT,expenseController.getExpenses);
router.delete('/expenses/:id', authJWT, expenseController.deleteExpense);
router.put('/expenses/:id', authJWT, expenseController.editExpense);

router.get('/expenses/:expenseID',authJWT,expenseController.getExpenseByExpenseID);

module.exports = router;