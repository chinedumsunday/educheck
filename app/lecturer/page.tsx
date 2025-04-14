"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Textarea } from "../../components/ui/textarea"
import { ArrowLeft, Upload, AlertCircle, CheckCircle, BookOpen } from "lucide-react"
import { submitResult, submitBulkResults } from "../../lib/contract"
import { WalletProvider, useWallet } from "../../components/wallet-provider"

function LecturerPageContent() {
  const { isConnected, provider } = useWallet()
  const router = useRouter()
  const [studentAddress, setStudentAddress] = useState("")
  const [courseId, setCourseId] = useState("")
  const [grade, setGrade] = useState("")
  const [bulkCourseId, setBulkCourseId] = useState("")
  const [bulkData, setBulkData] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window === "undefined") return // SSR safety
  
    let timeout = setTimeout(() => {
      if (!isConnected) {
        console.log("Wallet not connected, redirecting to /")
        router.push("/")
      }
    }, 500) // Give it 500ms for hydration and wallet restore
  
    return () => clearTimeout(timeout)
  }, [isConnected, router])

  const handleSubmitResult = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!studentAddress || !courseId || !grade || !provider) {
      setError("Please fill in all fields and ensure your wallet is connected")
      return
    }

    try {
      setLoading(true)
      setError(null)
      setSuccess(null)

      await submitResult(provider, studentAddress, courseId, grade)

      setSuccess("Result submitted successfully!")
      // Clear form
      setStudentAddress("")
      setCourseId("")
      setGrade("")
    } catch (err) {
      console.error("Error submitting result:", err)
      setError("Failed to submit result. Please check your inputs and try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitBulkResults = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!bulkCourseId || !bulkData || !provider) {
      setError("Please fill in all fields and ensure your wallet is connected")
      return
    }

    try {
      setLoading(true)
      setError(null)
      setSuccess(null)

      // Parse the JSON data
      let parsedData
      try {
        parsedData = JSON.parse(bulkData)
        if (!Array.isArray(parsedData)) {
          throw new Error("Data must be an array")
        }
      } catch (err) {
        setError("Invalid JSON format. Please check your input.")
        setLoading(false)
        return
      }

      // Extract student addresses and grades
      const studentAddresses = parsedData.map((item: any) => item.studentAddress)
      const grades = parsedData.map((item: any) => item.grade)

      await submitBulkResults(provider, bulkCourseId, studentAddresses, grades)

      setSuccess("Bulk results submitted successfully!")
      // Clear form
      setBulkCourseId("")
      setBulkData("")
    } catch (err) {
      console.error("Error submitting bulk results:", err)
      setError("Failed to submit bulk results. Please check your inputs and try again.")
    } finally {
      setLoading(false)
    }
  }

  if (!isConnected) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100">
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <Button variant="ghost" onClick={() => router.push("/")} className="text-amber-700">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Button>
          <div className="flex items-center text-amber-800 font-medium">
            <BookOpen className="mr-2 h-5 w-5" />
            Lecturer Portal
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-amber-600 text-white p-6">
            <h1 className="text-2xl font-bold">Submit Exam Results</h1>
            <p className="text-amber-100 mt-1">Submit individual or bulk results for students</p>
          </div>

          <div className="p-6">
            {success && (
              <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded relative">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                  <span className="font-medium">Success!</span>
                </div>
                <p className="mt-1">{success}</p>
              </div>
            )}

            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2 text-red-600" />
                  <span className="font-medium">Error!</span>
                </div>
                <p className="mt-1">{error}</p>
              </div>
            )}

            <Tabs defaultValue="individual" className="mt-4">
              <TabsList className="mb-4 bg-amber-100 p-1 rounded-md">
                <TabsTrigger
                  value="individual"
                  className="data-[state=active]:bg-white data-[state=active]:text-amber-800"
                >
                  Individual Result
                </TabsTrigger>
                <TabsTrigger value="bulk" className="data-[state=active]:bg-white data-[state=active]:text-amber-800">
                  Bulk Upload
                </TabsTrigger>
              </TabsList>

              <TabsContent value="individual">
                <form onSubmit={handleSubmitResult} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="studentAddress" className="text-amber-800">
                      Student Wallet Address
                    </Label>
                    <Input
                      id="studentAddress"
                      value={studentAddress}
                      onChange={(e) => setStudentAddress(e.target.value)}
                      placeholder="0x..."
                      required
                      className="border-amber-200 focus:border-amber-400 focus:ring-amber-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="courseId" className="text-amber-800">
                      Course ID
                    </Label>
                    <Input
                      id="courseId"
                      value={courseId}
                      onChange={(e) => setCourseId(e.target.value)}
                      placeholder="Enter course ID"
                      required
                      className="border-amber-200 focus:border-amber-400 focus:ring-amber-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="grade" className="text-amber-800">
                      Grade
                    </Label>
                    <Input
                      id="grade"
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                      placeholder="A, B, C, etc."
                      required
                      className="border-amber-200 focus:border-amber-400 focus:ring-amber-400"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Submitting...
                      </>
                    ) : (
                      "Submit Result"
                    )}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="bulk">
                <form onSubmit={handleSubmitBulkResults} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="bulkCourseId" className="text-amber-800">
                      Course ID
                    </Label>
                    <Input
                      id="bulkCourseId"
                      value={bulkCourseId}
                      onChange={(e) => setBulkCourseId(e.target.value)}
                      placeholder="Enter course ID"
                      required
                      className="border-amber-200 focus:border-amber-400 focus:ring-amber-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bulkData" className="text-amber-800">
                      JSON Data
                    </Label>
                    <Textarea
                      id="bulkData"
                      value={bulkData}
                      onChange={(e) => setBulkData(e.target.value)}
                      placeholder={`[
  {
    "studentAddress": "0x123...",
    "grade": "A"
  },
  {
    "studentAddress": "0x456...",
    "grade": "B"
  }
]`}
                      className="min-h-[200px] font-mono border-amber-200 focus:border-amber-400 focus:ring-amber-400"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Bulk Results
                      </>
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LecturerPage() {
  return (
    <WalletProvider>
      <LecturerPageContent />
    </WalletProvider>
  )
}
