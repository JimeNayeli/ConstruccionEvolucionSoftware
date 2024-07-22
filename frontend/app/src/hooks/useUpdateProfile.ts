import { useContext } from "react"
import { AlertContext } from "../App"
import { useMutation } from "react-query"
import fetchWrapper from "../utils/fetchWrapper"

interface ProfileUpdateRequest {
  firstName?: string
  lastName?: string
  description?: string
  image?: File
}

const fetchUpdateProfile = async (
  profileUpdateRequest: ProfileUpdateRequest
) => {
  const requestBody = JSON.stringify({
    firstName: profileUpdateRequest.firstName,
    lastName: profileUpdateRequest.lastName,
    description: profileUpdateRequest.description,
  })
  const formData = new FormData()
  if (profileUpdateRequest.image) {
    formData.append("image", profileUpdateRequest.image)
  }
  formData.append(
    "profile",
    new Blob([requestBody], {
      type: "application/json",
    })
  )

  const response = await fetchWrapper(`${process.env.REACT_APP_API_URL}/api/v1/profile/`, {
    method: "PATCH",
    body: formData,
  })

  if (!response.ok) {
    throw new Error(response.statusText)
  }

  return await response.json()
}

const useUpdateProfile = () => {
  const { setAlertNotification } = useContext(AlertContext)
  const updateProfileMutation = useMutation({
    mutationFn: (profileUpdateRequest: ProfileUpdateRequest) =>
      fetchUpdateProfile(profileUpdateRequest),
    onError: (e: Error) => {
      console.error(`An error occured: ${e}`)
      setAlertNotification({
        isVisible: true,
        type: "error",
        header: "Error updating profile",
        content: e.message,
      })
    },
    onSuccess: () => {
      setAlertNotification({
        isVisible: true,
        type: "success",
        header: "Updated profile information successfully",
        content: "Changes applied",
      })
    },
  })
  return updateProfileMutation
}

export default useUpdateProfile
