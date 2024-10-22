const { registerUser, loginUser, logoutUser } = require('../../controllers/userController');
const { User } = require('../../models/index');
const userService = require('../../service/userService');
const bcrypt = require('bcrypt');
const testData = require('../TestingData/testData');

jest.mock('../../models/index');
jest.mock('../../service/userService');
jest.mock('bcrypt');

describe('User Controller', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {},
            cookies: {},
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            redirect: jest.fn(),
            clearCookie: jest.fn(),
            cookie: jest.fn(),
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('registerUser', () => {
        it('should return 400 for missing required fields', async () => {
            await registerUser(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Bad request: Missing required fields' });
        });

        it('should return 400 for invalid email format', async () => {
            req.body = { email: 'invalid-email', password: 'password123' };
            await registerUser(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Invalid email format' });
        });

        it('should return 409 for existing email', async () => {
            req.body = { email: testData.userData.email, password: 'password123' };
            User.findOne.mockResolvedValueOnce({}); 
            await registerUser(req, res);
            expect(res.status).toHaveBeenCalledWith(409);
            expect(res.json).toHaveBeenCalledWith({ error: 'Email already in use' });
        });

        it('should register user successfully and return 201', async () => {
            req.body = { email: testData.userData.email, password: 'password123' };
            User.findOne.mockResolvedValueOnce(null);
            User.create.mockResolvedValueOnce({ 
                id: 1, 
                firstName: 'John', 
                lastName: 'Doe', 
                email: testData.userData.email 
            });

            await registerUser(req, res);

            expect(res.cookie).toHaveBeenCalled(); 
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ message: "User registered successfully." });
        });

        it('should return 500 on internal server error', async () => {
            req.body = { email: testData.userData.email, password: 'password123' };
            User.findOne.mockRejectedValue(new Error('Database error')); // Simulate DB error
            await registerUser(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: "Internal server error" });
        });
    });

    describe('loginUser', () => {
        it('should return 404 for no record found', async () => {
            req.body = { email: 'nonexistent@example.com', password: 'password123' };
            userService.findByEmail.mockResolvedValueOnce(null); 

            await loginUser(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: "No record found with that email id" });
        });

        it('should return 400 for incorrect password', async () => {
            req.body = { email: testData.userData.email, password: 'wrongpassword' };
            userService.findByEmail.mockResolvedValueOnce({ password: 'hashedPassword' });
            bcrypt.compare.mockResolvedValueOnce(false); 

            await loginUser(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: "Please enter correct credentials" });
        });

        it('should log in successfully and return 200', async () => {
            req.body = { email: testData.userData.email, password: 'password123' };
            userService.findByEmail.mockResolvedValueOnce({ 
                id: 1, 
                firstName: 'John', 
                lastName: 'Doe', 
                email: testData.userData.email, 
                password: await bcrypt.hash('password123', 10) 
            });

            bcrypt.compare.mockResolvedValueOnce(true); 

            await loginUser(req, res);

            expect(res.cookie).toHaveBeenCalled(); 
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'User logged in successfully (testing environment)'});
        });

        it('should return 500 on internal server error', async () => {
            req.body = { email: testData.userData.email, password: 'password123' };
            userService.findByEmail.mockRejectedValue(new Error('Database error')); 

            await loginUser(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
        });
    });

    describe('logoutUser', () => {
        it('should clear the cookie and redirect', () => {
            logoutUser(req, res);

            expect(res.clearCookie).toHaveBeenCalledWith('token');
            expect(res.redirect).toHaveBeenCalledWith('/auth/logout-success');
        });
    });
});
