import React, { useEffect, useState } from "react"
import useMyProfile from "../../hooks/useProfile"
import {
  Button,
  Container,
  Form,
  FormField,
  Grid,
  Input,
  SpaceBetween,
  Spinner,
  Textarea,
} from "@cloudscape-design/components"
import style from "../../styles/Profile.module.scss"
import Avatar from "react-avatar-edit"
import useUpdateProfile from "../../hooks/useUpdateProfile"
import { dataUrlToFile } from "../../utils/fileUtils"

const IMAGE_NAME = "profile-picture"

const MyProfile = () => {
  const { data: profile, isLoading, isError, isSuccess } = useMyProfile()
  const [profileInfo, setProfileInfo] = useState<Profile | null>(null)
  const [imageSource, setImageSource] = useState<null | string>(null)
  const updateProfileMutation = useUpdateProfile()

  useEffect(() => {
    if (isSuccess) {
      setProfileInfo(profile)
    }
  }, [isSuccess])

  const handleInputChange = (filterId: string, value: any) => {
    setProfileInfo((prevProfileInfo) => {
      return {
        ...prevProfileInfo,
        [filterId]: value,
      } as Profile
    })
    // TODO: zod validation
  }

  const handleClickSubmit = async () => {
    console.log(profileInfo)
    let imageFile: File | null = null
    if (imageSource !== null) {
      imageFile = await dataUrlToFile(imageSource, IMAGE_NAME)
    }
    updateProfileMutation.mutate({
      image: imageFile ?? undefined,
      firstName: profileInfo?.firstName,
      lastName: profileInfo?.lastName,
      description: profileInfo?.description ?? undefined,
    })
  }

  if (isLoading || profileInfo == null) {
    return <Spinner />
  }

  if (isError) {
    return <p>Error loading profile</p>
  }

  return (
    <Container>
      <Grid
        gridDefinition={[
          { colspan: { m: 4, default: 12 } },
          { colspan: { m: 8, default: 12 } },
        ]}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <h4>Foto de perfil</h4>

          <div style={{ margin: "1rem" }}>
            <img
              height={"250px"}
              src={imageSource ?? profile?.profilePictureURL ?? ""}
              alt={"Preview"}
            />
          </div>

          <Avatar
            width={250}
            height={250}
            exportAsSquare
            onCrop={(preview) => {
              setImageSource(preview)
            }}
            onClose={() => {
              setImageSource(null)
            }}
          />
        </div>

        <Form header={<h2>Mi Perfil</h2>}>
          <SpaceBetween size={"m"} direction="vertical">
            <div className={style.nameContainer}>
              <FormField label="Nombre">
                <Input
                  value={profileInfo!.firstName}
                  onChange={(e) =>
                    handleInputChange("firstName", e.detail.value)
                  }
                />
              </FormField>
              <FormField label="Apellido">
                <Input
                  value={profileInfo!.lastName}
                  onChange={(e) =>
                    handleInputChange("lastName", e.detail.value)
                  }
                />
              </FormField>
            </div>
            <FormField label="Descripcion">
              <Textarea
                placeholder="I am..."
                value={profileInfo!.description || ""}
                onChange={(e) =>
                  handleInputChange("description", e.detail.value)
                }
              />
            </FormField>

            <Button onClick={handleClickSubmit}>Guardar</Button>
          </SpaceBetween>
        </Form>
      </Grid>
    </Container>
  )
}

export default MyProfile
