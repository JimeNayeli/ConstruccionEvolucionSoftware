import { useQuery } from "react-query"

const fetchMyAuctions = async () => {
  const result = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/myAuctions`, {
    credentials: 'include'
  })

  if (!result.ok) {
    throw Error("Failed to fetch your auctions")
  }

  const data = await result.json()
  return data
}

const useMyAuctions = () => {
  const fetchMyAuctionsQuery = useQuery<Array<Auction>, Error>(
    "fetchMyAuctions",
    () => fetchMyAuctions()
  )
  return fetchMyAuctionsQuery
}

export default useMyAuctions
