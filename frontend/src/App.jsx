
import { useEffect, useState } from 'react'
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
  useParams,
} from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import api from './services/api'
import './App.css'

function Home() {
  const [jobs, setJobs] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(
    Boolean(localStorage.getItem('token'))
  )

  useEffect(() => {
    const updateLoginStatus = () => {
      setIsLoggedIn(Boolean(localStorage.getItem('token')))
    }

    window.addEventListener('auth-changed', updateLoginStatus)
    window.addEventListener('storage', updateLoginStatus)

    return () => {
      window.removeEventListener('auth-changed', updateLoginStatus)
      window.removeEventListener('storage', updateLoginStatus)
    }
  }, [])

  useEffect(() => {
    api.get('jobs/')
      .then((response) => {
        const data = response.data
        setJobs(Array.isArray(data) ? data : data.results || [])
      })
      .catch(() => setError('Unable to load jobs. Please try again later.'))
      .finally(() => setLoading(false))
  }, [])

  const logout = () => {
    localStorage.removeItem('token')
    window.dispatchEvent(new Event('auth-changed'))
    window.location.href = '/login'
  }

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
          {isLoggedIn ? (
            <>
              <Link to="/dashboard" className="login-btn">
                Dashboard
              </Link>
              <button type="button" className="signup-btn" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="login-btn">Login</Link>
              <Link to="/signup" className="signup-btn">Sign Up</Link>
            </>
          )}
        </div>
      </nav>

      <main id="home" className="hero">
        <div className="hero-content">
          <p className="hero-label">YOUR CAREER STARTS HERE</p>

          <h1>
            Find Your <span>Dream Job</span>
            <br />
            Build Your Future
          </h1>

          <p className="hero-description">
            Discover opportunities, connect with employers, and take
            the next step in your career with Job Connect.
          </p>

          <div className="hero-buttons">
            <a href="#jobs" className="primary-btn">Explore Jobs →</a>
            <Link
              to={isLoggedIn ? '/dashboard' : '/login'}
              className="secondary-btn"
            >
              Post a Job
            </Link>
          </div>

          <div className="hero-stats">
            <div><h3>{jobs.length}+</h3><p>Listed Jobs</p></div>
            <div><h3>Easy</h3><p>Job Search</p></div>
            <div><h3>Free</h3><p>To Explore</p></div>
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

        <div
          className="jobs-list"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
            gap: '24px',
            alignItems: 'stretch',
          }}
        >
          {jobs.map((job) => (
            <article
              className="job-preview"
              key={job.id}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '16px',
                padding: '24px',
                minWidth: 0,
                boxSizing: 'border-box',
                height: '100%',
              }}
            >
              <div className="company-icon" style={{ flexShrink: 0 }}>
                💼
              </div>

              <div
                className="job-info"
                style={{
                  flex: 1,
                  minWidth: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                }}
              >
                <h3 style={{ overflowWrap: 'anywhere', marginTop: 0 }}>
                  {job.title}
                </h3>

                <p>
                  {job.location || 'Location not specified'}
                  {' · '}
                  {job.job_type || 'Job type not specified'}
                </p>

                <p>Salary: {job.salary || 'Not specified'}</p>

                <p
                  style={{
                    overflowWrap: 'anywhere',
                    lineHeight: 1.6,
                    marginBottom: '20px',
                  }}
                >
                  {job.description || 'No description provided.'}
                </p>

                <Link
                  to={`/jobs/${job.id}`}
                  className="primary-btn"
                  style={{
                    display: 'inline-block',
                    marginTop: 'auto',
                    maxWidth: '100%',
                    boxSizing: 'border-box',
                    textAlign: 'center',
                    textDecoration: 'none',
                    whiteSpace: 'normal',
                  }}
                >
                  View Details
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="about" className="about-section">
        <h2>About Job Connect</h2>
        <p>
          Job Connect helps job seekers discover career opportunities
          and connect with employers through a simple job portal.
        </p>
      </section>

      <footer>© 2026 Job Connect. Connecting talent with opportunity.</footer>
    </div>
  )
}


function JobDetails() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [coverLetter, setCoverLetter] = useState('')
  const [resume, setResume] = useState(null)
  const [applying, setApplying] = useState(false)
  const [applyMessage, setApplyMessage] = useState('')
  const [applyError, setApplyError] = useState('')

  useEffect(() => {
    api.get(`jobs/${id}/`)
      .then((response) => setJob(response.data))
      .catch(() => {
        setError('Unable to load this job. It may no longer be available.')
      })
      .finally(() => setLoading(false))
  }, [id])

  async function handleApply(event) {
    event.preventDefault()
    setApplyMessage('')
    setApplyError('')

    if (!localStorage.getItem('token')) {
      navigate('/login')
      return
    }

    if (!job?.is_active) {
      setApplyError('This job is not currently accepting applications.')
      return
    }

    const formData = new FormData()
    formData.append('job', id)
    formData.append('cover_letter', coverLetter)

    if (resume) {
      formData.append('resume', resume)
    }

    setApplying(true)

    try {
      await api.post('applications/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      setApplyMessage('Your application was submitted successfully!')
      setCoverLetter('')
      setResume(null)

      const fileInput = document.getElementById('application-resume')
      if (fileInput) fileInput.value = ''
    } catch (err) {
      const data = err.response?.data

      if (err.response?.status === 401) {
        setApplyError('Your login session may have expired. Please log in again.')
      } else if (err.response?.status === 403) {
        setApplyError(
          data?.detail || 'Only job seekers can apply for jobs.'
        )
      } else if (data && typeof data === 'object') {
        const details = Object.entries(data)
          .map(([field, value]) =>
            `${field}: ${Array.isArray(value) ? value.join(', ') : value}`
          )
          .join(' ')
        setApplyError(details || 'Unable to submit your application.')
      } else {
        setApplyError('Unable to submit your application. Please try again.')
      }
    } finally {
      setApplying(false)
    }
  }

  const fieldStyle = {
    width: '100%',
    padding: '11px 12px',
    marginTop: '6px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    boxSizing: 'border-box',
    font: 'inherit',
  }

  const labelStyle = {
    display: 'block',
    marginBottom: '16px',
    fontWeight: 600,
    color: '#374151',
  }

  return (
    <main
      style={{
        maxWidth: '850px',
        margin: '0 auto',
        padding: '32px 20px',
        color: '#1f2937',
      }}
    >
      <Link to="/" className="secondary-btn">
        Back to Jobs
      </Link>

      {loading && <p>Loading job details...</p>}
      {error && <p role="alert">{error}</p>}

      {!loading && !error && job && (
        <>
          <article
            style={{
              marginTop: '24px',
              padding: '28px',
              background: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '14px',
              overflowWrap: 'anywhere',
              boxSizing: 'border-box',
            }}
          >
            <h1>{job.title}</h1>

            <p style={{ color: '#6b7280' }}>
              {job.location} · {job.job_type}
            </p>

            <h3>Salary</h3>
            <p>{job.salary || 'Not specified'}</p>

            <h3>Job Description</h3>
            <p style={{ lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
              {job.description || 'No description provided.'}
            </p>

            <h3>Requirements</h3>
            <p style={{ lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
              {job.requirements || 'No requirements specified.'}
            </p>

            <p>Status: {job.is_active ? 'Active' : 'Inactive'}</p>
          </article>

          {job.is_active && (
            <section
              style={{
                marginTop: '24px',
                padding: '28px',
                background: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '14px',
                boxSizing: 'border-box',
              }}
            >
              <h2 style={{ marginTop: 0 }}>Apply for this Job</h2>
              <p>Submit your application and optionally attach your resume.</p>

              {applyMessage && (
                <p role="status" style={{ color: '#047857' }}>
                  {applyMessage}
                </p>
              )}

              {applyError && (
                <p role="alert" style={{ color: '#b91c1c' }}>
                  {applyError}
                </p>
              )}

              <form onSubmit={handleApply}>
                <label style={labelStyle}>
                  Cover Letter (optional)
                  <textarea
                    style={{ ...fieldStyle, minHeight: '120px' }}
                    value={coverLetter}
                    onChange={(event) => setCoverLetter(event.target.value)}
                    placeholder="Explain why you are suitable for this job..."
                  />
                </label>

                <label style={labelStyle}>
                  Resume (optional)
                  <input
                    id="application-resume"
                    style={fieldStyle}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(event) =>
                      setResume(event.target.files?.[0] || null)
                    }
                  />
                </label>

                <button
                  type="submit"
                  className="primary-btn"
                  disabled={applying}
                >
                  {applying ? 'Submitting...' : 'Apply Now'}
                </button>

                {!localStorage.getItem('token') && (
                  <p>
                    Please <Link to="/login">log in</Link> as a job seeker to apply.
                  </p>
                )}
              </form>
            </section>
          )}

          {!job.is_active && (
            <p>This job is inactive and is not accepting applications.</p>
          )}
        </>
      )}
    </main>
  )
}
const emptyForm = {
  title: '',
  description: '',
  requirements: '',
  location: '',
  salary: '',
  job_type: 'Full-time',
  is_active: true,
}

function Dashboard() {
  const navigate = useNavigate()
  const [jobs, setJobs] = useState([])
  const [applications, setApplications] = useState([])
  const [applicationsLoading, setApplicationsLoading] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login')
      return
    }

    loadJobs()
    loadApplications()
  }, [navigate])

  async function loadJobs() {
    setLoading(true)
    setError('')

    try {
      const response = await api.get('jobs/?mine=true')
      const data = response.data
      setJobs(Array.isArray(data) ? data : data.results || [])
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        setError(
          err.response.data?.detail ||
          'You need a valid employer account to manage job listings.'
        )
      } else {
        setError('Could not load your jobs. Check that the backend is running.')
      }
    } finally {
      setLoading(false)
    }
  }
  
  async function loadApplications() {
    setApplicationsLoading(true)

    try {
      const response = await api.get('applications/employer/')
      const data = response.data
      setApplications(Array.isArray(data) ? data : data.results || [])
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        'Could not load applications. Please check your employer login.'
      )
    } finally {
      setApplicationsLoading(false)
    }
  }
  
  async function updateApplicationStatus(applicationId, status) {
    try {
      await api.patch(
        `applications/employer/${applicationId}/status/`,
        { status }
      )

      setApplications((previous) =>
        previous.map((application) =>
          application.id === applicationId
            ? { ...application, status }
            : application
        )
      )

      setMessage('Application status updated.')
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        'Could not update application status.'
      )
    }
  }

  function handleChange(event) {
    const { name, value, type, checked } = event.target

    setForm((previous) => ({
      ...previous,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  function startEditing(job) {
    setEditingId(job.id)

    setForm({
      title: job.title || '',
      description: job.description || '',
      requirements: job.requirements || '',
      location: job.location || '',
      salary: job.salary || '',
      job_type: job.job_type || 'Full-time',
      is_active: job.is_active,
    })

    setError('')
    setMessage('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function cancelEditing() {
    setEditingId(null)
    setForm(emptyForm)
    setError('')
    setMessage('')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSaving(true)
    setError('')
    setMessage('')

    try {
      if (editingId !== null) {
        await api.patch(`jobs/${editingId}/`, form)
        setMessage('Job updated successfully.')
      } else {
        await api.post('jobs/', form)
        setMessage('Job created successfully.')
      }

      cancelEditing()
      await loadJobs()
      setMessage(editingId !== null
        ? 'Job updated successfully.'
        : 'Job saved successfully.')
    } catch (err) {
      const data = err.response?.data

      if (data && typeof data === 'object') {
        const details = Object.entries(data)
          .map(([field, value]) =>
            `${field}: ${Array.isArray(value) ? value.join(', ') : value}`
          )
          .join(' ')

        setError(details || 'Unable to save the job.')
      } else {
        setError('Unable to save the job. Check your login and try again.')
      }
    } finally {
      setSaving(false)
    }
  }

  async function deleteJob(job) {
    if (!window.confirm(`Delete "${job.title}"? This cannot be undone.`)) {
      return
    }

    setError('')
    setMessage('')

    try {
      await api.delete(`jobs/${job.id}/`)
      setJobs((previous) => previous.filter((item) => item.id !== job.id))

      if (editingId === job.id) {
        cancelEditing()
      }

      setMessage('Job deleted successfully.')
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        'Could not delete this job. Check your permissions.'
      )
    }
  }

  const fieldStyle = {
    width: '100%',
    padding: '11px 12px',
    marginTop: '6px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    boxSizing: 'border-box',
    font: 'inherit',
  }

  const labelStyle = {
    display: 'block',
    marginBottom: '15px',
    fontWeight: 600,
    color: '#374151',
  }

  return (
    <main
      style={{
        maxWidth: '1050px',
        margin: '0 auto',
        padding: '32px 20px',
        color: '#1f2937',
      }}
    >
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
          flexWrap: 'wrap',
          marginBottom: '24px',
        }}
      >
        <div>
          <h1 style={{ marginBottom: '6px' }}>Employer Dashboard</h1>
          <p style={{ margin: 0, color: '#6b7280' }}>
            Create and manage your job listings.
          </p>
        </div>

        <Link to="/" className="secondary-btn">Back to Home</Link>
      </header>

      {error && (
        <p role="alert" style={{ color: '#b91c1c', marginBottom: '16px' }}>
          {error}
        </p>
      )}

      {message && (
        <p role="status" style={{ color: '#047857', marginBottom: '16px' }}>
          {message}
        </p>
      )}

      <section
        style={{
          background: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '14px',
          padding: '24px',
          marginBottom: '32px',
        }}
      >
        <h2 style={{ marginTop: 0 }}>
          {editingId !== null ? 'Edit Job' : 'Post a New Job'}
        </h2>

        <form onSubmit={handleSubmit}>
          <label style={labelStyle}>
            Job Title
            <input
              style={fieldStyle}
              name="title"
              value={form.title}
              onChange={handleChange}
              maxLength={200}
              required
            />
          </label>

          <label style={labelStyle}>
            Description
            <textarea
              style={{ ...fieldStyle, minHeight: '100px' }}
              name="description"
              value={form.description}
              onChange={handleChange}
              required
            />
          </label>

          <label style={labelStyle}>
            Requirements
            <textarea
              style={{ ...fieldStyle, minHeight: '90px' }}
              name="requirements"
              value={form.requirements}
              onChange={handleChange}
              required
            />
          </label>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
            }}
          >
            <label style={labelStyle}>
              Location
              <input
                style={fieldStyle}
                name="location"
                value={form.location}
                onChange={handleChange}
                maxLength={200}
                required
              />
            </label>

            <label style={labelStyle}>
              Salary
              <input
                style={fieldStyle}
                name="salary"
                value={form.salary}
                onChange={handleChange}
                maxLength={100}
                placeholder="e.g. 5-8 LPA"
                required
              />
            </label>

            <label style={labelStyle}>
              Job Type
              <select
                style={fieldStyle}
                name="job_type"
                value={form.job_type}
                onChange={handleChange}
                required
              >
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Internship</option>
                <option>Contract</option>
                <option>Remote</option>
              </select>
            </label>
          </div>

          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '20px',
            }}
          >
            <input
              type="checkbox"
              name="is_active"
              checked={form.is_active}
              onChange={handleChange}
            />
            Publish this job as active
          </label>

          <button className="primary-btn" type="submit" disabled={saving}>
            {saving
              ? 'Saving...'
              : editingId !== null
                ? 'Save Changes'
                : 'Create Job'}
          </button>

          {editingId !== null && (
            <button
              type="button"
              className="secondary-btn"
              onClick={cancelEditing}
              style={{ marginLeft: '10px' }}
            >
              Cancel
            </button>
          )}
        </form>
      </section>

      <section>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            flexWrap: 'wrap',
          }}
        >
          <h2>My Job Listings ({jobs.length})</h2>

          <button
            type="button"
            className="secondary-btn"
            onClick={loadJobs}
            disabled={loading}
          >
            Refresh
          </button>
        </div>

        {loading && <p>Loading your jobs...</p>}

        {!loading && jobs.length === 0 && !error && (
          <p>You haven't posted any jobs yet. Use the form above to create one.</p>
        )}

        <div style={{ display: 'grid', gap: '16px' }}>
          {jobs.map((job) => (
            <article
              key={job.id}
              style={{
                padding: '20px',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                background: '#ffffff',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: '12px',
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{ margin: '0 0 8px' }}>{job.title}</h3>

                  <p style={{ margin: '0 0 8px', color: '#6b7280' }}>
                    {job.location} · {job.job_type} · {job.salary}
                  </p>

                  <p style={{ margin: '0 0 8px', overflowWrap: 'anywhere' }}>
                    {job.description}
                  </p>

                  <p style={{ margin: 0, color: '#6b7280' }}>
                    Status: {job.is_active ? 'Active' : 'Inactive'}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className="secondary-btn"
                    onClick={() => startEditing(job)}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="signup-btn"
                    onClick={() => deleteJob(job)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
      
      <section style={{ marginTop: '32px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px',
            flexWrap: 'wrap',
          }}
        >
          <h2>Job Applications ({applications.length})</h2>

          <button
            type="button"
            className="secondary-btn"
            onClick={loadApplications}
            disabled={applicationsLoading}
          >
            {applicationsLoading ? 'Loading...' : 'Refresh Applications'}
          </button>
        </div>

        {applicationsLoading && <p>Loading applications...</p>}

        {!applicationsLoading && applications.length === 0 && (
          <p>No applications have been submitted for your jobs yet.</p>
        )}

        <div style={{ display: 'grid', gap: '16px' }}>
          {applications.map((application) => (
            <article
              key={application.id}
              style={{
                padding: '20px',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                background: '#ffffff',
              }}
            >
              <h3>Application #{application.id}</h3>

              <p>Job ID: {application.job}</p>
              <p>Applicant ID: {application.applicant}</p>
              <p>Status: {application.status}</p>

              {application.cover_letter && (
                <p>Cover Letter: {application.cover_letter}</p>
              )}

              {application.resume && (
                <p>
                  <a
                    href={application.resume}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View Resume
                  </a>
                </p>
              )}

              <label>
                Update Status:{' '}
                <select
                  value={application.status}
                  onChange={(event) =>
                    updateApplicationStatus(
                      application.id,
                      event.target.value
                    )
                  }
                >
                  <option value="Applied">Applied</option>
                  <option value="Shortlisted">Shortlisted</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Selected">Selected</option>
                </select>
              </label>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}

function JobSeekerDashboard() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadApplications = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await api.get('applications/')
      setApplications(
        Array.isArray(response.data) ? response.data : response.data.results || []
      )
    } catch (err) {
      setError('Could not load your applications. Please log in again if needed.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadApplications()
  }, [])

  return (
    <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '30px 20px' }}>
      <h1>Job Seeker Dashboard</h1>
      <p>Track the jobs you have applied for.</p>
      <Link to="/">Back to Home</Link>

      {loading && <p>Loading applications...</p>}
      {error && <p role="alert">{error}</p>}

      {!loading && !error && applications.length === 0 && (
        <p>You haven't applied for any jobs yet.</p>
      )}

      {!loading && applications.map((application) => (
        <article
          key={application.id}
          style={{
            border: '1px solid #ddd',
            borderRadius: '10px',
            padding: '18px',
            marginTop: '16px',
          }}
        >
          <h2>
            {application.job_title ||
              application.job?.title ||
              `Application #${application.id}`}
          </h2>
          <p>Status: {application.status || 'Pending'}</p>
          {application.cover_letter && <p>{application.cover_letter}</p>}
          {application.resume && (
            <p>
              <a href={application.resume} target="_blank" rel="noreferrer">
                View Resume
              </a>
            </p>
          )}
        </article>
      ))}

      <button onClick={loadApplications} disabled={loading}>
        Refresh Applications
      </button>
    </main>
  )
}
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
  path="/dashboard"
  element={
    localStorage.getItem('role') === 'job_seeker'
      ? <JobSeekerDashboard />
      : <Dashboard />
  }
/>
        <Route path="/jobs/:id" element={<JobDetails />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App