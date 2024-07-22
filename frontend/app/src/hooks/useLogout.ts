import { useMutation } from "react-query"
import fetchWrapper from "../utils/fetchWrapper"

const fetchUseLogout = async () => {
  const response = await fetchWrapper(`${process.env.REACT_APP_API_URL}/auth/logout`, {
    method: "POST",
  })
  if (!response.ok) {
    throw Error("Could not logout")
  }
}

const useLogout = (successCallBack: Function) => {
  const logoutMutation = useMutation({
    mutationFn: () => fetchUseLogout(),
    onError: (e: Error) => {
      console.error(e)
    },
    onSuccess: () => successCallBack(),
  })
  return logoutMutation
}

export default useLogout
