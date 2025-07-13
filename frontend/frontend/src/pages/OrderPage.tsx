import { useEffect, useState } from 'react'
import axios from 'axios'

function OrderPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [message, setMessage] = useState('')
  const [productId, setProductId] = useState<number | null>(null)

  useEffect(() => {
    const cart = localStorage.getItem('cart')
    if (cart) {
      const parsed = JSON.parse(cart)
      if (parsed.length > 0) {
        setProductId(parsed[0].id) // assuming one product at a time for order
      }
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!productId) {
      setMessage('❌ No product found in cart.')
      return
    }

    try {
      const token = localStorage.getItem('token')
      await axios.post(
        'http://127.0.0.1:8000/api/place_order/',
        { name, email, phone, address, product_id: productId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      setMessage('✅ Order placed successfully!')
      localStorage.removeItem('cart') // clear cart after order
    }catch (error: unknown) {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 401) {
      setMessage('🔒 You must be logged in to place an order.')
    } else {
      setMessage('❌ Failed to place order. Please try again.')
    }
  } else {
    setMessage('❌ Something went wrong.')
  }
}
  }

  const inputStyle = {
    display: 'block',
    width: '100%',
    padding: '0.75rem',
    marginBottom: '1rem',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '1rem',
  }

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', padding: '1.5rem', background: '#fff', borderRadius: '8px' }}>
      <h2 style={{ marginBottom: '1rem' }}>📝 Complete Your Order</h2>
      <form onSubmit={handleSubmit}>
        <input style={inputStyle} placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} required />
        <input style={inputStyle} placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} type="email" required />
        <input style={inputStyle} placeholder="Phone" value={phone} onChange={e => setPhone(e.target.value)} required />
        <textarea style={inputStyle} placeholder="Address" value={address} onChange={e => setAddress(e.target.value)} required />

        <button type="submit" style={{
          background: '#28a745',
          color: 'white',
          padding: '0.75rem 1.5rem',
          border: 'none',
          borderRadius: '6px',
          fontSize: '1rem',
          cursor: 'pointer',
        }}>
          Place Order
        </button>
      </form>
      {message && <p style={{ marginTop: '1rem', fontWeight: 'bold' }}>{message}</p>}
    </div>
  )
}

export default OrderPage
