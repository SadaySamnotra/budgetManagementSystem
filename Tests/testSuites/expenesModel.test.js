const {Expenses} = require('../../models/index');
const expenseService = require('../../service/expenseService');
const expenseController = require('../../controllers/expenseController');
const testingData = require('../TestingData/testData');

jest.mock('../../models/index');
jest.mock('../../service/expenseService');

describe('Expense controller unit tests',()=>{
    beforeEach(()=>{
        jest.clearAllMocks();
    });
    
    describe('Adding expense',()=>{
        test('It should create a new expense and return with a status code of 201',async()=>{
            const req = {
                user:{id:testingData.userID},
                body:{
                    amount: testingData.mockExpenseData.amount,
                    category: testingData.mockExpenseData.category,
                },   
            }
            const res = {
                status:jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            Expenses.create.mockResolvedValue(testingData.mockExpenseData);
            await expenseController.addExpense(req,res);
            expect(Expenses.create).toHaveBeenCalledWith({
                userID:req.user.id,
                amount: req.body.amount,
                category: req.body.category,
                dateOfExpense: expect.any(Date),
            });
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(testingData.mockExpenseData);
        });

        test('Should return error if the user fails to input some fields in the controller',async()=>{
            const req= {
                user:{id:testingData.userID},
                body:{amount:testingData.mockExpenseData.amount,category:null},
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            await expenseController.addExpense(req,res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({error:"Please enter all the fields correctly."});
        });
    });
    describe(' Testing Get expenses',()=>{
        test('Should successfully get data from the getExpense method and return with 200 status',async()=>{
            const req ={
                user:{id:testingData.userID},
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            const expenseData = testingData.mockExpenseData;

            expenseService.getExpense.mockResolvedValue(expenseData);
            await expenseController.getExpenses(req,res);

            expect(expenseService.getExpense).toHaveBeenCalledWith(req.user.id);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expenseData);
        });

        test('If the userID is not present, the server should return the status code 400 and redirect to the error page',async()=>{
            const req = {
                user:{id:null},
            }
            const res ={
                status: jest.fn().mockReturnThis(),
                redirect: jest.fn(),
            };

            await expenseController.getExpenses(req,res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.redirect).toHaveBeenCalledWith('/error');

        });
    });
    describe('Testing Delete expenses',()=>{
        test('Delete functionality should successfully delete the expense and return with status code 204',async()=>{
            const req = {
                params:{id:testingData.userID},
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn(),
            };
            Expenses.destroy = jest.fn().mockResolvedValue(1);
            await expenseController.deleteExpense(req,res);

            expect(Expenses.destroy).toHaveBeenCalledWith({where:{expenseID:req.params.id}});
            expect(res.status).toHaveBeenCalledWith(204);
            expect(res.send).toHaveBeenCalledWith();
        });

        test('Delete functionality does not work as the user ID was not given or not parsed correctly',async()=>{
            const req = {
                params:{id:null},
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn(),
            };
            Expenses.destroy = jest.fn().mockResolvedValue(0);
            await expenseController.deleteExpense(req,res);
            expect(Expenses.destroy).toHaveBeenCalledWith({where:{expenseID:req.params.id}});
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.send).toHaveBeenCalledWith("Expense not found");
        });
    });
    describe('Testing edit expenses',()=>{
        test('Edit the expense and on successful edit of the value, status 200 is send back and the value of the modified row is returned',async()=>{
            const req = {
                params:{
                    id:testingData.userID
                },
                body:{
                    amount: testingData.mockExpenseData.amount,
                    category:testingData.mockExpenseData.category,
                },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            }
            const expenseData = {
                ...testingData.mockExpenseData,
                save: jest.fn().mockResolvedValue(),
            };
            
            Expenses.findByPk= jest.fn().mockResolvedValue(expenseData);
            await expenseController.editExpense(req,res);

            expect(Expenses.findByPk).toHaveBeenCalledWith(req.params.id);
            expect(expenseData.category).toBe(req.body.category);
            expect(expenseData.amount).toBe(req.body.amount);
            expect(expenseData.save).toHaveBeenCalledWith();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expenseData); 
        });
        test('The expenseID was not correct and the record could not be found',async ()=>{
            const req = {
                params:{id:testingData.userID},
                body:{
                    amount : testingData.mockExpenseData.amount,
                    category: testingData.mockExpenseData.category,
                },
            };
            const res ={
                status: jest.fn().mockReturnThis(),
                send: jest.fn(),
            };
            Expenses.findByPk = jest.fn().mockResolvedValue(null);
            await expenseController.editExpense(req,res);

            expect(Expenses.findByPk).toHaveBeenCalledWith(req.params.id);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.send).toHaveBeenCalledWith("Expense not found");
        });
        test('The server crashed and there was an internal server error',async()=>{
            const req = {
                params:{id:testingData.userID},
                body:{
                    amount:testingData.mockExpenseData.amount,
                    category:testingData.mockExpenseData.category,
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn(),
            };
            Expenses.findByPk = jest.fn().mockRejectedValue(new Error('Database error'));
            await expenseController.editExpense(req,res);

            expect(Expenses.findByPk).toHaveBeenCalledWith(req.params.id);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith('Internal server error');
        });
    });
    describe('Testing the getExpenseByExpenseID controller',()=>{
        test('Successfully returns the expense details, and 200 status code when the expenseID is given',async()=>{
            const req = {
                params:{expenseID:testingData.mockExpenseData.expenseID},
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            const expenseData = testingData.mockExpenseData;
            Expenses.findByPk = jest.fn().mockResolvedValue(expenseData);
            await expenseController.getExpenseByExpenseID(req,res);

            expect(Expenses.findByPk).toHaveBeenCalledWith(req.params.expenseID);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expenseData);
        });
        test('If the expenseID is not present then it should return 404 and a message',async()=>{
            const req ={
                params:{expenseID:testingData.mockExpenseData.expenseID},
            }
            const res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn(),
            };
            Expenses.findByPk = jest.fn().mockResolvedValue(null);
            await expenseController.getExpenseByExpenseID(req,res);

            expect(Expenses.findByPk).toHaveBeenCalledWith(req.params.expenseID);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.send).toHaveBeenCalledWith("Expense not found");
        });
        test('Throw an error in case there is a DB related issue or a server related issue',async()=>{
            const req = {
                params:{expenseID:testingData.mockExpenseData.expenseID},
            };
            const res  ={
                status: jest.fn().mockReturnThis(),
                send: jest.fn(),
            };
            Expenses.findByPk = jest.fn().mockRejectedValue(new Error("Internal DB error"));
            await expenseController.getExpenseByExpenseID(req,res);
            expect(Expenses.findByPk).toHaveBeenCalledWith(req.params.expenseID);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith('Internal server error');
        });
    });
});