import { useQuery } from "react-query"

const fetchChatHistoryUsers = async () => {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/chatHistoryUsers`, {
    credentials: 'include'
  })
  if (!response.ok) {
    throw Error("Could not fetch list of users")
  }
  const data = await response.json()
  return data
}

const useChatUsers = () => {
  const fetchChatUsersQuery = useQuery<Array<User>, Error>(
    "fetchChatUsers",
    () => {
      return fetchChatHistoryUsers()
    }
  )

  return fetchChatUsersQuery
}

export default useChatUsers
