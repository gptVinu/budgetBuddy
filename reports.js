// BudgetBuddy - Reports Page JavaScript

// DOM Elements for Reports Page
const periodButtons = document.querySelectorAll('.period-btn');
const customStartDate = document.getElementById('customStartDate');
const customEndDate = document.getElementById('customEndDate');
const applyCustomDate = document.getElementById('applyCustomDate');
const reportTotalIncome = document.getElementById('reportTotalIncome');
const reportTotalExpenses = document.getElementById('reportTotalExpenses');
const reportNetSavings = document.getElementById('reportNetSavings');
const incomeChangePercent = document.getElementById('incomeChangePercent');
const expenseChangePercent = document.getElementById('expenseChangePercent');
const savingsChangePercent = document.getElementById('savingsChangePercent');
const incomeCount = document.getElementById('incomeCount');
const expenseCount = document.getElementById('expenseCount');
const topCategoriesList = document.getElementById('topCategoriesList');
const toggleTopCategories = document.getElementById('toggleTopCategories');

// Chart canvas elements
const incomeExpenseChart = document.getElementById('incomeExpenseChart');
const monthlyBreakdownChart = document.getElementById('monthlyBreakdownChart');
const expenseCategoriesChart = document.getElementById('expenseCategoriesChart');
const incomeSourcesChart = document.getElementById('incomeSourcesChart');

// Date ranges
let currentStartDate;
let currentEndDate;
let previousStartDate;
let previousEndDate;

// Reporting data
let reportData = {
    currentPeriod: {
        totalIncome: 0,
        totalExpenses: 0,
        netSavings: 0,
        incomeCount: 0,
        expenseCount: 0,
        incomeByCategory: {},
        expenseByCategory: {},
        incomeByMonth: {},
        expenseByMonth: {},
    },
    previousPeriod: {
        totalIncome: 0,
        totalExpenses: 0,
        netSavings: 0,
    }
};

// Set default date to today
customEndDate.valueAsDate = new Date();
// Set default start date to first day of current month
const firstDayOfMonth = new Date();
firstDayOfMonth.setDate(1);
customStartDate.valueAsDate = firstDayOfMonth;

// Initialize charts
let incomeExpenseChartObj, monthlyBreakdownChartObj, expenseCategoriesChartObj, incomeSourcesChartObj;

// Category colors
const categoryColors = {
    food: '#e67e22',
    rent: '#e74c3c',
    utilities: '#f39c12',
    transportation: '#16a085',
    entertainment: '#8e44ad',
    shopping: '#d35400',
    healthcare: '#27ae60',
    education: '#2980b9',
    other: '#7f8c8d',
    salary: '#3498db',
    freelance: '#9b59b6',
    gifts: '#1abc9c'
};

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 2
    }).format(amount);
}

// Initialize date range based on selected period
function initializeDateRange(period) {
    const now = new Date();
    
    switch(period) {
        case 'month':
            // This month
            currentStartDate = new Date(now.getFullYear(), now.getMonth(), 1);
            currentEndDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
            
            // Previous month
            previousStartDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            previousEndDate = new Date(now.getFullYear(), now.getMonth(), 0);
            break;
            
        case 'quarter':
            // Last 3 months
            currentStartDate = new Date(now.getFullYear(), now.getMonth() - 2, 1);
            currentEndDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
            
            // Previous 3 months
            previousStartDate = new Date(now.getFullYear(), now.getMonth() - 5, 1);
            previousEndDate = new Date(now.getFullYear(), now.getMonth() - 2, 0);
            break;
            
        case 'halfyear':
            // Last 6 months
            currentStartDate = new Date(now.getFullYear(), now.getMonth() - 5, 1);
            currentEndDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
            
            // Previous 6 months
            previousStartDate = new Date(now.getFullYear(), now.getMonth() - 11, 1);
            previousEndDate = new Date(now.getFullYear(), now.getMonth() - 5, 0);
            break;
            
        case 'year':
            // This year
            currentStartDate = new Date(now.getFullYear(), 0, 1);
            currentEndDate = new Date(now.getFullYear(), 11, 31);
            
            // Previous year
            previousStartDate = new Date(now.getFullYear() - 1, 0, 1);
            previousEndDate = new Date(now.getFullYear() - 1, 11, 31);
            break;
            
        case 'custom':
            // Use the dates from the inputs
            currentStartDate = new Date(customStartDate.value);
            currentEndDate = new Date(customEndDate.value);
            
            // Calculate equal previous period
            const duration = currentEndDate - currentStartDate;
            previousEndDate = new Date(currentStartDate);
            previousStartDate = new Date(currentStartDate);
            previousStartDate.setTime(previousStartDate.getTime() - duration);
            break;
    }
    
    // Update custom date inputs to match current selection
    customStartDate.valueAsDate = currentStartDate;
    customEndDate.valueAsDate = currentEndDate;
}

// Filter transactions by date range
function filterTransactionsByDate(transactions, startDate, endDate) {
    return transactions.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return transactionDate >= startDate && transactionDate <= endDate;
    });
}

// Calculate reporting data
function calculateReportData() {
    // Reset report data
    reportData = {
        currentPeriod: {
            totalIncome: 0,
            totalExpenses: 0,
            netSavings: 0,
            incomeCount: 0,
            expenseCount: 0,
            incomeByCategory: {},
            expenseByCategory: {},
            incomeByMonth: {},
            expenseByMonth: {}
        },
        previousPeriod: {
            totalIncome: 0,
            totalExpenses: 0,
            netSavings: 0
        }
    };
    
    // Filter transactions by current date range
    const currentIncome = filterTransactionsByDate(transactions.income, currentStartDate, currentEndDate);
    const currentExpenses = filterTransactionsByDate(transactions.expenses, currentStartDate, currentEndDate);
    
    // Filter transactions by previous date range
    const previousIncome = filterTransactionsByDate(transactions.income, previousStartDate, previousEndDate);
    const previousExpenses = filterTransactionsByDate(transactions.expenses, previousStartDate, previousEndDate);
    
    // Calculate totals for current period
    reportData.currentPeriod.totalIncome = currentIncome.reduce((sum, item) => sum + item.amount, 0);
    reportData.currentPeriod.totalExpenses = currentExpenses.reduce((sum, item) => sum + item.amount, 0);
    reportData.currentPeriod.netSavings = reportData.currentPeriod.totalIncome - reportData.currentPeriod.totalExpenses;
    reportData.currentPeriod.incomeCount = currentIncome.length;
    reportData.currentPeriod.expenseCount = currentExpenses.length;
    
    // Calculate totals for previous period
    reportData.previousPeriod.totalIncome = previousIncome.reduce((sum, item) => sum + item.amount, 0);
    reportData.previousPeriod.totalExpenses = previousExpenses.reduce((sum, item) => sum + item.amount, 0);
    reportData.previousPeriod.netSavings = reportData.previousPeriod.totalIncome - reportData.previousPeriod.totalExpenses;
    
    // Calculate income and expenses by category
    currentIncome.forEach(item => {
        if (!reportData.currentPeriod.incomeByCategory[item.category]) {
            reportData.currentPeriod.incomeByCategory[item.category] = 0;
        }
        reportData.currentPeriod.incomeByCategory[item.category] += item.amount;
    });
    
    currentExpenses.forEach(item => {
        if (!reportData.currentPeriod.expenseByCategory[item.category]) {
            reportData.currentPeriod.expenseByCategory[item.category] = 0;
        }
        reportData.currentPeriod.expenseByCategory[item.category] += item.amount;
    });
    
    // Calculate income and expenses by month
    currentIncome.forEach(item => {
        const date = new Date(item.date);
        const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
        
        if (!reportData.currentPeriod.incomeByMonth[monthKey]) {
            reportData.currentPeriod.incomeByMonth[monthKey] = 0;
        }
        reportData.currentPeriod.incomeByMonth[monthKey] += item.amount;
    });
    
    currentExpenses.forEach(item => {
        const date = new Date(item.date);
        const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
        
        if (!reportData.currentPeriod.expenseByMonth[monthKey]) {
            reportData.currentPeriod.expenseByMonth[monthKey] = 0;
        }
        reportData.currentPeriod.expenseByMonth[monthKey] += item.amount;
    });
}

// Calculate percentage change
function calculatePercentageChange(current, previous) {
    if (previous === 0) {
        return current > 0 ? 100 : 0;
    }
    return Math.round(((current - previous) / previous) * 100);
}

// Update the report UI
function updateReportUI() {
    // Update summary numbers
    reportTotalIncome.textContent = formatCurrency(reportData.currentPeriod.totalIncome);
    reportTotalExpenses.textContent = formatCurrency(reportData.currentPeriod.totalExpenses);
    reportNetSavings.textContent = formatCurrency(reportData.currentPeriod.netSavings);
    
    // Update transaction counts
    incomeCount.textContent = `${reportData.currentPeriod.incomeCount} transactions`;
    expenseCount.textContent = `${reportData.currentPeriod.expenseCount} transactions`;
    
    // Calculate and update percentage changes
    const incomeChange = calculatePercentageChange(
        reportData.currentPeriod.totalIncome, 
        reportData.previousPeriod.totalIncome
    );
    
    const expenseChange = calculatePercentageChange(
        reportData.currentPeriod.totalExpenses, 
        reportData.previousPeriod.totalExpenses
    );
    
    const savingsChange = calculatePercentageChange(
        reportData.currentPeriod.netSavings, 
        reportData.previousPeriod.netSavings
    );
    
    // Update change indicators
    incomeChangePercent.textContent = `${incomeChange}%`;
    incomeChangePercent.parentElement.classList.remove('positive', 'negative');
    incomeChangePercent.parentElement.classList.add(incomeChange >= 0 ? 'positive' : 'negative');
    incomeChangePercent.parentElement.querySelector('i').className = incomeChange >= 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down';
    
    expenseChangePercent.textContent = `${expenseChange}%`;
    expenseChangePercent.parentElement.classList.remove('positive', 'negative');
    expenseChangePercent.parentElement.classList.add(expenseChange >= 0 ? 'negative' : 'positive');
    expenseChangePercent.parentElement.querySelector('i').className = expenseChange >= 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down';
    
    savingsChangePercent.textContent = `${savingsChange}%`;
    savingsChangePercent.parentElement.classList.remove('positive', 'negative');
    savingsChangePercent.parentElement.classList.add(savingsChange >= 0 ? 'positive' : 'negative');
    savingsChangePercent.parentElement.querySelector('i').className = savingsChange >= 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down';
    
    // Update top spending categories
    updateTopCategories();
    
    // Update charts
    updateCharts();
}

// Update top spending categories
function updateTopCategories() {
    // Clear previous content
    topCategoriesList.innerHTML = '';
    
    // Sort categories by amount
    const sortedCategories = Object.entries(reportData.currentPeriod.expenseByCategory)
        .sort((a, b) => b[1] - a[1]);
    
    // Display top 5 categories by default
    const displayLimit = toggleTopCategories.textContent === 'Show All' ? 5 : sortedCategories.length;
    
    // Check if there are any categories
    if (sortedCategories.length === 0) {
        const noDataMessage = document.createElement('div');
        noDataMessage.className = 'no-data-message';
        noDataMessage.innerHTML = '<p>No expense data available for this period</p>';
        topCategoriesList.appendChild(noDataMessage);
        toggleTopCategories.style.display = 'none';
        return;
    }
    
    // Show/hide toggle button based on number of categories
    toggleTopCategories.style.display = sortedCategories.length > 5 ? 'block' : 'none';
    
    // Create category items
    for (let i = 0; i < Math.min(displayLimit, sortedCategories.length); i++) {
        const [category, amount] = sortedCategories[i];
        const percentage = Math.round((amount / reportData.currentPeriod.totalExpenses) * 100);
        
        const categoryItem = document.createElement('div');
        categoryItem.className = 'category-item';
        categoryItem.style.borderLeftColor = categoryColors[category] || '#7f8c8d';
        
        categoryItem.innerHTML = `
            <div>
                <h4>${category.charAt(0).toUpperCase() + category.slice(1)}</h4>
                <p>${percentage}% of total expenses</p>
            </div>
            <div>
                <h4>${formatCurrency(amount)}</h4>
            </div>
        `;
        
        topCategoriesList.appendChild(categoryItem);
    }
}

// Initialize and update charts
function updateCharts() {
    // Destroy previous charts if they exist
    if (incomeExpenseChartObj) incomeExpenseChartObj.destroy();
    if (monthlyBreakdownChartObj) monthlyBreakdownChartObj.destroy();
    if (expenseCategoriesChartObj) expenseCategoriesChartObj.destroy();
    if (incomeSourcesChartObj) incomeSourcesChartObj.destroy();
    
    // Create income vs expenses chart
    createIncomeExpenseChart();
    
    // Create monthly breakdown chart
    createMonthlyBreakdownChart();
    
    // Create expense categories chart
    createExpenseCategoriesChart();
    
    // Create income sources chart
    createIncomeSourcesChart();
}

// Create income vs expenses chart
function createIncomeExpenseChart() {
    const ctx = incomeExpenseChart.getContext('2d');
    
    incomeExpenseChartObj = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Income', 'Expenses', 'Savings'],
            datasets: [{
                data: [
                    reportData.currentPeriod.totalIncome,
                    reportData.currentPeriod.totalExpenses,
                    reportData.currentPeriod.netSavings
                ],
                backgroundColor: [
                    '#2ecc71',
                    '#e74c3c',
                    '#3498db'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return formatCurrency(context.raw);
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return formatCurrency(value);
                        }
                    }
                }
            }
        }
    });
}

// Create monthly breakdown chart
function createMonthlyBreakdownChart() {
    const ctx = monthlyBreakdownChart.getContext('2d');
    
    // Get all month keys sorted
    const allMonths = Object.keys({
        ...reportData.currentPeriod.incomeByMonth,
        ...reportData.currentPeriod.expenseByMonth
    }).sort();
    
    // Format month labels
    const monthLabels = allMonths.map(monthKey => {
        const [year, month] = monthKey.split('-');
        const date = new Date(year, month - 1, 1);
        return date.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
    });
    
    // Prepare data for chart
    const incomeData = allMonths.map(monthKey => 
        reportData.currentPeriod.incomeByMonth[monthKey] || 0
    );
    
    const expenseData = allMonths.map(monthKey => 
        reportData.currentPeriod.expenseByMonth[monthKey] || 0
    );
    
    // Create chart
    monthlyBreakdownChartObj = new Chart(ctx, {
        type: 'line',
        data: {
            labels: monthLabels,
            datasets: [
                {
                    label: 'Income',
                    data: incomeData,
                    borderColor: '#2ecc71',
                    backgroundColor: 'rgba(46, 204, 113, 0.2)',
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Expenses',
                    data: expenseData,
                    borderColor: '#e74c3c',
                    backgroundColor: 'rgba(231, 76, 60, 0.2)',
                    fill: true,
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${formatCurrency(context.raw)}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return formatCurrency(value);
                        }
                    }
                }
            }
        }
    });
}

// Create expense categories chart
function createExpenseCategoriesChart() {
    const ctx = expenseCategoriesChart.getContext('2d');
    
    const categories = Object.keys(reportData.currentPeriod.expenseByCategory);
    const amounts = Object.values(reportData.currentPeriod.expenseByCategory);
    const backgroundColors = categories.map(category => categoryColors[category] || '#7f8c8d');
    
    // Create chart
    expenseCategoriesChartObj = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: categories.map(cat => cat.charAt(0).toUpperCase() + cat.slice(1)),
            datasets: [{
                data: amounts,
                backgroundColor: backgroundColors,
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const percentage = Math.round(
                                (context.raw / reportData.currentPeriod.totalExpenses) * 100
                            );
                            return `${context.label}: ${formatCurrency(context.raw)} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

// Create income sources chart
function createIncomeSourcesChart() {
    const ctx = incomeSourcesChart.getContext('2d');
    
    const categories = Object.keys(reportData.currentPeriod.incomeByCategory);
    const amounts = Object.values(reportData.currentPeriod.incomeByCategory);
    const backgroundColors = categories.map(category => categoryColors[category] || '#3498db');
    
    // Create chart
    incomeSourcesChartObj = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: categories.map(cat => cat.charAt(0).toUpperCase() + cat.slice(1)),
            datasets: [{
                data: amounts,
                backgroundColor: backgroundColors,
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const percentage = Math.round(
                                (context.raw / reportData.currentPeriod.totalIncome) * 100
                            );
                            return `${context.label}: ${formatCurrency(context.raw)} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

// Load and refresh reports data
function loadReports(period = 'month') {
    // Initialize date range based on period
    initializeDateRange(period);
    
    // Calculate report data
    calculateReportData();
    
    // Update UI
    updateReportUI();
}

// Event listeners for period buttons
periodButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        // Remove active class from all buttons
        periodButtons.forEach(btn => btn.classList.remove('active'));
        
        // Add active class to clicked button
        e.target.classList.add('active');
        
        // Load reports for selected period
        loadReports(e.target.dataset.period);
    });
});

// Event listener for custom date filter
applyCustomDate.addEventListener('click', () => {
    // Check if dates are valid
    if (!customStartDate.value || !customEndDate.value) {
        alert('Please select both start and end dates');
        return;
    }
    
    // Check if end date is after start date
    if (new Date(customEndDate.value) < new Date(customStartDate.value)) {
        alert('End date must be after start date');
        return;
    }
    
    // Remove active class from all period buttons
    periodButtons.forEach(btn => btn.classList.remove('active'));
    
    // Load reports with custom period
    loadReports('custom');
});

// Event listener for toggling top categories
toggleTopCategories.addEventListener('click', () => {
    if (toggleTopCategories.textContent === 'Show All') {
        toggleTopCategories.textContent = 'Show Less';
    } else {
        toggleTopCategories.textContent = 'Show All';
    }
    updateTopCategories();
});

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
    
    // Load Chart.js from CDN if not already loaded
    if (typeof Chart === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
        script.onload = () => loadReports();
        document.head.appendChild(script);
    } else {
        loadReports();
    }
});
