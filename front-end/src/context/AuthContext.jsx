import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { currentUserApi, loginApi, logoutApi, registerApi } from '../lib/api.js'

const TOKEN_KEY = 'auth_token'

function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY) ?? sessionStorage.getItem(TOKEN_KEY)
}

function persistToken(token, remember) {
  if (remember) {
    localStorage.setItem(TOKEN_KEY, token)
    sessionStorage.removeItem(TOKEN_KEY)
    return
  }

  sessionStorage.setItem(TOKEN_KEY, token)
  localStorage.removeItem(TOKEN_KEY)
}

function clearStoredToken() {
  localStorage.removeItem(TOKEN_KEY)
  sessionStorage.removeItem(TOKEN_KEY)
}

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(getStoredToken)
  const [isLoadingAuth, setIsLoadingAuth] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function loadUser() {
      if (!token) {
        if (isMounted) {
          setUser(null)
          setIsLoadingAuth(false)
        }
        return
      }

      try {
        const data = await currentUserApi(token)
        if (isMounted) {
          setUser(data.user)
        }
      } catch {
        clearStoredToken()
        if (isMounted) {
          setToken(null)
          setUser(null)
        }
      } finally {
        if (isMounted) {
          setIsLoadingAuth(false)
        }
      }
    }

    loadUser()

    return () => {
      isMounted = false
    }
  }, [token])

  const login = useCallback(async (credentials) => {
    const response = await loginApi(credentials)
    persistToken(response.token, Boolean(credentials.remember))
    setToken(response.token)
    setUser(response.user)
    return response
  }, [])

  const register = useCallback(async (payload) => {
    const response = await registerApi(payload)
    persistToken(response.token, true)
    setToken(response.token)
    setUser(response.user)
    return response
  }, [])

  const logout = useCallback(async () => {
    if (token) {
      try {
        await logoutApi(token)
      } catch {
        // Ignore logout errors and clear local auth state anyway.
      }
    }

    clearStoredToken()
    setToken(null)
    setUser(null)
  }, [token])

  const value = useMemo(
    () => ({
      user,
      token,
      isLoadingAuth,
      isAuthenticated: Boolean(user && token),
      login,
      register,
      logout,
    }),
    [user, token, isLoadingAuth, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider.')
  }

  return context
}
