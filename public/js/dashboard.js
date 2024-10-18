document.addEventListener('DOMContentLoaded', () => {
    const addExpenseForm = document.getElementById('add-expense-form');
    const expensesTableBody = document.querySelector('#expenses-table tbody');
    const editExpenseModal = new bootstrap.Modal(document.getElementById('editExpenseModal'));
    const editExpenseForm = document.getElementById('edit-expense-form');
    let currentExpenseID = null;


    if (addExpenseForm) {
        addExpenseForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const formData = new FormData(addExpenseForm);
            const expenseData = {
                category: formData.get('category'),
                amount: formData.get('amount')
            };

            console.log('Adding Expense:', expenseData); 

            try {
                const response = await fetch('/api/expenses', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(expenseData)
                });

                if (response.ok) {
                    fetchExpenses(); 
                    showToast("Expense added successfully!");
                    addExpenseForm.reset(); 
                } else {
                    console.error('Failed to add expense');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        });
    }

   
    async function fetchExpenses() {
        try {
            const response = await fetch('/api/expenses');
            const expenses = await response.json();

            console.log('Fetched Expenses:', expenses); 

       
            expensesTableBody.innerHTML = '';

          
            expenses.forEach(expense => {
                const expenseRow = `
                    <tr data-expense-id="${expense.expenseID}">
                        <td>${expense.category}</td>
                        <td>${expense.amount}</td>
                        <td><button class="btn btn-warning edit-expense-btn">Edit</button></td>
                        <td><button class="btn btn-danger delete-expense-btn">Delete</button></td>
                        <td>${new Date(expense.dateOfExpense).toLocaleDateString()}</td>
                    </tr>
                `;
                expensesTableBody.insertAdjacentHTML('beforeend', expenseRow);
            });

            attachEventListeners();
        } catch (error) {
            console.error('Error fetching expenses:', error);
        }
    }

   
    function attachEventListeners() {
       
        document.querySelectorAll('.edit-expense-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const expenseRow = event.target.closest('tr');
                currentExpenseID = expenseRow.dataset.expenseId;
                const category = expenseRow.cells[0].textContent;
                const amount = expenseRow.cells[1].textContent;

                document.getElementById('editExpenseType').value = category;
                document.getElementById('editAmount').value = amount;
                document.getElementById('editExpenseID').value = currentExpenseID;

                console.log('Editing Expense:', currentExpenseID, category, amount); 

                editExpenseModal.show();
            });
        });

        
        document.querySelectorAll('.delete-expense-btn').forEach(button => {
            button.addEventListener('click', async (event) => {
                const expenseRow = event.target.closest('tr');
                const expenseID = expenseRow.dataset.expenseId;

                if (confirm('Are you sure you want to delete this expense?')) {
                    try {
                        const response = await fetch(`/api/expenses/${expenseID}`, { method: 'DELETE' });

                        if (response.ok) {
                            fetchExpenses(); 
                            showToast("Expense deleted successfully!");
                        } else {
                            console.error('Failed to delete expense');
                        }
                    } catch (error) {
                        console.error('Error:', error);
                    }
                }
            });
        });
    }

    
    if (editExpenseForm) {
      
        
        editExpenseForm.addEventListener('submit', () => console.log("HELLO"));

        editExpenseForm.addEventListener('submit', async (event) => {

            event.preventDefault();

           
            if (editExpenseModal._isShown) {
                const formData = new FormData(editExpenseForm);
                const expenseData = {
                    category: formData.get('category'),
                    amount: formData.get('amount')
                };
                console.log('Updating Expense:', currentExpenseID, expenseData);

                try {
                    const response = await fetch(`/api/expenses/${currentExpenseID}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(expenseData)
                    });

                    if (response.ok) {
                        fetchExpenses(); 
                        editExpenseModal.hide(); 
                        showToast("Expense updated successfully!");
                    } else {
                        console.error('Failed to update expense');
                    }
                } catch (error) {
                    console.error('Error:', error);
                }
            } else {
                console.warn('Edit Expense Modal is not shown!'); 
            }
        });
    }

    
    fetchExpenses(); 


    function showToast(message) {
        const toastElement = document.getElementById('toast-message');
        toastElement.innerText = message;
        toastElement.style.display = 'block';
        setTimeout(() => {
            toastElement.style.display = 'none';
        }, 3000);
    }
});
