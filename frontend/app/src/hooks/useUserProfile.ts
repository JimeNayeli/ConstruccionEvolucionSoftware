import { StatusCodes } from "http-status-codes"
import { useMutation, useQuery } from "react-query"
import { NotFoundError } from "../common/exceptions"

interface Profile {
  id: number
  firstName: string
  lastName: string
  description: string
  profilePictureURL: string
}

const fetchUserDetails = async (userId: number | null) => {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/user/${userId}`, {
    method: "GET",
    credentials: 'include'
  })
  if (response.status == StatusCodes.NOT_FOUND) {
    throw new NotFoundError("User not found")
  }
  if (!response.ok) {
    throw new Error("Could not fetch user details")
  }
  return await response.json()
}

export const useUserDetailsWithUserId = (userId: number) => {
  const userDetailsQuery = useQuery<User, Error>(
    `userDetails-${userId}`,
    () => fetchUserDetails(userId),
    {
      retry: false,
    }
  )
  return userDetailsQuery
}

const useUserDetails = (userId: number | null) => {
  const userDetailsQuery = useQuery<User, Error>(
    `userDetails-${userId}`,
    () => fetchUserDetails(userId),
    {
      enabled: !!userId,
    }
  )
  return userDetailsQuery
}

export default useUserDetails
