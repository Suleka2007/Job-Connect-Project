
import { useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'

function Signup() {
  const [role, setRole] = useState('job_seeker')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    company_name: '',
    company_location: '',
  })

  function handleChange(event) {
    const { name, value } = event.target
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setMessage('')
    setError('')
    setLoading(true)

    const data = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      role,
    }

    if (role === 'employer') {
      data.company_name = formData.company_name
      data.company_location = formData.company_location
    }

    try {
      const response = await api.post('accounts/register/', data)
      setMessage(response.data.message || 'Account created successfully!')
      setFormData({
        username: '',
        email: '',
        password: '',
        company_name: '',
        company_location: '',
      })
      setRole('job_seeker')
    } catch (err) {
      const details = err.response?.data
      if (details && typeof details === 'object') {
        setError(
          Object.entries(details)
            .map(([field, value]) =>
              `${field}: ${Array.isArray(value) ? value.join(', ') : typeof value === 'string' ? value : JSON.stringify(value)}`
            )
            .join(' | ')
        )
      } else {
        setError('Could not connect to the server. Check that Django is running.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Create an Account</h1>
        <p>Join Job Connect and take the next step in your career.</p>

        {message && <p role="status">{message}</p>}
        {error && <p role="alert">{error}</p>}

        <form onSubmit={handleSubmit}>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            placeholder="Choose a username"
            value={formData.username}
            onChange={handleChange}
            required
          />

          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            placeholder="Create a password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <label htmlFor="role">Register as</label>
          <select
            id="role"
            name="role"
            value={role}
            onChange={(event) => setRole(event.target.value)}
            required
          >
            <option value="job_seeker">Job Seeker</option>
            <option value="employer">Employer</option>
          </select>

          {role === 'employer' && (
            <>
              <label htmlFor="company_name">Company Name</label>
              <input
                id="company_name"
                name="company_name"
                type="text"
                placeholder="Enter company name"
                value={formData.company_name}
                onChange={handleChange}
                required
              />

              <label htmlFor="company_location">Company Location</label>
              <input
                id="company_location"
                name="company_location"
                type="text"
                placeholder="Enter company location"
                value={formData.company_location}
                onChange={handleChange}
                required
              />
            </>
          )}

          <button type="submit" className="primary-btn" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>

        <Link to="/" className="back-home">
          ← Back to Home
        </Link>
      </div>
    </div>
  )
}

export default Signup