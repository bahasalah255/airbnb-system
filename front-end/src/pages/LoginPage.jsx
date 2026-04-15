import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout.jsx'
import FormInput from '../components/FormInput.jsx'
import PasswordInput from '../components/PasswordInput.jsx'
import SubmitButton from '../components/SubmitButton.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { validateLogin } from '../utils/validation.js'

const initialValues = {
  email: '',
  password: '',
  remember: false,
}

export default function LoginPage() {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [serverMessage, setServerMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const redirectTo = location.state?.from?.pathname

  function onChange(event) {
    const { name, value, type, checked } = event.target
    setValues((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))

    setErrors((prev) => ({ ...prev, [name]: undefined }))
    setServerMessage('')
  }

  async function onSubmit(event) {
    event.preventDefault()

    const validationErrors = validateLogin(values)
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) {
      return
    }

    setIsSubmitting(true)
    setServerMessage('')

    try {
      const response = await login(values)
      const destination =
        redirectTo ??
        (response?.user?.role === 'admin'
          ? '/admin'
          : response?.user?.role === 'owner'
            ? '/owner'
            : response?.user?.role === 'client'
              ? '/client'
              : '/dashboard')
      navigate(destination, { replace: true })
    } catch (error) {
      if (error?.errors && Object.keys(error.errors).length > 0) {
        const mapped = Object.fromEntries(
          Object.entries(error.errors).map(([key, val]) => [key, val?.[0] ?? 'Invalid value.']),
        )
        setErrors(mapped)
      } else {
        setServerMessage(error.message ?? 'Unable to log in right now.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to continue to your dashboard and manage your account."
    >
      <form onSubmit={onSubmit} noValidate className="space-y-4">
        {serverMessage && (
          <div className="rounded-xl border border-rose-200 bg-rose-50/85 px-4 py-3 text-sm font-medium text-rose-700">
            {serverMessage}
          </div>
        )}

        <FormInput
          id="email"
          label="Email"
          type="email"
          value={values.email}
          onChange={onChange}
          error={errors.email}
          placeholder="you@example.com"
          autoComplete="email"
          required
        />

        <PasswordInput
          id="password"
          label="Password"
          value={values.password}
          onChange={onChange}
          error={errors.password}
          placeholder="Enter your password"
          autoComplete="current-password"
          required
        />

        <div className="flex items-center justify-between gap-2 text-sm">
          <label className="inline-flex items-center gap-2 text-slate-600">
            <input
              type="checkbox"
              name="remember"
              checked={values.remember}
              onChange={onChange}
              className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-blue-500"
            />
            Remember me
          </label>
          <a href="#" className="font-semibold text-slate-700 hover:text-slate-900">
            Forgot password?
          </a>
        </div>

        <SubmitButton isLoading={isSubmitting}>Login</SubmitButton>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600">
        No account yet?{' '}
        <Link to="/signup" className="font-semibold text-slate-900 hover:text-slate-700">
          Create one
        </Link>
      </p>
    </AuthLayout>
  )
}
