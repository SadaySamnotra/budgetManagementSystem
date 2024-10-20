const {setBudget, getBudget} = require('../../controllers/budgetController');
const {Budget} = require('../../models/index');
const budgetService = require('../../service/budgetService');
const expenseService = require('../../service/expenseService');
const testData = require('../TestingData/testData');
const expectedResponses = require('../ExpectedResponses/expectedResponses');



jest.mock('../../models/index');
jest.mock('../../service/budgetService');
jest.mock('../../service/expenseService');

describe('Budget Controller', () => {
    let req, res;

    beforeEach(() => {
        req = { ...testData.newBudget };
        req.user = { id: 1 }; 
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            send: jest.fn()
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('setBudget', () => {
        it('Should be able to create a new budget and return status 201', async () => {
            req.body = {
                month: new Date(),
                category: 'Groceries',
                budgetAmount: 1000
            };
            Budget.create.mockResolvedValue(req.body);

            await setBudget(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(req.body);
        });

        it('Should return status 400 when budget creation fails', async () => {
            req.body = {
                month: new Date(),
                category: 'Groceries',
                budgetAmount: 1000
            };
            Budget.create.mockResolvedValue(null); 

            await setBudget(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({});
        });

        it('Should return status 500 when there is an internal server error', async () => {
            req.body = {
                month: new Date(),
                category: 'Groceries',
                budgetAmount: 1000
            };
            Budget.create.mockRejectedValue(new Error('Internal error'));

            await setBudget(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith("Internal server error");
        });

        it('Should handle missing user ID and return 500', async () => {
            req.user = null; 

            await setBudget(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith("Internal server error");
        });
    });


    describe('getBudget', () => {
        it('Should retrieve budgets and expenses successfully and return status 200', async () => {
            budgetService.getBudget.mockResolvedValue(testData.budgets);
            expenseService.getExpense.mockResolvedValue(testData.expenses);
        
            await getBudget(req, res);
        
            expect(budgetService.getBudget).toHaveBeenCalledWith(req.user.id);
            expect(expenseService.getExpense).toHaveBeenCalledWith(req.user.id);
            expect(res.json).toHaveBeenCalledWith({
                budgets: expectedResponses.allBudgets, 
                expenses: expectedResponses.expenses
            });
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
    });
});
