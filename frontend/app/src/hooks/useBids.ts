import React from "react"
import { useQuery } from "react-query"

const fetchBids = async (auctionId: string) => {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/auction/${auctionId}/bids`, {
    method: "GET",
    credentials: 'include'
  })
  const data = await response.json()
  if (!response.ok) {
    throw Error(data.message)
  }
  return data
}

export interface Bid {
  id: number
  placedAt: Date
  amount: number
  placedByUsername: string
  placedById: number
  comment?: string
}

const useBids = (auctionId: string) => {
  const { data, isLoading, isError, error, refetch } = useQuery<
    Array<Bid>,
    Error
  >("fetchBids", () => fetchBids(auctionId), {
    refetchOnWindowFocus: false,
  })

  return { data, isLoading, isError, error, refetch }
}

export default useBids
