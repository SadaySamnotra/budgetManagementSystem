const expectedResponses = {
    budgetCreated: {
        id: 1,
        userId: 1,
        month: expect.any(Date),
        category: 'Groceries',
        budgetAmount: 500.00,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date)
    },
    allBudgets: [
        {
            id: 1,
            userId: 1,
            month: expect.any(Date),
            category: 'Groceries',
            budgetAmount: 500.00,
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date)
        },
        {
            id: 2,
            userId: 1,
            month: expect.any(Date),
            category: 'Transport',
            budgetAmount: 300.00,
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date)
        }
    ],
    expenses: [
        {
            id: 1,
            userId: 1,
            amount: 100,
            category: 'Groceries',
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date)
        }
    ]
};

module.exports = expectedResponses;
