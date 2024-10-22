const testData = {
    newBudget: {
        month: new Date('2024-01-01T00:00:00Z'),
        category: 'Groceries',
        budgetAmount: 500.00
    },
    invalidBudget: {
        month: '',  // Invalid month
        category: '',  // Invalid category
        budgetAmount: -100  // Invalid amount
    },
    userID: 1,
    budgets: [
        {
            id: 1,
            userID: 1,  // Consistent userID
            month: new Date('2024-01-01T00:00:00Z'),
            category: 'Groceries',
            budgetAmount: 500.00,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            id: 2,
            userID: 1,
            month: new Date('2024-01-01T00:00:00Z'),
            category: 'Transport',
            budgetAmount: 300.00,
            createdAt: new Date(),
            updatedAt: new Date()
        }
    ],
    mockExpenseData: {
        expenseID: 1,
        userID: 1,
        amount: 200,
        category: 'Transport',
        dateOfExpense: new Date('2024-01-01T00:00:00Z')
    },
    mockExpenseResponse: [
        {
            expenseID: 1,
            userID: 1,
            amount: 100,
            category: "Food",
            dateOfExpense: new Date('2024-01-01T00:00:00Z')
        }
    ],
    mockUpdatedExpense: {
        userID: 1,
        expenseID: 1,
        category: 'Food',
        amount: 500,
        save: jest.fn().mockResolvedValue(),
    },
    invalidExpenseId: null,
    errorMessage: "Expense not found",
    userData: {
        id: 1,
        firstName: "Saday",
        lastName: "Samnotra",
        email: "sadaysamnotra@gmail.com",
        password: "kendrikLamarDaGoat"
    },
    mockUser: {
        id: 2,  
        firstName: 'Saksham',
        lastName: 'Prabhakar',
        email: 'sk@gmail.com',
    },
    wrongMockUser: {
        id: 3,
        firstName: '',
        lastName: 'Prabhakar',
        email: 'sk@gmail.com',
        password: '1342',
    },
    loginData: {
        validUser: {
            email: "sadaysamnotra@gmail.com", 
            password: "kendrikLamarDaGoat" 
        },
        invalidEmail: {
            email: "nonexistent@example.com",
            password: "wrong-password"
        },
        invalidPassword: {
            email: "sadaysamnotra@gmail.com",
            password: "wrong-password"
        }
    },
    expenseData:{
        amount:200,
        category:"Transport",
    }
};

module.exports = testData;
