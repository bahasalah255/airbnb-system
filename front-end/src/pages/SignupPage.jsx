import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout.jsx'
import FormInput from '../components/FormInput.jsx'
import PasswordInput from '../components/PasswordInput.jsx'
import SubmitButton from '../components/SubmitButton.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { validateSignup } from '../utils/validation.js'

const initialValues = {
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
}

export default function SignupPage() {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [serverMessage, setServerMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { register } = useAuth()
  const navigate = useNavigate()

  function onChange(event) {
    const { name, value } = event.target
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }))

    setErrors((prev) => ({ ...prev, [name]: undefined }))
    setServerMessage('')
  }

  async function onSubmit(event) {
    event.preventDefault()

    const validationErrors = validateSignup(values)
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) {
      return
    }

    setIsSubmitting(true)
    setServerMessage('')

    try {
      await register(values)
      navigate('/dashboard', { replace: true })
    } catch (error) {
      if (error?.errors && Object.keys(error.errors).length > 0) {
        const mapped = Object.fromEntries(
          Object.entries(error.errors).map(([key, val]) => [key, val?.[0] ?? 'Invalid value.']),
        )
        setErrors(mapped)
      } else {
        setServerMessage(error.message ?? 'Unable to create account right now.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Set up your profile to start booking and managing stays."
    >
      <form onSubmit={onSubmit} noValidate className="space-y-4">
        {serverMessage && (
          <div className="rounded-xl border border-rose-200 bg-rose-50/85 px-4 py-3 text-sm font-medium text-rose-700">
            {serverMessage}
          </div>
        )}

        <FormInput
          id="name"
          label="Full name"
          value={values.name}
          onChange={onChange}
          error={errors.name}
          placeholder="John Doe"
          autoComplete="name"
          required
        />

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
          placeholder="Create a password"
          autoComplete="new-password"
          required
        />

        <PasswordInput
          id="password_confirmation"
          label="Confirm password"
          value={values.password_confirmation}
          onChange={onChange}
          error={errors.password_confirmation}
          placeholder="Repeat your password"
          autoComplete="new-password"
          required
        />

        <SubmitButton isLoading={isSubmitting}>Register</SubmitButton>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-slate-900 hover:text-slate-700">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  )
}
