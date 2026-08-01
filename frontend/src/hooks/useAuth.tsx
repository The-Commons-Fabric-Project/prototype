/**
 * Source and reference project: https://tanstack.com/router/v1/docs/how-to/setup-authentication#create-authentication-context
 * 
 * ??? Tanstack's setup example uses an AuthProvider, but their kitchen sink example doesn't? 
 * ??? Where should this file go? hooks?
 * 
 * ??? Will we eventually use an authentication library like better auth?
 */

import React, { createContext, useContext, useState, useEffect } from 'react'

import type { AuthState, User } from '../types/users'
// TODO: replace mock auth with real auth
import { auth } from '../mocks/auth'

const AuthContext = createContext<AuthState | undefined>(undefined)

type AuthAttemptStatus = 'unsent' | 'pending' | 'success' | 'fail';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [status, setStatus] = useState<AuthAttemptStatus>('unsent');
  // const [isLoading, setIsLoading] = useState(true)

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
    setStatus('pending');
    await auth.login(username, password);

    if (auth.isAuthenticated) {
      setStatus('success');
      setUser(auth.user);
      setIsAuthenticated(true);
      console.log("Authentication successful");

      // Store token for persistence
      // localStorage.setItem('auth-token', userData.token)
    } else {
      setStatus('fail');
      throw new Error('Authentication failed')
    }
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    setStatus('unsent');
    // TODO: add any additional logout logic
    // localStorage.removeItem('auth-token')
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, status, user, login, logout }}>
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