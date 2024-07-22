import Badge from "@cloudscape-design/components/badge"

export interface Item {
  description: string
  startingPrice: number
  category: { id: string; name: string }
}

const AuctionItem = (props: Item) => {
  return (
    <>
      <div>
        <p>{props.description}</p>
        <div>
        Precio inicial: <span className="price">${props.startingPrice}</span>
        </div>
        <Badge color="grey">{props.category?.name}</Badge>
      </div>
    </>
  )
}

export default AuctionItem
