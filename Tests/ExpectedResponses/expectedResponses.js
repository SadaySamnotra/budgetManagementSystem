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
    ],
    expenseCreated: {
        id: 1,
        userID: 1,
        amount: expect.any(Number),
        category: expect.any(String),
        dateOfExpense: expect.any(Date),
    },
    expenseUpdated: {
        userID: 1,
        expenseID: 1,
        amount: 500,
        category: 'Food',
    },
    expenseNotFound: {
        status: 404,
        message: "Expense not found"
    },
    internalServerError: {
        status: 500,
        message: "Internal server error"
    }
};

module.exports = expectedResponses;
