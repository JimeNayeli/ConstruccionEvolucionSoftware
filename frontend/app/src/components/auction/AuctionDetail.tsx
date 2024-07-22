import { Grid, Icon, SpaceBetween } from "@cloudscape-design/components"
import Button from "@cloudscape-design/components/button"
import Container from "@cloudscape-design/components/container"
import Header from "@cloudscape-design/components/header"
import Spinner from "@cloudscape-design/components/spinner"
import { useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { AlertContext } from "../../App"
import useAuctionDetail, { ItemDetail } from "../../hooks/useAuctionDetail"
import useBids from "../../hooks/useBids"
import UserDetail from "../UserDetail"
import BidsTable from "./BidsTable"
import PlaceBidModal from "./PlaceBidModal"

const AuctionDetail = () => {
  const { auctionId } = useParams()
  const { setAlertNotification } = useContext(AlertContext)

  const {
    data: auctionData,
    isLoading: isLoadingAuction,
    isError: isErrorAuction,
    error: auctionError,
  } = useAuctionDetail(auctionId as string)

  useEffect(() => {
    if (isErrorAuction) {
      setAlertNotification({
        isVisible: true,
        header: "Could not fetch Auction",
        content: `${auctionError}`,
        type: "error",
      })
    }
  }, [isErrorAuction])

  if (isLoadingAuction) {
    return <Spinner />
  }

  if (isErrorAuction) {
    return <div>An error occurred</div>
  }

  return (
    <div style={{ marginTop: "1rem" }}>
      <Container
        header={
          <Header variant="h2" description={auctionData?.description}>
            {auctionData?.name}
          </Header>
        }
      >
        <Grid
          gridDefinition={[
            { colspan: { default: 12, s: 9 } },
            { colspan: { default: 12, s: 3 } },
          ]}
        >
          <div>
            {" "}
            <Item {...auctionData!.item} />
          </div>

          <UserDetail createdById={auctionData!.createdById} />
        </Grid>
      </Container>

      <div style={{ marginTop: "2rem" }}>
        <Bids auctionId={auctionId!} isClosed={auctionData ? auctionData.closed : true} />
      </div>
    </div>
  )
}

const Bids = (props: { auctionId: string, isClosed: boolean }) => {
  const {
    data: bidsData,
    isLoading,
    isError,
    refetch,
  } = useBids(props.auctionId)
  const [showPlaceBidModal, setShowPlaceBidModal] = useState(false)

  if (isError) {
    return <div>Error loading bids</div>
  }

  return (
    <>
      {showPlaceBidModal && (
        <PlaceBidModal
          showPlaceBidModal={showPlaceBidModal}
          setShowPlaceBidModal={setShowPlaceBidModal}
          auctionId={props.auctionId}
          refetchBidsData={refetch}
        />
      )}
      <SpaceBetween size={"l"}>
        <BidsTable data={bidsData!} isLoading={isLoading} />
        {props.isClosed &&
          <SpaceBetween size={"xs"} direction="horizontal">
            <Icon name="lock-private" variant="error" />
            <b>La subasta está cerrada y no se aceptan más ofertas.</b>
          </SpaceBetween>
        }
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Button disabled={props.isClosed} variant="primary" onClick={() => setShowPlaceBidModal(true)}>
          Hacer una oferta
          </Button>
        </div>
      </SpaceBetween>
    </>
  )
}

const Item = (props: ItemDetail) => {
  return (
    <div>
      <b>{props.name}</b>

      <p>{props.description}</p>
    </div>
  )
}

export default AuctionDetail
