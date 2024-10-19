document.addEventListener('DOMContentLoaded', () => {
    const addBudgetForm = document.getElementById('add-budget-form');
    const budgetTableBody = document.querySelector('#budget-table tbody');
    const expensesTableBody = document.querySelector('#expenses-table tbody');
  
    addBudgetForm.addEventListener('submit', async (event) => {
      event.preventDefault(); 
  
      const formData = new FormData(addBudgetForm);
      const budgetData = {
        month: formData.get('month'),
        category: formData.get('category'),
        budgetAmount: formData.get('budgetAmount')
      };
  
      try {
        const response = await fetch('/budget/set-budget', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(budgetData)
        });
  
        if (response.ok) {
          const result = await response.json();
          fetchBudgetAndExpenses();
        } else {
          console.error('Failed to set budget');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    });
  
    async function fetchBudgetAndExpenses() {
      try {
        const response = await fetch('/budget/getBudget');
        const { budgets, expenses } = await response.json();
  
        budgetTableBody.innerHTML = '';
        expensesTableBody.innerHTML = '';

        budgets.forEach((budget) => {
          const expenseForCategory = expenses.filter(exp => exp.category === budget.category);
          const totalExpenses = expenseForCategory.reduce((acc, exp) => acc + exp.amount, 0);
          const remainingAmount = budget.budgetAmount - totalExpenses;
  
          const budgetRow = `
            <tr>
              <td>${budget.category}</td>
              <td>${budget.month}</td>
              <td>${budget.budgetAmount}</td>
              <td>${totalExpenses}</td>
              <td>${remainingAmount}</td>
              <td><button class="btn btn-warning edit-budget-btn">Edit</button></td>
              <td><button class="btn btn-danger delete-budget-btn">Delete</button></td>
            </tr>
          `;
          budgetTableBody.insertAdjacentHTML('beforeend', budgetRow);
        });
  
        expenses.forEach((expense) => {
          const expenseRow = `
            <tr>
              <td>${new Date(expense.dateOfExpense).toLocaleDateString()}</td>
              <td>${expense.category}</td>
              <td>${expense.amount}</td>
            </tr>
          `;
          expensesTableBody.insertAdjacentHTML('beforeend', expenseRow);
        });
  
      } catch (error) {
        console.error('Error fetching budget and expenses data:', error);
      }
    }

    fetchBudgetAndExpenses();
  });
  