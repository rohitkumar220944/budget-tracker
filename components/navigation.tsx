"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"   // ⬅️ add useRouter
import { Button } from "@/components/ui/button"
import { Home, Plus, BarChart3, FileText, User, LogIn, LogOut, Info } from "lucide-react"

export function Navigation() {
  const pathname = usePathname()
  const router = useRouter()   // ⬅️ initialize router

  // TODO: Replace with actual authentication state from your backend
  const isAuthenticated = true // This should come from your auth context/state
  const userName = "John Doe" // This should come from your user data

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/transactions", label: "Add Transaction", icon: Plus },
    { href: "/statistics", label: "Statistics", icon: BarChart3 },
    { href: "/reports", label: "Reports", icon: FileText },
    { href: "/about", label: "About", icon: Info },
  ]

  // ✅ Logout handler
  const handleLogout = () => {
    console.log("Logout clicked")

    // 🔹 Remove stored token/user info
    localStorage.removeItem("authToken")
    localStorage.removeItem("user")

    // (Optional) if you call backend logout endpoint:
    // await fetch("http://localhost:8080/money/logout", { method: "POST", credentials: "include" });

    // 🔹 Redirect to login page
    router.push("/login")
  }

  return (
    <nav className="bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">₹</span>
            </div>
            <span className="font-heading font-bold text-xl text-foreground">Budget Tracker</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>

          {/* Authentication Section */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">{userName}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2 bg-transparent"
                  onClick={handleLogout}   // ⬅️ now calls real logout
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/login">
                  <Button variant="outline" size="sm" className="flex items-center space-x-2 bg-transparent">
                    <LogIn className="w-4 h-4" />
                    <span>Login</span>
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>Register</span>
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
import { useState } from "react"