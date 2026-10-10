
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../services/api'

function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setMessage('')
    setLoading(true)

    try {
      const response = await api.post('accounts/login/', {
        username,
        password,
      })

    if (response.data.token) {
  localStorage.setItem('token', response.data.token)
  localStorage.setItem('role', response.data.role)
  localStorage.setItem('username', response.data.username)
  window.dispatchEvent(new Event('auth-changed'))
}
navigate('/')
    } catch (error) {
      if (error.response) {
        setMessage(
          error.response.data.detail ||
          error.response.data.error ||
          'Invalid username or password.'
        )
      } else {
        setMessage('Could not connect to the server. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Welcome Back!</h1>
        <p>Log in to your Job Connect account.</p>

        <form onSubmit={handleLogin}>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {message && <p role="alert">{message}</p>}

          <button
            type="submit"
            className="primary-btn"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>

        <Link to="/" className="back-home">
          Back to Home
        </Link>
      </div>
    </div>
  )
}

export default Login

