import React, { useContext, useEffect, useState } from "react"

import { useQuery } from "react-query"
import Spinner from "@cloudscape-design/components/spinner"
import moment from "moment"
import Auction from "../auction/Auction"
import ButtonDropdown from "@cloudscape-design/components/button-dropdown"
import {
  Badge,
  Grid,
  Multiselect,
  Pagination,
  Select,
  SpaceBetween,
} from "@cloudscape-design/components"
import { AlertContext } from "../../App"
import fetchAllCategories from "../../common/fetchAllCategories"
import { OptionDefinition } from "@cloudscape-design/components/internal/components/option/interfaces"

const fetchAuctions = async (
  sortOrder: SortOrder,
  currentPageIndex: number,
  category: string | null
) => {
  const sortByColumn = sortOrder === SortOrder.BIDS_ORDER_LEAST || sortOrder === SortOrder.BIDS_ORDER_MOST ? "bids" : "createdAt";
  const sortOrderString = sortOrder === SortOrder.BIDS_ORDER_LEAST || sortOrder === SortOrder.CREATED_AT_OLDEST ? "asc" : "desc";

  let url = `${process.env.REACT_APP_API_URL}/api/v1/auctions?pageNumber=${currentPageIndex - 1
    }&sortBy=${sortByColumn}&sortOrder=${sortOrderString}`

  if (category !== null) {
    url += `&category=${category}`
  }

  const result = await fetch(url,
    {
      method: "GET",
      credentials: 'include'
    }
  )
  const data = await result.json()

  if (!result.ok) {
    throw Error("Failed with: " + data.message)
  }
  return data
}

const AuctionListings = () => {
  const [sortOrder, setSortOrder] = useState(SortOrder.CREATED_AT_LATEST)
  const [currentPageIndex, setCurrentPageIndex] = useState(1)
  const [selectedCategory, setSelectedCategory] =
    useState<OptionDefinition | null>(null);

  const { data, error, isError, isLoading, isSuccess, refetch } = useQuery<
    { auctions: Array<Auction>; numPages: number },
    Error
  >(["queryAllAuctions", currentPageIndex, selectedCategory], () => fetchAuctions(sortOrder, currentPageIndex, selectedCategory?.label || null), {
    retry: false,
    refetchOnWindowFocus: false,
  })
  const { setAlertNotification } = useContext(AlertContext)


  useEffect(() => {
    if (isError) {
      setAlertNotification({
        header: "Error fetching Auctions",
        content: error.message,
        type: "error",
        isVisible: true,
      })
    }
  }, [isError])

  useEffect(() => {
    refetch()
  }, [sortOrder])

  if (isError) {
    return <b>Could not fetch the data</b>
  }

  if (isLoading) {
    return <Spinner />
  }

  return (
    <div style={{ marginBottom: "2rem" }}>
      <div>
        <AuctionSelectionDropdown
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
      </div>

      <div>

        {data!.auctions.length !== 0 &&
          <Pagination
            ariaLabels={{
              nextPageLabel: "Next page",
              previousPageLabel: "Previous page",
              pageLabel: (pageNumber) => `Page ${pageNumber} of all pages`,
            }}
            pagesCount={data!.numPages}
            currentPageIndex={currentPageIndex}
            onChange={(e) => {
              setCurrentPageIndex(e.detail.currentPageIndex)
            }}
          />}
      </div>

      <Grid
        gridDefinition={[
          { colspan: { default: 12, s: 6 } },
          { colspan: { default: 12, s: 6 } },
          { colspan: { default: 12, s: 6 } },
          { colspan: { default: 12, s: 6 } },
        ]}
      >
        {data!.auctions.map((auctionItem: any) => {
          return (
            <Auction
              key={auctionItem.id}
              {...auctionItem}
              closingTime={moment.utc(auctionItem.closingTime).fromNow()}
            />
          )
        })}

        {data!.auctions.length === 0 && <h2>No se pudo encontrar ninguna subasta con los filtros seleccionados!</h2>}
      </Grid>
    </div>
  )
}

enum SortOrder {
  CREATED_AT_LATEST = "Latest",
  CREATED_AT_OLDEST = "Oldest",
  BIDS_ORDER_LEAST = "Least Bids",
  BIDS_ORDER_MOST = "Most Bids",
}

interface AuctionSelectionDropdownProps {
  sortOrder: SortOrder
  setSortOrder: React.SetStateAction<any>
  selectedCategory: OptionDefinition | null
  setSelectedCategory: React.Dispatch<React.SetStateAction<OptionDefinition | null>>
}

const AuctionSelectionDropdown = (props: AuctionSelectionDropdownProps) => {
  const [categories, setCategories] = useState<
    { label: string; value: string }[]
  >([])


  const handleLoadCategoryOptions = async () => {
    try {
      if (categories.length !== 0) {
        return;
      }
      const fetchedCategories = await fetchAllCategories()
      setCategories([{ label: "All", value: null }, ...fetchedCategories])
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <>
      <SpaceBetween size="l" direction="vertical">
        <SpaceBetween size={"l"} direction="horizontal">
          <ButtonDropdown
            items={[
              { text: "Recientes", id: SortOrder.CREATED_AT_LATEST, disabled: false },
              { text: "Antiguas", id: SortOrder.CREATED_AT_OLDEST, disabled: false },
              { text: "Mas ofertas", id: SortOrder.BIDS_ORDER_MOST, disabled: false },
              { text: "Menos ofertas", id: SortOrder.BIDS_ORDER_LEAST, disabled: false },
            ]}
            onItemClick={(e) => {
              const selection = e.detail.id
              props.setSortOrder(selection as SortOrder)
            }}
          >
            Ordenar por
          </ButtonDropdown>
          <Badge
          >
            {props.sortOrder}
          </Badge>
        </SpaceBetween>

        <div style={{ width: "100%", display: "flex", flexDirection: "row-reverse" }}>
          <div>
            <Select
              selectedOption={props.selectedCategory}
              onChange={({ detail }) => {
                props.setSelectedCategory(detail.selectedOption)
              }}
              options={categories}
              placeholder="Filtrar por categoria"
              selectedAriaLabel="Selected Category"
              onLoadItems={handleLoadCategoryOptions}
              loadingText="Loading available categories"
            />
          </div>
        </div>
      </SpaceBetween>
    </>
  )
}

export default AuctionListings
