import { SpaceBetween } from '@cloudscape-design/components';
import Button from '@cloudscape-design/components/button';
import Input from '@cloudscape-design/components/input';
import { noop } from 'lodash';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import { KeyCodes } from '../../constants/keyCodes';
import fetchChatHistory from '../../hooks/useChatHistory';
import styles from "../../styles/Chat.module.scss";

const Chat = (props: {
  userName: string, messages: Array<ChatMessageResponse>, publishMessage: (message: { destinationUserName: string; body: string }) => void,
}) => {
  const [message, setMessage] = useState("");
  const [chatHistoryPageNumber, setChatHistoryPageNumber] = useState(0);
  const bottomDiv = useRef<null | HTMLDivElement>(null)
  const [chatHistory, setChatHistory] = useState<Array<ChatMessageResponse>>([]);
  const [noPreviousHistory, setNoPreviousHistory] = useState(false);
  const [isErrorFetchingHistory, setIsErrorFetchingHistory] = useState(false);


  useEffect(() => {
    fetchChatHistory(props.userName, chatHistoryPageNumber).then(
      (chatHistory) => {
        if (chatHistory.length === 0) {
          setNoPreviousHistory(true)
        } else {
          setChatHistory((previousChatHistory) => {
            const newChatHistory = chatHistory.concat([...previousChatHistory]).sort((chatMessageOne, chatMessageTwo) => {
              return chatMessageTwo.sentAt > chatMessageOne.sentAt ? -1 : 1
            })
            return newChatHistory
          })
        }
      }
    ).catch((e) => {
      console.error(e);
      setIsErrorFetchingHistory(true);
    })
  }, [chatHistoryPageNumber])


  /**
   * TODO: Not ideal, but will work for now
   */
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      bottomDiv.current?.scrollIntoView(
        {
          behavior: 'smooth',
          block: 'end',
          inline: 'nearest'
        })
    }, 500)
  }, [props.messages])


  const handleClick = () => {
    if (message.length === 0) {
      return;
    }
    props.publishMessage({
      destinationUserName: props.userName,
      body: message
    })
    setMessage("")
  }

  const handleClickLoadPreviousMessages = () => {
    setChatHistoryPageNumber(chatHistoryPageNumber + 1)
  }

  const getPreviousHistory = () => {
    if (isErrorFetchingHistory) {
      return "Previous chat history can't be fetched"
    }
    if (noPreviousHistory) {
      return <p className={styles.loadMessage}>Fin del historial de chat anterior</p>
    }
    if (chatHistory.length === 0) {
      return "Loading previous chat history..."
    }
    return (
      <p className={`${styles.historyLoadMessage} ${styles.loadMessage}`} onClick={() => handleClickLoadPreviousMessages()}>Cargar mensajes anteriores</p>
    )
  }

  const messages = props.messages ? props.messages.map(message => <Message key={`${message.userName}:${message.sentAt}`} {...message} highlight={message.userName !== props.userName} />) : "No new messages";
  const historicalMessages = chatHistory.length !== 0 ? chatHistory.map(message => <Message key={`${message.userName}:${message.sentAt}`} {...message} highlight={message.userName !== props.userName} />) : "";

  return (
    <div>
      <SpaceBetween size={'s'} direction="vertical">

        <div className={styles.chatbox}>
          <div>
            {getPreviousHistory()}
            {historicalMessages}
          </div>
          <hr />
          {messages}
          <div
            ref={bottomDiv}>
          </div>
        </div>


        <div style={{
          display: 'flex',
          gap: "1rem"
        }}>
          <div style={{ width: "70%" }}>
            <Input onKeyDown={(e) => e.detail.keyCode === KeyCodes.ENTER_KEY ? handleClick() : noop} placeholder='Type something...' value={message} onChange={(e) => setMessage(e.detail.value)} />
          </div>
          <Button onClick={() => handleClick()}>Enviar</Button>
        </div>
      </SpaceBetween>
    </div>
  )
}


const Message = (props: ChatMessageResponse & { highlight: boolean }) => {

  const sentAt = moment(props.sentAt)


  return (
    <div className={props.highlight ? styles.messageContainer : ""}>
      <div className={props.highlight ? styles.messageHighlight : styles.message}>
        <div className={styles.messageHeader}>
          <span>
            {
              sentAt.isSame(moment(), 'day') ?
                sentAt.format('HH:mm:ss') : sentAt.format('MMMM Do, HH:mm:ss')
            }
          </span>
          <span className={props.highlight ? styles.messageUserNameHighlight : styles.messageUserName}>
            {props.userName}
          </span>
        </div>
        <span className={styles.messageContent}>
          {props.message}
        </span>
      </div>
    </div>
  )
}

export default Chat
