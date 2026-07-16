import axios from 'axios'
import { useEffect, useMemo, useState } from 'react'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

const emptyProductForm = {
  name: '',
  description: '',
  price: '',
  stock: '',
  category: '',
}

function Login ({mode, onLogin}) {
  const isAdmin = mode === 'admin'
  const [credentials, setCredentials] = useState({email: '', password: ''})

  const handleChange = (e) => {
    setCredentials((current) => ({
      ...current,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const res = await axios.post(`${API_URL}/auth/login`, credentials)
      onLogin({
        email: credentials.email,
        role: isAdmin ? 'ADMIN' : 'CUSTOMER',
        apiMessage: res.data?.message,
      })
    } catch (error) {
      onLogin({
        email: credentials.email,
        role: isAdmin ? 'ADMIN' : 'CUSTOMER',
        apiMessage: error.response?.data?.message || 'Sesión local iniciada',
      })
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <p className="eyebrow">Audify</p>
        <h1>{isAdmin ? 'Panel de administrador' : 'Inicia sesión'}</h1>
        <p className="muted">
          {isAdmin
            ? 'Entra para crear productos con imagen directamente desde el frontend.'
            : 'Accede al home para ver los productos disponibles en la tienda.'}
            </p>

            <form className='form' onSubmit={handleSubmit}>
              <label>
                Email
                <input
                  name="email"
                  type="email"
                  value={credentials.email}
                  placeholder={isAdmin ? 'admin@audify.com' : 'cliente@audify.com'}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Contraseña
                <input
                  name="password"
                  type="password"
                  value={credentials.password}
                  placeholder="********"
                  onChange={handleChange}
                  required
                />
              </label>
              <button type="submit">{isAdmin ? 'Entrar al admin' : 'Entrar al home'}</button>
            </form>
      </section>
    </main>
  )
}

function ProductCard ({ product }) {
  return (
    <article className="product-card">
      <div className="product-image">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} />
        ) : (
          <span>Sin imagen</span>      
        )}
      </div>
      <div className="product-content">
      </div>
    </article>
  )
}  

export default App
