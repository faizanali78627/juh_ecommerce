import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'
import ImageGallery from 'react-image-gallery'
import 'react-image-gallery/styles/css/image-gallery.css'
import './App.css'

import Signup from './pages/Signup'
import Login from './pages/Login'
import OrderPage from './pages/OrderPage'
import MyOrders from './pages/MyOrders'

interface ProductMedia {
  file: string
  is_video: boolean
}

interface Product {
  id: number
  name: string
  description: string
  price: string
  in_stock: boolean
  media: ProductMedia[]
}

function ProductPage() {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    axios
      .get('http://127.0.0.1:8000/api/products/')
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err))
  }, [])

  const handleAddToCart = (product: Product) => {
    const existing = localStorage.getItem('cart')
    const cart = existing ? JSON.parse(existing) : []
    cart.push(product)
    localStorage.setItem('cart', JSON.stringify(cart))
    alert(`${product.name} added to cart!`)
  }

  return (
    <div style={{ fontFamily: 'Poppins, sans-serif', background: '#f8f9fa', padding: '2rem' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '2.5rem', color: '#333' }}>
        🛍️ Our Products
      </h1>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        {products.map((product) => {
          const mediaItems = product.media.map((item) => ({
            original: `http://127.0.0.1:8000/${item.file}`,
            thumbnail: `http://127.0.0.1:8000/${item.file}`,
            renderItem: () =>
              item.is_video ? (
                <video controls style={{ width: '100%', borderRadius: '8px' }}>
                  <source src={`http://127.0.0.1:8000/${item.file}`} type="video/mp4" />
                </video>
              ) : (
                <img
                  src={`http://127.0.0.1:8000/${item.file}`}
                  alt="Product"
                  className="image-zoom-effect"
                  style={{ width: '100%', borderRadius: '8px' }}
                />
              ),
          }))

          return (
            <div
              key={product.id}
              style={{
                backgroundColor: '#fff',
                borderRadius: '12px',
                padding: '1rem',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <ImageGallery
                items={mediaItems}
                showPlayButton={false}
                showFullscreenButton={false}
                showNav={true}
                autoPlay={product.media.length > 1}
                slideInterval={3000}
                slideDuration={500}
              />

              <div style={{ padding: '1rem 0' }}>
                <h2 style={{ fontSize: '1.2rem', margin: '0 0 0.5rem' }}>{product.name}</h2>
                <p style={{ fontSize: '0.9rem', color: '#666' }}>{product.description}</p>
                <p style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#222', marginTop: '0.5rem' }}>
                  Rs. {Number(product.price).toLocaleString('en-PK')}
                </p>
                <p style={{ color: product.in_stock ? 'green' : 'red', fontWeight: 600 }}>
                  {product.in_stock ? 'In Stock' : 'Out of Stock'}
                </p>
              </div>

              <button
                onClick={() => handleAddToCart(product)}
                style={{
                  marginTop: 'auto',
                  padding: '0.6rem 1rem',
                  backgroundColor: '#ff6600',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                }}
              >
                Add to Cart
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function CartPage() {
  const [cart, setCart] = useState<Product[]>([])

  useEffect(() => {
    const stored = localStorage.getItem('cart')
    setCart(stored ? JSON.parse(stored) : [])
  }, [])

  return (
    <div style={{ padding: '2rem', fontFamily: 'Poppins, sans-serif' }}>
      <h2>Your Cart</h2>
      {cart.length === 0 ? (
        <p>No items in cart.</p>
      ) : (
        cart.map((product, idx) => (
          <div key={idx} style={{ marginBottom: '1rem', background: '#eee', padding: '1rem' }}>
            <strong>{product.name}</strong> - Rs. {product.price}
          </div>
        ))
      )}
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <nav
        style={{
          padding: '1rem',
          background: '#fff',
          borderBottom: '1px solid #ddd',
          marginBottom: '1rem',
          display: 'flex',
          justifyContent: 'center',
          gap: '20px',
        }}
      >
        <Link to="/" style={{ fontWeight: 'bold' }}>
          Home
        </Link>
        <Link to="/signup">Signup</Link>
        <Link to="/login">Login</Link>
        <Link to="/cart">🛒 Cart</Link>
        <Link to="/order">📝 Order</Link>
        <Link to="/my-orders">📦 My Orders</Link>
      </nav>

      <Routes>
        <Route path="/" element={<ProductPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/order" element={<OrderPage />} />
        <Route path="/my-orders" element={<MyOrders />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
