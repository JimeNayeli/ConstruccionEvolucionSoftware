import React from "react"
import Header from "@cloudscape-design/components/header"
import style from "../../styles/AuctionListings.module.scss"
import AuctionItem, { Item } from "./AuctionItem"
import { useNavigate } from "react-router-dom"


const Auction = (props: Auction) => {
  const navigate = useNavigate()
  const handleClickAuction = (auctionId: string) => {
    navigate(`/auction/${auctionId}`)
  }

  return (
    <div
      className={`${style.auctionCard} ${props.closed ? style.closedAuction : ""}`}
      onClick={() => handleClickAuction(props.id)}
    >
      <div style={{ padding: "1rem" }}>
        {props.closed &&
          <div className={style.ribbon + " " + style.ribbonTopLeft}>
            <span>
              {"        "}Cerrada
            </span>
          </div>
        }
        <div className={style.auctionCardHeader}>
          

          <b>{props.name}</b>
        </div>
        <br></br>
        <p>{props.description}</p>

        <div>
          <AuctionItem {...props.item} />
          <div className={style.currentHighestBid}>
          Apuesta más alta:{" "}
            <b className="price">
              {props?.currentHighestBid?.amount
                ? `$${props?.currentHighestBid?.amount}`
                : "No bids yet"}
            </b>
          </div>
          <div className={style.closingDateText}>
            {props.closed ?
              <b>La subasta está cerrada</b> : `Closes ${props.closingTime}`
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default Auction
