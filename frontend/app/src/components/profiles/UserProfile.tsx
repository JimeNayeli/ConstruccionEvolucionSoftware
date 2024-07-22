import Button from "@cloudscape-design/components/button";
import Spinner from "@cloudscape-design/components/spinner"
import { useNavigate, useParams } from "react-router-dom"
import { NotFoundError } from "../../common/exceptions";
import { useUserDetailsWithUserId } from "../../hooks/useUserProfile"
import styles from "../../styles/UserProfile.module.scss";
import NotFoundErrorComponent from "../404";

const UserProfile = () => {
  const { userId } = useParams()
  const navigate = useNavigate();
  const { data: profileData, isLoading, isError, isSuccess, refetch, error } = useUserDetailsWithUserId(parseInt(userId!))

  const handleClickChatWithUser = () => {
    navigate(`/chat?userId=${userId}`)
  }


  if (isLoading) {
    return <Spinner size="large" />
  }

  if (isError) {
    if (error instanceof NotFoundError) {
      return <NotFoundErrorComponent />
    }
    return <p>Error loading user profile</p>
  }

  return (

    <div className={styles.profileContainer}>

      <img className={styles.profileImage} src={
        profileData?.profile.profilePictureURL ?? "/images/profile-anonymous.jpg"
      } />

      {profileData?.profile.description &&
        <q>{profileData.profile.description}</q>
      }

      <b>{profileData?.username}</b>
      <p>{profileData?.profile.firstName} {profileData?.profile.lastName}</p>

      <Button onClick={handleClickChatWithUser} variant="primary">Chatear con usuario</Button>
    </div>
  )
}

export default UserProfile
