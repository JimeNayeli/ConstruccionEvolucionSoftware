import getCookie, { fetchCSRFCookie } from "./cookieUtils"

const CSRF_COOKIE_NAME = "XSRF-TOKEN"

/**
 * Fetch wrapper to handle CSRF cookie
 * @param input input
 * @param init init
 * @returns Promise
 
  NOTE: GET requests do not need CSRF Token, so use only with unsafe methods which have side-effects
 */
async function fetchWrapper(
  input: RequestInfo | URL,
  init?: RequestInit | undefined
): Promise<Response> {
  if (getCookie(CSRF_COOKIE_NAME) === null) {
    await fetchCSRFCookie()
  }

  const csrfToken = getCookie(CSRF_COOKIE_NAME) as string
  const customHeaders = {
    "X-XSRF-TOKEN": csrfToken,
  }

  if (init === undefined) {
    return fetch(input, { headers: customHeaders, credentials: 'include' })
  }

  if (init.headers) {
    const headers = {
      ...init.headers,
      ...customHeaders,
    }
    return fetch(input, {
      ...init,
      headers: headers,
      credentials: 'include'
    })
  }

  return fetch(input, {
    ...init,
    headers: customHeaders,
    credentials: 'include'
  })
}

export default fetchWrapper
