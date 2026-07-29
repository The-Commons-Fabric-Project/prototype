/**
 * Source and reference project: https://tanstack.com/router/v1/docs/how-to/setup-authentication#create-authentication-context
 * 
 * ??? Tanstack's setup example uses an AuthProvider, but their kitchen sink example
 */

import React, { createContext, useContext, useState, useEffect } from 'react'

import type { AuthState, User } from './types/users'
import { auth } from './mocks/auth'

const AuthContext = createContext<AuthState | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Restore auth state on app load
  // useEffect(() => {
  //   const token = localStorage.getItem('auth-token')
  //   if (token) {
  //     // Validate token with your API
  //     fetch('/api/validate-token', {
  //       headers: { Authorization: `Bearer ${token}` },
  //     })
  //       .then((response) => response.json())
  //       .then((userData) => {
  //         if (userData.valid) {
  //           setUser(userData.user)
  //           setIsAuthenticated(true)
  //         } else {
  //           localStorage.removeItem('auth-token')
  //         }
  //       })
  //       .catch(() => {
  //         localStorage.removeItem('auth-token')
  //       })
  //       .finally(() => {
  //         setIsLoading(false)
  //       })
  //   } else {
  //     setIsLoading(false)
  //   }
  // }, [])

  // // Show loading state while checking auth
  // if (isLoading) {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen">
  //       Loading...
  //     </div>
  //   )
  // }

  const login = async (username: string, password: string) => {
    // Replace with your authentication logic
    // const response = await fetch('/api/login', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ username, password }),
    // })
    await auth.login(username, password);

    if (auth.isAuthenticated) {
      console.log("Authentication successful");
      setUser(auth.user)
      setIsAuthenticated(true)
      // Store token for persistence
      // localStorage.setItem('auth-token', userData.token)
    } else {
      throw new Error('Authentication failed')
    }
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    // localStorage.removeItem('auth-token')
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}