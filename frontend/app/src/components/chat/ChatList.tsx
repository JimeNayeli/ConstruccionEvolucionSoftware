import SpaceBetween from "@cloudscape-design/components/space-between";
import Spinner from "@cloudscape-design/components/spinner";
import { useEffect, useState } from "react";
import ChatUser from "./ChatUser";
import styles from "../../styles/ChatPage.module.scss";
import useChatUsers from "../../hooks/useFetchChatUsers";
import { useSearchParams } from "react-router-dom";
import Input from "@cloudscape-design/components/input";
import useUserDetails from "../../hooks/useUserProfile";


// TODO: Refactor, lots of useEffects which might not be needed
const ChatUsersList = (props: { setSelectedUser: React.Dispatch<React.SetStateAction<string | null>> }) => {
  const chatUsersQuery = useChatUsers();
  const [chatUsersFilter, setChatUsersFilter] = useState("");
  const [searchParams, _] = useSearchParams();
  const [startChatWithNewUser, setStartChatWithNewUser] = useState<number | null>(null);
  const { data: newChatUserData, isSuccess: isSuccessFetchNewChatUserData, refetch } = useUserDetails(startChatWithNewUser);


  useEffect(() => {
    const userId = searchParams.get('userId');
    if (userId !== null) {
      console.log('Start new chat with:', userId)
      setStartChatWithNewUser(parseInt(userId));
    }
  }, [searchParams])

  useEffect(() => {
    if (startChatWithNewUser !== null) {
      refetch()
    }
  }, [startChatWithNewUser])

  useEffect(() => {
    if (isSuccessFetchNewChatUserData) {

      props.setSelectedUser(newChatUserData!.username);
    }
  }, [isSuccessFetchNewChatUserData])

  if (chatUsersQuery.isLoading) {
    return (
      <Spinner />
    )
  }

  if (chatUsersQuery.isError) {
    return (
      <p>Error loading list of users</p>
    )
  }

  const newChatUserAlreadyExists = chatUsersQuery.data ? chatUsersQuery.data.some(user => user.id === startChatWithNewUser) : true;


  return (
    <div>
      <SpaceBetween size={"s"} direction="vertical">
        <div className={styles.chatUsers}>
          {
            chatUsersQuery.data?.filter(user => chatUsersFilter === ""
              || user.username.toLocaleLowerCase().startsWith(chatUsersFilter.toLowerCase()))
              .map(user => {
                return (<div key={user.username} className={styles.chatUserContainer} onClick={() => props.setSelectedUser(user.username)}>
                  <ChatUser userId={user.id} />
                </div>)
              })}

          {!newChatUserAlreadyExists && isSuccessFetchNewChatUserData &&
            <div key={newChatUserData!.username} className={styles.chatUserContainer} onClick={() => props.setSelectedUser(newChatUserData!.username)}>
              <ChatUser userId={newChatUserData!.id} />
            </div>
          }

        </div>
        <SearchChatUserInput setChatUsersFilter={setChatUsersFilter} />
      </SpaceBetween>
    </div>
  )
}


// TODO: Debounce if needed
const SearchChatUserInput = (props: { setChatUsersFilter: React.Dispatch<React.SetStateAction<string>> }) => {
  const [value, setValue] = useState("");

  const handleInputChange = (value: string) => {
    setValue(value)
    if (value.trim().length !== 0) {
      props.setChatUsersFilter(value)
    } else {
      props.setChatUsersFilter("")
    }
  }

  return (
    <>
      <Input placeholder="Buscar a usuario..." value={value} onChange={(e) => handleInputChange(e.detail.value)} />
    </>
  )
}

export default ChatUsersList
