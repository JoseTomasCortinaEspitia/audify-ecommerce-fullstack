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
        {product.imageUrl  (
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
          <p>
            Edit <code>src/App.jsx</code> and save to test <code>HMR</code>
          </p>
        </div>
        <button
          type="button"
          className="counter"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>
      </section>

      <div className="ticks"></div>

      <section id="next-steps">
        <div id="docs">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#documentation-icon"></use>
          </svg>
          <h2>Documentation</h2>
          <p>Your questions, answered</p>
          <ul>
            <li>
              <a href="https://vite.dev/" target="_blank">
                <img className="logo" src={viteLogo} alt="" />
                Explore Vite
              </a>
            </li>
            <li>
              <a href="https://react.dev/" target="_blank">
                <img className="button-icon" src={reactLogo} alt="" />
                Learn more
              </a>
            </li>
          </ul>
        </div>
        <div id="social">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#social-icon"></use>
          </svg>
          <h2>Connect with us</h2>
          <p>Join the Vite community</p>
          <ul>
            <li>
              <a href="https://github.com/vitejs/vite" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#github-icon"></use>
                </svg>
                GitHub
              </a>
            </li>
            <li>
              <a href="https://chat.vite.dev/" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#discord-icon"></use>
                </svg>
                Discord
              </a>
            </li>
            <li>
              <a href="https://x.com/vite_js" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#x-icon"></use>
                </svg>
                X.com
              </a>
            </li>
            <li>
              <a href="https://bsky.app/profile/vite.dev" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#bluesky-icon"></use>
                </svg>
                Bluesky
              </a>
            </li>
          </ul>
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default App
