import Grid from "@cloudscape-design/components/grid";
import Spinner from "@cloudscape-design/components/spinner";
import { useSearchParams } from "react-router-dom";
import useSearchAuctions from "../../hooks/useSearchAuctions";
import Auction from "./Auction";


const AuctionSearch = () => {
  const [searchParams, _] = useSearchParams();
  const searchAuctionsQuery = useSearchAuctions(searchParams.get("query") || "");

  if (searchAuctionsQuery.isLoading) {
    return <Spinner size='large' />
  }

  if (searchAuctionsQuery.isError) {
    return <p>Failed to fetch auctions</p>
  }

  if (searchAuctionsQuery.data?.length === 0) {
    return <p>No matching auctions found according to search query.</p>
  }

  return (
    <div>
      <p>Displaying a list of all auctions matching <b>"{searchParams.get("query")}"</b>:</p>
      <Grid
        gridDefinition={[
          { colspan: { default: 12, s: 4 } },
          { colspan: { default: 12, s: 4 } },
          { colspan: { default: 12, s: 4 } },
          { colspan: { default: 12, s: 4 } },
        ]}
      >
        {searchAuctionsQuery.data?.map(auction => <Auction {...auction} />
        )}
      </Grid>
    </div>
  )
}

export default AuctionSearch;
