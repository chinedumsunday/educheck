"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { GraduationCap, BookOpen, CheckCircle, Settings } from "lucide-react"
import { WalletProvider, useWallet } from "../components/wallet-provider"

function HomePage() {
  const { connect, isConnected, isConnecting, address } = useWallet()
  const router = useRouter()
  const [selectedRole, setSelectedRole] = useState<string | null>(null)

  const handleRoleSelection = (role: string) => {
    setSelectedRole(role)
  }

  const handleContinue = () => {
    if (selectedRole) {
      router.push(`/${selectedRole.toLowerCase()}`)
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Exam Results Portal</CardTitle>
          <CardDescription>Connect your wallet and select your role to continue</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isConnected ? (
            <Button onClick={connect} className="w-full" disabled={isConnecting}>
              {isConnecting ? "Connecting..." : "Connect Wallet"}
            </Button>
          ) : (
            <>
              <div className="text-center text-sm text-gray-500 mb-2">
                Connected: {address?.substring(0, 6)}...{address?.substring(38)}
              </div>
              <div className="grid grid-cols-1 gap-4">
                <RoleCard
                  title="Student"
                  description="View your exam results"
                  icon={<GraduationCap className="h-8 w-8" />}
                  selected={selectedRole === "Student"}
                  onClick={() => handleRoleSelection("Student")}
                />
                <RoleCard
                  title="Lecturer"
                  description="Submit results for students"
                  icon={<BookOpen className="h-8 w-8" />}
                  selected={selectedRole === "Lecturer"}
                  onClick={() => handleRoleSelection("Lecturer")}
                />
                <RoleCard
                  title="Validator"
                  description="Validate submitted results"
                  icon={<CheckCircle className="h-8 w-8" />}
                  selected={selectedRole === "Validator"}
                  onClick={() => handleRoleSelection("Validator")}
                />
                <RoleCard
                  title="Admin"
                  description="Manage users and courses"
                  icon={<Settings className="h-8 w-8" />}
                  selected={selectedRole === "Admin"}
                  onClick={() => handleRoleSelection("Admin")}
                />
              </div>
              <Button onClick={handleContinue} className="w-full" disabled={!selectedRole}>
                Continue
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </main>
  )
}

interface RoleCardProps {
  title: string
  description: string
  icon: React.ReactNode
  selected: boolean
  onClick: () => void
}

function RoleCard({ title, description, icon, selected, onClick }: RoleCardProps) {
  return (
    <div
      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
        selected ? "border-primary bg-primary/10" : "border-gray-200 hover:border-primary/50"
      }`}
      onClick={onClick}
    >
      <div className="flex items-center space-x-4">
        <div className={`${selected ? "text-primary" : "text-gray-500"}`}>{icon}</div>
        <div>
          <h3 className="font-medium">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <WalletProvider>
      <HomePage />
    </WalletProvider>
  )
}
