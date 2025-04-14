"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { ArrowLeft, UserPlus, BookOpen, CheckCircle, AlertCircle, Settings } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert"
import { WalletProvider, useWallet } from "../../components/wallet-provider"
import { ethers } from "ethers"
import { contractABI, contractAddress } from "../../lib/contract"

function AdminPageContent() {
  const { isConnected, provider, address } = useWallet()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [checkingAdmin, setCheckingAdmin] = useState(true)

  // Form states
  const [studentAddress, setStudentAddress] = useState("")
  const [studentName, setStudentName] = useState("")
  const [studentStatus, setStudentStatus] = useState("Active")

  const [lecturerAddress, setLecturerAddress] = useState("")
  const [validatorAddress, setValidatorAddress] = useState("")

  const [courseId, setCourseId] = useState("")
  const [courseName, setCourseName] = useState("")

  const [assignLecturerAddress, setAssignLecturerAddress] = useState("")
  const [assignCourseId, setAssignCourseId] = useState("")

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
    const checkIfAdmin = async () => {
      if (!provider || !address) return

      try {
        setCheckingAdmin(true)
        const contract = new ethers.Contract(contractAddress, contractABI, await provider.getSigner())
        const adminAddress = await contract.admin()
        console.log("Contract admin address:", adminAddress)
        console.log("Connected wallet address:", address)
        setIsAdmin(adminAddress.toLowerCase() === address.toLowerCase())
      } catch (err) {
        console.error("Error checking admin status:", err)
        setError("Failed to verify admin status. Please try again later.")
      } finally {
        setCheckingAdmin(false)
      }
    }

    if (isConnected && provider && address) {
      checkIfAdmin()
    }
  }, [isConnected, provider, address])

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!studentAddress || !studentName || !studentStatus || !provider) {
      setError("Please fill in all fields and ensure your wallet is connected")
      return
    }

    try {
      setLoading(true)
      setError(null)
      setSuccess(null)

      const contract = new ethers.Contract(contractAddress, contractABI, await provider.getSigner())
      const tx = await contract.addStudent(studentAddress, studentName, studentStatus)
      await tx.wait()

      setSuccess(`Student ${studentName} added successfully!`)
      // Clear form
      setStudentAddress("")
      setStudentName("")
      setStudentStatus("Active")
    } catch (err) {
      console.error("Error adding student:", err)
      setError("Failed to add student. Please check your inputs and try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleAddLecturer = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!lecturerAddress || !provider) {
      setError("Please fill in all fields and ensure your wallet is connected")
      return
    }

    try {
      setLoading(true)
      setError(null)
      setSuccess(null)

      const contract = new ethers.Contract(contractAddress, contractABI, await provider.getSigner())
      const tx = await contract.addLecturer(lecturerAddress)
      await tx.wait()

      setSuccess(`Lecturer added successfully!`)
      // Clear form
      setLecturerAddress("")
    } catch (err) {
      console.error("Error adding lecturer:", err)
      setError("Failed to add lecturer. Please check your inputs and try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleAddValidator = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validatorAddress || !provider) {
      setError("Please fill in all fields and ensure your wallet is connected")
      return
    }

    try {
      setLoading(true)
      setError(null)
      setSuccess(null)

      const contract = new ethers.Contract(contractAddress, contractABI, await provider.getSigner())
      const tx = await contract.addValidator(validatorAddress)
      await tx.wait()

      setSuccess(`Validator added successfully!`)
      // Clear form
      setValidatorAddress("")
    } catch (err) {
      console.error("Error adding validator:", err)
      setError("Failed to add validator. Please check your inputs and try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!courseId || !courseName || !provider) {
      setError("Please fill in all fields and ensure your wallet is connected")
      return
    }

    try {
      setLoading(true)
      setError(null)
      setSuccess(null)

      const contract = new ethers.Contract(contractAddress, contractABI, await provider.getSigner())
      const tx = await contract.addCourse(courseId, courseName)
      await tx.wait()

      setSuccess(`Course ${courseName} added successfully!`)
      // Clear form
      setCourseId("")
      setCourseName("")
    } catch (err) {
      console.error("Error adding course:", err)
      setError("Failed to add course. Please check your inputs and try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleAssignCourse = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!assignLecturerAddress || !assignCourseId || !provider) {
      setError("Please fill in all fields and ensure your wallet is connected")
      return
    }

    try {
      setLoading(true)
      setError(null)
      setSuccess(null)

      const contract = new ethers.Contract(contractAddress, contractABI, await provider.getSigner())
      const tx = await contract.assignCourse(assignLecturerAddress, assignCourseId)
      await tx.wait()

      setSuccess(`Course assigned to lecturer successfully!`)
      // Clear form
      setAssignLecturerAddress("")
      setAssignCourseId("")
    } catch (err) {
      console.error("Error assigning course:", err)
      setError("Failed to assign course. Please check your inputs and try again.")
    } finally {
      setLoading(false)
    }
  }

  if (!isConnected) {
    return null
  }

  if (checkingAdmin) {
    return (
      <div className="container mx-auto py-8 px-4 flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Button variant="outline" className="mb-6" onClick={() => router.push("/")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-red-600">Access Denied</CardTitle>
            <CardDescription>You do not have admin privileges</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Your wallet address does not have admin privileges. Please connect with the admin wallet to access this
              page.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <Button variant="outline" onClick={() => router.push("/")} className="text-gray-700">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Button>
          <div className="flex items-center text-gray-800 font-medium">
            <Settings className="mr-2 h-5 w-5" />
            Admin Portal
          </div>
        </div>

        {success && (
          <Alert className="mb-6 bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">Success</AlertTitle>
            <AlertDescription className="text-green-700">{success}</AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert className="mb-6 bg-red-50 border-red-200">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertTitle className="text-red-800">Error</AlertTitle>
            <AlertDescription className="text-red-700">{error}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="students" className="bg-white rounded-lg shadow-md">
          <div className="p-4 border-b">
            <TabsList className="grid grid-cols-5 gap-4">
              <TabsTrigger value="students">Students</TabsTrigger>
              <TabsTrigger value="lecturers">Lecturers</TabsTrigger>
              <TabsTrigger value="validators">Validators</TabsTrigger>
              <TabsTrigger value="courses">Courses</TabsTrigger>
              <TabsTrigger value="assign">Assign Courses</TabsTrigger>
            </TabsList>
          </div>

          <div className="p-6">
            <TabsContent value="students">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <UserPlus className="mr-2 h-5 w-5" /> Add Student
              </h2>
              <form onSubmit={handleAddStudent} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="studentAddress">Student Wallet Address</Label>
                  <Input
                    id="studentAddress"
                    value={studentAddress}
                    onChange={(e) => setStudentAddress(e.target.value)}
                    placeholder="0x..."
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="studentName">Student Name</Label>
                  <Input
                    id="studentName"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="Enter student name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="studentStatus">Student Status</Label>
                  <Input
                    id="studentStatus"
                    value={studentStatus}
                    onChange={(e) => setStudentStatus(e.target.value)}
                    placeholder="Active, Graduated, etc."
                    required
                  />
                </div>

                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Adding...
                    </>
                  ) : (
                    "Add Student"
                  )}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="lecturers">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <UserPlus className="mr-2 h-5 w-5" /> Add Lecturer
              </h2>
              <form onSubmit={handleAddLecturer} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="lecturerAddress">Lecturer Wallet Address</Label>
                  <Input
                    id="lecturerAddress"
                    value={lecturerAddress}
                    onChange={(e) => setLecturerAddress(e.target.value)}
                    placeholder="0x..."
                    required
                  />
                </div>

                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Adding...
                    </>
                  ) : (
                    "Add Lecturer"
                  )}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="validators">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <UserPlus className="mr-2 h-5 w-5" /> Add Validator
              </h2>
              <form onSubmit={handleAddValidator} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="validatorAddress">Validator Wallet Address</Label>
                  <Input
                    id="validatorAddress"
                    value={validatorAddress}
                    onChange={(e) => setValidatorAddress(e.target.value)}
                    placeholder="0x..."
                    required
                  />
                </div>

                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Adding...
                    </>
                  ) : (
                    "Add Validator"
                  )}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="courses">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <BookOpen className="mr-2 h-5 w-5" /> Add Course
              </h2>
              <form onSubmit={handleAddCourse} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="courseId">Course ID</Label>
                  <Input
                    id="courseId"
                    value={courseId}
                    onChange={(e) => setCourseId(e.target.value)}
                    placeholder="Enter course ID"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="courseName">Course Name</Label>
                  <Input
                    id="courseName"
                    value={courseName}
                    onChange={(e) => setCourseName(e.target.value)}
                    placeholder="Enter course name"
                    required
                  />
                </div>

                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Adding...
                    </>
                  ) : (
                    "Add Course"
                  )}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="assign">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <BookOpen className="mr-2 h-5 w-5" /> Assign Course to Lecturer
              </h2>
              <form onSubmit={handleAssignCourse} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="assignLecturerAddress">Lecturer Wallet Address</Label>
                  <Input
                    id="assignLecturerAddress"
                    value={assignLecturerAddress}
                    onChange={(e) => setAssignLecturerAddress(e.target.value)}
                    placeholder="0x..."
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="assignCourseId">Course ID</Label>
                  <Input
                    id="assignCourseId"
                    value={assignCourseId}
                    onChange={(e) => setAssignCourseId(e.target.value)}
                    placeholder="Enter course ID"
                    required
                  />
                </div>

                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Assigning...
                    </>
                  ) : (
                    "Assign Course"
                  )}
                </Button>
              </form>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  )
}

export default function AdminPage() {
  return (
    <WalletProvider>
      <AdminPageContent />
    </WalletProvider>
  )
}
