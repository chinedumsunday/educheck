import { BrowserProvider, Contract, EventLog, ContractRunner } from "ethers"



export const contractABI = [
  { inputs: [], stateMutability: "nonpayable", type: "constructor" },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: "uint256", name: "courseId", type: "uint256" },
      { indexed: false, internalType: "string", name: "name", type: "string" },
    ],
    name: "CourseAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [{ indexed: false, internalType: "address", name: "lecturer", type: "address" }],
    name: "LecturerAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: "address", name: "student", type: "address" },
      { indexed: false, internalType: "uint256", name: "courseId", type: "uint256" },
      { indexed: false, internalType: "string", name: "grade", type: "string" },
    ],
    name: "ResultSubmitted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: "address", name: "student", type: "address" },
      { indexed: false, internalType: "uint256", name: "courseId", type: "uint256" },
    ],
    name: "ResultValidated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [{ indexed: false, internalType: "address", name: "student", type: "address" }],
    name: "StudentAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [{ indexed: false, internalType: "address", name: "validator", type: "address" }],
    name: "ValidatorAdded",
    type: "event",
  },
  {
    inputs: [
      { internalType: "uint256", name: "courseId", type: "uint256" },
      { internalType: "string", name: "name", type: "string" },
    ],
    name: "addCourse",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_lecturer", type: "address" }],
    name: "addLecturer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_student", type: "address" },
      { internalType: "string", name: "name", type: "string" },
      { internalType: "string", name: "status", type: "string" },
    ],
    name: "addStudent",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_validator", type: "address" }],
    name: "addValidator",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "admin",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_lecturer", type: "address" },
      { internalType: "uint256", name: "courseId", type: "uint256" },
    ],
    name: "assignCourse",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "courses",
    outputs: [
      { internalType: "string", name: "name", type: "string" },
      { internalType: "uint256", name: "courseId", type: "uint256" },
      { internalType: "bool", name: "exists", type: "bool" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getMyResults",
    outputs: [
      {
        components: [
          { internalType: "address", name: "student", type: "address" },
          { internalType: "uint256", name: "courseId", type: "uint256" },
          { internalType: "string", name: "grade", type: "string" },
          { internalType: "uint8", name: "signatures", type: "uint8" },
          { internalType: "bool", name: "validated", type: "bool" },
          { internalType: "bool", name: "exists", type: "bool" },
        ],
        internalType: "struct ExamResults.Result[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "", type: "address" },
      { internalType: "uint256", name: "", type: "uint256" },
    ],
    name: "lecturerCourses",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "lecturers",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_lecturer", type: "address" }],
    name: "removeLecturer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_student", type: "address" }],
    name: "removeStudent",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "", type: "address" },
      { internalType: "uint256", name: "", type: "uint256" },
    ],
    name: "studentCourses",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "", type: "address" },
      { internalType: "uint256", name: "", type: "uint256" },
    ],
    name: "studentResults",
    outputs: [
      { internalType: "address", name: "student", type: "address" },
      { internalType: "uint256", name: "courseId", type: "uint256" },
      { internalType: "string", name: "grade", type: "string" },
      { internalType: "uint8", name: "signatures", type: "uint8" },
      { internalType: "bool", name: "validated", type: "bool" },
      { internalType: "bool", name: "exists", type: "bool" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "students",
    outputs: [
      { internalType: "string", name: "name", type: "string" },
      { internalType: "string", name: "status", type: "string" },
      { internalType: "bool", name: "exists", type: "bool" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "courseId", type: "uint256" },
      { internalType: "address[]", name: "studentAddresses", type: "address[]" },
      { internalType: "string[]", name: "grades", type: "string[]" },
    ],
    name: "submitBulkResults",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "student", type: "address" },
      { internalType: "uint256", name: "courseId", type: "uint256" },
      { internalType: "string", name: "grade", type: "string" },
    ],
    name: "submitResult",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "student", type: "address" },
      { internalType: "uint256", name: "courseId", type: "uint256" },
    ],
    name: "validateResult",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "validators",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "courseId", type: "uint256" }],
    name: "viewResult",
    outputs: [
      { internalType: "string", name: "grade", type: "string" },
      { internalType: "bool", name: "validated", type: "bool" },
    ],
    stateMutability: "view",
    type: "function",
  },
]

// Contract address on OP Sepolia
export const contractAddress = "0xaF649d8e10F31dCe2F25591c03d6362e6C8B50DC" // Replace if needed



export interface Result {
  student: string
  courseId: string
  grade: string
  signatures: number
  validated: boolean
  exists: boolean
  courseName?: string
}

// ✅ Accept BrowserProvider from ethers v6
export const getContract = (runner: ContractRunner) => {
  return new Contract(contractAddress, contractABI, runner)
}

// ✅ getMyResults
export const getMyResults = async (provider: BrowserProvider): Promise<Result[]> => {
  try {
    const signer = await provider.getSigner()
    const contract = getContract(signer)

    const results = await contract.getMyResults()

    const resultsWithCourseNames = await Promise.all(
      results.map(async (result: Result) => {
        try {
          const course = await contract.courses(result.courseId)
          return { ...result, courseName: course.name }
        } catch (error) {
          console.error("Error fetching course name:", error)
          return { ...result, courseName: `Course ${result.courseId}` }
        }
      })
    )

    return resultsWithCourseNames
  } catch (error) {
    console.error("Error fetching results:", error)
    throw error
  }
}

export const submitResult = async (
  provider: BrowserProvider,
  studentAddress: string,
  courseId: string,
  grade: string,
) => {
  try {
    const signer = await provider.getSigner()
    const contract = getContract(signer)
    const tx = await contract.submitResult(studentAddress, courseId, grade)
    await tx.wait()
    return tx
  } catch (error) {
    console.error("Error submitting result:", error)
    throw error
  }
}

export const submitBulkResults = async (
  provider: BrowserProvider,
  courseId: string,
  studentAddresses: string[],
  grades: string[],
) => {
  try {
    const signer = await provider.getSigner()
    const contract = getContract(signer)
    const tx = await contract.submitBulkResults(courseId, studentAddresses, grades)
    await tx.wait()
    return tx
  } catch (error) {
    console.error("Error submitting bulk results:", error)
    throw error
  }
}

export const validateResult = async (
  provider: BrowserProvider,
  studentAddress: string,
  courseId: string,
) => {
  try {
    const signer = await provider.getSigner()
    const contract = getContract(signer)
    const tx = await contract.validateResult(studentAddress, courseId)
    await tx.wait()
    return tx
  } catch (error) {
    console.error("Error validating result:", error)
    throw error
  }
}

export const getAllUnvalidatedResults = async (provider: BrowserProvider): Promise<Result[]> => {
  try {
    const signer = await provider.getSigner()
    const contract = getContract(signer)

    const resultSubmittedEvents = await contract.queryFilter(contract.filters.ResultSubmitted())
    const resultValidatedEvents = await contract.queryFilter(contract.filters.ResultValidated())

    const validatedResultsSet = new Set(
      resultValidatedEvents
        .filter((e): e is EventLog => "args" in e)
        .map(e => `${e.args.student.toLowerCase()}-${e.args.courseId.toString()}`)
    )

    const unvalidatedResults = await Promise.all(
      resultSubmittedEvents
        .filter((e): e is EventLog => "args" in e)
        .filter((e) => {
          const key = `${e.args.student.toLowerCase()}-${e.args.courseId.toString()}`
          return !validatedResultsSet.has(key)
        })
        .map(async (e) => {
          const student = e.args.student
          const courseId = e.args.courseId.toString()
          const result = await contract.studentResults(student, courseId)
          const course = await contract.courses(courseId)

          return {
            student,
            courseId,
            grade: result.grade,
            signatures: result.signatures,
            validated: result.validated,
            exists: result.exists,
            courseName: course.name,
          }
        })
    )

    return unvalidatedResults
  } catch (error) {
    console.error("Error fetching unvalidated results:", error)
    throw error
  }
}