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
        <p className="category">{product.category?.name || 'Audio'}</p>
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <div className="product-footer">
          <strong>${Number(product.price).toFixed(2)}</strong>
          <span>{product.stock} en stock</span>
        </div>
      </div>
    </article>
  )
}  

function ProductsGrid({ reloadedKey = 0}){
  const [products, setProducts] = useState([])
  const [status, setStatus] = useState('Cargando productos...')

  useEffect(() => {
    const getProducts = async () => {
      try {
        const res = await axios.get(`${API_URL}/products`)
        setProducts(res.data?.products || [])
        setStatus('')
      } catch (error) {
        setStatus(error.response?.data?.message || 'No se pudieron cargar los productos')
      }
    }

    getProducts()
  }, [reloadedKey])
  
  if (status) return <p className="status-message">{status}</p>
  
  if (!products.length) {
    return <p className="status-message">No se encontraron productos</p>
  }

  return (
    <section className="products-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </section>
  )
}

function Home({ user, onLogout}){
  return (
    <main>
      <header className="store-hero">
        <nav className='topbar'>
          <a className="brand" href="/">Audify</a>
          <div>
            <span>{user?.email}</span>
            <button type="button" className="link-button" onClick={onLogout}>Salir</button>
          </div>
        </nav>
        <section className="hero-content">
          <p className='eyebrow'>Marketplace de audio profesional</p>
          <h1>Encuentra lo que necesitas</h1>
          <p>
            Este home funciona como la entrada de www.audify.com: después del login,
            consulta la API y muestra los productos guardados en la base de datos.
          </p>    
        </section>
      </header>
      <ProductsGrid />
    </main>
  )
}

function AdminPanel({ user, onLogout }) {
  const [form, setForm] = useState(emptyProductForm)
  const [image, setImage] = useState(null)
  const [categories, setCategories] = useState([])
  const [message, setMessage] = useState('')
  const [reloadedKey, setReloadedKey] = useState(0)

  const categoryOptions = useMemo(() => categories.map((category) => (
    <option key={category.id} value={category.id}>{category.name}</option>
  )), [categories])

  useEffect(() => {
    const getCategories = async () => {
      try {
        const res = await axios.get(`${API_URL}/categories`)
        setCategories(res.data?.categories || [])
      } catch (error) {
        setCategories([])
      }
    }

    getCategories()
  }, [])

  const handleChange = (e) => {
    setForm((current) => ({ ...current, [e.target.name]: e.target.value}))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setCategories('Creando producto...')
    
    const data = new FormData()
    Object.entries(form).forEach(([key, value]) =>  data.append(key, value))
    if (image) data.append('image', image)

    try {
      const res = await axios.post(`${API_URL}/products`, data)
      setMessage(res.data?.message || 'Producto creado correctamente')
      setForm(emptyProductForm)
      setImage(null)
      e.target.reset()
      setReloadedKey((current) => current + 1)
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error al crear producto')
    }
  }

  return(
  <main className="admin-layout">
    <nav className="topbar admin-topbar">
      <a className="brand" href="/">Audify</a>
      <div>
        <span>{user?.email}</span>
        <button type="button" className="link-button" onClick={onLogout}>Salir</button>
      </div>
    </nav>

    <section className="admin-grid">
      <article className="anel-card">
        <p className="eyebrow">Crear producto</p>
        <h1>Alta desde frontend</h1>
        <form className="form" onSubmit={handleSubmit}>
          <label>Nombre<input name='name' value={form.name} onChange={handleChange} required/></label>
          <label>Precio<input name='price' tyepe="number" step="0.01" min="0" value={form.price} onChange={handleChange} required/></label>
          <label>Stock<input name='stock' type="number" min="0" value={form.stock} onChange={handleChange} required/></label>
          <label> 
            Categoría
            <select name='categoryId' value={form.categoryId} onChange={handleChange} required>
              <option value="">Selecciona una categoría</option>
              {categoryOptions}
            </select>
          </label>
          <label>Descripción<textarea name='description' value={form.description} onChange={handleChange} required /></label>
          <label>Imagen<input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} /></label>
          <button type="submit">Crear producto</button>
        </form>
        {message && <p className="status-message">{message}</p>}
      </article>

      <article className="panel-card preview-panel">
        <p className="eyebrow">Vista Pública</p>
        <h1>Productos publicados</h1>
        <ProductsGrid reloadedKey={reloadedKey} />
      </article>
    </section>
  </main>  
  )
}

function App() {
  const [user, setUser] = useState(null)
  const path = window.location.pathname
  const isAdminRoute = path.startsWith('/admin')

  if (!user) {
    return <Login mode={isAdminRoute ? 'admin' : 'customer'} onLogin={setUser} />
  }

  if (isAdminRoute) {
    return <AdminPanel user={user} onLogout={() => setUser(null)} />
  }

  return <Home user={user} onLogout={() => setUser(null)} />
}

export default App