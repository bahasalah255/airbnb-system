import { Navigate, Route, Routes } from 'react-router-dom'
import LoginPage from './pages/LoginPage.jsx'
import SignupPage from './pages/SignupPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import GuestRoute from './components/GuestRoute.jsx'
import AdminRoute from './components/AdminRoute.jsx'
import AdminLayout from './components/admin/AdminLayout.jsx'
import AdminOverviewPage from './pages/admin/AdminOverviewPage.jsx'
import AdminUsersPage from './pages/admin/AdminUsersPage.jsx'
import AdminApartmentsPage from './pages/admin/AdminApartmentsPage.jsx'
import AdminReservationsPage from './pages/admin/AdminReservationsPage.jsx'
import AdminOwnersPage from './pages/admin/AdminOwnersPage.jsx'
import AdminAnalyticsPage from './pages/admin/AdminAnalyticsPage.jsx'
import AdminNotificationsPage from './pages/admin/AdminNotificationsPage.jsx'
import AdminSettingsPage from './pages/admin/AdminSettingsPage.jsx'
import OwnerRoute from './components/OwnerRoute.jsx'
import OwnerLayout from './components/owner/OwnerLayout.jsx'
import OwnerOverviewPage from './pages/owner/OwnerOverviewPage.jsx'
import OwnerApartmentsPage from './pages/owner/OwnerApartmentsPage.jsx'
import OwnerReservationsPage from './pages/owner/OwnerReservationsPage.jsx'
import OwnerCalendarPage from './pages/owner/OwnerCalendarPage.jsx'
import OwnerAnalyticsPage from './pages/owner/OwnerAnalyticsPage.jsx'
import OwnerNotificationsPage from './pages/owner/OwnerNotificationsPage.jsx'
import OwnerProfilePage from './pages/owner/OwnerProfilePage.jsx'
import ClientRoute from './components/ClientRoute.jsx'
import ClientLayout from './components/client/ClientLayout.jsx'
import ClientOverviewPage from './pages/client/ClientOverviewPage.jsx'
import ClientReservationsPage from './pages/client/ClientReservationsPage.jsx'
import ClientFavoritesPage from './pages/client/ClientFavoritesPage.jsx'
import ClientProfilePage from './pages/client/ClientProfilePage.jsx'
import ClientApartmentDetailsPage from './pages/client/ClientApartmentDetailsPage.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route
        path="/login"
        element={
          <GuestRoute>
            <LoginPage />
          </GuestRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <GuestRoute>
            <SignupPage />
          </GuestRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<AdminOverviewPage />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="apartments" element={<AdminApartmentsPage />} />
        <Route path="reservations" element={<AdminReservationsPage />} />
        <Route path="owners" element={<AdminOwnersPage />} />
        <Route path="analytics" element={<AdminAnalyticsPage />} />
        <Route path="notifications" element={<AdminNotificationsPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
      </Route>
      <Route
        path="/owner"
        element={
          <OwnerRoute>
            <OwnerLayout />
          </OwnerRoute>
        }
      >
        <Route index element={<OwnerOverviewPage />} />
        <Route path="apartments" element={<OwnerApartmentsPage />} />
        <Route path="reservations" element={<OwnerReservationsPage />} />
        <Route path="calendar" element={<OwnerCalendarPage />} />
        <Route path="analytics" element={<OwnerAnalyticsPage />} />
        <Route path="notifications" element={<OwnerNotificationsPage />} />
        <Route path="profile" element={<OwnerProfilePage />} />
      </Route>
      <Route
        path="/client"
        element={
          <ClientRoute>
            <ClientLayout />
          </ClientRoute>
        }
      >
        <Route index element={<ClientOverviewPage />} />
        <Route path="apartments/:apartmentId" element={<ClientApartmentDetailsPage />} />
        <Route path="reservations" element={<ClientReservationsPage />} />
        <Route path="favorites" element={<ClientFavoritesPage />} />
        <Route path="profile" element={<ClientProfilePage />} />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App
