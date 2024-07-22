import Box from "@cloudscape-design/components/box";
import Header from "@cloudscape-design/components/header";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Table from "@cloudscape-design/components/table";
import moment from "moment";
import { Link } from "react-router-dom";
import useMyBids from "../../hooks/useMyBids";



const MyBids = () => {
  const fetchMyBidsQuery = useMyBids();

  console.log(fetchMyBidsQuery.data)
  return (
    <div>
      <p>Tus ofertas</p>
      <Table
        loading={fetchMyBidsQuery.isLoading}
        columnDefinitions={[
          {
            id: "auction",
            header: "Subasta",
            cell: (item) => <Link to={`/auction/${item.auctionId}`}>{item.auctionName}</Link>
          },
          {
            id: "placedAt",
            header: "Hecha hace",
            cell: (item) => moment(item.placedAt).fromNow(),
          },
          {
            id: "comment",
            header: "Comentario",
            cell: (item) => item.comment || "-",
          },
          {
            id: "amount",
            header: "Cantidad",
            cell: (item) => <b style={{ color: "green" }}>${item.amount}</b>,
          },
          {
            id: "highestAmount",
            header: "Oferta mas alta",
            cell: (item) => <b style={{ color: "darkgreen" }}>${item.auctionCurrentHighestBidAmount}</b>
          },
          {
            id: "auctionCloses",
            header: "La subasta se cierra en",
            cell: (item) => moment(item.auctionClosingTime).isBefore(moment()) ?
              <b style={{ color: "firebrick" }}>Cerrada</b>
              : moment(item.auctionClosingTime).fromNow(),
          }
        ]}
        resizableColumns
        sortingDisabled
        items={fetchMyBidsQuery.data!}
        loadingText="Loading bids"
        empty={
          <Box textAlign="center" color="inherit">
            <SpaceBetween size={"s"}>
              <b>Aún no has realizado ninguna oferta</b>
            </SpaceBetween>
          </Box>
        }
        header={<Header>Todas las ofertas</Header>}
      />
    </div>
  )
}

export default MyBids;
