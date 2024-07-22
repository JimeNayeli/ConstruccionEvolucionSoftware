import {
  Table,
  Box,
  SpaceBetween,
  Button,
  Header,
} from "@cloudscape-design/components"
import moment from "moment"
import { Link } from "react-router-dom";
import { Bid } from "../../hooks/useBids"

const BidsTable = (props: { data: Array<Bid>; isLoading: boolean }) => {
  return (
    <Table
      loading={props.isLoading}
      columnDefinitions={[
        {
          id: "placedBy",
          header: "Hecho por",
          cell: (item) => <Link style={{ textDecoration: 'none' }} to={`/profile/${item.placedById}`}>{item.placedByUsername}</Link>,
        },
        {
          id: "placedAt",
          header: "Hecho hace",
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
      ]}
      resizableColumns
      sortingDisabled
      items={props.data}
      loadingText="Loading bids"
      empty={
        <Box textAlign="center" color="inherit">
          <SpaceBetween size={"s"}>
            <b>Aún no hay ofertas, ¡intente realizar una!</b>
          </SpaceBetween>
        </Box>
      }
      header={<Header>Todas las ofertas</Header>}
    />
  )
}

export default BidsTable
