import { Button, Form, FormField, Input, SpaceBetween } from "@cloudscape-design/components";
import { forOwn } from "lodash";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { AlertContext } from "../App";
import useRegister from "../hooks/useRegister";
import styles from "../styles/Register.module.scss";
const registerRequestSchema = z.object({
  userName: z.string().min(5).max(20),
  password: z.string().min(5).max(20),
  firstName: z.string().min(2).max(15),
  lastName: z.string().min(2).max(15),
})

const errorMessages: { [key: string]: string } = {
  "String must contain at least 5 character(s)": "La cadena debe contener al menos 5 caracteres",
  "String must contain at most 20 character(s)": "La cadena debe contener como máximo 20 caracteres",
  "String must contain at least 2 character(s)": "La cadena debe contener al menos 2 caracteres",
  "String must contain at most 15 character(s)": "La cadena debe contener como máximo 15 caracteres",
  // Añade más traducciones según sea necesario
};

const translateErrorMessage = (message: string): string => {
  return errorMessages[message] || message;
};

const Register = () => {
  const [userInfo, setUserInfo] = useState({
    userName: "",
    password: "",
    firstName: "",
    lastName: "",
  })
  const [userInfoErrors, setUserInfoErrors] = useState({
    userName: "",
    password: "",
    firstName: "",
    lastName: "",
  })
  const navigate = useNavigate();
  const { setAlertNotification } = useContext(AlertContext);

  const handleMutationSuccess = () => {
    setAlertNotification({
      type: "success",
      header: "Registro exitoso",
      content: "Registrado exitosamente. ¡Bienvenido!",
      isVisible: true,
    })
    navigate("/")
  }

  const registerMutation = useRegister({ handleMutationSuccess: handleMutationSuccess });

  const handleClickSubmit = () => {
    const registerRequestValidation = registerRequestSchema.safeParse(userInfo);

    if (registerRequestValidation.success) {
      registerMutation.mutate({
        ...userInfo
      });
    } else {
      const errors = registerRequestValidation.error.flatten();
      const fieldErrors = errors.fieldErrors;

      forOwn(fieldErrors, (value, key) => {
        setUserInfoErrors((prevErrors) => {
          return {
            ...prevErrors,
            [key]: value ? value.map(translateErrorMessage) : [],
          };
        });
      });
    }
  }

 return (
  <div className={styles.bodyContainer}>
      <div className={styles.formContainer}>
      <Form header={
        <h1>
          Registrar
        </h1>
      }>
        <SpaceBetween size={"s"} direction="vertical">


          <div >
            <FormField className={styles.formField} label="Nombre" errorText={userInfoErrors.firstName}>
              <Input value={userInfo.firstName} onChange={(e) => {
                setUserInfoErrors(userInfoErrors => {
                  return {
                    ...userInfoErrors,
                    firstName: ""
                  }
                })
                setUserInfo(loginInfo => {
                  return {
                    ...loginInfo,
                    firstName: e.detail.value,
                  }
                })
              }} />
            </FormField>

            <FormField className={styles.formField} label="Apellido" errorText={userInfoErrors.lastName}>
              <Input  value={userInfo.lastName} onChange={(e) => {
                setUserInfoErrors(userInfoErrors => {
                  return {
                    ...userInfoErrors,
                    lastName: ""
                  }
                })
                setUserInfo(loginInfo => {
                  return {
                    ...loginInfo,
                    lastName: e.detail.value,
                  }
                })
              }} />
            </FormField>
          </div>

          <FormField className={styles.formField} label="Username" errorText={userInfoErrors.userName}>
            <Input value={userInfo.userName} onChange={(e) => {
              setUserInfoErrors(userInfoErrors => {
                return {
                  ...userInfoErrors,
                  userName: ""
                }
              })
              setUserInfo(loginInfo => {
                return {
                  ...loginInfo,
                  userName: e.detail.value,
                }
              })
            }} />
          </FormField>
          <FormField className={styles.formField} label="Password" errorText={userInfoErrors.password}>
            <Input type="password" value={userInfo.password} onChange={(e) => {
              setUserInfoErrors(userInfoErrors => {
                return {
                  ...userInfoErrors,
                  password: ""
                }
              })
              setUserInfo(loginInfo => {
                return {
                  ...loginInfo,
                  password: e.detail.value
                }
              })
            }} />
          </FormField>


          <button className={styles.formButton} onClick={handleClickSubmit} >Registrar</button>
        </SpaceBetween>
      </Form>
    </div>
  </div>
  )
}


export default Register;
