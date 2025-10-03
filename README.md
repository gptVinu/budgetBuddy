# BudgetBuddy - Simple Expense Tracker

BudgetBuddy is a straightforward expense tracking application built with HTML, CSS, and vanilla JavaScript. It allows users to record their income and expenses, categorize them, and view a summary of their financial situation.

## Features

- Add income and expense transactions with details (date, description, category, amount)
- Delete transactions
- Filter transactions by category
- View financial summary (total income, total expenses, net balance)
- Expense breakdown pie chart
- Data persistence using localStorage

## Project Structure

The project consists of three main files:

1. **index.html**: Contains the structure of the application with all necessary elements
2. **style.css**: Handles the styling and responsive design
3. **script.js**: Contains all the JavaScript functionality

## How to Use

1. Fill in the transaction details:
   - Date
   - Description
   - Category
   - Amount

2. Click either "Add Income" or "Add Expense" to add the transaction to the respective list

3. View your transactions in the Income and Expense sections
   - Filter transactions by category using the dropdown
   - Delete transactions with the Delete button

4. Check your financial summary:
   - Total Income
   - Total Expenses
   - Net Balance
   - Expense breakdown chart

## Code Structure

### HTML Structure

- Header section with app title
- Main section with:
  - Form for adding transactions
  - Lists for displaying income and expenses
  - Summary section with totals and chart

### CSS Features

- Responsive design that works on mobile, tablet, and desktop
- Flexbox and Grid layouts for organization
- Consistent color scheme
- Styled transaction items with category tags

### JavaScript Functionality

- Transaction management (add, delete, filter)
- Data persistence with localStorage
- Form validation
- Financial calculations
- Dynamic rendering of transactions
- Simple pie chart for expense visualization

## Future Enhancements

Potential features to add in the future:
- Edit existing transactions
- Export/import data
- Date range filtering
- Monthly/yearly reports
- Budget setting and alerts
