/**
 * Session state, backed by the real API.
 *
 * Reference: https://tanstack.com/router/v1/docs/how-to/setup-authentication#create-authentication-context
 *
 * No token and nothing in localStorage - the session is an httpOnly cookie that
 * JavaScript cannot read, so the mount effect asks the server instead.
 */

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'

import type { AuthAttemptStatus, AuthState, User } from '../api/auth'
import * as authApi from '../api/auth'
import { ApiError } from '../api/client'

const AuthContext = createContext<AuthState | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [status, setStatus] = useState<AuthAttemptStatus>('unsent')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    authApi
      .getProfile()
      .then((profile) => {
        if (!cancelled) setUser(profile)
      })
      .catch((err: unknown) => {
        if (cancelled) return
        setUser(null)
        if (!(err instanceof ApiError) || !err.isUnauthorized) {
          console.error('[auth] could not restore session:', err)
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    // StrictMode mounts effects twice; keeps the discarded run from writing state.
    return () => {
      cancelled = true
    }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    setStatus('pending')
    setError('')
    try {
      const profile = await authApi.login(email, password)
      setUser(profile)
      setStatus('success')
    } catch (err: unknown) {
      setUser(null)
      setStatus('fail')
      setError(err instanceof ApiError ? err.detail : 'Could not reach the server.')
      throw err
    }
  }, [])

  const logout = useCallback(async () => {
    // Cleared locally first and regardless of the server, so the button signs you
    // out of this tab even if the request fails.
    setUser(null)
    setStatus('unsent')
    setError('')
    try {
      await authApi.logout()
    } catch (err: unknown) {
      console.error('[auth] logout request failed; local session cleared anyway:', err)
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{ isAuthenticated: user !== null, isLoading, status, error, user, login, logout }}
    >
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
