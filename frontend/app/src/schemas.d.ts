interface Bid {
  id: string
  placedAt: string
  amount: number
  placedByUsername: string
  comment: string
  auctionClosingTime: string
  auctionName: string
  auctionCurrentHighestBidAmount: number
  auctionId: number
}

interface Profile {
  id: string
  firstName: string
  lastName: string
  description: string | null
  profilePictureURL: string | null
}

interface ChatMessageResponse {
  userName: string
  message: string
  sentAt: string
}

interface User {
  id: number
  username: string
  profile: Profile
}

interface Auction {
  id: string
  name: string
  description: string
  item: Item
  closingTime: string
  s3ImageURL?: string
  currentHighestBid?: Bid
  closed: boolean
}
