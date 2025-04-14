"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "../../components/ui/button"
import { ArrowLeft, CheckCircle, AlertCircle, Shield } from "lucide-react"
import { getAllUnvalidatedResults, validateResult, type Result } from "../../lib/contract"
import { WalletProvider, useWallet } from "../../components/wallet-provider"

function ValidatorPageContent() {
  const { isConnected, provider } = useWallet()
  const router = useRouter()
  const [results, setResults] = useState<Result[]>([])
  const [loading, setLoading] = useState(true)
  const [validating, setValidating] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window === "undefined") return // SSR safety
  
    const timeout = setTimeout(() => {
      if (!isConnected) {
        console.log("Wallet not connected, redirecting to /")
        router.push("/")
      }
    }, 500) // Give it 500ms for hydration and wallet restore
  
    return () => clearTimeout(timeout)
  }, [isConnected, router])
  useEffect(() => {
    const fetchUnvalidatedResults = async () => {
      if (!provider) return

      try {
        setLoading(true)
        const results = await getAllUnvalidatedResults(provider)
        setResults(results)
      } catch (err) {
        console.error("Error fetching unvalidated results:", err)
        setError("Failed to fetch unvalidated results. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    if (isConnected && provider) {
      fetchUnvalidatedResults()
    }
  }, [isConnected, provider])

  const handleValidate = async (studentAddress: string, courseId: string) => {
    if (!provider) {
      setError("Wallet not connected")
      return
    }

    try {
      setValidating(`${studentAddress}-${courseId}`)
      setError(null)
      setSuccess(null)

      await validateResult(provider, studentAddress, courseId)

      setSuccess("Result validated successfully!")

      // Remove the validated result from the list
      setResults(results.filter((result) => !(result.student === studentAddress && result.courseId === courseId)))
    } catch (err) {
      console.error("Error validating result:", err)
      setError("Failed to validate result. Please try again.")
    } finally {
      setValidating(null)
    }
  }

  if (!isConnected) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-emerald-100">
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <Button variant="ghost" onClick={() => router.push("/")} className="text-emerald-700">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Button>
          <div className="flex items-center text-emerald-800 font-medium">
            <Shield className="mr-2 h-5 w-5" />
            Validator Portal
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-emerald-600 text-white p-6">
            <h1 className="text-2xl font-bold">Validate Exam Results</h1>
            <p className="text-emerald-100 mt-1">Review and validate submitted exam results</p>
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

            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
              </div>
            ) : results.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No unvalidated results found. All submitted results have been validated.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-emerald-100">
                      <th className="py-3 px-4 text-left text-emerald-800 font-semibold">Student</th>
                      <th className="py-3 px-4 text-left text-emerald-800 font-semibold">Course</th>
                      <th className="py-3 px-4 text-left text-emerald-800 font-semibold">Grade</th>
                      <th className="py-3 px-4 text-left text-emerald-800 font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((result, index) => (
                      <tr
                        key={index}
                        className={`border-b border-emerald-50 ${
                          index % 2 === 0 ? "bg-emerald-50/30" : "bg-white"
                        } hover:bg-emerald-50/50 transition-colors`}
                      >
                        <td className="py-3 px-4 font-medium">
                          {result.student.substring(0, 6)}...{result.student.substring(38)}
                        </td>
                        <td className="py-3 px-4">{result.courseName || `Course ${result.courseId}`}</td>
                        <td className="py-3 px-4">
                          <span className="inline-block bg-emerald-100 text-emerald-800 font-medium py-1 px-3 rounded-full">
                            {result.grade}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <Button
                            onClick={() => handleValidate(result.student, result.courseId)}
                            disabled={validating === `${result.student}-${result.courseId}`}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white"
                            size="sm"
                          >
                            {validating === `${result.student}-${result.courseId}` ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Validating...
                              </>
                            ) : (
                              <>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Validate
                              </>
                            )}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ValidatorPage() {
  return (
    <WalletProvider>
      <ValidatorPageContent />
    </WalletProvider>
  )
}
