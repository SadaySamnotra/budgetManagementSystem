const { setBudget, getBudget } = require('../../controllers/budgetController');
const { Budget } = require('../../models/index');
const budgetService = require('../../service/budgetService');
const expenseService = require('../../service/expenseService');
const testData = require('../TestingData/testData');

jest.mock('../../models/index');
jest.mock('../../service/budgetService');
jest.mock('../../service/expenseService');

describe('Budget Controller', () => {
    let req, res;
    beforeEach(() => {
        req = { 
            user: { id: testData.userID },
            body: { ...testData.newBudget } 
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            send: jest.fn(),
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('setBudget', () => {
        it('Should create a new budget and return status 201', async () => {
            Budget.create.mockResolvedValue(testData.newBudget);

            await setBudget(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(testData.newBudget);
        });

        it('Should return status 400 when budget creation fails', async () => {
            Budget.create.mockResolvedValue(null); 
            await setBudget(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: "Failed to create budget." });
        });

        it('Should return status 500 when there is an internal server error', async () => {
            Budget.create.mockRejectedValue(new Error('Internal error'));
            await setBudget(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith("Internal server error. Please try again later.");
        });

        it('Should handle missing user ID and return 400', async () => {
            req.user = null; 
            await setBudget(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: "User ID is required" });
        });

        it('Should return status 400 for invalid budget amount', async () => {
            req.body.budgetAmount = -100; 
            await setBudget(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: "Budget amount must be a positive number." });
        });
    });

    describe('getBudget', () => {
        it('Should retrieve budgets and expenses successfully and return status 200', async () => {
            const budgets = testData.budgets;
            const expenses = testData.mockExpenseData;
            expenseService.getExpense.mockResolvedValue(expenses);
            budgetService.getBudget.mockResolvedValue(budgets);
            await getBudget(req, res);
            expect(res.json).toHaveBeenCalledWith({ budgets, expenses });
        });

        it('Should return status 500 when budgetService throws an error', async () => {
            budgetService.getBudget.mockRejectedValue(new Error('Database error'));
            await getBudget(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith("Internal server error");
        });

        it('Should return status 500 when expenseService throws an error', async () => {
            budgetService.getBudget.mockResolvedValue(testData.budgets);
            expenseService.getExpense.mockRejectedValue(new Error('Expense service error'));
            await getBudget(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith("Internal server error");
        });

        it('Should return empty arrays if no budgets or expenses found', async () => {
            budgetService.getBudget.mockResolvedValue([]);
            expenseService.getExpense.mockResolvedValue([]);
            await getBudget(req, res);
            expect(res.json).toHaveBeenCalledWith({
                budgets: [],
                expenses: []
            });
        });

        it('Should handle missing user ID and return 500', async () => {
            req.user = null;
            await getBudget(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith("Internal server error");
        });
    });
});
