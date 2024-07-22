import { Button, FormField, Input, SpaceBetween } from "@cloudscape-design/components";
import Form from "@cloudscape-design/components/form";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthenticatedContext, FlashbarContext } from "../App";
import { FlashbarNotificationId } from "../constants/notifications";
import { FlashBarNotificationActionType } from "../reducers/flashBarNotificationReducer";
import fetchWrapper from "../utils/fetchWrapper";
import styles from "../styles/Login.module.scss";

const fetchLogin = async (username: string, password: string) => {
  const formData = new FormData();
  formData.set("username", username);
  formData.set("password", password);

  const response = await fetchWrapper(`${process.env.REACT_APP_API_URL}/auth/login`, {
    method: "POST",
    body: formData,
  })

  if (!response.ok) {
    throw Error("Could not login")
  }
}

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { userIsLoggedIn, setUserIsLoggedIn } = useContext(AuthenticatedContext);
  const { dispatchFlashBarNotifications } = useContext(FlashbarContext);

  const handleClickSubmit = async () => {
    try {
      await fetchLogin(username, password);
      navigate('/');
      setUserIsLoggedIn(true)
    } catch (e) {
      console.error(e);
      dispatchFlashBarNotifications({
        type: FlashBarNotificationActionType.ADD,
        notification: {
          header: "Error logging in!",
          content: "Asegúrese de que el nombre de usuario y la contraseña estén ingresados correctamente.",
          id: FlashbarNotificationId.LOGIN_ERROR_NOTIFICATION,
          type: "error",
          onDismiss: () => dispatchFlashBarNotifications({
            type: FlashBarNotificationActionType.REMOVE,
            notification: {
              id: FlashbarNotificationId.LOGIN_ERROR_NOTIFICATION
            }
          })
        }
      })
    }
  }

  if (userIsLoggedIn) {
    return <>
      Ya has iniciado sesión
    </>
  }

  return (
    <div className={styles.bodyContainer}>
      <div className={styles.formContainer}>
        <h1>Login</h1>
        <div className={styles.formField}>
          <label>Username</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className={styles.formField}>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className={styles.formButton} onClick={handleClickSubmit}>
          Iniciar Sesion
        </button>
      </div>
    </div>
  );
}

export default Login;
