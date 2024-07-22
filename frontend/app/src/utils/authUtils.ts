import { StatusCodes } from "http-status-codes"

const fetchVerifyCredentials = async () => {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/verifyCredentials`, {
      redirect: "error",
      credentials: 'include'
    })

    if (response.status === StatusCodes.OK) {
      const data = await response.json()
      return {
        isAuthenticated: true,
        userName: data.userName,
      }
    }
  } catch (e) {
    console.warn(e)
  }
  return {
    isAuthenticated: false,
    userName: "",
  }
}

export default fetchVerifyCredentials
