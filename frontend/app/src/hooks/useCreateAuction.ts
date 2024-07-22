import { Auction } from "../schemas/auctionSchema"
import { Item } from "../schemas/itemSchema"
import fetchWrapper from "../utils/fetchWrapper"

const constructAuctionBody = (
  auction: Auction,
  item: Item,
  categoryId: string
) => {
  return {
    ...auction,
    item: {
      ...item,
      category: {
        id: categoryId,
      },
    },
  }
}

export const createAuction = async (newAuction: {
  auction: Auction
  item: Item
  categoryId: string
  image?: File
}) => {
  const requestBody = JSON.stringify(
    constructAuctionBody(
      newAuction.auction,
      newAuction.item,
      newAuction.categoryId
    )
  )

  const formData = new FormData()
  if (newAuction.image) {
    formData.append("image", newAuction.image)
  }
  formData.append(
    "auction",
    new Blob([requestBody], {
      type: "application/json",
    })
  )

  const response = await fetchWrapper(`${process.env.REACT_APP_API_URL}/api/v1/auctions`, {
    method: "POST",
    body: formData,
  })

  // If the response is not successful, throw an error
  if (!response.ok) {
    throw new Error(response.statusText)
  }

  // Return the response data
  return await response.json()
}
