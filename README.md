# BudgetBuddy - Simple Expense Tracker

BudgetBuddy is a modern expense tracking web application built with HTML, CSS, and vanilla JavaScript. It allows users to securely log in, record income and expense transactions, categorize them, set budgets, and view detailed financial reports.

## Features

- **Authentication**: Login and signup with default credentials (username: `admin`, password: `admin123`) or create your own account.
- **Sidebar Navigation**: Responsive sidebar for navigation on mobile and desktop.
- **Add Transactions**: Record income and expense transactions with date, description, category, and amount.
- **Transaction Management**: View, filter, and delete transactions. Filter by type, category, and date range.
- **Financial Summary**: Dashboard showing total income, total expenses, and net balance.
- **Budget Planning**: Set monthly and category-wise budgets, track spending, and view remaining budget.
- **Reports & Charts**: Visualize your finances with charts (income vs expenses, monthly breakdown, category breakdown).
- **Data Persistence**: All data is stored in browser localStorage for privacy and persistence.
- **Logout**: Securely log out from any page.
- **Responsive Design**: Optimized for mobile and desktop devices.

## Project Structure

- **index.html**: Dashboard and summary view.
- **add-transaction.html**: Add new income or expense transactions.
- **transactions.html**: View, filter, and manage all transactions.
- **budget.html**: Set and track budgets.
- **reports.html**: Financial reports and charts.
- **login.html** / **signup.html**: Authentication pages.
- **style.css**: Main stylesheet for layout and responsive design.
- **script.js**: Main JavaScript for app logic and navigation.
- **login.js**: Authentication logic.
- **budget.js** / **reports.js**: Page-specific logic for budget and reports.

## How to Use

1. **Login**: Start at `login.html`. Use default credentials or sign up for a new account.
2. **Navigation**: Use the sidebar menu (toggle button on mobile) to access different sections.
3. **Add Transactions**: Go to "Add Transaction", fill in details, and submit.
4. **View Transactions**: Use "Transactions" to see all records, filter by type/category/date, and delete if needed.
5. **Set Budgets**: Go to "Budget" to set monthly/category budgets and track your spending.
6. **View Reports**: Go to "Reports" for charts and analytics of your financial data.
7. **Logout**: Use the logout button in the sidebar or navbar to securely log out.

## Code Structure

- **HTML**: Semantic structure for each page, with sidebar and main content.
- **CSS**: Responsive layouts, sidebar navigation, modern UI components.
- **JavaScript**: Handles authentication, transaction management, filtering, chart rendering, and budget logic.

## Demo Credentials

- Username: `admin`
- Password: `admin123`

## Future Enhancements

- Edit transactions and budgets
- Export/import data
- Multi-user support
- Cloud sync
- Notifications and reminders

---

**Designed By Vinayak**

BudgetBuddy © 2025
- Dynamic rendering of transactions
- Simple pie chart for expense visualization

## Future Enhancements

Potential features to add in the future:
- Edit existing transactions
- Export/import data
- Date range filtering
- Monthly/yearly reports
- Budget setting and alerts
