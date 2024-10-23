const request = require('supertest');
const { User } = require('../../models/index');
const { sequelize } = require('../../models/index');
const app = require('../../index');
const testData = require('../TestingData/testData');
const jwt = require('jsonwebtoken');

let user; 
let token; 

afterAll(async () => {
    await sequelize.truncate({ cascade: true }); 
    await sequelize.close();
});
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
describe('Budget Controller Integration Tests', () => {
    
    beforeEach(async () => {
        await sequelize.sync({ force: true });
        user = await sequelize.models.User.create({
            id: testData.userData.id,
            firstName: testData.userData.firstName,
            lastName: testData.userData.lastName,
            email: testData.userData.email,
            password: testData.userData.password, 
        });
        token = generateToken(user);
        console.log("user: ",user,"token: ",token)
    });

    test('User sets a budget successfully, status code 201 is returned', async () => {
        const res = await request(app)
            .post('/budget/set-budget')
            .set('Authorization', `Bearer ${token}`)
            .send(testData.newBudget);
        console.log(res.body);
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('id');
        expect(res.body.userID).toBe(user.id);
        expect(res.body.category).toBe(testData.newBudget.category);
        expect(res.body.budgetAmount).toBe(testData.newBudget.budgetAmount);
    });

    test('User fails to set a budget without a month, status code 400 is returned', async () => {
        const res = await request(app)
            .post('/budget/set-budget')
            .set('Authorization', `Bearer ${token}`)
            .send({ category: 'Groceries', budgetAmount: 500.00 });
        expect(res.statusCode).toEqual(400);
        expect(res.body.error).toBe("Month, category, and budget amount are required.");
    });

    test('User retrieves budgets successfully, status code 200 is returned', async () => {
        await request(app)
        .post('/budget/set-budget')
        .set('Authorization', `Bearer ${token}`)
        .send(testData.newBudget);
        const res = await request(app)
            .get('/budget/getBudget')
            .set('Authorization', `Bearer ${token}`);
        console.log(res.body);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('budgets');
        expect(res.body.budgets.length).toBeGreaterThanOrEqual(1); 
        expect(res.body.budgets[0].category).toBe(testData.newBudget.category);
    });
});
