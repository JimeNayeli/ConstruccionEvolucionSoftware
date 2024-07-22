import { useQuery } from "react-query"

const fetchMyBids = async () => {
  const result = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/myBids`, {
    credentials: 'include'
  })
  if (!result.ok) {
    throw Error("Could not fetch your bids")
  }
  const data = await result.json()
  return data
}

const useMyBids = () => {
  const fetchMyBidsQuery = useQuery<Array<Bid>, Error>("myBids", () =>
    fetchMyBids()
  )
  return fetchMyBidsQuery
}

export default useMyBids
