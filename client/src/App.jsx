import axios from 'axios'
import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

const emptyProductForm = {
  name: '',
  description: '',
  price: '',
  stock: '',
  categoryId: '',
}

const readSession = () => {
  try {
    return JSON.parse(localStorage.getItem('audify-session'))
  } catch {
    return null
  }
}

function GoogleButton({ onSuccess, onError }) {
  const buttonRef = useRef(null)

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return undefined

    const renderGoogleButton = () => {
      if (!window.google?.accounts?.id || !buttonRef.current) return
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: async ({ credential }) => {
          try {
            const response = await axios.post(`${API_URL}/auth/google`, { credential })
            onSuccess(response.data)
          } catch (error) {
            onError(error.response?.data?.message || 'No se pudo ingresar con Google')
          }
        },
      })
      buttonRef.current.innerHTML = ''
      window.google.accounts.id.renderButton(buttonRef.current, {
        type: 'standard',
        theme: 'outline',
        size: 'large',
        text: 'continue_with',
        shape: 'pill',
        width: 360,
      })
    }

    const existingScript = document.querySelector('script[data-google-identity]')
    if (existingScript) {
      renderGoogleButton()
      existingScript.addEventListener('load', renderGoogleButton)
      return () => existingScript.removeEventListener('load', renderGoogleButton)
    }

    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.dataset.googleIdentity = 'true'
    script.addEventListener('load', renderGoogleButton)
    document.head.appendChild(script)
    return () => script.removeEventListener('load', renderGoogleButton)
  }, [onError, onSuccess])

  if (!GOOGLE_CLIENT_ID) {
    return <button className="google-pending" type="button" disabled>Google · configuración pendiente</button>
  }

  return <div className="google-button" ref={buttonRef} aria-label="Continuar con Google" />
}

function AuthPage({ adminMode, onAuth }) {
  const [mode, setMode] = useState(adminMode ? 'login' : 'login')
  const [form, setForm] = useState({ name: '', email: '', identifier: '', password: '' })
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = ({ target }) => {
    setForm((current) => ({ ...current, [target.name]: target.value }))
  }

  const submit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const payload = mode === 'register'
        ? { name: form.name, email: form.email, password: form.password }
        : { identifier: form.identifier, password: form.password }
      const response = await axios.post(`${API_URL}/auth/${mode}`, payload)
      onAuth(response.data)
    } catch (error) {
      setMessage(error.response?.data?.message || 'No fue posible completar la solicitud')
    } finally {
      setLoading(false)
    }
  }

  const selectMode = (nextMode) => {
    setMode(nextMode)
    setMessage('')
  }

  return (
    <main className="auth-page">
      <section className="auth-showcase" aria-hidden="true">
        <a className="brand brand-light" href="/">AUDIFY</a>
        <div>
          <p className="eyebrow light">Audio para cada momento</p>
          <h1>Escucha mejor.<br />Vive más.</h1>
          <p>Equipos seleccionados para estudio, escenario y todos los días.</p>
        </div>
      </section>

      <section className="auth-panel">
        <div className="auth-card">
          <p className="eyebrow">{adminMode ? 'Acceso privado' : 'Bienvenido a Audify'}</p>
          <h2>{adminMode ? 'Panel de administrador' : mode === 'login' ? 'Inicia sesión' : 'Crea tu cuenta'}</h2>
          <p className="muted">
            {adminMode
              ? 'Ingresa con una cuenta que tenga permisos de administrador.'
              : mode === 'login'
                ? 'Usa los datos con los que te registraste.'
                : 'Regístrate con tus datos o continúa con Google.'}
          </p>

          {!adminMode && (
            <div className="auth-tabs" role="tablist" aria-label="Acceso a la cuenta">
              <button type="button" className={mode === 'login' ? 'active' : ''} onClick={() => selectMode('login')}>Ingresar</button>
              <button type="button" className={mode === 'register' ? 'active' : ''} onClick={() => selectMode('register')}>Registrarse</button>
            </div>
          )}

          <form className="form auth-form" onSubmit={submit}>
            {mode === 'register' ? (
              <>
                <label>Nombre completo<input name="name" value={form.name} onChange={handleChange} autoComplete="name" required /></label>
                <label>Correo electrónico<input name="email" type="email" value={form.email} onChange={handleChange} autoComplete="email" required /></label>
              </>
            ) : (
              <label>Correo o nombre<input name="identifier" value={form.identifier} onChange={handleChange} autoComplete="username" required /></label>
            )}
            <label>Contraseña<input name="password" type="password" minLength="8" value={form.password} onChange={handleChange} autoComplete={mode === 'register' ? 'new-password' : 'current-password'} required /></label>
            <button className="primary-button" type="submit" disabled={loading}>
              {loading ? 'Procesando…' : mode === 'login' ? 'Ingresar' : 'Crear cuenta'}
            </button>
          </form>

          {message && <p className="form-message error" role="alert">{message}</p>}

          {!adminMode && (
            <>
              <div className="divider"><span>o</span></div>
              <GoogleButton onSuccess={onAuth} onError={setMessage} />
            </>
          )}

          {adminMode && <a className="back-link" href="/">← Volver a la tienda</a>}
        </div>
      </section>
    </main>
  )
}

function ProductCard({ product }) {
  return (
    <article className="product-card">
      <div className="product-image">
        {product.imageUrl ? <img src={product.imageUrl} alt={product.name} /> : <span>Sin imagen</span>}
      </div>
      <div className="product-content">
        <p className="category">{product.category?.name || 'Audio'}</p>
        <h3>{product.name}</h3>
        <p className="product-description">{product.description}</p>
        <div className="product-footer">
          <strong>${Number(product.price).toFixed(2)}</strong>
          <span>{product.stock} disponibles</span>
        </div>
      </div>
    </article>
  )
}

function ProductsGrid({ reloadKey = 0 }) {
  const [products, setProducts] = useState([])
  const [status, setStatus] = useState('Cargando productos…')

  useEffect(() => {
    axios.get(`${API_URL}/products`)
      .then(({ data }) => {
        setProducts(data?.products || [])
        setStatus('')
      })
      .catch((error) => setStatus(error.response?.data?.message || 'No se pudieron cargar los productos'))
  }, [reloadKey])

  if (status) return <p className="status-message">{status}</p>
  if (!products.length) return <p className="status-message">No se encontraron productos</p>

  return <section className="products-grid">{products.map((product) => <ProductCard key={product.id} product={product} />)}</section>
}

function StoreHeader({ user, onLogout }) {
  return (
    <nav className="topbar">
      <a className="brand" href="/">AUDIFY</a>
      <div className="nav-links"><a href="#productos">Productos</a><a href="#audio">Tecnología</a></div>
      <div className="account-menu">
        {user.avatarUrl && <img className="avatar" src={user.avatarUrl} alt="" />}
        <span>{user.name || user.email}</span>
        <button type="button" className="link-button" onClick={onLogout}>Salir</button>
      </div>
    </nav>
  )
}

function Home({ user, onLogout }) {
  return (
    <main>
      <StoreHeader user={user} onLogout={onLogout} />
      <header className="store-hero" id="audio">
        <div className="hero-copy">
          <p className="eyebrow light">Marketplace de audio profesional</p>
          <h1>El sonido que estabas buscando.</h1>
          <p>Audífonos, micrófonos y equipos elegidos para escuchar cada detalle.</p>
          <a className="hero-button" href="#productos">Explorar productos</a>
        </div>
      </header>
      <section className="catalog-section" id="productos">
        <div className="section-heading"><div><p className="eyebrow">Colección Audify</p><h2>Productos destacados</h2></div><span>Diseño, rendimiento y sonido</span></div>
        <ProductsGrid />
      </section>
    </main>
  )
}

function AdminPanel({ session, onLogout }) {
  const [form, setForm] = useState(emptyProductForm)
  const [image, setImage] = useState(null)
  const [categories, setCategories] = useState([])
  const [message, setMessage] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  const categoryOptions = useMemo(() => categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>), [categories])

  useEffect(() => {
    axios.get(`${API_URL}/categories`)
      .then(({ data }) => setCategories(data?.categories || []))
      .catch(() => setCategories([]))
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setMessage('Creando producto…')
    const data = new FormData()
    Object.entries(form).forEach(([key, value]) => data.append(key, value))
    if (image) data.append('image', image)

    try {
      const response = await axios.post(`${API_URL}/products`, data, {
        headers: { Authorization: `Bearer ${session.token}` },
      })
      setMessage(response.data?.message || 'Producto creado correctamente')
      setForm(emptyProductForm)
      setImage(null)
      event.target.reset()
      setReloadKey((current) => current + 1)
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error al crear producto')
    }
  }

  return (
    <main className="admin-layout">
      <StoreHeader user={session.user} onLogout={onLogout} />
      <section className="admin-grid">
        <article className="panel-card">
          <p className="eyebrow">Crear producto</p><h2>Nuevo producto</h2>
          <form className="form" onSubmit={handleSubmit}>
            <label>Nombre<input name="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></label>
            <div className="form-row">
              <label>Precio<input name="price" type="number" step="0.01" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required /></label>
              <label>Stock<input name="stock" type="number" min="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} required /></label>
            </div>
            <label>Categoría<select name="categoryId" value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} required><option value="">Selecciona una categoría</option>{categoryOptions}</select></label>
            <label>Descripción<textarea name="description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required /></label>
            <label>Imagen<input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} /></label>
            <button className="primary-button" type="submit">Crear producto</button>
          </form>
          {message && <p className="form-message">{message}</p>}
        </article>
        <article className="panel-card preview-panel"><p className="eyebrow">Vista pública</p><h2>Productos publicados</h2><ProductsGrid reloadKey={reloadKey} /></article>
      </section>
    </main>
  )
}

function App() {
  const [session, setSession] = useState(readSession)
  const isAdminRoute = window.location.pathname.startsWith('/admin')

  const saveSession = (data) => {
    const nextSession = { token: data.token, user: data.user }
    localStorage.setItem('audify-session', JSON.stringify(nextSession))
    setSession(nextSession)
  }

  const logout = () => {
    localStorage.removeItem('audify-session')
    setSession(null)
  }

  if (!session) return <AuthPage adminMode={isAdminRoute} onAuth={saveSession} />
  if (isAdminRoute && session.user.role !== 'ADMIN') return <section className="access-denied"><p className="eyebrow">Acceso restringido</p><h2>Esta cuenta no es administradora</h2><p>Inicia sesión con una cuenta ADMIN para gestionar productos.</p><button onClick={logout}>Usar otra cuenta</button><a href="/">Volver a la tienda</a></section>
  if (isAdminRoute) return <AdminPanel session={session} onLogout={logout} />
  return <Home user={session.user} onLogout={logout} />
}

export default App
