import { useState } from 'react'
import { Compass, LockKeyhole } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import api from '../services/api'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

function AuthPage({ mode }) {
  const isSignup = mode === 'signup'
  useDocumentTitle(
    isSignup ? 'Create Account' : 'Sign In',
    isSignup ? 'Create a YatraHub account.' : 'Sign in to YatraHub.',
    'noindex,nofollow',
  )
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const endpoint = isSignup ? '/auth/register' : '/auth/login'
      const payload = isSignup ? { name, email, password } : { email, password }
      await api.post(endpoint, payload)
      const target = location.state?.from?.pathname
      navigate(target && target !== '/admin' ? target : '/', { replace: true })
    } catch (requestError) {
      if (requestError.response?.data?.error) {
        setError(requestError.response.data.error)
      } else if (requestError.request) {
        setError('Cannot reach the server. Please try again in a moment.')
      } else {
        setError('Unable to start sign in. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="admin-login-page">
      <header className="admin-login-header">
        <Link className="brand" to="/">
          <span className="brand-mark"><Compass size={20} /></span>
          <span>YatraHub</span>
        </Link>
        <span className="admin-access-label"><LockKeyhole size={14} /> Secure account</span>
      </header>

      <section className="admin-login-content" aria-labelledby="auth-title">
        <div className="admin-login-copy">
          <p className="eyebrow">YatraHub / Your account</p>
          <h1 id="auth-title">{isSignup ? 'Your next journey starts here.' : 'Welcome back.'}</h1>
          <p>{isSignup ? 'Create an account to explore thoughtful journeys.' : 'Sign in to continue exploring.'}</p>
        </div>

        <div className="admin-login-panel">
          <form className="admin-login-form" onSubmit={handleSubmit}>
            <h2>{isSignup ? 'Create account' : 'Sign in'}</h2>
            {error && <p className="admin-login-error" role="alert">{error}</p>}
            {isSignup && (
              <label htmlFor="account-name">Name
                <input id="account-name" type="text" value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" maxLength={100} required />
              </label>
            )}
            <label htmlFor="account-email">Email address
              <input id="account-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required />
            </label>
            <label htmlFor="account-password">Password
              <input id="account-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete={isSignup ? 'new-password' : 'current-password'} minLength={8} required />
            </label>
            <button className="admin-login-submit" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Please wait...' : isSignup ? 'Create account' : 'Sign in'}
            </button>
            <p className="auth-switch">
              {isSignup ? 'Already have an account?' : 'New to YatraHub?'}{' '}
              <Link to={isSignup ? '/login' : '/signup'}>{isSignup ? 'Sign in' : 'Create an account'}</Link>
            </p>
          </form>
        </div>
      </section>
      <footer className="admin-login-footer"><span>Thoughtful journeys, thoughtfully made.</span><Link to="/admin/login">Admin sign in</Link></footer>
    </main>
  )
}

export default AuthPage
