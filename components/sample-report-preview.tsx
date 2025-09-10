import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export function SampleReportPreview() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="w-full justify-start bg-transparent flex items-center gap-2 px-2 py-1.5 rounded hover:bg-muted transition">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2a2 2 0 012-2h2a2 2 0 012 2v2m-6 4h6a2 2 0 002-2V7a2 2 0 00-2-2h-2.586a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 009.586 2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
          View Sample Report
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Sample Report Preview</DialogTitle>
        </DialogHeader>
        <div className="w-full h-[500px] flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 rounded overflow-auto p-4">
          <table className="min-w-full text-sm text-left border border-blue-300 bg-white shadow-lg rounded-lg">
            <thead className="bg-blue-600">
              <tr>
                <th className="px-4 py-2 border text-white font-semibold">Date</th>
                <th className="px-4 py-2 border text-white font-semibold">Title</th>
                <th className="px-4 py-2 border text-white font-semibold">Amount</th>
                <th className="px-4 py-2 border text-white font-semibold">Type</th>
                <th className="px-4 py-2 border text-white font-semibold">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-blue-50 hover:bg-blue-100 transition">
                <td className="px-4 py-2 border">2025-09-01</td>
                <td className="px-4 py-2 border">Salary</td>
                <td className="px-4 py-2 border text-green-600 font-medium">$3,000</td>
                <td className="px-4 py-2 border">Income</td>
                <td className="px-4 py-2 border">Monthly salary</td>
              </tr>
              <tr className="bg-white hover:bg-blue-50 transition">
                <td className="px-4 py-2 border">2025-09-03</td>
                <td className="px-4 py-2 border">Groceries</td>
                <td className="px-4 py-2 border text-red-600 font-medium">-$150</td>
                <td className="px-4 py-2 border">Expense</td>
                <td className="px-4 py-2 border">Supermarket shopping</td>
              </tr>
              <tr className="bg-blue-50 hover:bg-blue-100 transition">
                <td className="px-4 py-2 border">2025-09-05</td>
                <td className="px-4 py-2 border">Electricity Bill</td>
                <td className="px-4 py-2 border text-red-600 font-medium">-$60</td>
                <td className="px-4 py-2 border">Expense</td>
                <td className="px-4 py-2 border">Monthly bill</td>
              </tr>
              <tr className="bg-white hover:bg-blue-50 transition">
                <td className="px-4 py-2 border">2025-09-10</td>
                <td className="px-4 py-2 border">Freelance Project</td>
                <td className="px-4 py-2 border text-green-600 font-medium">$500</td>
                <td className="px-4 py-2 border">Income</td>
                <td className="px-4 py-2 border">Web development</td>
              </tr>
            </tbody>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  )
}
