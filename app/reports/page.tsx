"use client"

import { useAuth } from "@/app/providers/AuthProvider"
import { useRouter } from "next/navigation"
import { useEffect } from "react"



import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Download, FileText, Calendar } from "lucide-react"
import { SampleReportPreview } from "@/components/sample-report-preview"
import Link from "next/link"

const reportTypes = [
	{ value: "income", label: "Income Report", description: "Detailed income breakdown by category" },
	{ value: "expense", label: "Expense Report", description: "Detailed expense breakdown by category" },
	{ value: "combined", label: "Combined Report", description: "Complete income and expense summary" },
];

const monthOptions = [
	{ value: "1", label: "Current Month" },
	{ value: "2", label: "Last 2 Months" },
	{ value: "3", label: "Last 3 Months" },
	{ value: "4", label: "Last 4 Months" },
	{ value: "5", label: "Last 5 Months" },
	{ value: "6", label: "Last 6 Months" },
];

const formatOptions = [
	{ value: "pdf", label: "PDF", icon: "📄" },
];

// Example recent reports config (could be dynamic in future)
const recentReportsConfig = [
	{ name: "Combined Report - Last 3 Months", months: 3, type: "combined" },
	{ name: "Expense Report - Last 1 Month", months: 1, type: "expense" },
	{ name: "Income Report - Last 6 Months", months: 6, type: "income" },
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

					// Calculate the start and end month/year for the report based on selectedMonths
					const now = new Date();
					const monthsBack = parseInt(selectedMonths, 10);
					const endMonth = now.getMonth() + 1;
					const endYear = now.getFullYear();
					let startMonth = endMonth - (monthsBack - 1);
					let startYear = endYear;
					while (startMonth <= 0) {
						startMonth += 12;
						startYear -= 1;
					}

			// Only PDF is supported by backend for now
			if (selectedFormat !== "pdf") {
				alert("Only PDF export is supported at this time.");
				setIsGenerating(false);
				return;
			}

					const token = localStorage.getItem("token"); // Or however you store the JWT

					const res = await fetch("http://localhost:8080/auth/cust/report/pdf", {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							"Authorization": `Bearer ${token}`,
						},
						body: JSON.stringify({
							startMonth,
							startYear,
							endMonth,
							endYear,
							type: selectedReportType === "combined" ? null : selectedReportType,
						}),
					});

			if (!res.ok) throw new Error("Failed to generate report");
			const blob = await res.blob();
			const url = window.URL.createObjectURL(blob);
			// Download the PDF
			const a = document.createElement("a");
			a.href = url;
			a.download = `report_${selectedReportType}_${selectedMonths}months.pdf`;
			document.body.appendChild(a);
			a.click();
			a.remove();
			window.URL.revokeObjectURL(url);
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
				{/* Report Configuration - now full width and visually consistent */}
				<Card className="mb-6">
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
							{selectedMonths && (
								<div className="text-xs text-muted-foreground mt-1">
									{(() => {
										const now = new Date();
										const monthsBack = parseInt(selectedMonths, 10);
										let endMonth = now.getMonth() + 1;
										let endYear = now.getFullYear();
										let startMonth = endMonth - (monthsBack - 1);
										let startYear = endYear;
										while (startMonth <= 0) {
											startMonth += 12;
											startYear -= 1;
										}
										return `Report will include transactions from ${startMonth}/${startYear} to ${endMonth}/${endYear}`;
									})()}
								</div>
							)}
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

								 {/* Recent Reports */}
								 <Card className="mt-6">
										 <CardHeader>
												 <CardTitle>Recent Reports</CardTitle>
										 </CardHeader>
										 <CardContent>
												 <div className="space-y-3">
													 {recentReportsConfig.map((report, index) => {
														 const now = new Date();
														 const endMonth = now.getMonth() + 1;
														 const endYear = now.getFullYear();
														 let startMonth = endMonth - (report.months - 1);
														 let startYear = endYear;
														 while (startMonth <= 0) {
															 startMonth += 12;
															 startYear -= 1;
														 }
														 return (
															 <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
																 <div className="flex items-center gap-3">
																	 <FileText className="w-5 h-5 text-muted-foreground" />
																	 <div>
																		 <div className="font-medium">{report.name}</div>
																		 <div className="text-sm text-muted-foreground">
																			 {`From ${startMonth}/${startYear} to ${endMonth}/${endYear} • PDF`}
																		 </div>
																	 </div>
																 </div>
																 <Button
																	 variant="ghost"
																	 size="sm"
																	 onClick={async () => {
																		 const token = localStorage.getItem("token");
																		 try {
																			 const res = await fetch("http://localhost:8080/auth/cust/report/pdf", {
																				 method: "POST",
																				 headers: {
																					 "Content-Type": "application/json",
																					 "Authorization": `Bearer ${token}`,
																				 },
																				 body: JSON.stringify({
																					 startMonth,
																					 startYear,
																					 endMonth,
																					 endYear,
																					 type: report.type === "combined" ? null : report.type,
																				 }),
																			 });
																			 if (!res.ok) throw new Error("Failed to download report");
																			 const blob = await res.blob();
																			 const url = window.URL.createObjectURL(blob);
																			 const a = document.createElement("a");
																			 a.href = url;
																			 a.download = `${report.name.replace(/\s+/g, '_').toLowerCase()}.pdf`;
																			 document.body.appendChild(a);
																			 a.click();
																			 a.remove();
																			 window.URL.revokeObjectURL(url);
																		 } catch (err) {
																			 alert("Failed to download report. Please try again.");
																		 }
																	 }}
																 >
																	 <Download className="w-4 h-4" />
																 </Button>
															 </div>
														 );
													 })}
												 </div>
										 </CardContent>
								 </Card>
			</div>
		</div>
	);
}
