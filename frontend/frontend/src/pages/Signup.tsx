import { useState } from 'react'
import axios from 'axios'

export default function Signup() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSignup = async () => {
    try {
      await axios.post('http://127.0.0.1:8000/api/register/', { username, password })
      setSuccess(true)
    } catch (err: unknown) {
  if (axios.isAxiosError(err)) {
    if (err.response) {
      alert('Error: ' + JSON.stringify(err.response.data))
    } else {
      alert('Network error')
    }
  } else {
    alert('An unknown error occurred')
  }
}

  }

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Sign Up</h2>
      <input type="text" placeholder="Username" onChange={e => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
      <button onClick={handleSignup}>Signup</button>
      {success && <p>Signup successful! Go to login</p>}
    </div>
  )
}
