import { useEffect, useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import api from '../services/api'

function RequireAuth() {
  const location = useLocation()
  const [state, setState] = useState({ loading: true, authenticated: false, error: '' })

  useEffect(() => {
    let isCurrent = true

    api.get('/auth/me').then(() => {
      if (isCurrent) setState({ loading: false, authenticated: true, error: '' })
    }).catch((requestError) => {
      if (!isCurrent) return
      if (requestError.response?.status === 401) {
        setState({ loading: false, authenticated: false, error: '' })
      } else {
        setState({
          loading: false,
          authenticated: false,
          error: requestError.response?.data?.error || 'Unable to verify your session. Please try again.',
        })
      }
    })

    return () => { isCurrent = false }
  }, [])

  if (state.loading) {
    return <main className="auth-checking" aria-live="polite">Checking your sign-in...</main>
  }

  if (state.error) {
    return (
      <main className="auth-checking" role="alert">
        <p>{state.error}</p>
        <button className="admin-login-submit" type="button" onClick={() => window.location.reload()}>Try again</button>
      </main>
    )
  }

  return state.authenticated
    ? <Outlet />
    : <Navigate to="/login" replace state={{ from: location }} />
}

export default RequireAuth
