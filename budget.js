// BudgetBuddy - Budget Page JavaScript

// DOM Elements for Budget Page
const currentMonthElem = document.getElementById('currentMonth');
const prevMonthBtn = document.getElementById('prevMonth');
const nextMonthBtn = document.getElementById('nextMonth');
const totalBudgetElem = document.getElementById('totalBudget');
const totalSpentElem = document.getElementById('totalSpent');
const remainingBudgetElem = document.getElementById('remainingBudget');
const spentProgressElem = document.getElementById('spentProgress');
const budgetCategoriesList = document.getElementById('budgetCategoriesList');
const addBudgetBtn = document.getElementById('addBudgetBtn');
const budgetForm = document.getElementById('budgetForm');
const formTitle = document.getElementById('formTitle');
const budgetCategorySelect = document.getElementById('budgetCategory');
const budgetAmountInput = document.getElementById('budgetAmount');
const budgetIdInput = document.getElementById('budgetId');
const budgetMonthInput = document.getElementById('budgetMonth');
const categoryBudgetForm = document.getElementById('categoryBudgetForm');
const cancelBudgetBtn = document.getElementById('cancelBudget');

// Date and month handling
let currentDate = new Date();
let displayedMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

// Budget data structure
let budgets = {};

// Category icons
const categoryIcons = {
    food: 'fa-utensils',
    rent: 'fa-home',
    utilities: 'fa-bolt',
    transportation: 'fa-car',
    entertainment: 'fa-film',
    shopping: 'fa-shopping-bag',
    healthcare: 'fa-medkit',
    education: 'fa-graduation-cap',
    other: 'fa-circle'
};

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 2
    }).format(amount);
}

// Format month year
function formatMonthYear(date) {
    return date.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
}

// Generate month key
function getMonthKey(date) {
    return `${date.getFullYear()}-${date.getMonth() + 1}`;
}

// Calculate total budget
function calculateTotalBudget(monthKey) {
    if (!budgets[monthKey]) return 0;
    return Object.values(budgets[monthKey]).reduce((total, budget) => total + budget.amount, 0);
}

// Get current month's expenses
function getCurrentMonthExpenses(monthKey) {
    const [year, month] = monthKey.split('-').map(Number);
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    
    // Filter expenses within the month
    return transactions.expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= startDate && expenseDate <= endDate;
    });
}

// Calculate total spent in a month
function calculateTotalSpent(monthKey) {
    const expenses = getCurrentMonthExpenses(monthKey);
    return expenses.reduce((total, expense) => total + expense.amount, 0);
}

// Calculate spent by category
function calculateCategorySpent(monthKey, category) {
    const expenses = getCurrentMonthExpenses(monthKey).filter(expense => expense.category === category);
    return expenses.reduce((total, expense) => total + expense.amount, 0);
}

// Update budget display
function updateBudgetDisplay() {
    // Update month display
    currentMonthElem.textContent = formatMonthYear(displayedMonth);
    
    // Get current month key
    const monthKey = getMonthKey(displayedMonth);
    
    // Calculate budget stats
    const totalBudget = calculateTotalBudget(monthKey);
    const totalSpent = calculateTotalSpent(monthKey);
    const remainingBudget = Math.max(0, totalBudget - totalSpent);
    
    // Update summary cards
    totalBudgetElem.textContent = formatCurrency(totalBudget);
    totalSpentElem.textContent = formatCurrency(totalSpent);
    remainingBudgetElem.textContent = formatCurrency(remainingBudget);
    
    // Update progress bar
    const spentPercentage = totalBudget > 0 ? Math.min(100, Math.round((totalSpent / totalBudget) * 100)) : 0;
    spentProgressElem.style.width = `${spentPercentage}%`;
    
    // Change progress bar color based on percentage
    if (spentPercentage < 70) {
        spentProgressElem.className = 'progress safe';
    } else if (spentPercentage < 90) {
        spentProgressElem.className = 'progress warning';
    } else {
        spentProgressElem.className = 'progress danger';
    }
    
    // Update category budgets list
    renderCategoryBudgets(monthKey);
}

// Render category budgets
function renderCategoryBudgets(monthKey) {
    // Clear previous content
    budgetCategoriesList.innerHTML = '';
    
    // Check if there are any budgets for this month
    if (!budgets[monthKey] || Object.keys(budgets[monthKey]).length === 0) {
        const noBudgetsMessage = document.createElement('div');
        noBudgetsMessage.className = 'no-data-message';
        noBudgetsMessage.innerHTML = `
            <i class="fas fa-piggy-bank"></i>
            <p>No budgets set for ${formatMonthYear(displayedMonth)}</p>
            <button class="btn incomeBtn" id="startBudgetBtn">Set Your First Budget</button>
        `;
        budgetCategoriesList.appendChild(noBudgetsMessage);
        
        // Add event listener to the "Set Your First Budget" button
        document.getElementById('startBudgetBtn').addEventListener('click', () => showBudgetForm());
        return;
    }
    
    // Sort categories alphabetically
    const categories = Object.keys(budgets[monthKey]).sort();
    
    // Create budget category items
    categories.forEach(category => {
        const budget = budgets[monthKey][category];
        const spent = calculateCategorySpent(monthKey, category);
        const remaining = Math.max(0, budget.amount - spent);
        const percentage = budget.amount > 0 ? Math.min(100, Math.round((spent / budget.amount) * 100)) : 0;
        
        // Determine progress bar class based on percentage
        let progressClass = 'safe';
        if (percentage >= 90) progressClass = 'danger';
        else if (percentage >= 70) progressClass = 'warning';
        
        const categoryItem = document.createElement('div');
        categoryItem.className = 'budget-category';
        
        categoryItem.innerHTML = `
            <div class="budget-category-header">
                <div class="budget-category-title">
                    <i class="fas ${categoryIcons[category] || 'fa-circle'} ${category}"></i>
                    <h3>${category.charAt(0).toUpperCase() + category.slice(1)}</h3>
                </div>
                <div class="budget-actions">
                    <button class="edit-budget" data-category="${category}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-budget" data-category="${category}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="budget-details">
                <div>Budget: ${formatCurrency(budget.amount)}</div>
                <div>Spent: ${formatCurrency(spent)}</div>
                <div>Remaining: ${formatCurrency(remaining)}</div>
            </div>
            <div class="budget-progress-bar">
                <div class="budget-progress ${progressClass}" style="width: ${percentage}%"></div>
            </div>
            <div class="budget-percentage">${percentage}% used</div>
        `;
        
        // Add event listeners to edit and delete buttons
        categoryItem.querySelector('.edit-budget').addEventListener('click', () => {
            editBudget(monthKey, category);
        });
        
        categoryItem.querySelector('.delete-budget').addEventListener('click', () => {
            deleteBudget(monthKey, category);
        });
        
        budgetCategoriesList.appendChild(categoryItem);
    });
}

// Show budget form
function showBudgetForm(isEdit = false, categoryToEdit = null, existingAmount = 0) {
    budgetForm.style.display = 'block';
    formTitle.textContent = isEdit ? 'Edit Budget' : 'Add New Budget';
    
    if (isEdit && categoryToEdit) {
        // Set existing values for editing
        budgetCategorySelect.value = categoryToEdit;
        budgetCategorySelect.disabled = true; // Disable category change when editing
        budgetAmountInput.value = existingAmount;
        budgetIdInput.value = categoryToEdit;
    } else {
        // Reset form for adding new budget
        budgetCategorySelect.value = '';
        budgetCategorySelect.disabled = false;
        budgetAmountInput.value = '';
        budgetIdInput.value = '';
    }
    
    // Set current month
    budgetMonthInput.value = getMonthKey(displayedMonth);
    
    // Scroll to the form
    budgetForm.scrollIntoView({ behavior: 'smooth' });
}

// Hide budget form
function hideBudgetForm() {
    budgetForm.style.display = 'none';
}

// Save budget
function saveBudget(event) {
    event.preventDefault();
    
    const category = budgetCategorySelect.value;
    const amount = parseFloat(budgetAmountInput.value);
    const monthKey = budgetMonthInput.value;
    
    // Validate inputs
    if (!category || isNaN(amount) || amount <= 0) {
        alert('Please select a category and enter a valid amount');
        return;
    }
    
    // Initialize month structure if it doesn't exist
    if (!budgets[monthKey]) {
        budgets[monthKey] = {};
    }
    
    // Save/update budget
    budgets[monthKey][category] = {
        amount: amount
    };
    
    // Save to localStorage
    saveBudgetsToStorage();
    
    // Hide form
    hideBudgetForm();
    
    // Update display
    updateBudgetDisplay();
}

// Edit budget
function editBudget(monthKey, category) {
    if (budgets[monthKey] && budgets[monthKey][category]) {
        showBudgetForm(true, category, budgets[monthKey][category].amount);
    }
}

// Delete budget
function deleteBudget(monthKey, category) {
    if (confirm(`Are you sure you want to delete the budget for ${category}?`)) {
        if (budgets[monthKey] && budgets[monthKey][category]) {
            delete budgets[monthKey][category];
            
            // If no more budgets for this month, delete the month entry
            if (Object.keys(budgets[monthKey]).length === 0) {
                delete budgets[monthKey];
            }
            
            // Save to localStorage
            saveBudgetsToStorage();
            
            // Update display
            updateBudgetDisplay();
        }
    }
}

// Save budgets to localStorage
function saveBudgetsToStorage() {
    localStorage.setItem('budgetBuddy_budgets', JSON.stringify(budgets));
}

// Load budgets from localStorage
function loadBudgetsFromStorage() {
    const savedBudgets = localStorage.getItem('budgetBuddy_budgets');
    if (savedBudgets) {
        budgets = JSON.parse(savedBudgets);
    }
}

// Navigate to previous month
function goToPrevMonth() {
    displayedMonth = new Date(displayedMonth.getFullYear(), displayedMonth.getMonth() - 1, 1);
    updateBudgetDisplay();
}

// Navigate to next month
function goToNextMonth() {
    displayedMonth = new Date(displayedMonth.getFullYear(), displayedMonth.getMonth() + 1, 1);
    updateBudgetDisplay();
}

// Event listeners
prevMonthBtn.addEventListener('click', goToPrevMonth);
nextMonthBtn.addEventListener('click', goToNextMonth);
addBudgetBtn.addEventListener('click', () => showBudgetForm());
cancelBudgetBtn.addEventListener('click', hideBudgetForm);
categoryBudgetForm.addEventListener('submit', saveBudget);

// Initialize when document is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Load transactions from localStorage
    if (typeof transactions === 'undefined') {
        // If transactions object isn't available from the main script, create it
        transactions = {
            income: JSON.parse(localStorage.getItem('budgetBuddy_income') || '[]'),
            expenses: JSON.parse(localStorage.getItem('budgetBuddy_expenses') || '[]')
        };
    }
    
    // Initialize sidebar functionality if not already set up
    if (typeof sidebarToggle !== 'undefined' && !sidebarToggle.hasListener) {
        sidebarToggle.addEventListener('click', () => sidebar.classList.add('open'));
        closeSidebar.addEventListener('click', () => sidebar.classList.remove('open'));
        sidebarToggle.hasListener = true;
    }
    
    // Load budgets
    loadBudgetsFromStorage();
    
    // Initialize display
    updateBudgetDisplay();
});
