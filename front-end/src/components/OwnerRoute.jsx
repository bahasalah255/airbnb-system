import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function OwnerRoute({ children }) {
  const { isAuthenticated, isLoadingAuth, user } = useAuth()

  if (isLoadingAuth) {
    return (
      <div className="grid min-h-screen place-items-center bg-slate-50 px-4 text-slate-700">
        <p className="text-sm font-medium">Loading your session...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (user?.role !== 'owner') {
    return <Navigate to={user?.role === 'admin' ? '/admin' : '/dashboard'} replace />
  }

  return children
}
