const request = require('supertest');
const { User } = require('../../models/index');
const { sequelize } = require('../../models/index');
const app = require('../../index');
const testData = require('../TestingData/testData');

describe('User related (Auth Controller) integration test cases', () => {
    beforeAll(async () => {
        try {
            await sequelize.authenticate(); 
            console.log('Database connection established.');
            await sequelize.sync({ force: true }); 
            console.log('Test database has been set up.')
        } catch (error) {
            console.error('Unable to connect to the database:', error);
            throw error; 
        }
    });
    describe('User registration', () => {
        test('User is successfully registered on the website, status code 201 is returned', async () => {
            const res = await request(app)
                .post('/auth/register')
                .send(testData.userData);
            expect(res.statusCode).toEqual(201);
            expect(res.headers['set-cookie']).toBeDefined();
            const user = await User.findOne({ where: { email: testData.userData.email } });
            expect(user).toBeTruthy();
        });

        test('User is not registered and receives a 500 status code with error message', async () => {
            const res = await request(app)
                .post('/auth/register')
                .send(testData.wrongMockUser);
            expect(res.statusCode).toEqual(500);
            expect(res.body.error).toEqual('Internal server error');
            expect(res.headers['set-cookie']).not.toBeDefined();
            const user = await User.findOne({ where: { email: testData.wrongMockUser.email } });
            expect(user).toBeNull();
        });

        test('User is not registered if required fields are missing, status code 400 is returned', async () => {
            const res = await request(app)
                .post('/auth/register')
                .send({ email: "", password: "" });

            expect(res.statusCode).toEqual(400);
            expect(res.body.error).toBe('Bad request: Missing required fields');
            expect(res.headers['set-cookie']).not.toBeDefined();
            const user = await User.findOne({ where: { email: "" } });
            expect(user).toBeNull();
        });

        test('User is not registered if email format is invalid, status code 400 is returned', async () => {
            const res = await request(app)
                .post('/auth/register')
                .send({ ...testData.userData, email: 'invalid-email' });

            expect(res.statusCode).toEqual(400);
            expect(res.body.error).toBe('Invalid email format');
            expect(res.headers['set-cookie']).not.toBeDefined();
            const user = await User.findOne({ where: { email: 'invalid-email' } });
            expect(user).toBeNull();
        });

        test('User is not registered with an already registered email, status code 409 is returned', async () => {
            await request(app)
                .post('/auth/register')
                .send(testData.userData);
            const res = await request(app)
                .post('/auth/register')
                .send(testData.userData);

            expect(res.statusCode).toEqual(409);
            expect(res.body.error).toBe('Email already in use');
            const users = await User.findAll({ where: { email: testData.userData.email } });
            expect(users.length).toEqual(1);
        });
    });

    describe('User login', () => {
        test('User logs in successfully in testing environment, status code 200 is returned', async () => {
            const res = await request(app)
                .post('/auth/login')
                .send(testData.loginData.validUser);
    
            expect(res.statusCode).toEqual(200); 
            expect(res.body).toEqual({ message: 'User logged in successfully (testing environment)' }); 
            expect(res.headers['set-cookie']).toBeDefined();
        });
    
        test('User login fails with incorrect password, status code 400 is returned', async () => {
            const res = await request(app)
                .post('/auth/login')
                .send(testData.loginData.invalidPassword);
    
            expect(res.statusCode).toEqual(400);
            expect(res.body.error).toBe('Please enter correct credentials');
            expect(res.headers['set-cookie']).not.toBeDefined();
        });
    
        test('User login fails with non-existent email, status code 404 is returned', async () => {
            const res = await request(app)
                .post('/auth/login')
                .send(testData.loginData.invalidEmail);
    
            expect(res.statusCode).toEqual(404);
            expect(res.body.error).toBe('No record found with that email id');
            expect(res.headers['set-cookie']).not.toBeDefined();
        });
    });
    
    
    afterAll(async () => {
        console.log('Closing the database connection...');
        await sequelize.close();
        console.log('Database connection closed');
    });
});
