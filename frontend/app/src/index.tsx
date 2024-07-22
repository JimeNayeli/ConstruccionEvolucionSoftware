import React, { StrictMode } from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import reportWebVitals from "./reportWebVitals"
import { createBrowserRouter, RouterProvider, Route } from "react-router-dom"
import ErrorPage from "./components/ErrorPage"
import Home from "./components/home/Home"
import CreateListing from "./components/auction/CreateListings"
import AuctionDetail from "./components/auction/AuctionDetail"
import MyProfile from "./components/profiles/Profile"
import Login from "./components/Login"
import Register from "./components/Register"
import ChatPage from "./components/chat/ChatPage"
import UserProfile from "./components/profiles/UserProfile"
import MyListings from "./components/auction/MyListings"
import MyBids from "./components/auction/MyBids"
import AuctionSearch from "./components/auction/AuctionSearch"

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/create-listing",
        element: <CreateListing />,
      },
      {
        path: "/my-listings",
        element: <MyListings />,
      },
      {
        path: "/my-bids",
        element: <MyBids />,
      },
      {
        path: "/auction/:auctionId",
        element: <AuctionDetail />,
      },
      {
        path: "/auctions/search",
        element: <AuctionSearch />,
      },
      {
        path: "/profile",
        element: <MyProfile />,
      },
      {
        path: "/profile/:userId",
        element: <UserProfile />,
      },
      {
        path: "/chat",
        element: <ChatPage />,
      }
    ],
  },
])

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)
root.render(
  <RouterProvider router={router} />
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
