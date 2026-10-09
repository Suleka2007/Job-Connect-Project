
import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import api from './services/api'
import './App.css'

function Home() {
  const [jobs, setJobs] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('jobs/')
      .then((response) => {
        setJobs(response.data)
      })
      .catch(() => {
        setError('Unable to load jobs. Please try again later.')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  return (
    <div className="app">
      <nav className="navbar">
        <Link to="/" className="logo">
          Job<span>Connect</span>
        </Link>

        <div className="nav-links">
          <Link to="/">Home</Link>
          <a href="/#jobs">Find Jobs</a>
          <a href="/#about">About</a>
        </div>

        <div className="nav-buttons">
          <Link to="/login" className="login-btn">Login</Link>
          <Link to="/signup" className="signup-btn">Sign Up</Link>
        </div>
      </nav>

      <main id="home" className="hero">
        <div className="hero-content">
          <p className="tagline">YOUR CAREER STARTS HERE</p>

          <h1>
            Find Your <span>Dream Job</span>
            <br />
            Build Your Future
          </h1>

          <p className="description">
            Discover exciting opportunities, connect with employers,
            and take the next step in your career with Job Connect.
          </p>

          <div className="hero-buttons">
            <a href="#jobs" className="primary-btn">
              Explore Jobs →
            </a>
            <Link to="/login" className="secondary-btn">
              Post a Job
            </Link>
          </div>

          <div className="stats">
            <div>
              <h3>1,000+</h3>
              <p>Job Opportunities</p>
            </div>
            <div>
              <h3>500+</h3>
              <p>Companies</p>
            </div>
            <div>
              <h3>2,000+</h3>
              <p>Job Seekers</p>
            </div>
          </div>
        </div>

        <div className="hero-card">
          <div className="card-icon">💼</div>
          <h2>Your Next Opportunity Awaits</h2>
          <p>Take the first step toward a career you'll love.</p>
        </div>
      </main>

      <section id="jobs" className="jobs-section">
        <h2>Explore Available Jobs</h2>
        <p>Discover opportunities to start your career.</p>

        {loading && <p>Loading jobs...</p>}

        {error && <p role="alert">{error}</p>}

        {!loading && !error && jobs.length === 0 && (
          <p>No jobs are available right now.</p>
        )}

        {jobs.map((job) => (
          <div className="job-preview" key={job.id}>
            <div className="company-icon">💼</div>
            <div>
              <h4>{job.title}</h4>
              <p>{job.location} · {job.job_type}</p>
              <p>Salary: {job.salary || 'Not specified'}</p>
              <p>{job.description}</p>
            </div>
          </div>
        ))}
      </section>

      <section id="about" className="about-section">
        <h2>About Job Connect</h2>
        <p>
          Job Connect helps job seekers discover career opportunities
          and connect with employers.
        </p>
      </section>

      <footer>
        © 2026 Job Connect. Connecting talent with opportunity.
      </footer>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App