

"use client"

import { useAuth } from "@/app/providers/AuthProvider"
import { useRouter } from "next/navigation"
import { useEffect } from "react"



import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Download, FileText, Calendar } from "lucide-react"
import Link from "next/link"

const reportTypes = [
  { value: "income", label: "Income Report", description: "Detailed income breakdown by category" },
  { value: "expense", label: "Expense Report", description: "Detailed expense breakdown by category" },
  { value: "combined", label: "Combined Report", description: "Complete income and expense summary" },
  { value: "category", label: "Category Report", description: "Category-wise financial analysis" },
];

const monthOptions = [
  { value: "1", label: "Last 1 Month" },
  { value: "2", label: "Last 2 Months" },
  { value: "3", label: "Last 3 Months" },
  { value: "4", label: "Last 4 Months" },
  { value: "5", label: "Last 5 Months" },
  { value: "6", label: "Last 6 Months" },
];

const formatOptions = [
  { value: "pdf", label: "PDF", icon: "📄" },
  { value: "excel", label: "Excel", icon: "📊" },
  { value: "csv", label: "CSV", icon: "📋" },
];

export default function Reports() {
  const { user } = useAuth();
  const router = useRouter();
  const [selectedReportType, setSelectedReportType] = useState("");
  const [selectedMonths, setSelectedMonths] = useState("");
  const [selectedFormat, setSelectedFormat] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (!user) router.push("/login");
  }, [user, router]);
  if (!user) return null;

  const handleGenerateReport = async () => {
    if (!selectedReportType || !selectedMonths || !selectedFormat) {
      alert("Please select all required fields");
      return;
    }

    setIsGenerating(true);

    try {
      // TODO: API call to generate and download report
      // POST /api/reports/generate
      // Body: {
      //   type: selectedReportType,
      //   months: selectedMonths,
      //   format: selectedFormat
      // }
      // Response: { downloadUrl: string } or direct file download

      console.log("Generating report:", {
        type: selectedReportType,
        months: selectedMonths,
        format: selectedFormat,
      });

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // In real implementation, this would trigger file download
      alert(`Report generated successfully! (${selectedReportType} - ${selectedMonths} months - ${selectedFormat})`);
    } catch (error) {
      console.error("Error generating report:", error);
      alert("Failed to generate report. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <FileText className="w-6 h-6" />
          <h1 className="text-2xl font-bold font-[family-name:var(--font-heading)]">Financial Reports</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Report Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Generate Report
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Report Type Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Report Type</label>
                <Select value={selectedReportType} onValueChange={setSelectedReportType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    {reportTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div>
                          <div className="font-medium">{type.label}</div>
                          <div className="text-xs text-muted-foreground">{type.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Time Period Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Time Period</label>
                <Select value={selectedMonths} onValueChange={setSelectedMonths}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time period" />
                  </SelectTrigger>
                  <SelectContent>
                    {monthOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Format Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Export Format</label>
                <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    {formatOptions.map((format) => (
                      <SelectItem key={format.value} value={format.value}>
                        <div className="flex items-center gap-2">
                          <span>{format.icon}</span>
                          <span>{format.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Generate Button */}
              <Button
                onClick={handleGenerateReport}
                className="w-full"
                disabled={isGenerating || !selectedReportType || !selectedMonths || !selectedFormat}
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                    Generating Report...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Generate & Download Report
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Report Preview/Info */}
          <Card>
            <CardHeader>
              <CardTitle>Report Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-medium mb-2">What's included in your report:</h3>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Detailed transaction history</li>
                    <li>• Category-wise breakdown</li>
                    <li>• Income vs expense analysis</li>
                    <li>• Monthly trends and patterns</li>
                    <li>• Summary statistics</li>
                  </ul>
                </div>

                {selectedReportType && (
                  <div className="p-4 bg-primary/10 rounded-lg">
                    <h3 className="font-medium mb-2">Selected Report Type:</h3>
                    <p className="text-sm">
                      {reportTypes.find((type) => type.value === selectedReportType)?.description}
                    </p>
                  </div>
                )}

                {selectedMonths && (
                  <div className="p-4 bg-chart-1/10 rounded-lg">
                    <h3 className="font-medium mb-2">Time Period:</h3>
                    <p className="text-sm">{monthOptions.find((option) => option.value === selectedMonths)?.label}</p>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-medium mb-2">Quick Actions:</h3>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                    <FileText className="w-4 h-4 mr-2" />
                    View Sample Report
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Recurring Reports
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Reports */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Recent Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: "Combined Report - Last 3 Months", date: "2025-07-20", format: "PDF", size: "2.4 MB" },
                { name: "Expense Report - Last 1 Month", date: "2025-07-15", format: "Excel", size: "1.8 MB" },
                { name: "Income Report - Last 6 Months", date: "2025-07-10", format: "CSV", size: "0.9 MB" },
              ].map((report, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{report.name}</div>
                      <div className="text-sm text-muted-foreground">
                        Generated on {report.date} • {report.format} • {report.size}
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
