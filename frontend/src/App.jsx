import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import Topbar from './components/Topbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Register from './pages/Register'
import Plan from './pages/Plan'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'

/* Layout that includes Topbar + Footer */
function PublicLayout({ children }) {
  return (
    <div className="app">
      <Topbar />
      <main>{children}</main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <Toaster
        position="bottom-center"
        toastOptions={{
          duration: 3000,
          style: { fontFamily: 'Inter, sans-serif', fontSize: 13 },
          success: { style: { background: '#111a2e', color: '#fff' } },
          error:   { style: { background: '#2b0e0e', color: '#ffcece' } },
        }}
      />
      <Routes>
        {/* Public pages */}
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/register" element={<PublicLayout><Register /></PublicLayout>} />
        <Route path="/plan" element={<PublicLayout><Plan /></PublicLayout>} />

        {/* Admin auth */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected admin dashboard (no public layout — has its own sidebar) */}
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/*" element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } />

        {/* 404 */}
        <Route path="*" element={
          <PublicLayout>
            <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, color: '#667087' }}>
              <div style={{ fontSize: 64, fontWeight: 900, color: '#d1d8e8' }}>404</div>
              <div style={{ fontSize: 18, fontWeight: 700 }}>Page not found</div>
              <a href="/" className="btn btn-dark btn-sm" style={{ marginTop: 8 }}>← Go home</a>
            </div>
          </PublicLayout>
        } />
      </Routes>
    </AuthProvider>
  )
}
