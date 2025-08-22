"use client"

import { useState } from "react"

export default function AddTransaction() {
  const [formData, setFormData] = useState({
    type: "Income",
    amount: "",
    entrydate: "",
    description: "",
    title: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const payload = {
      ...formData,
      amount: parseFloat(formData.amount),
    }

    const res = await fetch("http://localhost:8080/home/savetrans", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    if (res.ok) {
      alert("✅ Transaction added successfully")
      setFormData({ type: "Income", amount: "", entrydate: "", description: "", title: "" })
    } else {
      alert("❌ Failed to add transaction")
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#0d0d0d] text-white">
      <div className="w-full max-w-md bg-[#111827] rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-teal-400 text-center mb-2">💲 Add Transaction</h2>
        <p className="text-gray-400 text-center text-sm mb-6">
          Record your income and expenses to track your financial health.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Transaction Type */}
          <div>
            <label className="block text-sm font-medium mb-2">Transaction Type</label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: "Income" })}
                className={`flex-1 py-2 rounded-lg border ${
                  formData.type === "Income"
                    ? "bg-teal-600 text-white border-teal-600"
                    : "bg-gray-800 border-gray-600 text-gray-300"
                }`}
              >
                Income
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: "Expense" })}
                className={`flex-1 py-2 rounded-lg border ${
                  formData.type === "Expense"
                    ? "bg-red-600 text-white border-red-600"
                    : "bg-gray-800 border-gray-600 text-gray-300"
                }`}
              >
                Expense
              </button>
            </div>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium mb-2">Amount (₹)</label>
            <input
              type="number"
              step="0.01"
              name="amount"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="w-full p-2 rounded-lg bg-gray-900 border border-gray-700 focus:outline-none focus:border-teal-500"
              placeholder="0.00"
              required
            />
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-2 rounded-lg bg-gray-900 border border-gray-700 focus:outline-none focus:border-teal-500"
              placeholder="e.g. Salary / Grocery"
              required
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium mb-2">Date</label>
            <input
              type="date"
              name="entrydate"
              value={formData.entrydate}
              onChange={(e) => setFormData({ ...formData, entrydate: e.target.value })}
              className="w-full p-2 rounded-lg bg-gray-900 border border-gray-700 focus:outline-none focus:border-teal-500"
              required
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium mb-2">Notes (Optional)</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-2 rounded-lg bg-gray-900 border border-gray-700 focus:outline-none focus:border-teal-500"
              placeholder="Add any additional details..."
              rows={3}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 rounded-lg transition"
          >
            Add Transaction
          </button>
        </form>
      </div>
    </div>
  )
}
