const request = require('supertest');
const { sequelize } = require('../../models');
const app = require('../../index');
const testData = require('../TestingData/testData');
const jwt = require('jsonwebtoken');
const testData = require('../TestingData/testData');

function generateToken(user) {
    return jwt.sign(
        {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
        },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
}

let user;

beforeAll(async () => {
    await sequelize.sync({ force: true });
    user = await sequelize.models.Users.create({
        id: testData.userData.id,
        firstName: testData.userData.firstName,
        lastName: testData.userData.lastName,
        email: testData.userData.email,
        password: testData.userData.password, 
    });
});

afterEach(async () => {
    await sequelize.truncate({ cascade: true });
});

describe('Expense Controller Integration Tests', () => {
    test('User adds a new expense successfully, returns status 201', async () => {
        const token = generateToken(user);
        const res = await request(app)
            .post('/api/expenses')
            .set('Authorization', `Bearer ${token}`)
            .send(testData.expenseData);

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('id');
        expect(res.body.category).toBe('Transport');
        expect(res.body.amount).toBe(200);
    });

    test('Fails to add expense with missing fields, returns status 400', async () => {
        const token = generateToken(user);

        const res = await request(app)
            .post('/api/expenses')
            .set('Authorization', `Bearer ${token}`)
            .send({
                category: 'Groceries', // Missing amount
            });

        expect(res.statusCode).toEqual(400);
        expect(res.body.error).toBe('Please enter all the fields correctly.');
    });

    test('User retrieves expenses successfully, returns status 200', async () => {
        const token = generateToken(user);
        await request(app)
            .post('/api/expenses')
            .set('Authorization', `Bearer ${token}`)
            .send({
                category: 'Groceries',
                amount: 200.00,
            });

        const res = await request(app)
            .get('/api/expenses')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toBeGreaterThan(0);
    });

    test('User deletes an expense successfully, returns status 204', async () => {
        const token = generateToken(user);
        const expense = await request(app)
            .post('/api/expenses')
            .set('Authorization', `Bearer ${token}`)
            .send({
                category: 'Entertainment',
                amount: 300.00,
            });

        const res = await request(app)
            .delete(`/api/expenses/${expense.body.id}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(204);
    });

    test('Fails to delete non-existing expense, returns status 404', async () => {
        const token = generateToken(user);
        const res = await request(app)
            .delete('/api/expenses/999')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(404);
        expect(res.text).toBe('Expense not found');
    });

    test('User edits an expense successfully, returns status 200', async () => {
        const token = generateToken(user);
        const expense = await request(app)
            .post('/api/expenses')
            .set('Authorization', `Bearer ${token}`)
            .send({
                category: 'Travel',
                amount: 400.00,
            });

        const res = await request(app)
            .put(`/api/expenses/${expense.body.id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                category: 'Transport',
                amount: 450.00,
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body.category).toBe('Transport');
        expect(res.body.amount).toBe(450.00);
    });

    test('Fails to edit non-existing expense, returns status 404', async () => {
        const token = generateToken(user);
        const res = await request(app)
            .put('/api/expenses/999')
            .set('Authorization', `Bearer ${token}`)
            .send({
                category: 'Transport',
                amount: 450.00,
            });

        expect(res.statusCode).toEqual(404);
        expect(res.text).toBe('Expense not found');
    });

    test('User retrieves an expense by ID successfully, returns status 200', async () => {
        const token = generateToken(user);
        const expense = await request(app)
            .post('/api/expenses')
            .set('Authorization', `Bearer ${token}`)
            .send({
                category: 'Shopping',
                amount: 500.00,
            });

        const res = await request(app)
            .get(`/api/expenses/${expense.body.id}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.category).toBe('Shopping');
        expect(res.body.amount).toBe(500.00);
    });

    test('Fails to retrieve non-existing expense, returns status 404', async () => {
        const token = generateToken(user);
        const res = await request(app)
            .get('/api/expenses/999')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(404);
        expect(res.text).toBe('Expense not found');
    });
});
