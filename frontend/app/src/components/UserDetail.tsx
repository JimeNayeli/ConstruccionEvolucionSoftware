import { Button, Container, Spinner, Link as CloudscapeLink } from "@cloudscape-design/components"
import { Link, useNavigate } from "react-router-dom"
import useUserDetails from "../hooks/useUserProfile"
import style from "../styles/UserDetail.module.scss"

const UserDetail = (props: { createdById: number }) => {
  const {
    data: userData,
    isLoading,
    isError,
    error,
  } = useUserDetails(props.createdById)
  const navigate = useNavigate();

  const handleClickChatWithUser = () => {
    navigate(`/chat?userId=${props.createdById}`)
  }

  if (isLoading) {
    return <Spinner />
  }

  if (isError) {
    return <div>Error fetching user details...</div>
  }

  return (
    <div className={style.userDetailsContainer}>
      <h3>Ofertado por</h3>
      <img
        className={style.image}
        src={
          userData?.profile.profilePictureURL ?? "/images/profile-anonymous.jpg"
        }
      ></img>
      <CloudscapeLink>
        <Link style={{ textDecoration: 'none' }} to={`/profile/${userData!.id}`}>{userData?.username}</Link>
      </CloudscapeLink>
      <div className={style.fullName}>
        <p>{userData?.profile.firstName}</p>
        <p>{userData?.profile.lastName}</p>
      </div>
      <Button onClick={handleClickChatWithUser} variant="primary">Chatear con usuario</Button>
    </div>
  )
}

export default UserDetail
