import axios from 'axios'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID
const SESSION_KEY = 'audify-session'
const SESSION_INACTIVITY_MS = 15 * 60 * 1000

const copy = {
  es: {
    language: 'EN', private: 'Acceso privado', welcome: 'Bienvenido a Audify', admin: 'Panel de administrador',
    loginTitle: 'Inicia sesión', registerTitle: 'Crea tu cuenta', adminHelp: 'Ingresa con una cuenta que tenga permisos de administrador.',
    loginHelp: 'Usa los datos con los que te registraste.', registerHelp: 'Regístrate con tus datos o continúa con Google.',
    login: 'Ingresar', register: 'Registrarse', name: 'Nombre completo', email: 'Correo electrónico', identifier: 'Correo o nombre',
    password: 'Contraseña', createAccount: 'Crear cuenta', processing: 'Procesando…', googlePending: 'Google · configuración pendiente',
    back: '← Volver a la tienda', showcase: 'Audio para cada momento', showcaseTitle: <>Escucha mejor.<br />Vive más.</>,
    showcaseText: 'Equipos seleccionados para estudio, escenario y todos los días.', products: 'Productos', technology: 'Tecnología', logout: 'Salir',
    market: 'Marketplace de audio profesional', hero: 'El sonido que estabas buscando.', heroText: 'Audífonos, micrófonos y equipos elegidos para escuchar cada detalle.',
    explore: 'Explorar productos', collection: 'Colección Audify', featured: 'Productos destacados', featureText: 'Diseño, rendimiento y sonido',
    noImage: 'Sin imagen', available: 'disponibles', loading: 'Cargando productos…', loadError: 'No se pudieron cargar los productos', empty: 'No se encontraron productos',
    createProduct: 'Crear producto', newProduct: 'Nuevo producto', productName: 'Nombre', price: 'Precio en pesos colombianos',
    stock: 'Inventario', category: 'Categoría', selectCategory: 'Selecciona una categoría', description: 'Descripción en español',
    image: 'Imagen', creating: 'Creando producto…', created: 'Producto creado correctamente', createError: 'Error al crear producto', publicView: 'Vista pública', published: 'Productos publicados',
    search: 'Buscar productos', searchPlaceholder: 'Nombre o descripción…', allCategories: 'Todas las categorías', sortBy: 'Ordenar por', newest: 'Más recientes', priceLow: 'Precio: menor a mayor', priceHigh: 'Precio: mayor a menor', nameAZ: 'Nombre: A–Z', results: 'productos', clearFilters: 'Limpiar filtros',
    edit: 'Editar', delete: 'Eliminar', editProduct: 'Editar producto', saveChanges: 'Guardar cambios', saving: 'Guardando cambios…', updated: 'Producto actualizado correctamente', updateError: 'Error al actualizar producto', cancel: 'Cancelar', deleting: 'Eliminando producto…', deleted: 'Producto eliminado correctamente', deleteError: 'Error al eliminar producto', deleteConfirm: '¿Seguro que quieres eliminar este producto? Esta acción no se puede deshacer.', currentImage: 'La imagen actual se conservará si no eliges otra.',
    restricted: 'Acceso restringido', notAdmin: 'Esta cuenta no es administradora', notAdminText: 'Inicia sesión con una cuenta ADMIN para gestionar productos.', otherAccount: 'Usar otra cuenta',
  },
  en: {
    language: 'ES', private: 'Private access', welcome: 'Welcome to Audify', admin: 'Admin dashboard',
    loginTitle: 'Sign in', registerTitle: 'Create your account', adminHelp: 'Sign in with an account that has administrator permissions.',
    loginHelp: 'Use the details you registered with.', registerHelp: 'Register with your details or continue with Google.',
    login: 'Sign in', register: 'Register', name: 'Full name', email: 'Email address', identifier: 'Email or name',
    password: 'Password', createAccount: 'Create account', processing: 'Processing…', googlePending: 'Google · setup pending',
    back: '← Back to store', showcase: 'Audio for every moment', showcaseTitle: <>Hear better.<br />Live more.</>,
    showcaseText: 'Selected equipment for the studio, stage, and every day.', products: 'Products', technology: 'Technology', logout: 'Sign out',
    market: 'Professional audio marketplace', hero: 'The sound you were looking for.', heroText: 'Headphones, microphones, and equipment selected to hear every detail.',
    explore: 'Explore products', collection: 'Audify collection', featured: 'Featured products', featureText: 'Design, performance, and sound',
    noImage: 'No image', available: 'available', loading: 'Loading products…', loadError: 'Products could not be loaded', empty: 'No products found',
    createProduct: 'Create product', newProduct: 'New product', productName: 'Name', price: 'Price in Colombian pesos',
    stock: 'Stock', category: 'Category', selectCategory: 'Select a category', description: 'Description in Spanish',
    image: 'Image', creating: 'Creating product…', created: 'Product created successfully', createError: 'Error creating product', publicView: 'Public view', published: 'Published products',
    search: 'Search products', searchPlaceholder: 'Name or description…', allCategories: 'All categories', sortBy: 'Sort by', newest: 'Newest', priceLow: 'Price: low to high', priceHigh: 'Price: high to low', nameAZ: 'Name: A–Z', results: 'products', clearFilters: 'Clear filters',
    edit: 'Edit', delete: 'Delete', editProduct: 'Edit product', saveChanges: 'Save changes', saving: 'Saving changes…', updated: 'Product updated successfully', updateError: 'Error updating product', cancel: 'Cancel', deleting: 'Deleting product…', deleted: 'Product deleted successfully', deleteError: 'Error deleting product', deleteConfirm: 'Are you sure you want to delete this product? This action cannot be undone.', currentImage: 'The current image will be kept if you do not choose another one.',
    restricted: 'Restricted access', notAdmin: 'This account is not an administrator', notAdminText: 'Sign in with an ADMIN account to manage products.', otherAccount: 'Use another account',
  }
}

const emptyProductForm = { name: '', description: '', price: '', stock: '', categoryId: '' }

const readSession = () => {
  try {
    const navigationType = performance.getEntriesByType('navigation')[0]?.type
    const saved = JSON.parse(sessionStorage.getItem(SESSION_KEY))
    if (!saved || navigationType !== 'reload' || Date.now() - saved.lastActive > SESSION_INACTIVITY_MS) {
      sessionStorage.removeItem(SESSION_KEY)
      return null
    }
    return saved
  } catch {
    return null
  }
}

function LanguageButton({ language, onChange }) {
  return <button type="button" className="language-button" onClick={() => onChange(language === 'es' ? 'en' : 'es')} aria-label={language === 'es' ? 'Switch to English' : 'Cambiar a español'}>{copy[language].language}</button>
}

function GoogleButton({ language, onSuccess, onError }) {
  const buttonRef = useRef(null)
  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return undefined
    const render = () => {
      if (!window.google?.accounts?.id || !buttonRef.current) return
      window.google.accounts.id.initialize({ client_id: GOOGLE_CLIENT_ID, callback: async ({ credential }) => {
        try { onSuccess((await axios.post(`${API_URL}/auth/google`, { credential })).data) }
        catch (error) { onError(error.response?.data?.message || copy[language].loadError) }
      } })
      buttonRef.current.innerHTML = ''
      window.google.accounts.id.renderButton(buttonRef.current, { theme: 'outline', size: 'large', text: 'continue_with', shape: 'pill', width: 360, locale: language })
    }
    let script = document.querySelector('script[data-google-identity]')
    if (!script) {
      script = document.createElement('script'); script.src = 'https://accounts.google.com/gsi/client'; script.async = true; script.defer = true; script.dataset.googleIdentity = 'true'; document.head.appendChild(script)
    }
    render(); script.addEventListener('load', render)
    return () => script.removeEventListener('load', render)
  }, [language, onError, onSuccess])
  return GOOGLE_CLIENT_ID ? <div className="google-button" ref={buttonRef} /> : <button className="google-pending" disabled>{copy[language].googlePending}</button>
}

function AuthPage({ adminMode, language, onLanguageChange, onAuth }) {
  const t = copy[language]
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ name: '', email: '', identifier: '', password: '' })
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const handleChange = ({ target }) => setForm((current) => ({ ...current, [target.name]: target.value }))
  const submit = async (event) => {
    event.preventDefault(); setLoading(true); setMessage('')
    try {
      const payload = mode === 'register' ? { name: form.name, email: form.email, password: form.password } : { identifier: form.identifier, password: form.password }
      onAuth((await axios.post(`${API_URL}/auth/${mode}`, payload)).data)
    } catch (error) { setMessage(error.response?.data?.message || (language === 'es' ? 'No fue posible completar la solicitud' : 'The request could not be completed')) }
    finally { setLoading(false) }
  }
  return <main className="auth-page">
    <section className="auth-showcase" aria-hidden="true"><a className="brand brand-light" href="/">AUDIFY</a><div><p className="eyebrow light">{t.showcase}</p><h1>{t.showcaseTitle}</h1><p>{t.showcaseText}</p></div></section>
    <section className="auth-panel"><div className="auth-language"><LanguageButton language={language} onChange={onLanguageChange} /></div><div className="auth-card">
      <p className="eyebrow">{adminMode ? t.private : t.welcome}</p><h2>{adminMode ? t.admin : mode === 'login' ? t.loginTitle : t.registerTitle}</h2>
      <p className="muted">{adminMode ? t.adminHelp : mode === 'login' ? t.loginHelp : t.registerHelp}</p>
      {!adminMode && <div className="auth-tabs"><button className={mode === 'login' ? 'active' : ''} onClick={() => { setMode('login'); setMessage('') }}>{t.login}</button><button className={mode === 'register' ? 'active' : ''} onClick={() => { setMode('register'); setMessage('') }}>{t.register}</button></div>}
      <form className="form auth-form" onSubmit={submit}>{mode === 'register' ? <><label>{t.name}<input name="name" value={form.name} onChange={handleChange} required /></label><label>{t.email}<input name="email" type="email" value={form.email} onChange={handleChange} required /></label></> : <label>{t.identifier}<input name="identifier" value={form.identifier} onChange={handleChange} required /></label>}<label>{t.password}<input name="password" type="password" minLength="8" value={form.password} onChange={handleChange} required /></label><button className="primary-button" disabled={loading}>{loading ? t.processing : mode === 'login' ? t.login : t.createAccount}</button></form>
      {message && <p className="form-message error">{message}</p>}{!adminMode && <><div className="divider"><span>o</span></div><GoogleButton language={language} onSuccess={onAuth} onError={setMessage} /></>}{adminMode && <a className="back-link" href="/">{t.back}</a>}
    </div></section>
  </main>
}

const formatPrice = (product, language) => new Intl.NumberFormat(language === 'es' ? 'es-CO' : 'en-US', { style: 'currency', currency: language === 'es' ? 'COP' : 'USD', maximumFractionDigits: language === 'es' ? 0 : 2 }).format(product.price)

function ProductCard({ product, language, actions }) {
  const t = copy[language]
  return <article className="product-card"><div className="product-image">{product.imageUrl ? <img src={product.imageUrl} alt={product.name} /> : <span>{t.noImage}</span>}</div><div className="product-content"><p className="category">{product.category?.name}</p><h3>{product.name}</h3><p className="product-description">{product.description}</p><div className="product-footer"><strong>{formatPrice(product, language)}</strong><span>{product.stock} {t.available}</span></div>{actions && <div className="product-actions"><button type="button" className="edit-button" onClick={() => actions.onEdit(product)}>{t.edit}</button><button type="button" className="delete-button" disabled={actions.deletingId === product.id} onClick={() => actions.onDelete(product)}>{actions.deletingId === product.id ? '…' : t.delete}</button></div>}</div></article>
}

function ProductsGrid({ language, reloadKey = 0, actions }) {
  const t = copy[language], [products, setProducts] = useState([]), [status, setStatus] = useState('loading')
  useEffect(() => { axios.get(`${API_URL}/products`, { params: { lang: language } }).then(({ data }) => { setProducts(data.products || []); setStatus('') }).catch(() => setStatus('error')) }, [language, reloadKey])
  if (status) return <p className="status-message">{status === 'loading' ? t.loading : t.loadError}</p>
  if (!products.length) return <p className="status-message">{t.empty}</p>
  return <section className="products-grid">{products.map((product) => <ProductCard key={product.id} product={product} language={language} actions={actions} />)}</section>
}

function Catalog({ language }) {
  const t = copy[language]
  const [products, setProducts] = useState([]), [status, setStatus] = useState('loading')
  const [search, setSearch] = useState(''), [categoryId, setCategoryId] = useState(''), [sort, setSort] = useState('newest')
  useEffect(() => { axios.get(`${API_URL}/products`, { params: { lang: language } }).then(({ data }) => { setProducts(data.products || []); setStatus('') }).catch(() => setStatus('error')) }, [language])
  const categories = useMemo(() => Array.from(new Map(products.filter((product) => product.category).map((product) => [product.category.id, product.category])).values()).sort((a, b) => a.name.localeCompare(b.name, language)), [language, products])
  const visibleProducts = useMemo(() => {
    const term = search.trim().toLocaleLowerCase(language)
    const filtered = products.filter((product) => (!categoryId || product.categoryId === categoryId) && (!term || `${product.name} ${product.description}`.toLocaleLowerCase(language).includes(term)))
    return [...filtered].sort((a, b) => sort === 'price-low' ? a.price - b.price : sort === 'price-high' ? b.price - a.price : sort === 'name' ? a.name.localeCompare(b.name, language) : new Date(b.createdAt) - new Date(a.createdAt))
  }, [categoryId, language, products, search, sort])
  const clear = () => { setSearch(''); setCategoryId(''); setSort('newest') }
  return <><div className="catalog-controls"><label className="search-control"><span>{t.search}</span><input type="search" value={search} placeholder={t.searchPlaceholder} onChange={(event) => setSearch(event.target.value)} /></label><label><span>{t.category}</span><select value={categoryId} onChange={(event) => setCategoryId(event.target.value)}><option value="">{t.allCategories}</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label><label><span>{t.sortBy}</span><select value={sort} onChange={(event) => setSort(event.target.value)}><option value="newest">{t.newest}</option><option value="price-low">{t.priceLow}</option><option value="price-high">{t.priceHigh}</option><option value="name">{t.nameAZ}</option></select></label></div><div className="catalog-summary"><span>{visibleProducts.length} {t.results}</span>{(search || categoryId || sort !== 'newest') && <button type="button" className="clear-button" onClick={clear}>{t.clearFilters}</button>}</div>{status ? <p className="status-message">{status === 'loading' ? t.loading : t.loadError}</p> : visibleProducts.length ? <section className="products-grid">{visibleProducts.map((product) => <ProductCard key={product.id} product={product} language={language} />)}</section> : <p className="status-message">{t.empty}</p>}</>
}

function StoreHeader({ user, language, onLanguageChange, onLogout }) {
  const t = copy[language]
  return <nav className="topbar"><a className="brand" href="/">AUDIFY</a><div className="nav-links"><a href="#productos">{t.products}</a><a href="#audio">{t.technology}</a></div><div className="account-menu">{user.avatarUrl && <img className="avatar" src={user.avatarUrl} alt="" />}<span>{user.name || user.email}</span><LanguageButton language={language} onChange={onLanguageChange} /><button className="link-button" onClick={onLogout}>{t.logout}</button></div></nav>
}

function Home({ user, language, onLanguageChange, onLogout }) {
  const t = copy[language]
  return <main><StoreHeader user={user} language={language} onLanguageChange={onLanguageChange} onLogout={onLogout} /><header className="store-hero" id="audio"><div className="hero-copy"><p className="eyebrow light">{t.market}</p><h1>{t.hero}</h1><p>{t.heroText}</p><a className="hero-button" href="#productos">{t.explore}</a></div></header><section className="catalog-section" id="productos"><div className="section-heading"><div><p className="eyebrow">{t.collection}</p><h2>{t.featured}</h2></div><span>{t.featureText}</span></div><Catalog language={language} /></section></main>
}

function AdminPanel({ session, language, onLanguageChange, onLogout }) {
  const t = copy[language], [form, setForm] = useState(emptyProductForm), [image, setImage] = useState(null), [categories, setCategories] = useState([]), [message, setMessage] = useState(''), [reloadKey, setReloadKey] = useState(0), [editingProduct, setEditingProduct] = useState(null), [deletingId, setDeletingId] = useState(''), [submitting, setSubmitting] = useState(false)
  useEffect(() => { axios.get(`${API_URL}/categories`, { params: { lang: language } }).then(({ data }) => setCategories(data.categories || [])).catch(() => setCategories([])) }, [language])
  const change = ({ target }) => setForm((current) => ({ ...current, [target.name]: target.value }))
  const options = useMemo(() => categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>), [categories])
  const resetForm = () => { setForm(emptyProductForm); setImage(null); setEditingProduct(null) }
  const startEdit = (product) => { setEditingProduct(product); setForm({ name: product.name, description: product.description, price: product.price, stock: product.stock, categoryId: product.categoryId }); setImage(null); setMessage(''); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  const submit = async (event) => { event.preventDefault(); setSubmitting(true); setMessage(editingProduct ? t.saving : t.creating); const data = new FormData(); Object.entries(form).forEach(([key, value]) => data.append(key, value)); if (image) data.append('image', image); try { const method = editingProduct ? 'put' : 'post'; const url = editingProduct ? `${API_URL}/products/${editingProduct.id}` : `${API_URL}/products`; const response = await axios[method](url, data, { headers: { Authorization: `Bearer ${session.token}` } }); setMessage(response.data.message || (editingProduct ? t.updated : t.created)); resetForm(); event.target.reset(); setReloadKey((key) => key + 1) } catch (error) { setMessage(error.response?.data?.message || (editingProduct ? t.updateError : t.createError)) } finally { setSubmitting(false) } }
  const remove = async (product) => { if (!window.confirm(t.deleteConfirm)) return; setDeletingId(product.id); setMessage(t.deleting); try { const response = await axios.delete(`${API_URL}/products/${product.id}`, { headers: { Authorization: `Bearer ${session.token}` } }); if (editingProduct?.id === product.id) resetForm(); setMessage(response.data.message || t.deleted); setReloadKey((key) => key + 1) } catch (error) { setMessage(error.response?.data?.message || t.deleteError) } finally { setDeletingId('') } }
  return <main className="admin-layout"><StoreHeader user={session.user} language={language} onLanguageChange={onLanguageChange} onLogout={onLogout} /><section className="admin-grid"><article className="panel-card admin-form-card"><p className="eyebrow">{editingProduct ? t.edit : t.createProduct}</p><h2>{editingProduct ? t.editProduct : t.newProduct}</h2><form className="form" onSubmit={submit}><label>{t.productName}<input name="name" value={form.name} onChange={change} required /></label><div className="form-row"><label>{t.price}<input name="price" type="number" min="0" value={form.price} onChange={change} required /></label><label>{t.stock}<input name="stock" type="number" min="0" value={form.stock} onChange={change} required /></label></div><label>{t.category}<select name="categoryId" value={form.categoryId} onChange={change} required><option value="">{t.selectCategory}</option>{options}</select></label><label>{t.description}<textarea name="description" value={form.description} onChange={change} required /></label><label>{t.image}<input type="file" accept="image/*" onChange={(event) => setImage(event.target.files[0])} />{editingProduct?.imageUrl && <small>{t.currentImage}</small>}</label><div className="form-buttons"><button className="primary-button" disabled={submitting}>{submitting ? (editingProduct ? t.saving : t.creating) : (editingProduct ? t.saveChanges : t.createProduct)}</button>{editingProduct && <button type="button" className="secondary-button" onClick={() => { resetForm(); setMessage('') }}>{t.cancel}</button>}</div></form>{message && <p className="form-message">{message}</p>}</article><article className="panel-card preview-panel"><p className="eyebrow">{t.publicView}</p><h2>{t.published}</h2><ProductsGrid language={language} reloadKey={reloadKey} actions={{ onEdit: startEdit, onDelete: remove, deletingId }} /></article></section></main>
}

function App() {
  const [session, setSession] = useState(readSession), [language, setLanguage] = useState(() => localStorage.getItem('audify-language') || 'es')
  const isAdminRoute = window.location.pathname.startsWith('/admin')
  const changeLanguage = (next) => { localStorage.setItem('audify-language', next); document.documentElement.lang = next; setLanguage(next) }
  const logout = useCallback(() => { sessionStorage.removeItem(SESSION_KEY); setSession(null) }, [])
  useEffect(() => { document.documentElement.lang = language }, [language])
  useEffect(() => {
    if (!session) return undefined
    let timer
    const touch = () => { const next = { ...session, lastActive: Date.now() }; sessionStorage.setItem(SESSION_KEY, JSON.stringify(next)); clearTimeout(timer); timer = setTimeout(logout, SESSION_INACTIVITY_MS) }
    const events = ['click', 'keydown', 'scroll', 'touchstart']; events.forEach((event) => window.addEventListener(event, touch, { passive: true })); touch()
    return () => { clearTimeout(timer); events.forEach((event) => window.removeEventListener(event, touch)) }
  }, [logout, session])
  const saveSession = useCallback((data) => { const next = { token: data.token, user: data.user, lastActive: Date.now() }; sessionStorage.setItem(SESSION_KEY, JSON.stringify(next)); setSession(next) }, [])
  const t = copy[language]
  if (!session) return <AuthPage adminMode={isAdminRoute} language={language} onLanguageChange={changeLanguage} onAuth={saveSession} />
  if (isAdminRoute && session.user.role !== 'ADMIN') return <section className="access-denied"><LanguageButton language={language} onChange={changeLanguage} /><p className="eyebrow">{t.restricted}</p><h2>{t.notAdmin}</h2><p>{t.notAdminText}</p><button onClick={logout}>{t.otherAccount}</button><a href="/">{t.back}</a></section>
  if (isAdminRoute) return <AdminPanel session={session} language={language} onLanguageChange={changeLanguage} onLogout={logout} />
  return <Home user={session.user} language={language} onLanguageChange={changeLanguage} onLogout={logout} />
}

export default App
