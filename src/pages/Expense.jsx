import { useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import { useFinanceStore } from '../store/financeStore';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

function Expense() {
  const { transactions, deleteTransaction, addTransaction } = useFinanceStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    date: new Date().toISOString().split('T')[0], // Today's date as default
  });

  // Get all expense transactions
  const expenseTransactions = transactions
    .filter((t) => t.type === 'expense')
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    const suffix =
      day === 1 || day === 21 || day === 31
        ? 'st'
        : day === 2 || day === 22
          ? 'nd'
          : day === 3 || day === 23
            ? 'rd'
            : 'th';
    return `${day}${suffix} ${month} ${year}`;
  };

  // Format date for chart (like "2nd 09", "14th 09", "4th 10")
  const formatDateForChart = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const suffix =
      day === 1 || day === 21 || day === 31
        ? 'st'
        : day === 2 || day === 22
          ? 'nd'
          : day === 3 || day === 23
            ? 'rd'
            : 'th';
    return `${day}${suffix} ${month}`;
  };

  // Prepare chart data - show last 10-11 transactions (individual, not grouped)
  const chartData = expenseTransactions
    .slice(0, 11) // Get last 11 transactions
    .map((transaction) => ({
      date: formatDateForChart(transaction.date),
      amount: transaction.amount,
      timestamp: new Date(transaction.date).getTime(),
    }))
    .sort((a, b) => a.timestamp - b.timestamp); // Sort oldest first for chart

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      deleteTransaction(id);
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({
      title: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title || !formData.amount || !formData.date) {
      alert('Please fill in all fields');
      return;
    }

    addTransaction({
      type: 'expense',
      title: formData.title,
      category: formData.title,
      amount: parseFloat(formData.amount),
      date: formData.date,
    });

    handleCloseModal();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <MainLayout>
      <div className="grid grid-cols-1 gap-6">
        {/* Expense Overview */}
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <h5 className="text-lg">Expense Overview</h5>
              <p className="mt-0.5 text-xs text-gray-400">
                Track your spending trends over time and gain insights into
                where your money goes.
              </p>
            </div>
            <button className="add-btn" onClick={handleOpenModal}>
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
                <path d="M5 12h14"></path>
                <path d="M12 5v14"></path>
              </svg>
              Add Expense
            </button>
          </div>
          <div className="mt-10">
            <div className="bg-white">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient
                      id="expenseGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#875cf5" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#875cf5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" tick={{ fill: '#555', fontSize: 12 }} />
                  <YAxis
                    tick={{ fill: '#555', fontSize: 12 }}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip
                    formatter={(value) => formatCurrency(value)}
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="amount"
                    stroke="#875cf5"
                    strokeWidth={3}
                    fill="url(#expenseGradient)"
                    fillOpacity={0.6}
                    dot={{
                      r: 3,
                      fill: '#ab8df8',
                      fillOpacity: 0.6,
                      strokeWidth: 3,
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* All Expenses */}
        <div className="card">
          <div className="flex items-center justify-between">
            <h5 className="text-lg">All Expenses</h5>
            <button className="card-btn">
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
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" x2="12" y1="15" y2="3"></line>
              </svg>
              Download
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2">
            {expenseTransactions.map((expense) => (
              <div
                key={expense.id}
                className="group relative mt-2 flex items-center gap-4 rounded-lg p-3 hover:bg-gray-100/60"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-xl text-gray-800">
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
                <div className="flex flex-1 items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      {expense.title || expense.category}
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      {formatDate(expense.date)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDelete(expense.id)}
                      className="cursor-pointer text-red-500 transition-opacity group-hover:opacity-100 md:text-gray-400 md:opacity-0 md:hover:text-red-500"
                    >
                      <svg
                        stroke="currentColor"
                        fill="none"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        height="18"
                        width="18"
                      >
                        <path d="M3 6h18"></path>
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                        <line x1="10" x2="10" y1="11" y2="17"></line>
                        <line x1="14" x2="14" y1="11" y2="17"></line>
                      </svg>
                    </button>
                    <div className="flex items-center gap-2 rounded-md bg-red-50 px-3 py-1.5 text-red-500">
                      <h6 className="text-xs font-medium">
                        -{formatCurrency(expense.amount)}
                      </h6>
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
      </div>

      {/* Add Expense Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative max-h-full w-full max-w-2xl">
            <div className="relative rounded-lg bg-white shadow-sm">
              {/* Modal Header */}
              <div className="flex items-center justify-between rounded-t border-b border-gray-200 p-4 md:p-5">
                <h3 className="text-lg font-medium text-gray-900">
                  Add Expense
                </h3>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-transparent text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900"
                >
                  <svg
                    className="h-3 w-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                </button>
              </div>

              {/* Modal Body */}
              <div className="space-y-4 p-4 md:p-5">
                <form onSubmit={handleSubmit}>
                  {/* Icon Picker */}
                  <div className="mb-6 flex flex-col items-start gap-5 md:flex-row">
                    <div className="flex cursor-pointer items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-2xl text-primary">
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
                          <rect
                            width="18"
                            height="18"
                            x="3"
                            y="3"
                            rx="2"
                            ry="2"
                          ></rect>
                          <circle cx="9" cy="9" r="2"></circle>
                          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
                        </svg>
                      </div>
                      <p>Pick Icon</p>
                    </div>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="text-[13px] text-slate-800">
                      Category
                    </label>
                    <div className="input-box">
                      <input
                        name="title"
                        type="text"
                        placeholder="Rent, Groceries, etc"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full bg-transparent outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                        required
                      />
                    </div>
                  </div>

                  {/* Amount */}
                  <div>
                    <label className="text-[13px] text-slate-800">Amount</label>
                    <div className="input-box">
                      <input
                        name="amount"
                        type="number"
                        placeholder="0"
                        value={formData.amount}
                        onChange={handleChange}
                        className="w-full bg-transparent outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>
                  </div>

                  {/* Date */}
                  <div>
                    <label className="text-[13px] text-slate-800">Date</label>
                    <div className="input-box">
                      <input
                        name="date"
                        type="date"
                        value={formData.date}
                        onChange={handleChange}
                        className="w-full bg-transparent outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                        required
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="mt-6 flex justify-end">
                    <button type="submit" className="add-btn add-btn-fill">
                      Add Expense
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}

export default Expense;
