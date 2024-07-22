import React, { useContext } from "react"
import { useMutation } from "react-query"
import { AlertContext, FlashbarContext } from "../App"
import { Spinner } from "@cloudscape-design/components"
import { StatusCodes } from "http-status-codes"
import fetchWrapper from "../utils/fetchWrapper"
import { FlashBarNotificationActionType } from "../reducers/flashBarNotificationReducer"

interface BidCreateRequest {
  auctionId: string
  amount: number
  comment?: string
}

const fetchCreateBid = async (request: BidCreateRequest) => {
  const response = await fetchWrapper(`${process.env.REACT_APP_API_URL}/api/v1/auction/${request.auctionId}/bid`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  })

  if (response.status === StatusCodes.BAD_REQUEST) {
    const responseData = await response.json()
    throw Error(
      `${responseData.message ?? "Unknown error while placing bid"}`
    )
  }
  if (!response.ok) {
    throw Error("Unknown error while placing bid")
  }
}

const useCreateBid = (args: { handleSuccess: Function, handleMutate: Function }) => {
  const { dispatchFlashBarNotifications } = useContext(FlashbarContext);

  const createBidMutation = useMutation({
    mutationFn: (bidCreateRequest: BidCreateRequest) =>
      fetchCreateBid(bidCreateRequest),
    onError: (e: Error) => {
      console.error(`An error occured: ${e}`)
      dispatchFlashBarNotifications({
        type: FlashBarNotificationActionType.ADD,
        notification: {
          header: "Error placing the bid",
          type: "error",
          content: `Failed with: ${e.message}`,
          dismissLabel: "Dismiss message",
          id: "placeBidNotification",
          onDismiss: () => dispatchFlashBarNotifications({
            type: FlashBarNotificationActionType.REMOVE,
            notification: {
              id: "placeBidNotification"
            }
          })
        }
      })
    },
    onSuccess: () => {
      args.handleSuccess()
    },
    onMutate: () => {
      args.handleMutate()
    },
  })
  return createBidMutation
}

export default useCreateBid
