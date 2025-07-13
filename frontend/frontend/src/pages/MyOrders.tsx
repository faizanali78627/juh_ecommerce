import { useEffect, useState } from 'react'
import axios from 'axios'

interface Product {
  name: string
}

interface Order {
  id: number
  name: string
  email: string
  phone: string
  address: string
  product: Product
  ordered_at: string
}

function MyOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      setError('🔒 Please login to view your orders.')
      return
    }

    axios
      .get('http://127.0.0.1:8000/api/my_orders/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setOrders(res.data))
      .catch((err) => {
        console.error('Error fetching orders', err)
        setError('❌ Failed to fetch orders.')
      })
  }, [])

  return (
    <div style={{ padding: '2rem', fontFamily: 'Poppins, sans-serif', maxWidth: 700, margin: '0 auto' }}>
      <h2 style={{ marginBottom: '1rem' }}>📦 My Orders</h2>

      {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}

      {orders.length === 0 && !error ? (
        <p>No orders placed yet.</p>
      ) : (
        orders.map((order) => (
          <div
            key={order.id}
            style={{
              background: '#f9f9f9',
              padding: '1rem',
              borderRadius: '8px',
              marginBottom: '1.5rem',
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
            }}
          >
            <p><strong>Product:</strong> {order.product?.name || 'Unknown Product'}</p>
            <p><strong>Name:</strong> {order.name}</p>
            <p><strong>Email:</strong> {order.email}</p>
            <p><strong>Phone:</strong> {order.phone}</p>
            <p><strong>Address:</strong> {order.address}</p>
            <p><strong>Ordered At:</strong> {new Date(order.ordered_at).toLocaleString()}</p>
          </div>
        ))
      )}
    </div>
  )
}

export default MyOrders
