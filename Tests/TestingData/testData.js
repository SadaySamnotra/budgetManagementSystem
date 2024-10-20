const testData = {
    newBudget: {
        month: new Date(),
        category: 'Groceries',
        budgetAmount: 500.00
    },
    userId: 1,
    budgets: [
        {
            id: 1,
            userId: 1,
            month: new Date(),
            category: 'Groceries',
            budgetAmount: 500.00,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            id: 2,
            userId: 1,
            month: new Date(),
            category: 'Transport',
            budgetAmount: 300.00,
            createdAt: new Date(),
            updatedAt: new Date()
        }
    ]
};

module.exports = testData;
