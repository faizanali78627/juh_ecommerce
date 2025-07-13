import { useState } from 'react'
import axios from 'axios'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [token, setToken] = useState('')

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://127.0.0.1:8000/api/login/', { username, password })
      const access = res.data.access
      localStorage.setItem('token', access)
      setToken(access)
    }catch (err: unknown) {
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
      <h2>Login</h2>
      <input type="text" placeholder="Username" onChange={e => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
      {token && <p>Logged in! Token saved ✅</p>}
    </div>
  )
}
