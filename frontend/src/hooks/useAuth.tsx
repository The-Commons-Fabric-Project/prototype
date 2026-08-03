/**
 * Session state, backed by the real API.
 *
 * Source and reference project: https://tanstack.com/router/v1/docs/how-to/setup-authentication#create-authentication-context
 *
 * There is no token here and nothing in localStorage. The session is an httpOnly
 * cookie, which JavaScript cannot read by design - that is what stops an XSS bug
 * from walking off with a session. The consequence is that the only way to learn
 * whether we are signed in is to ask the server, which is what the mount effect
 * below does.
 */

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'

import type { AuthAttemptStatus, AuthState, User } from '../utils/types/users'
import * as authApi from '../api/auth'
import { ApiError } from '../api/client'

const AuthContext = createContext<AuthState | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [status, setStatus] = useState<AuthAttemptStatus>('unsent')
  const [error, setError] = useState('')
  // Starts true: on first paint we genuinely do not know yet, and claiming
  // "signed out" before asking is what causes the refresh flicker.
  const [isLoading, setIsLoading] = useState(true)

  // Restore the session on load. A 401 is the expected answer for a visitor who
  // is not signed in, so it clears state rather than surfacing an error; anything
  // else is a real failure and worth a console entry, but still leaves the app
  // usable signed-out.
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

    // StrictMode mounts effects twice in development; the flag keeps the first,
    // discarded run from writing state after unmount.
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
      // ApiError.detail is written by the API to be read by a person, so a bad
      // password says so instead of showing a generic failure.
      setError(err instanceof ApiError ? err.detail : 'Could not reach the server.')
      throw err
    }
  }, [])

  const logout = useCallback(async () => {
    // Clear locally first, and regardless of what the server says: the button
    // must sign you out of this tab even if the request fails. The cookie is
    // cleared server-side, and /auth/logout succeeds even without a session.
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
