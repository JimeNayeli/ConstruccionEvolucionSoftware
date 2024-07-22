import React, { createContext, ReactNode, useEffect, useReducer, useState } from "react"
import "./App.scss"
import "@cloudscape-design/global-styles/index.css"
import TopNavigation, { TopNavigationProps } from "@cloudscape-design/components/top-navigation"
import { AppLayout, Button, ButtonDropdownProps, Flashbar, FlashbarProps, Input } from "@cloudscape-design/components"
import Footer from "./components/Footer"
import "@cloudscape-design/global-styles/index.css"
import { QueryClient, QueryClientProvider } from "react-query"
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom"
import Alert from "@cloudscape-design/components/alert"
import { noop } from "lodash"
import Logout from "./components/Logout"
import fetchVerifyCredentials from "./utils/authUtils"
import "./index.css"
import flashBarNotificationReducer, { FlashBarNotificationAction, FlashBarNotificationActionType } from "./reducers/flashBarNotificationReducer"
import { KeyCodes } from "./constants/keyCodes"

const queryClient = new QueryClient()

interface Alert {
  header: string
  content: ReactNode
  isVisible: boolean
  type: "error" | "success" | "info"
}

interface AlertContextType {
  alertNotification: Alert | null
  setAlertNotification: React.Dispatch<React.SetStateAction<Alert | null>>
}

export const AlertContext = createContext<AlertContextType>({
  alertNotification: null,
  setAlertNotification: noop,
})

interface AuthenticatedContextType {
  userIsLoggedIn: boolean
  setUserIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>
  userName: string
  setUserName: React.Dispatch<React.SetStateAction<string>>
}

export const AuthenticatedContext = createContext<AuthenticatedContextType>({
  userIsLoggedIn: false,
  setUserIsLoggedIn: noop,
  userName: "",
  setUserName: noop,
})

interface FlashbarContextType {
  flashBarNotifications: FlashbarProps.MessageDefinition[],
  dispatchFlashBarNotifications: React.Dispatch<FlashBarNotificationAction>
}

export const FlashbarContext = createContext<FlashbarContextType>({
  flashBarNotifications: [],
  dispatchFlashBarNotifications: noop,
})


function App() {
  const [alertNotification, setAlertNotification] = useState<null | Alert>(null)
  const [flashBarNotifications, dispatchFlashBarNotifications] = useReducer(flashBarNotificationReducer, []);
  const [showLogOutModal, setShowLogOutModal] = useState(false)
  const [userIsLoggedIn, setUserIsLoggedIn] = useState(false)
  const [userName, setUserName] = useState("")
  const [searchQuery, setSearchQuery] = useState<string | null>(null);
  const navigate = useNavigate()
  const location = useLocation();



  // Flash bar should be reset on navigation to different page
  useEffect(() => {
    dispatchFlashBarNotifications({
      type: FlashBarNotificationActionType.RESET,
    })
  }, [location])

  useEffect(() => {
    async function checkIfUserIsLoggedIn() {
      const { isAuthenticated, userName } = await fetchVerifyCredentials();
      setUserIsLoggedIn(isAuthenticated);
      setUserName(userName)
    }

    checkIfUserIsLoggedIn();
  }, [])


  const handleItemClick = (e: any) => {
    e.preventDefault()
    if (e.detail.href) {
      navigate(e.detail.href)
    }
  }


  const handleUserProfileClick = (
    e: CustomEvent<ButtonDropdownProps.ItemClickDetails>
  ) => {
    switch (e.detail.id) {
      case "logout":
        handleLogoutClick()
        break
      case "profile":
        navigate("/profile")
        break
      default:
        noop()
    }
  }

  const handleLogoutClick = () => {
    setShowLogOutModal(true)
  }

  const handleSearchClick = () => {
    navigate(`/auctions/search?query=${searchQuery}`)
  }

  const getNavigationUtilities = (): Array<TopNavigationProps.Utility> => {
    if (userIsLoggedIn) {
      return [
        {
          type: "menu-dropdown",
          iconName: "menu",
          title: "Servicios",
          items: [
            {
              id: "create-listing",
              text: "Crear Subasta",
              href: "/create-listing",
            },
            {
              id: "my-listings",
              text: "Explorar Mis Subastas",
              href: "/my-listings",
            },
            {
              id: "chat",
              text: "Enviar mensage",
              href: "/chat",
            },
          ],
          onItemClick: handleItemClick
        },
        {
          type: "menu-dropdown",
          iconName: "user-profile",
          ariaLabel: "Account",
          title: "Account",
          items: [
            {
              id: "logout",
              text: "Logout",
            },
            {
              id: "profile",
              text: "View/Editar Perfil",
            },
          ],
          onItemClick: (e: CustomEvent<ButtonDropdownProps.ItemClickDetails>) => handleUserProfileClick(e),
        }
      ]
    } else {
      return [
        {
          type: "menu-dropdown",
          iconName: "user-profile",
          title: "Account",
          items: [
            {
              id: "login",
              text: "Login",
              href: "/login",
            },
            {
              id: "register",
              text: "Registro",
              href: "/register"
            },
          ],
          onItemClick: handleItemClick,
        }
      ]
    }
  }

  return (
    <>
      <AuthenticatedContext.Provider value={{ userIsLoggedIn, setUserIsLoggedIn, userName, setUserName }}>
        <AlertContext.Provider
          value={{ alertNotification, setAlertNotification }}
        >
          <FlashbarContext.Provider value={{ flashBarNotifications, dispatchFlashBarNotifications }}>
            <QueryClientProvider client={queryClient}>
              <TopNavigation
                identity={{
                  onFollow: (e) => {
                    e.preventDefault();
                    navigate("/");
                  },
                  href: "/",
                  title: "Subastas App",
                  logo: {
                    src: "/images/logo.png",
                    alt: "Auction App",
                  },
                }}
                i18nStrings={{
                  searchIconAriaLabel: "Search",
                  searchDismissIconAriaLabel: "Close search",
                  overflowMenuTriggerText: "More",
                  overflowMenuTitleText: "All",
                  overflowMenuBackIconAriaLabel: "Back",
                  overflowMenuDismissIconAriaLabel: "Close menu",
                }}
                utilities={getNavigationUtilities()}
                
              />
              {alertNotification && (
                <div style={{ margin: "1rem 0.5rem 0 0.5rem" }}>
                  <Alert
                    onDismiss={() => setAlertNotification(null)}
                    visible={alertNotification?.isVisible}
                    dismissAriaLabel="Close alert"
                    header={alertNotification.header}
                    type={alertNotification.type}
                    dismissible
                  >
                    {alertNotification.content}
                  </Alert>
                </div>
              )}
              {dispatchFlashBarNotifications.length !== 0 && (
                <div style={{ margin: "1rem 0.5rem 0 0.5rem", position: "fixed", bottom: "2.5rem", right: "1rem", zIndex: 1000 }}>
                  <Flashbar
                    items={flashBarNotifications}
                  />
                </div>
              )}
              <Logout
                showLogOutModal={showLogOutModal}
                setShowLogOutModal={setShowLogOutModal}
                setUserIsLoggedIn={setUserIsLoggedIn}
              />
              <AppLayout
                footerSelector="#footer"
                navigationHide={true}
                toolsHide={true}
                content={(location.pathname === '/login' || location.pathname === '/register' || userIsLoggedIn) ?
                  <Outlet /> :
                  <p>Click <Link to={"/login"}>aqui</Link> para Iniciar sesion en la aplicacion. Si no tienes una cuenta,
                    click <Link to={"/register"}>Registrar</Link>.</p>}
              />
            </QueryClientProvider>
          </FlashbarContext.Provider>
        </AlertContext.Provider>
      </AuthenticatedContext.Provider>
    </>
  )
}

export default App
