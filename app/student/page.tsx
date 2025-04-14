"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "../../components/ui/button"
import { ArrowLeft, CheckCircle, XCircle, GraduationCap } from "lucide-react"
import { getMyResults, type Result } from "../../lib/contract"
import { WalletProvider, useWallet } from "../../components/wallet-provider"

function StudentPageContent() {
  const { isConnected, provider, address } = useWallet()
  const router = useRouter()
  const [results, setResults] = useState<Result[]>([])
  const [loading, setLoading] = useState(true)
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
    const fetchResults = async () => {
      if (!address || !provider) return

      try {
        setLoading(true)
        const results = await getMyResults(provider)
        setResults(results)
      } catch (err) {
        console.error("Error fetching results:", err)
        setError("Failed to fetch your results. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    if (isConnected && address && provider) {
      fetchResults()
    }
  }, [isConnected, address, provider])

  if (!isConnected) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100">
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <Button variant="ghost" onClick={() => router.push("/")} className="text-indigo-700">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Button>
          <div className="flex items-center text-indigo-800 font-medium">
            <GraduationCap className="mr-2 h-5 w-5" />
            Student Portal
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-indigo-600 text-white p-6">
            <h1 className="text-2xl font-bold">My Exam Results</h1>
            <p className="text-indigo-100 mt-1">View all your exam results and their validation status</p>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
            ) : error ? (
              <div className="text-center py-8 text-red-500">{error}</div>
            ) : results.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No results found. Your results will appear here once they are submitted by your lecturers.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-indigo-100">
                      <th className="py-3 px-4 text-left text-indigo-800 font-semibold">Course</th>
                      <th className="py-3 px-4 text-left text-indigo-800 font-semibold">Grade</th>
                      <th className="py-3 px-4 text-left text-indigo-800 font-semibold">Validation Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((result, index) => (
                      <tr
                        key={index}
                        className={`border-b border-indigo-50 ${
                          index % 2 === 0 ? "bg-indigo-50/30" : "bg-white"
                        } hover:bg-indigo-50/50 transition-colors`}
                      >
                        <td className="py-3 px-4 font-medium">{result.courseName || `Course ${result.courseId}`}</td>
                        <td className="py-3 px-4">
                          <span className="inline-block bg-indigo-100 text-indigo-800 font-medium py-1 px-3 rounded-full">
                            {result.grade}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {result.validated ? (
                            <div className="flex items-center text-green-600">
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Validated
                            </div>
                          ) : (
                            <div className="flex items-center text-amber-600">
                              <XCircle className="mr-2 h-4 w-4" />
                              Pending Validation
                            </div>
                          )}
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

export default function StudentPage() {
  return (
    <WalletProvider>
      <StudentPageContent />
    </WalletProvider>
  )
}
