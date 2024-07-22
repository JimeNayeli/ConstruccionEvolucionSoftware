export const fetchCSRFCookie = async () => {
  await fetch(`${process.env.REACT_APP_API_URL}/auth/csrf`, {
    credentials: 'include'
  })
}

const getCookie = (name: string) => {
  if (!document.cookie) {
    return null
  }

  const cookies = document.cookie
    .split(";")
    .map((c) => c.trim())
    .filter((c) => c.startsWith(name + "="))

  if (cookies.length === 0) {
    return null
  }
  return decodeURIComponent(cookies[0].split("=")[1])
}

export default getCookie
