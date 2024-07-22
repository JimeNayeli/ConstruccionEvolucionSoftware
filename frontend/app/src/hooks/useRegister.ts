import { useContext } from "react"
import { useMutation } from "react-query"
import { FlashbarContext } from "../App"
import { FlashbarNotificationId } from "../constants/notifications"
import { FlashBarNotificationActionType } from "../reducers/flashBarNotificationReducer"
import fetchWrapper from "../utils/fetchWrapper"

interface UserDetails {
  userName: string
  password: string
  firstName: string
  lastName: string
}

const fetchUserRegister = async (userDetails: UserDetails) => {
  const response = await fetchWrapper(`${process.env.REACT_APP_API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...userDetails,
    }),
  })

  if (!response.ok) {
    throw Error("Could not register")
  }
}

const useRegister = (args: { handleMutationSuccess: Function }) => {
  const { dispatchFlashBarNotifications } = useContext(FlashbarContext)

  const registerMutation = useMutation({
    mutationFn: (userDetails: UserDetails) => fetchUserRegister(userDetails),
    onSuccess: () => {
      args.handleMutationSuccess()
    },
    onError: () => {
      dispatchFlashBarNotifications({
        type: FlashBarNotificationActionType.ADD,
        notification: {
          header: "¡No se pudo registrar!",
          content: "Por favor, inténtelo de nuevo más tarde",
          id: FlashbarNotificationId.REGISTER_ERROR_NOTIFICATION,
          type: "error",
          onDismiss: () =>
            dispatchFlashBarNotifications({
              type: FlashBarNotificationActionType.REMOVE,
              notification: {
                id: FlashbarNotificationId.REGISTER_ERROR_NOTIFICATION,
              },
            }),
        },
      })
    },
  })

  return registerMutation
}

export default useRegister
