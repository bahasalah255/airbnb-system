import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoadingAuth } = useAuth()
  const location = useLocation()

  if (isLoadingAuth) {
    return (
      <div className="grid min-h-screen place-items-center bg-slate-50 px-4 text-slate-700">
        <p className="text-sm font-medium">Loading your session...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return children
}
