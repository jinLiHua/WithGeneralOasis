
const TokenKey = 'token'

export function getToken() {
  return sessionStorage.getItem(TokenKey)
}

export function setToken(token) {
  sessionStorage.setItem(TokenKey, token)
}

export function removeToken(token) {
  return sessionStorage.removeItem(token)
}
