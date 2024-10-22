const request = require('supertest');
const { sequelize } = require('../../models/index');
const app = require('../../index');
const testData = require('../TestingData/testData');
const jwt = require('jsonwebtoken');

function generateToken(user) {
    return jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
}

beforeAll(async () => {
    await sequelize.sync({ force: true });
});

afterEach(async () => {
    await sequelize.truncate({ cascade: true });
});

describe('Budget Controller Integration Tests', () => {
    const user = {
        id: testData.userData.id,
        token: generateToken(testData.userData),
    };

    test('User sets a budget successfully, status code 201 is returned', async () => {
        const res = await request(app)
            .post('/budget/set-budget')
            .set('Authorization', `Bearer ${user.token}`)
            .send(testData.newBudget);

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('id'); 
        expect(res.body.userID).toBe(user.id);
        expect(res.body.category).toBe(testData.newBudget.category);
        expect(res.body.budgetAmount).toBe(testData.newBudget.budgetAmount);
    });

    test('User fails to set a budget without a month, status code 400 is returned', async () => {
        const res = await request(app)
            .post('/budget/set-budget')
            .set('Authorization', `Bearer ${user.token}`)
            .send({ category: 'Groceries', budgetAmount: 500.00 }); 

        expect(res.statusCode).toEqual(400);  // It should return 400 for missing fields
        expect(res.body.error).toBe("Month, category, and budget amount are required.");
    });

    test('User retrieves budgets successfully, status code 200 is returned', async () => {
        await request(app)
            .post('/budget/set-budget')
            .set('Authorization', `Bearer ${user.token}`)
            .send(testData.newBudget);
        const res = await request(app)
            .get('/budget/getBudget')
            .set('Authorization', `Bearer ${user.token}`);
        
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('budgets');
        expect(res.body.budgets.length).toBeGreaterThanOrEqual(0);
        expect(res.body.budgets[0].category).toBe(testData.newBudget.category);
    });
});
