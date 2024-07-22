import { useQuery } from "react-query"

const fetchUserProfile = async () => {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/profile`, {
    method: "GET",
    credentials: 'include'
  })
  if (!response.ok) {
    throw Error("Could not fetch profile")
  }
  const responseData = await response.json()
  return responseData
}

const useMyProfile = () => {
  const profileQueryResult = useQuery<Profile, Error>(
    "fetchProfile",
    () => fetchUserProfile(),
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  )
  return profileQueryResult
}

export default useMyProfile
