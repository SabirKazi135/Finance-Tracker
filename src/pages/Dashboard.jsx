// Import the main page layout wrapper component
import MainLayout from '../layouts/MainLayout';
import { useNavigate } from 'react-router-dom';


// Import the custom Zustand store hook to access finance data and helper methods
import { useFinanceStore } from '../store/financeStore';
// Import chart components from the 'recharts' library for visualizing data
import {
  PieChart, // Main container for pie charts
  Pie, // Actual pie shape that shows data slices
  Cell, // Used to color each slice/bar individually
  ResponsiveContainer, // Makes charts automatically fit their parent container size
  BarChart, // Main container for bar charts
  Bar, // Actual bars that represent data
  XAxis, // X axis line and labels
  YAxis, // Y axis line and labels
  CartesianGrid, // Background grid lines
  Legend, // Legend explaining what each color means
  Tooltip, // Tooltip that appears on hover
} from 'recharts';

// Main React component that shows the "Total" dashboard page
function Total() {
  const navigate = useNavigate();

  // Destructure methods from the finance store (Zustand)
  // These functions return calculated values or filtered lists from the store state
  const {
    getTotalBalance, // Returns total balance = total income - total expense (or however you defined it)
    getTotalIncome, // Returns sum of all income transactions
    getTotalExpense, // Returns sum of all expense transactions
    getRecentTransactions, // Returns list of recent transactions (both income and expense)
    getRecentIncome, // Returns list of recent income transactions
    getRecentExpenses, // Returns list of recent expense transactions
  } = useFinanceStore();

  // Call store selectors to get actual values and lists
  const totalBalance = getTotalBalance(); // Current total balance value
  const totalIncome = getTotalIncome(); // Current total income value
  const totalExpense = getTotalExpense(); // Current total expense value
  const recentTransactions = getRecentTransactions(5); // Get last 5 mixed transactions (income + expense)
  const recentIncome = getRecentIncome(5); // Get last 5 income records
  const recentExpenses = getRecentExpenses(5); // Get last 5 expense records

  // Helper function to format any number as currency
  const formatCurrency = (amount) => {
    // Intl.NumberFormat formats numbers according to locale and currency style
    return new Intl.NumberFormat('en-US', {
      style: 'currency', // Show as money
      currency: 'USD', // Use US Dollar symbol
      minimumFractionDigits: 0, // Do not show decimal places
    }).format(amount); // Format the given amount and return string
  };

  // Helper function to format a date string into "1st Jan 2025" style
  const formatDate = (dateString) => {
    const date = new Date(dateString); // Convert stored date string into Date object
    const day = date.getDate(); // Get day of month (1–31)
    const month = date.toLocaleString('default', { month: 'short' }); // Get short month name (e.g. Jan, Feb)
    const year = date.getFullYear(); // Get full year

    // Choose proper suffix for the day (1st, 2nd, 3rd, 4th, etc.)
    const suffix =
      day === 1 || day === 21 || day === 31
        ? 'st'
        : day === 2 || day === 22
          ? 'nd'
          : day === 3 || day === 23
            ? 'rd'
            : 'th';

    // Build final formatted date string
    return `${day}${suffix} ${month} ${year}`;
  };

  // ===== Financial Overview Pie Chart Data =====
  // Build an array of objects for the "Financial Overview" pie chart
  // Each object represents one slice of the pie
  const financialOverviewData = [
    { name: 'Total Balance', amount: totalBalance, color: '#875CF5' }, // Slice for balance
    { name: 'Total Expense', amount: totalExpense, color: '#FA2C37' }, // Slice for expense
    { name: 'Total Income', amount: totalIncome, color: '#FF6900' }, // Slice for income
  ];

  // ===== Last 30 Days Expenses Bar Chart Data =====
  // Group recent expenses by category and sum their amounts
  const expenseCategories = recentExpenses.reduce((acc, expense) => {
    // Check if we already have an entry for this category
    const existing = acc.find((item) => item.name === expense.category);
    if (existing) {
      // If exists, add this expense amount to the existing total
      existing.amount += expense.amount;
    } else {
      // If not exists, push a new object with category name and amount
      acc.push({ name: expense.category, amount: expense.amount });
    }
    return acc; // Return accumulator for the next iteration
  }, []); // Start with an empty array

  // ===== Last 60 Days Income Pie Chart Data =====
  // Group recent income by category and sum their amounts
  const incomeCategories = recentIncome.reduce((acc, income) => {
    // Check if we already have an entry for this income category
    const existing = acc.find((item) => item.name === income.category);
    if (existing) {
      // If exists, increase total amount
      existing.amount += income.amount;
    } else {
      // If not, create a new category entry
      acc.push({ name: income.category, amount: income.amount });
    }
    return acc; // Return accumulator for next loop
  }, []); // Start with empty array

  // Predefined colors for specific income category names
  const incomeColors = {
    'Freelance Project': '#FF6900',
    Income: '#875CF5',
    'Part-time Work': '#4f39f6',
  };

  // JSX: what the component renders on the screen
  return (
    // MainLayout wraps the whole page with the common layout (sidebar, navbar, etc.)
    <MainLayout>
      {/* ==== TOP CARDS ==== */}
      {/* Grid for the top 3 cards: Total Balance, Total Income, Total Expense */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Total Balance */}
        {/* Card container with flex layout and styles */}
        <div className="flex items-center gap-6 rounded-2xl border border-gray-200/50 bg-white p-6 shadow-md shadow-gray-100">
          {/* Icon circle with background and icon for balance */}
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-[26px] text-white drop-shadow-xl">
            {/* SVG icon representing a card/wallet */}
            <svg
              stroke="currentColor"
              fill="currentColor"
              viewBox="0 0 512 512"
              height="1em"
              width="1em"
            >
              <path d="M435.2 80H76.8c-24.9 0-44.6 19.6-44.6 44L32 388c0 24.4 19.9 44 44.8 44h358.4c24.9 0 44.8-19.6 44.8-44V124c0-24.4-19.9-44-44.8-44zm0 308H76.8V256h358.4v132zm0-220H76.8v-44h358.4v44z"></path>
            </svg>
          </div>
          {/* Text section showing label and value */}
          <div>
            <h6 className="mb-1 text-sm text-gray-500">Total Balance</h6>
            <span className="text-[22px] font-semibold">
              {/* Display formatted total balance */}
              {formatCurrency(totalBalance)}
            </span>
          </div>
        </div>

        {/* Total Income */}
        {/* Similar card structure but for total income */}
        <div className="flex items-center gap-6 rounded-2xl border border-gray-200/50 bg-white p-6 shadow-md shadow-gray-100">
          {/* Icon circle with orange background */}
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-500 text-[26px] text-white drop-shadow-xl">
            {/* SVG icon representing money or income */}
            <svg
              stroke="currentColor"
              fill="currentColor"
              viewBox="0 0 512 512"
              height="1em"
              width="1em"
            >
              <path d="M461.2 128H80c-8.84 0-16-7.16-16-16s7.16-16 16-16h384c8.84 0 16-7.16 16-16 0-26.51-21.49-48-48-48H64C28.65 32 0 60.65 0 96v320c0 35.35 28.65 64 64 64h397.2c28.02 0 50.8-21.53 50.8-48V176c0-26.47-22.78-48-50.8-48zM416 336c-17.67 0-32-14.33-32-32s14.33-32 32-32 32 14.33 32 32-14.33 32-32 32z"></path>
            </svg>
          </div>
          {/* Text for total income */}
          <div>
            <h6 className="mb-1 text-sm text-gray-500">Total Income</h6>
            <span className="text-[22px] font-semibold">
              {/* Display formatted total income */}
              {formatCurrency(totalIncome)}
            </span>
          </div>
        </div>

        {/* Total Expense */}
        {/* Card for total expense */}
        <div className="flex items-center gap-6 rounded-2xl border border-gray-200/50 bg-white p-6 shadow-md shadow-gray-100">
          {/* Red circle icon for expense */}
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500 text-[26px] text-white drop-shadow-xl">
            {/* SVG icon for outgoing money */}
            <svg
              stroke="currentColor"
              fill="currentColor"
              viewBox="0 0 640 512"
              height="1em"
              width="1em"
            >
              <path d="M535 41c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l64 64c4.5 4.5 7 10.6 7 17s-2.5 12.5-7 17l-64 64c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l23-23L384 112c-13.3 0-24-10.7-24-24s10.7-24 24-24l174.1 0L535 41zM105 377l-23 23L256 400c13.3 0 24 10.7 24 24s-10.7 24-24 24L81.9 448l23 23c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0L7 441c-4.5-4.5-7-10.6-7-17s2.5-12.5 7-17l64-64c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9zM96 64l241.9 0c-3.7 7.2-5.9 15.3-5.9 24c0 28.7 23.3 52 52 52l117.4 0c-4 17 .6 35.5 13.8 48.8c20.3 20.3 53.2 20.3 73.5 0L608 169.5 608 384c0 35.3-28.7 64-64 64l-241.9 0c3.7-7.2 5.9-15.3 5.9-24c0-28.7-23.3-52-52-52l-117.4 0c4-17-.6-35.5-13.8-48.8c-20.3-20.3-53.2-20.3-73.5 0L32 342.5 32 128c0-35.3 28.7-64 64-64zm64 64l-64 0 0 64c35.3 0 64-28.7 64-64zM544 320c-35.3 0-64 28.7-64 64l64 0 0-64zM320 352a96 96 0 1 0 0-192 96 96 0 1 0 0 192z"></path>
            </svg>
          </div>
          {/* Text for total expense */}
          <div>
            <h6 className="mb-1 text-sm text-gray-500">Total Expense</h6>
            <span className="text-[22px] font-semibold">
              {/* Display formatted total expense */}
              {formatCurrency(totalExpense)}
            </span>
          </div>
        </div>
      </div>

      {/* ==== MAIN CONTENT GRID ==== */}
      {/* Two-column grid: Recent Transactions + Financial Overview chart */}
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Recent Transactions */}
        {/* Card container for recent transactions list */}
        <div className="card border">
          {/* Header row with title and "See All" button */}
          <div className="flex items-center justify-between">
            <h5 className="text-lg">Recent Transactions</h5>
            <button className="card-btn" onClick={() => navigate('/expense')}>
              {/* Button text and arrow icon */}
              See All{' '}
              <svg
                stroke="currentColor"
                fill="none"
                strokeWidth="2"
                viewBox="0 0 24 24"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-base"
                height="1em"
                width="1em"
              >
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </button>
          </div>
          {/* List of recent transactions */}
          <div className="mt-6">
            {/* Map over recentTransactions array to render each item */}
            {recentTransactions.map((transaction) => (
              // Outer container for single transaction item
              <div
                key={transaction.id} // Key helps React track list items
                className="group relative mt-2 flex items-center gap-4 rounded-lg p-3 hover:bg-gray-100/60"
              >
                {/* Circle icon on left side */}
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-xl text-gray-800">
                  {/* SVG icon for transaction */}
                  <svg
                    stroke="currentColor"
                    fill="none"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    height="1em"
                    width="1em"
                  >
                    <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"></path>
                    <path d="M7 2v20"></path>
                    <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"></path>
                  </svg>
                </div>
                {/* Right side: title/date and amount */}
                <div className="flex flex-1 items-center justify-between">
                  {/* Left text block: transaction title and date */}
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      {/* Show transaction title */}
                      {transaction.title}
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      {/* Format and show transaction date */}
                      {formatDate(transaction.date)}
                    </p>
                  </div>
                  {/* Right block: amount with styling based on type (income/expense) */}
                  <div className="flex items-center gap-2">
                    <div
                      className={`flex items-center gap-2 rounded-md px-3 py-1.5 ${
                        transaction.type === 'income'
                          ? 'bg-green-50 text-green-500' // For income: green background and text
                          : 'bg-red-50 text-red-500' // For expense: red background and text
                      }`}
                    >
                      <h6 className="text-xs font-medium">
                        {/* Add + or - sign based on type and format amount */}
                        {transaction.type === 'income' ? '+' : '-'}
                        {formatCurrency(transaction.amount)}
                      </h6>
                      {/* Icon showing direction (up for income, down for expense) */}
                      <svg
                        stroke="currentColor"
                        fill="none"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        height="1em"
                        width="1em"
                      >
                        {transaction.type === 'income' ? (
                          // If income, show "up" style icon
                          <>
                            <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
                            <polyline points="16 7 22 7 22 13"></polyline>
                          </>
                        ) : (
                          // If expense, show "down" style icon
                          <>
                            <polyline points="22 17 13.5 8.5 8.5 13.5 2 7"></polyline>
                            <polyline points="16 17 22 17 22 11"></polyline>
                          </>
                        )}
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Financial Overview */}
        {/* Card containing the financial overview pie chart */}
        <div className="card">
          {/* Header with title */}
          <div className="flex items-center justify-between">
            <h5 className="text-lg">Financial Overview</h5>
          </div>
          <div>
            {/* ResponsiveContainer makes pie chart resize with width/height of parent */}
            <ResponsiveContainer width="100%" height={380}>
              {/* Main PieChart wrapper */}
              <PieChart>
                {/* Pie component draws the donut chart */}
                <Pie
                  data={financialOverviewData} // Use prepared data array
                  cx="50%" // Center X position
                  cy="50%" // Center Y position
                  labelLine={false} // Hide default label lines
                  outerRadius={130} // Outer radius of donut
                  innerRadius={80} // Inner radius (makes it donut instead of full pie)
                  fill="#8884d8" // Default fill (overridden by Cell)
                  dataKey="amount" // Which field to use for slice size
                >
                  {/* Map over financialOverviewData to create one Cell per slice with its own color */}
                  {financialOverviewData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                {/* Tooltip appears when hovering over slices */}
                <Tooltip
                  formatter={(value) => formatCurrency(value)} // Format displayed number as currency
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                {/* Legend shows labels and color boxes */}
                <Legend
                  wrapperStyle={{ paddingTop: '20px' }} // Add space above legend
                  formatter={(value) => (
                    <span className="text-xs font-medium text-gray-700">
                      {value}
                    </span>
                  )}
                />
                {/* Center text: title inside the donut */}
                <text
                  x="50%"
                  y="50%"
                  dy={-25}
                  textAnchor="middle"
                  fill="#666"
                  fontSize="14px"
                >
                  Total Balance
                </text>
                {/* Center text: actual balance value inside the donut */}
                <text
                  x="50%"
                  y="50%"
                  dy={8}
                  textAnchor="middle"
                  fill="#333"
                  fontSize="24px"
                  fontWeight="semi-bold"
                >
                  {formatCurrency(totalBalance)}
                </text>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ==== SECOND ROW ==== */}
      {/* Grid: left - expense list, right - bar chart for last 30 days expenses */}
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Expenses */}
        {/* Card listing recent expense items */}
        <div className="card">
          {/* Header with title and "See All" button */}
          <div className="flex items-center justify-between">
            <h5 className="text-lg">Expanses</h5>
            <button className="card-btn" onClick={() => navigate('/expense')}>
              {/* Button text and arrow icon */}
              See All{' '}
              <svg
                stroke="currentColor"
                fill="none"
                strokeWidth="2"
                viewBox="0 0 24 24"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-base"
                height="1em"
                width="1em"
              >
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </button>
          </div>
          {/* List of recent expense entries */}
          <div className="mt-6">
            {/* Map over recentExpenses array */}
            {recentExpenses.map((expense) => (
              // Single expense row container
              <div
                key={expense.id}
                className="group relative mt-2 flex items-center gap-4 rounded-lg p-3 hover:bg-gray-100/60"
              >
                {/* Left icon circle */}
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-xl text-gray-800">
                  {/* SVG icon */}
                  <svg
                    stroke="currentColor"
                    fill="none"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    height="1em"
                    width="1em"
                  >
                    <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"></path>
                    <path d="M7 2v20"></path>
                    <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"></path>
                  </svg>
                </div>
                {/* Right side: title/date and amount */}
                <div className="flex flex-1 items-center justify-between">
                  {/* Expense title and date */}
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      {/* Expense title text */}
                      {expense.title}
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      {/* Expense date formatted */}
                      {formatDate(expense.date)}
                    </p>
                  </div>
                  {/* Amount block with red styling */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 rounded-md bg-red-50 px-3 py-1.5 text-red-500">
                      <h6 className="text-xs font-medium">
                        {/* Always negative prefix for expenses */}-
                        {formatCurrency(expense.amount)}
                      </h6>
                      {/* Icon showing downward trend */}
                      <svg
                        stroke="currentColor"
                        fill="none"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        height="1em"
                        width="1em"
                      >
                        <polyline points="22 17 13.5 8.5 8.5 13.5 2 7"></polyline>
                        <polyline points="16 17 22 17 22 11"></polyline>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Last 30 Days Expenses Chart */}
        {/* Card containing bar chart of expenses grouped by category */}
        <div className="card col-span-1">
          {/* Header with title */}
          <div className="flex items-center justify-between">
            <h5 className="text-lg">Last 30 Days Expenses</h5>
          </div>
          {/* Bar chart area */}
          <div className="mt-6 bg-white">
            {/* ResponsiveContainer for the bar chart */}
            <ResponsiveContainer width="100%" height={300}>
              {/* BarChart component with expenseCategories data */}
              <BarChart data={expenseCategories}>
                {/* Background grid lines */}
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                {/* X axis shows category names */}
                <XAxis
                  dataKey="name" // Use 'name' property as label
                  tick={{ fill: '#555', fontSize: 12 }} // Styling of tick labels
                  angle={-45} // Rotate labels to avoid overlap
                  textAnchor="end" // Anchor at end of text
                  height={80} // Extra height to fit rotated labels
                />
                {/* Y axis shows numeric values */}
                <YAxis
                  tick={{ fill: '#555', fontSize: 12 }}
                  tickFormatter={(value) => `$${value}`} // Show dollar symbol on axis
                />
                {/* Tooltip when hovering over bars */}
                <Tooltip
                  formatter={(value) => formatCurrency(value)} // Format value as currency
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                {/* Bar component to draw bars based on "amount" */}
                <Bar dataKey="amount" radius={[10, 10, 0, 0]} fill="#875cf5">
                  {/* Color each bar individually, alternating colors */}
                  {expenseCategories.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={index % 2 === 0 ? '#875cf5' : '#cfbefb'} // Alternate between two purple shades
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ==== THIRD ROW ==== */}
      {/* Grid: left - income pie chart, right - recent income list */}
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Last 60 Days Income Chart */}
        {/* Card for income breakdown pie chart */}
        <div className="card">
          {/* Header title */}
          <div className="flex items-center justify-between">
            <h5 className="text-lg">Last 60 Days Income</h5>
          </div>
          <div>
            {/* Responsive container for pie chart */}
            <ResponsiveContainer width="100%" height={380}>
              {/* PieChart wrapper */}
              <PieChart>
                {/* Pie component for donut chart */}
                <Pie
                  data={incomeCategories} // Grouped income data by category
                  cx="50%" // Center X
                  cy="50%" // Center Y
                  labelLine={false} // Hide label lines
                  outerRadius={130} // Outer radius
                  innerRadius={80} // Inner radius for donut
                  fill="#8884d8" // Default color
                  dataKey="amount" // Use 'amount' field for slice size
                >
                  {/* Map incomeCategories to colored slices */}
                  {incomeCategories.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        incomeColors[entry.name] || // Use predefined color if category exists in incomeColors
                        ['#875CF5', '#FA2C37', '#FF6900', '#4f39f6'][index % 4] // Otherwise choose from fallback colors
                      }
                    />
                  ))}
                </Pie>
                {/* Tooltip for hover values */}
                <Tooltip
                  formatter={(value) => formatCurrency(value)} // Currency formatting
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                {/* Legend for income categories */}
                <Legend
                  wrapperStyle={{ paddingTop: '20px' }}
                  formatter={(value) => (
                    <span className="text-xs font-medium text-gray-700">
                      {value}
                    </span>
                  )}
                />
                {/* Center label: "Total Income" */}
                <text
                  x="50%"
                  y="50%"
                  dy={-25}
                  textAnchor="middle"
                  fill="#666"
                  fontSize="14px"
                >
                  Total Income
                </text>
                {/* Center label: actual total income amount */}
                <text
                  x="50%"
                  y="50%"
                  dy={8}
                  textAnchor="middle"
                  fill="#333"
                  fontSize="24px"
                  fontWeight="semi-bold"
                >
                  {formatCurrency(totalIncome)}
                </text>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Income */}
        {/* Card listing latest income entries */}
        <div className="card">
          {/* Header with title and "See All" button */}
          <div className="flex items-center justify-between">
            <h5 className="text-lg">Recent Income</h5>
            <button className="card-btn" onClick={() => navigate('/income')}>
              {/* "See All" with arrow icon */}
              See All{' '}
              <svg
                stroke="currentColor"
                fill="none"
                strokeWidth="2"
                viewBox="0 0 24 24"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-base"
                height="1em"
                width="1em"
              >
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </button>
          </div>
          {/* List of recent income items */}
          <div className="mt-6">
            {/* Map over recentIncome array */}
            {recentIncome.map((income) => (
              // Single income row
              <div
                key={income.id}
                className="group relative mt-2 flex items-center gap-4 rounded-lg p-3 hover:bg-gray-100/60"
              >
                {/* Left circular icon */}
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-xl text-gray-800">
                  {/* SVG icon */}
                  <svg
                    stroke="currentColor"
                    fill="none"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    height="1em"
                    width="1em"
                  >
                    <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"></path>
                    <path d="M7 2v20"></path>
                    <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"></path>
                  </svg>
                </div>
                {/* Right side with text and amount */}
                <div className="flex flex-1 items-center justify-between">
                  {/* Income title (or category) and date */}
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      {/* Use title if present, otherwise fallback to category */}
                      {income.title || income.category}
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      {/* Formatted income date */}
                      {formatDate(income.date)}
                    </p>
                  </div>
                  {/* Amount block with green styling */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 rounded-md bg-green-50 px-3 py-1.5 text-green-500">
                      <h6 className="text-xs font-medium">
                        {/* Always prefix + for income */}+
                        {formatCurrency(income.amount)}
                      </h6>
                      {/* Icon showing upward trend */}
                      <svg
                        stroke="currentColor"
                        fill="none"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        height="1em"
                        width="1em"
                      >
                        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
                        <polyline points="16 7 22 7 22 13"></polyline>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

// Export the Total component as default so it can be used in routing/pages
export default Total;
