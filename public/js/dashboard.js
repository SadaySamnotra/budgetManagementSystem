document.getElementById('add-expense-form').addEventListener('submit', async function(event) {
    event.preventDefault(); 

    const expenseType = document.getElementById('expenseType').value; 
    const expenseAmount = document.getElementById('amount').value;
    if (!expenseType || !expenseAmount) {
        showToast("Please fill in all fields.");
        return;
    }
    try {
        const response = await fetch('/api/expenses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ category: expenseType, amount: parseFloat(expenseAmount) }),
        });
        if (response.ok) {
            const newExpense = await response.json(); 
            addExpenseToTable(newExpense); 
            showToast("Expense added successfully!");
        } else {
            const errorMessage = await response.text(); 
            showToast(`Failed to add expense: ${errorMessage}`);
        }
    } catch (error) {
        console.log('Error:', error);
        showToast("An error occurred while adding the expense.");
    }
    document.getElementById('expenseType').value = ''; 
    document.getElementById('amount').value = '';
});

document.addEventListener('DOMContentLoaded', async function () {
    console.log("DOM fully loaded and parsed");
    await loadExpenses(); 
});

async function loadExpenses() {
    try {
        const response = await fetch('/api/expenses');
        console.log(response); 
        if (response.ok) {
            const expenses = await response.json();
            expenses.forEach(expense => addExpenseToTable(expense));
        } else {
            console.log("Failed to fetch expenses.");
        }
    } catch (error) {
        console.log("Error loading expenses:", error);
    }
}

async function updateExpense(expenseID, updatedData) {
    try {
        const response = await fetch(`/api/expenses/${expenseID}`, {
            method: 'PUT', 
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData), 
        });

        if (response.ok) {
            const updatedExpense = await response.json();
           
            showToast("Expense updated successfully!");
        } else {
            const errorMessage = await response.text();
            showToast(`Failed to update expense: ${errorMessage}`);
        }
    } catch (error) {
        console.error(error);
        showToast(`Error updating expense: ${error.message}`);
    }
}


function addExpenseToTable(expense) {
    const tableBody = document.querySelector('#expenses-table tbody');
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${expense.category || "N/A"}</td> 
      <td>${expense.amount || "N/A"}</td> 
      <td><button class = "edit-expense-btn" data-id="${expense.expenseID}">Edit</button></td>
      <td><button class="delete-expense-btn" data-id="${expense.expenseID}">Delete</button></td> 
      <td>${expense.createdAt || "N/A"}</td>
    `;

    const deleteButton = row.querySelector('.delete-expense-btn');
    deleteButton.addEventListener('click',async()=>{
        const expenseID = deleteButton.dataset.id;
        await deleteExpense(expenseID); 
    });

    const editButton = row.querySelector('.edit-expense-btn');
    editButton.addEventListener('click',async()=>{
        const expenseID = editButton.dataset.id;
        const expenseData = await updateExpense(expenseID); 
        if (expenseData) { 
            document.querySelector('#editExpenseType').value = expenseData.category;
            document.querySelector('#editAmount').value = expenseData.amount;
            $('#editExpenseModal').modal('show'); 
        }
    })

    tableBody.appendChild(row);
}

function showToast(message) {
    const toast = document.getElementById('toast-message');
    toast.innerHTML = message;
    toast.style.display = 'block';
    setTimeout(() => {
        toast.style.display = 'none';
    }, 3000);
}
