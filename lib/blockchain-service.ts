import { BrowserProvider, Contract, JsonRpcSigner, EventLog } from "ethers"
import { contractABI, contractAddress } from "./contract"
import { getEthereumProviderFromPrivy } from "./privy-helpers"

export const getProviderFromPrivy = async (walletClient: any): Promise<BrowserProvider> => {
  return await getEthereumProviderFromPrivy(walletClient)
}

export const getContract = (signer: JsonRpcSigner) => {
  return new Contract(contractAddress, contractABI, signer)
}

export const getMyResults = async (walletClient: any) => {
  try {
    const provider = await getProviderFromPrivy(walletClient)
    const signer = await provider.getSigner()
    const contract = getContract(signer)

    const results = await contract.getMyResults()

    const resultsWithCourseNames = await Promise.all(
      results.map(async (result: any) => {
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
  walletClient: any,
  studentAddress: string,
  courseId: string,
  grade: string
) => {
  try {
    const provider = await getProviderFromPrivy(walletClient)
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
  walletClient: any,
  courseId: string,
  studentAddresses: string[],
  grades: string[]
) => {
  try {
    const provider = await getProviderFromPrivy(walletClient)
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
  walletClient: any,
  studentAddress: string,
  courseId: string
) => {
  try {
    const provider = await getProviderFromPrivy(walletClient)
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

export const getAllUnvalidatedResults = async (walletClient: any) => {
  try {
    const provider = await getProviderFromPrivy(walletClient)
    const signer = await provider.getSigner()
    const contract = getContract(signer)

    const submittedEvents = await contract.queryFilter(contract.filters.ResultSubmitted())
    const validatedEvents = await contract.queryFilter(contract.filters.ResultValidated())

    const validatedSet = new Set(
      validatedEvents
        .filter((e): e is EventLog => "args" in e)
        .map((e) => `${e.args.student.toLowerCase()}-${e.args.courseId.toString()}`)
    )

    const unvalidated = await Promise.all(
      submittedEvents
        .filter((e): e is EventLog => "args" in e)
        .filter((e) => {
          const key = `${e.args.student.toLowerCase()}-${e.args.courseId.toString()}`
          return !validatedSet.has(key)
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

    return unvalidated
  } catch (error) {
    console.error("Error fetching unvalidated results:", error)
    throw error
  }
}
