// BudgetBuddy - Main JavaScript

// Fix sidebar toggle functionality
function initSidebarToggle() {
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    const closeSidebar = document.getElementById('closeSidebar');
    
    if(sidebarToggle && sidebar && closeSidebar) {
        // Remove any existing event listeners
        const newSidebarToggle = sidebarToggle.cloneNode(true);
        sidebarToggle.parentNode.replaceChild(newSidebarToggle, sidebarToggle);
        
        const newCloseSidebar = closeSidebar.cloneNode(true);
        closeSidebar.parentNode.replaceChild(newCloseSidebar, closeSidebar);
        
        // Add event listeners to the new elements
        newSidebarToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            sidebar.classList.add('open');
        });
        
        newCloseSidebar.addEventListener('click', function(e) {
            e.preventDefault();
            sidebar.classList.remove('open');
        });
        
        // Close sidebar when clicking outside of it
        document.addEventListener('click', function(e) {
            if (sidebar.classList.contains('open') && 
                !sidebar.contains(e.target) && 
                e.target !== newSidebarToggle) {
                sidebar.classList.remove('open');
            }
        });
    }
}

// Check authentication
function checkAuth() {
    const auth = JSON.parse(localStorage.getItem('budgetBuddy_auth') || sessionStorage.getItem('budgetBuddy_auth') || '{"isAuthenticated": false}');
    
    if (!auth.isAuthenticated) {
        window.location.href = 'login.html';
    }
    
    return auth;
}

// Add logout function
function logout() {
    localStorage.removeItem('budgetBuddy_auth');
    sessionStorage.removeItem('budgetBuddy_auth');
    window.location.href = 'login.html';
}

// DOM Elements - Common
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebar = document.getElementById('sidebar');
const closeSidebar = document.getElementById('closeSidebar');

// App State
let transactions = {
    income: [],
    expenses: []
};

// Check which page we're on and execute specific code
const currentPage = window.location.pathname.split('/').pop();

// Load transactions from localStorage
function loadTransactions() {
    const savedIncome = localStorage.getItem('budgetBuddy_income');
    const savedExpenses = localStorage.getItem('budgetBuddy_expenses');
    
    if (savedIncome) {
        transactions.income = JSON.parse(savedIncome);
    }
    
    if (savedExpenses) {
        transactions.expenses = JSON.parse(savedExpenses);
    }
}

// Save transactions to localStorage
function saveTransactions() {
    localStorage.setItem('budgetBuddy_income', JSON.stringify(transactions.income));
    localStorage.setItem('budgetBuddy_expenses', JSON.stringify(transactions.expenses));
}

// Format currency to Indian Rupee
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 2
    }).format(amount);
}

// Format date for better display
function formatDate(dateStr) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString('en-IN', options);
}

// ----- HOME PAGE FUNCTIONALITY -----
if (currentPage === 'index.html' || currentPage === '') {
    const totalIncomeEl = document.getElementById('totalIncome');
    const totalExpensesEl = document.getElementById('totalExpenses');
    const netBalanceEl = document.getElementById('netBalance');
    const recentTransactionsList = document.getElementById('recentTransactionsList');

    // Render recent transactions on home page
    function renderRecentTransactions() {
        if (!recentTransactionsList) return;
        
        recentTransactionsList.innerHTML = '';
        
        // Combine and sort all transactions by date (newest first)
        const allTransactions = [
            ...transactions.income.map(item => ({...item, type: 'income'})),
            ...transactions.expenses.map(item => ({...item, type: 'expense'}))
        ].sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // Show only the 10 most recent transactions
        const recentTransactions = allTransactions.slice(0, 10);
        
        if (recentTransactions.length === 0) {
            recentTransactionsList.innerHTML = `
                <li class="no-transactions">
                    <p>No transactions yet. Add your first transaction!</p>
                </li>
            `;
            return;
        }
        
        recentTransactions.forEach(item => {
            const li = document.createElement('li');
            li.className = 'transaction-item';
            
            li.innerHTML = `
                <div class="transaction-info">
                    <div class="transaction-date">${formatDate(item.date)}</div>
                    <div class="transaction-description">${item.description}</div>
                    <div class="transaction-category ${item.category}">${item.category}</div>
                    <div class="transaction-amount ${item.type === 'income' ? 'incomeText' : 'expenseText'}">
                        ${item.type === 'income' ? '+' : '-'} ${formatCurrency(item.amount)}
                    </div>
                </div>
            `;
            
            recentTransactionsList.appendChild(li);
        });
    }

    // Update summary totals on home page
    function updateSummary() {
        if (!totalIncomeEl || !totalExpensesEl || !netBalanceEl) return;
        
        // Calculate total income
        const totalIncome = transactions.income.reduce((sum, item) => sum + item.amount, 0);
        totalIncomeEl.textContent = formatCurrency(totalIncome);
        
        // Calculate total expenses
        const totalExpenses = transactions.expenses.reduce((sum, item) => sum + item.amount, 0);
        totalExpensesEl.textContent = formatCurrency(totalExpenses);
        
        // Calculate net balance
        const netBalance = totalIncome - totalExpenses;
        netBalanceEl.textContent = formatCurrency(netBalance);
        
        // Change color of net balance based on value
        if (netBalance > 0) {
            netBalanceEl.style.color = '#2ecc71';
        } else if (netBalance < 0) {
            netBalanceEl.style.color = '#e74c3c';
        } else {
            netBalanceEl.style.color = '#333';
        }
    }
    
    // Initialize home page
    if (recentTransactionsList || totalIncomeEl) {
        loadTransactions();
        renderRecentTransactions();
        updateSummary();
    }
}

// ----- ADD TRANSACTION PAGE FUNCTIONALITY -----
if (currentPage === 'add-transaction.html') {
    const dateInput = document.getElementById('dateInput');
    const descriptionInput = document.getElementById('descriptionInput');
    const categoryInput = document.getElementById('categoryInput');
    const amountInput = document.getElementById('amountInput');
    const addTransactionBtn = document.getElementById('addTransactionBtn');
    const incomeTabBtn = document.getElementById('incomeTabBtn');
    const expenseTabBtn = document.getElementById('expenseTabBtn');
    const formTitle = document.getElementById('formTitle');
    const recentlyAddedList = document.getElementById('recentlyAddedList');
    
    // Set default date to today
    if (dateInput) {
        dateInput.valueAsDate = new Date();
    }
    
    let currentTransactionType = 'income'; // Default transaction type
    
    // Update category options based on transaction type
    function updateCategoryOptions() {
        if (!categoryInput) return;
        
        categoryInput.innerHTML = '<option value="" disabled selected>Select category</option>';
        
        if (currentTransactionType === 'income') {
            const incomeCategories = ['salary', 'freelance', 'gifts', 'other'];
            incomeCategories.forEach(cat => {
                const option = document.createElement('option');
                option.value = cat;
                option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
                categoryInput.appendChild(option);
            });
        } else {
            const expenseCategories = [
                'food', 'rent', 'utilities', 'transportation', 
                'entertainment', 'shopping', 'healthcare', 'education', 'other'
            ];
            expenseCategories.forEach(cat => {
                const option = document.createElement('option');
                option.value = cat;
                option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
                categoryInput.appendChild(option);
            });
        }
    }
    
    // Set active tab and update form
    function setActiveTransactionType(type) {
        currentTransactionType = type;
        
        if (incomeTabBtn && expenseTabBtn) {
            if (type === 'income') {
                incomeTabBtn.classList.add('active');
                expenseTabBtn.classList.remove('active');
                addTransactionBtn.textContent = 'Add Income';
                addTransactionBtn.className = 'btn incomeBtn';
                formTitle.textContent = 'Add Income';
            } else {
                incomeTabBtn.classList.remove('active');
                expenseTabBtn.classList.add('active');
                addTransactionBtn.textContent = 'Add Expense';
                addTransactionBtn.className = 'btn expenseBtn';
                formTitle.textContent = 'Add Expense';
            }
        }
        
        updateCategoryOptions();
    }
    
    // Check URL params for pre-selected type
    function checkUrlParams() {
        const params = new URLSearchParams(window.location.search);
        const type = params.get('type');
        
        if (type === 'income' || type === 'expense') {
            setActiveTransactionType(type);
        } else {
            // Set default to income if no type parameter is present
            setActiveTransactionType('income');
        }
    }
    
    // Validate form inputs
    function validateInputs() {
        if (!dateInput || !descriptionInput || !categoryInput || !amountInput) return false;
        
        if (!dateInput.value || !descriptionInput.value || !categoryInput.value || !amountInput.value) {
            alert("Please fill in all fields!");
            return false;
        }
        
        if (parseFloat(amountInput.value) <= 0) {
            alert("Amount must be greater than zero!");
            return false;
        }
        
        return true;
    }
    
    // Add new transaction
    function addTransaction() {
        if (!validateInputs()) return;
        
        const newTransaction = {
            id: Date.now(),
            date: dateInput.value,
            description: descriptionInput.value,
            category: categoryInput.value,
            amount: parseFloat(amountInput.value)
        };
        
        loadTransactions(); // Ensure we have the latest data
        
        if (currentTransactionType === 'income') {
            transactions.income.push(newTransaction);
        } else {
            transactions.expenses.push(newTransaction);
        }
        
        // Clear form inputs
        descriptionInput.value = '';
        amountInput.value = '';
        categoryInput.selectedIndex = 0;
        
        // Update UI
        saveTransactions();
        renderRecentlyAdded();
        
        // Show success message
        alert(`${currentTransactionType === 'income' ? 'Income' : 'Expense'} added successfully!`);
    }
    
    // Render recently added transactions
    function renderRecentlyAdded() {
        if (!recentlyAddedList) return;
        
        recentlyAddedList.innerHTML = '';
        
        // Combine and sort all transactions by date (newest first)
        const allTransactions = [
            ...transactions.income.map(item => ({...item, type: 'income'})),
            ...transactions.expenses.map(item => ({...item, type: 'expense'}))
        ].sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // Show only the 5 most recent transactions
        const recentTransactions = allTransactions.slice(0, 5);
        
        if (recentTransactions.length === 0) {
            recentlyAddedList.innerHTML = `
                <li class="no-transactions">
                    <p>No transactions yet. Add your first transaction!</p>
                </li>
            `;
            return;
        }
        
        recentTransactions.forEach(item => {
            const li = document.createElement('li');
            li.className = 'transaction-item';
            
            li.innerHTML = `
                <div class="transaction-info">
                    <div class="transaction-date">${formatDate(item.date)}</div>
                    <div class="transaction-description">${item.description}</div>
                    <div class="transaction-category ${item.category}">${item.category}</div>
                    <div class="transaction-amount ${item.type === 'income' ? 'incomeText' : 'expenseText'}">
                        ${item.type === 'income' ? '+' : '-'} ${formatCurrency(item.amount)}
                    </div>
                </div>
                <button class="deleteBtn" data-id="${item.id}" data-type="${item.type}">Delete</button>
            `;
            
            // Add delete functionality
            const deleteBtn = li.querySelector('.deleteBtn');
            deleteBtn.addEventListener('click', () => {
                deleteTransaction(item.id, item.type);
            });
            
            recentlyAddedList.appendChild(li);
        });
    }
    
    // Delete transaction
    function deleteTransaction(id, type) {
        if (confirm('Are you sure you want to delete this transaction?')) {
            if (type === 'income') {
                transactions.income = transactions.income.filter(item => item.id !== id);
            } else {
                transactions.expenses = transactions.expenses.filter(item => item.id !== id);
            }
            
            saveTransactions();
            renderRecentlyAdded();
        }
    }
    
    // Add event listeners
    if (incomeTabBtn && expenseTabBtn) {
        incomeTabBtn.addEventListener('click', () => setActiveTransactionType('income'));
        expenseTabBtn.addEventListener('click', () => setActiveTransactionType('expense'));
    }
    
    if (addTransactionBtn) {
        addTransactionBtn.addEventListener('click', addTransaction);
    }
    
    // Initialize add transaction page
    if (dateInput) {
        loadTransactions();
        checkUrlParams(); // This will now always set a transaction type
        updateCategoryOptions(); // Ensure categories are populated on page load
        renderRecentlyAdded();
    }
}

// ----- TRANSACTIONS PAGE FUNCTIONALITY -----
if (currentPage === 'transactions.html') {
    const transactionType = document.getElementById('transactionType');
    const categoryFilter = document.getElementById('categoryFilter');
    const startDate = document.getElementById('startDate');
    const endDate = document.getElementById('endDate');
    const applyFilters = document.getElementById('applyFilters');
    const resetFilters = document.getElementById('resetFilters');
    const transactionsTableBody = document.getElementById('transactionsTableBody');
    const noTransactions = document.getElementById('noTransactions');
    
    let filteredTransactions = [];
    
    // Update category filter options based on transaction type
    function updateCategoryFilterOptions() {
        if (!categoryFilter || !transactionType) return;
        
        categoryFilter.innerHTML = '<option value="all">All Categories</option>';
        
        if (transactionType.value === 'all') {
            const allCategories = [
                'salary', 'freelance', 'gifts', 'food', 'rent', 'utilities', 
                'transportation', 'entertainment', 'shopping', 'healthcare', 'education', 'other'
            ];
            
            allCategories.forEach(cat => {
                const option = document.createElement('option');
                option.value = cat;
                option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
                categoryFilter.appendChild(option);
            });
        } else if (transactionType.value === 'income') {
            const incomeCategories = ['salary', 'freelance', 'gifts', 'other'];
            incomeCategories.forEach(cat => {
                const option = document.createElement('option');
                option.value = cat;
                option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
                categoryFilter.appendChild(option);
            });
        } else {
            const expenseCategories = [
                'food', 'rent', 'utilities', 'transportation', 
                'entertainment', 'shopping', 'healthcare', 'education', 'other'
            ];
            expenseCategories.forEach(cat => {
                const option = document.createElement('option');
                option.value = cat;
                option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
                categoryFilter.appendChild(option);
            });
        }
    }
    
    // Filter transactions based on selected criteria
    function filterTransactions() {
        loadTransactions(); // Ensure we have the latest data
        
        let combined = [];
        
        // Get all transactions based on type
        if (transactionType.value === 'all' || !transactionType.value) {
            combined = [
                ...transactions.income.map(item => ({...item, type: 'income'})),
                ...transactions.expenses.map(item => ({...item, type: 'expense'}))
            ];
        } else if (transactionType.value === 'income') {
            combined = transactions.income.map(item => ({...item, type: 'income'}));
        } else {
            combined = transactions.expenses.map(item => ({...item, type: 'expense'}));
        }
        
        // Filter by category
        if (categoryFilter.value && categoryFilter.value !== 'all') {
            combined = combined.filter(item => item.category === categoryFilter.value);
        }
        
        // Filter by date range
        if (startDate.value) {
            combined = combined.filter(item => new Date(item.date) >= new Date(startDate.value));
        }
        
        if (endDate.value) {
            combined = combined.filter(item => new Date(item.date) <= new Date(endDate.value));
        }
        
        // Sort by date (newest first)
        filteredTransactions = combined.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        renderTransactionsTable();
    }
    
    // Render transactions table
    function renderTransactionsTable() {
        if (!transactionsTableBody || !noTransactions) return;
        
        transactionsTableBody.innerHTML = '';
        
        if (filteredTransactions.length === 0) {
            transactionsTableBody.innerHTML = '';
            noTransactions.style.display = 'block';
            return;
        }
        
        noTransactions.style.display = 'none';
        
        filteredTransactions.forEach(item => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${formatDate(item.date)}</td>
                <td>${item.description}</td>
                <td><span class="transaction-category ${item.category}">${item.category}</span></td>
                <td>${item.type.charAt(0).toUpperCase() + item.type.slice(1)}</td>
                <td class="${item.type === 'income' ? 'incomeText' : 'expenseText'}">
                    ${item.type === 'income' ? '+' : '-'} ${formatCurrency(item.amount)}
                </td>
                <td>
                    <button class="deleteBtn" data-id="${item.id}" data-type="${item.type}">Delete</button>
                </td>
            `;
            
            // Add delete functionality
            const deleteBtn = row.querySelector('.deleteBtn');
            deleteBtn.addEventListener('click', () => {
                deleteTransaction(item.id, item.type);
            });
            
            transactionsTableBody.appendChild(row);
        });
    }
    
    // Delete transaction
    function deleteTransaction(id, type) {
        if (confirm('Are you sure you want to delete this transaction?')) {
            if (type === 'income') {
                transactions.income = transactions.income.filter(item => item.id !== id);
            } else {
                transactions.expenses = transactions.expenses.filter(item => item.id !== id);
            }
            
            saveTransactions();
            filterTransactions(); // Re-filter and render
        }
    }
    
    // Reset all filters
    function resetAllFilters() {
        if (!transactionType || !categoryFilter || !startDate || !endDate) return;
        
        transactionType.value = 'all';
        updateCategoryFilterOptions();
        categoryFilter.value = 'all';
        startDate.value = '';
        endDate.value = '';
        
        filterTransactions();
    }
    
    // Add event listeners
    if (transactionType) {
        transactionType.addEventListener('change', () => {
            updateCategoryFilterOptions();
        });
    }
    
    if (applyFilters) {
        applyFilters.addEventListener('click', filterTransactions);
    }
    
    if (resetFilters) {
        resetFilters.addEventListener('click', resetAllFilters);
    }
    
    // Initialize transactions page
    if (transactionType) {
        loadTransactions();
        updateCategoryFilterOptions();
        filterTransactions();
    }
}

// Initialize App - Common for all pages
document.addEventListener('DOMContentLoaded', function() {
    // Initialize sidebar toggle functionality
    initSidebarToggle();
    
    // Load and display transactions for current page
    loadTransactions();
    
    // Add logout event listeners
    const logoutBtn = document.getElementById('logoutBtn');
    const sidebarLogout = document.getElementById('sidebarLogout');
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    }
    
    if (sidebarLogout) {
        sidebarLogout.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    }
});
