import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Shield, TrendingUp, PieChart, FileText } from "lucide-react"

export default function AboutPage() {
  const features = [
    {
      icon: TrendingUp,
      title: "Financial Tracking",
      description: "Track your income and expenses with detailed categorization and real-time balance updates.",
    },
    {
      icon: PieChart,
      title: "Visual Analytics",
      description: "Understand your spending patterns with interactive charts and comprehensive statistics.",
    },
    {
      icon: FileText,
      title: "Detailed Reports",
      description: "Generate monthly and custom reports to analyze your financial trends over time.",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your financial data is encrypted and stored securely with industry-standard protection.",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-heading font-bold mb-4">About Budget Tracker</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A comprehensive personal finance management application designed to help you take control of your financial
            future.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-heading">Our Mission</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Budget Tracker was created with the mission to make personal finance management accessible, intuitive, and
              powerful for everyone. We believe that understanding your financial habits is the first step towards
              achieving your financial goals.
            </p>
            <p className="text-muted-foreground">
              Our application provides you with the tools to track every rupee, categorize your expenses, visualize your
              spending patterns, and generate insightful reports that help you make informed financial decisions.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-heading">Key Features</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start space-x-2">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                <span>Real-time income and expense tracking with automatic balance calculation</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                <span>Comprehensive category management for detailed expense classification</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                <span>Interactive charts and graphs for visual spending analysis</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                <span>Monthly budget setting and tracking with progress indicators</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                <span>Currency conversion tools for international transactions</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                <span>Detailed reporting with export capabilities (PDF, Excel, CSV)</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                <span>Responsive design that works seamlessly across all devices</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">Ready to take control of your finances?</p>
          <Link href="/register">
            <Button size="lg">Get Started Today</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
