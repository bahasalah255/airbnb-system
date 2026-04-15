export function validateLogin(values) {
  const errors = {}

  if (!values.email.trim()) {
    errors.email = 'Email is required.'
  } else if (!/^\S+@\S+\.\S+$/.test(values.email)) {
    errors.email = 'Please enter a valid email address.'
  }

  if (!values.password) {
    errors.password = 'Password is required.'
  }

  return errors
}

export function validateSignup(values) {
  const errors = {}

  if (!values.name.trim()) {
    errors.name = 'Full name is required.'
  } else if (values.name.trim().length < 2) {
    errors.name = 'Full name must be at least 2 characters.'
  }

  if (!values.email.trim()) {
    errors.email = 'Email is required.'
  } else if (!/^\S+@\S+\.\S+$/.test(values.email)) {
    errors.email = 'Please enter a valid email address.'
  }

  if (!values.password) {
    errors.password = 'Password is required.'
  } else if (values.password.length < 8) {
    errors.password = 'Password must be at least 8 characters.'
  }

  if (!values.password_confirmation) {
    errors.password_confirmation = 'Please confirm your password.'
  } else if (values.password !== values.password_confirmation) {
    errors.password_confirmation = 'Passwords do not match.'
  }

  return errors
}
